import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import { User } from "@/models/User";
import jwt from "jsonwebtoken";

const NEXTAUTH_SECRET = process.env.NEXTAUTH_SECRET || "cracktheloop_secret_auth_key_2026_z8y";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { provider, prompt, apiKey, role, jobDescription, candidateResume, token } = body;

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
4. MAXIMUM BREVITY: Answer in exactly 1 highly dense, premium technical bullet point or 1 extremely short sentence (strictly maximum 25 words total). Make it exceptionally concise and direct.
`;

    if (jobDescription && jobDescription.trim()) {
      sysPrompt += `\nTARGET JOB DETAILS (prioritize aligning answer with these tools/technologies):\n${jobDescription.trim()}\n`;
    }

    if (candidateResume && candidateResume.trim()) {
      sysPrompt += `\nCANDIDATE'S ACTUAL EXPERIENCE (anchor your first-person perspective organically using these technologies/methods where relevant):\n${candidateResume.trim()}\n`;
    }

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
            { role: "user", content: prompt },
          ],
          stream: true,
        };
        break;
      case "openai":
        url = "https://api.openai.com/v1/chat/completions";
        headers["Authorization"] = `Bearer ${finalApiKey}`;
        reqBody = {
          model: "gpt-4o-mini",
          messages: [
            { role: "system", content: sysPrompt },
            { role: "user", content: prompt },
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
            { role: "user", content: prompt },
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
            { role: "user", content: prompt },
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
              parts: [{ text: prompt }],
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

    return new Response(response.body, {
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
