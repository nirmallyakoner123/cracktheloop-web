import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import { User } from "@/models/User";
import { TokenUsage } from "@/models/TokenUsage";
import jwt from "jsonwebtoken";

const NEXTAUTH_SECRET = process.env.NEXTAUTH_SECRET || "cracktheloop_secret_auth_key_2026_z8y";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { provider, prompt, apiKey, role, jobDescription, candidateResume, token, history, sessionId, requestType, request_type, previousAnswer } = body;
    const finalRequestType = requestType || request_type || "normal";

    if (!role || !role.trim()) {
      return NextResponse.json(
        { error: "Interview role is required" },
        { status: 400 }
      );
    }

    const authHeader = req.headers.get("authorization");
    const jwtToken = token || (authHeader && authHeader.startsWith("Bearer ") ? authHeader.substring(7) : null);

    if (!jwtToken) {
      return NextResponse.json(
        { error: "Authentication token is required to make Copilot requests" },
        { status: 401 }
      );
    }

    let decoded: any;
    try {
      decoded = jwt.verify(jwtToken, NEXTAUTH_SECRET);
    } catch (err) {
      return NextResponse.json({ error: "Invalid or expired session token" }, { status: 401 });
    }

    await connectToDatabase();
    const user = await User.findById(decoded.user_id);

    if (!user) {
      return NextResponse.json({ error: "User account not found" }, { status: 404 });
    }

    if (!user.is_subscribed && user.subscription_tier !== "trial") {
      return NextResponse.json(
        { error: "Active subscription or trial required to run AI Copilot" },
        { status: 402 }
      );
    }

    if (user.subscription_tier === "trial") {
      if (user.trial_expires_at && new Date() > user.trial_expires_at) {
        return NextResponse.json(
          { error: "Your 7-day Free Trial has expired. Please purchase a plan to continue." },
          { status: 402 }
        );
      }
    }

    if ((user.credits || 0) < 10) {
      return NextResponse.json(
        { error: "Insufficient credits. At least 10 credits are required to run AI Copilot." },
        { status: 402 }
      );
    }

    // Use server key if available and no client key is provided
    const serverOpenAIKey = process.env.OPENAI_API_KEY;
    const useServerKeys = !!serverOpenAIKey && (!apiKey || apiKey.trim() === "" || apiKey === "server");
    const finalApiKey = useServerKeys ? serverOpenAIKey : apiKey;

    if (!finalApiKey) {
      return NextResponse.json({ error: "API Key is required" }, { status: 400 });
    }

    const providerLower = useServerKeys ? "openai" : provider.toLowerCase();

    // Construct dynamic system prompt
    const roleLower = role.toLowerCase();
    const isSenior = roleLower.includes("senior")
        || roleLower.includes("lead")
        || roleLower.includes("architect")
        || roleLower.includes("principal")
        || roleLower.includes("staff");

    let sysPrompt = `You are the inner mind and immediate technical autopilot of an expert candidate interviewing for the role of: ${role}.
Your goal is to provide the candidate with extremely direct, technically precise, and stealthy real-time guidance.

CORE PERSONA & CONTEXT:
- Embody a world-class practitioner matching the role of ${role}.
`;

    if (isSenior) {
      sysPrompt += `        - Seniority Level: SENIOR/LEAD. Focus heavily on architectural patterns, scalability trade-offs, system safety, operational monitoring, and production-grade reliability.\n`;
    } else {
      sysPrompt += `        - Seniority Level: MID/STANDARD. Focus heavily on clean, elegant, bug-free, and highly performant technical implementations, syntax, or exact execution steps.\n`;
    }

    sysPrompt += `        
CRITICAL RULES:
1. STEALTH: NEVER mention the name 'CrackTheLoop', 'copilot', 'software', or 'overlay'. Be a quiet inner technical voice.
2. FORMAL VERBATIM RESPONSE: Write your response strictly as a highly formal, professional, first-person candidate answer. Avoid any casual terms or conversational fluff.
3. NO META-LANGUAGE: Do NOT start with any conversational preambles, greetings, or meta-introductions. Start directly with the technical answer.
4. RESPONSE FORMAT & LENGTH CONTROL: Tailor the response length and detail level dynamically to the interviewer's query:
   - If the interviewer's question is direct, short, or simply asks 'what is X?' or is a brief check-in, provide a minimal, highly concise, but technically complete first-person response (typically 2-3 precise sentences) to allow for quick and natural verbal delivery.
   - If the question is complex or asks you to explain, elaborate, compare, or describe something in detail, provide a detailed, well-structured explanation with bullet points and code examples where appropriate to demonstrate deep domain competence.
   - Start directly with the technical answer.

KNOWLEDGE BASE INTEGRATION RULES & GUIDELINES:
- PRIORITIZE KNOWLEDGE BASE: You MUST heavily prioritize context from the candidate's uploaded resume (CANDIDATE'S ACTUAL EXPERIENCE) and target job details (TARGET JOB DETAILS).
- PROJECT & CONTEXT-DRIVEN ANSWERS: If the interviewer asks questions about technical topics (such as backend/frontend architecture, security, authentication, authorization, RBAC, database handling, deployments, scalability, multithreading, or bandwidth optimization), and the question can be related to a company, project, or domain mentioned in the candidate's resume or job details, you must naturally connect your answer to that specific project, company, or domain.
- USE NATURAL DETAILS: Reference the actual company names, project names, tools, technologies, and responsibilities provided in the resume and job details. Incorporate them fluidly so the response sounds realistic and highly authentic.
- NO HALLUCINATION: Under no circumstances should you invent or hallucinate fake company names, project names, proprietary tools, or specific responsibilities that are not explicitly present in the provided context. If certain details are missing, provide a general but realistic technical response based on the candidate's actual skills/stack, without making up false facts.
- CANDIDATE PERSPECTIVE: Maintain the first-person perspective ("I", "we", "in my project X at company Y") to make it sound like a genuine reflection of the candidate's personal experience. Keep answers structured, concise, confident, and professional.
`;

    if (jobDescription && jobDescription.trim()) {
      sysPrompt += `\nTARGET JOB DETAILS (prioritize aligning answer with these tools/technologies):\n${jobDescription.trim()}\n`;
    }

    if (candidateResume && candidateResume.trim()) {
      sysPrompt += `\nCANDIDATE'S ACTUAL EXPERIENCE (anchor your first-person perspective organically using these technologies/methods where relevant):\n${candidateResume.trim()}\n`;
    }

    if (history && Array.isArray(history) && history.length > 0) {
      // Keep only the last 15 turns of history to prevent token bloat
      const recentHistory = history.slice(-15);
      let historyText = "\nCONVERSATION HISTORY TO KEEP IN MIND:\n";
      recentHistory.forEach((turn: any) => {
        const senderLabel = turn.sender === "interviewer" ? "Interviewer" : "Candidate (You)";
        historyText += `[${senderLabel}]: ${turn.text}\n`;
      });
      sysPrompt += historyText;
    }

    // Construct final user prompt based on requestType
    let finalPrompt = prompt;
    if (finalRequestType === "regeneration") {
      finalPrompt = `The candidate was not fully satisfied with the previous answer. Please regenerate a significantly better, more accurate, and more useful response. 
      
Below is the interviewer's question:
"${prompt}"

Below is the previous answer that was generated:
"${previousAnswer || ''}"

Make sure your new response is distinct, addresses any likely gaps in the previous answer, and provides a highly polished explanation that satisfies the interviewer. Present the improved response strictly in the first-person perspective as the candidate.`;
    } else if (finalRequestType === "screen_capture") {
      finalPrompt = `Analyze the following screen content extracted from the candidate's display capture:
"""
${prompt}
"""

Please identify the type of content and output the appropriate guidance:
- If it is a coding/DSA problem (e.g. from LeetCode, HackerRank, etc.):
  - Provide a clear explanation of the optimal approach and the time/space complexities.
  - Write clean, correct, and compilation-ready code in the target language (or Python/TypeScript if not specified).
  - Briefly discuss edge cases.
- If it is a set of interview questions or a single question:
  - Provide complete, professional answers starting with the most prominent question.
- If it is a math calculation or logic puzzle:
  - Break down the calculation steps and show the final result.
- For any other screen-based content:
  - Extract the core task or question and provide a helpful, accurate, first-person candidate response.`;
    }

    console.log(`[COMPLETION API] Processing request for Role: "${role}" | RequestType: "${finalRequestType}"`);
    console.log(`[COMPLETION API] Job Description injected: ${jobDescription ? `Yes (${jobDescription.trim().length} chars)` : "No"}`);
    console.log(`[COMPLETION API] Candidate Resume injected: ${candidateResume ? `Yes (${candidateResume.trim().length} chars)` : "No"}`);
    console.log(`[COMPLETION API] Conversation History injected: ${history && Array.isArray(history) ? `Yes (${history.length} turns)` : "No"}`);
    console.log(`[COMPLETION API] Final System Prompt Size: ${sysPrompt.length} chars`);
    console.log(`[COMPLETION API] Provider: ${providerLower}`);

    let url = "";
    let headers: Record<string, string> = {
      "Content-Type": "application/json",
    };
    let reqBody: any = {};

    switch (providerLower) {
      case "groq":
        url = "https://api.groq.com/v1/chat/completions";
        headers["Authorization"] = `Bearer ${finalApiKey}`;
        reqBody = {
          model: "llama-3.1-8b-instant",
          messages: [
            { role: "system", content: sysPrompt },
            { role: "user", content: finalPrompt },
          ],
          stream: true,
        };
        break;
      case "openai":
        url = "https://api.openai.com/v1/chat/completions";
        headers["Authorization"] = `Bearer ${finalApiKey}`;
        reqBody = {
          model: "gpt-5.4-mini",
          messages: [
            { role: "system", content: sysPrompt },
            { role: "user", content: finalPrompt },
          ],
          stream: true,
        };
        break;
      case "xai":
        url = "https://api.x.ai/v1/chat/completions";
        headers["Authorization"] = `Bearer ${finalApiKey}`;
        reqBody = {
          model: "grok-beta",
          messages: [
            { role: "system", content: sysPrompt },
            { role: "user", content: finalPrompt },
          ],
          stream: true,
        };
        break;
      case "anthropic":
        url = "https://api.anthropic.com/v1/messages";
        headers["x-api-key"] = finalApiKey;
        headers["anthropic-version"] = "2023-06-01";
        reqBody = {
          model: "claude-3-5-haiku-20241022",
          system: sysPrompt,
          messages: [
            { role: "user", content: finalPrompt },
          ],
          max_tokens: 150,
          stream: true,
        };
        break;
      case "gemini":
        url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:streamGenerateContent?alt=sse&key=${finalApiKey}`;
        reqBody = {
          contents: [
            {
              parts: [{ text: finalPrompt }],
            },
          ],
          systemInstruction: {
            parts: [{ text: sysPrompt }],
          },
        };
        break;
      default:
        return NextResponse.json({ error: `Unsupported provider: ${provider}` }, { status: 400 });
    }

    const response = await fetch(url, {
      method: "POST",
      headers,
      body: JSON.stringify(reqBody),
    });

    if (!response.ok) {
      const errorText = await response.text();
      return new Response(errorText, {
        status: response.status,
        headers: { "Content-Type": "application/json" },
      });
    }

    const reader = (response.body as any).getReader();
    const decoder = new TextDecoder();
    let responseText = "";

    const customStream = new ReadableStream({
      async start(controller) {
        try {
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            controller.enqueue(value);

            const chunk = decoder.decode(value, { stream: true });
            const lines = chunk.split("\n");
            for (const line of lines) {
              const trimmed = line.trim();
              if (trimmed.startsWith("data: ")) {
                const data = trimmed.slice(6);
                if (data === "[DONE]") continue;
                try {
                  const parsed = JSON.parse(data);
                  let content = "";
                  if (providerLower === "openai") {
                    content = parsed.choices?.[0]?.delta?.content || "";
                  } else if (providerLower === "groq") {
                    content = parsed.choices?.[0]?.delta?.content || "";
                  } else if (providerLower === "xai") {
                    content = parsed.choices?.[0]?.delta?.content || "";
                  } else if (providerLower === "anthropic") {
                    if (parsed.type === "content_block_delta") {
                      content = parsed.delta?.text || "";
                    }
                  } else if (providerLower === "gemini") {
                    content = parsed.candidates?.[0]?.content?.parts?.[0]?.text || "";
                  }
                  responseText += content;
                } catch (_) {}
              }
            }
          }
          controller.close();

          // Stream completed! Calculate tokens and save to database
          const inputTokens = Math.ceil((sysPrompt.length + finalPrompt.length) / 3.8);
          const outputTokens = Math.ceil(responseText.length / 3.8);
          const totalTokens = inputTokens + outputTokens;

          // Determine pricing (Standard rates as of 2026)
          let inputPricePerM = 0.15;
          let outputPricePerM = 0.60;
          let modelName = providerLower;

          if (providerLower === "openai") {
            modelName = "gpt-5.4-mini";
            inputPricePerM = 0.75;
            outputPricePerM = 4.50;
          } else if (providerLower === "groq") {
            modelName = "llama-3.1-8b-instant";
            inputPricePerM = 0.15;
            outputPricePerM = 0.60;
          }

          const cost = ((inputTokens * inputPricePerM) + (outputTokens * outputPricePerM)) / 1000000;

          // Save TokenUsage
          try {
            await TokenUsage.create({
              user_id: user._id,
              session_id: sessionId || "none",
              model_name: modelName,
              input_tokens: inputTokens,
              output_tokens: outputTokens,
              prompt_tokens: inputTokens,
              completion_tokens: outputTokens,
              total_tokens: totalTokens,
              cost: cost,
              request_type: finalRequestType,
              metadata: {
                role,
                has_job_description: !!jobDescription,
                has_candidate_resume: !!candidateResume,
                history_turns: history ? history.length : 0,
                provider: providerLower,
                use_server_keys: useServerKeys
              }
            });
            console.log(`[TOKEN USAGE] Logged for user ${user.email} (session: ${sessionId || "none"}): model=${modelName}, request_type=${finalRequestType}, input=${inputTokens}, output=${outputTokens}, cost=$${cost.toFixed(6)}`);
          } catch (dbErr) {
            console.error("[TOKEN USAGE ERROR] Failed to save token usage:", dbErr);
          }
        } catch (err) {
          controller.error(err);
        }
      }
    });

    return new Response(customStream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        "Connection": "keep-alive",
      },
    });
  } catch (error: any) {
    console.error("[CORS PROXY ERROR]", error);
    return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
  }
}
