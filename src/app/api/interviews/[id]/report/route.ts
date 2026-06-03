import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import { InterviewSession } from "@/models/InterviewSession";
import { User } from "@/models/User";
import jwt from "jsonwebtoken";

const NEXTAUTH_SECRET = process.env.NEXTAUTH_SECRET || "cracktheloop_secret_auth_key_2026_z8y";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const authHeader = req.headers.get("authorization");
  const jwtToken = authHeader && authHeader.startsWith("Bearer ") ? authHeader.substring(7) : null;
  if (!jwtToken) {
    return NextResponse.json({ error: "Unauthorized. Token required." }, { status: 401 });
  }

  try {
    const decoded: any = jwt.verify(jwtToken, NEXTAUTH_SECRET);
    const { id } = await params;
    const reqJson = await req.json().catch(() => ({}));
    const { provider, apiKey } = reqJson;

    // Use server key if available and no client key is provided
    const serverOpenAIKey = process.env.OPENAI_API_KEY;
    const useServerKeys = !!serverOpenAIKey && (!apiKey || apiKey.trim() === "" || apiKey === "server");
    const finalApiKey = useServerKeys ? serverOpenAIKey : apiKey;

    if (!finalApiKey) {
      return NextResponse.json({ error: "API Key is required" }, { status: 400 });
    }

    const providerLower = useServerKeys ? "openai" : (provider || "openai").toLowerCase();

    await connectToDatabase();

    const user = await User.findById(decoded.user_id);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Verify credit balance (5 credits per analysis)
    if (user.credits < 5) {
      return NextResponse.json(
        { error: "Insufficient credits. Running an evaluation report requires 5 credits." },
        { status: 402 }
      );
    }

    // Trial report limit check (maximum 1 report generated)
    if (user.subscription_tier === "trial") {
      const reportCount = await InterviewSession.countDocuments({
        user_id: decoded.user_id,
        report: { $exists: true }
      });
      if (reportCount >= 1) {
        return NextResponse.json(
          { error: "Free Trial limit reached. You can only generate exactly 1 AI report. Please purchase a plan to continue." },
          { status: 403 }
        );
      }
    }

    const session = await InterviewSession.findOne({
      _id: id,
      user_id: decoded.user_id
    });

    if (!session) {
      return NextResponse.json({ error: "Interview session not found or access denied" }, { status: 404 });
    }

    if (!session.transcript || session.transcript.length === 0) {
      return NextResponse.json({ error: "Cannot evaluate an empty interview transcript" }, { status: 400 });
    }

    // Build the grading prompt for the LLM
    const transcriptText = session.transcript
      .map((t: any) => `${t.sender.toUpperCase()}: ${t.text}`)
      .join("\n");

    const systemPrompt = `You are a Principal Engineering Recruiter and Technical Interviewer.
Your job is to analyze the provided interview transcript and generate a structured evaluation report.
Analyze candidate's communication flow, correctness of technical details, and accuracy in response to questions.

Provide scores out of 100.
You MUST output ONLY a valid JSON object matching this structure (no markdown formatting, no code block tickmarks):
{
  "communication_score": number,
  "technical_score": number,
  "overall_score": number,
  "feedback": "summary string",
  "improvement_guide": "reconciliation guide string"
}`;

    const userPrompt = `Interview Role: ${session.role}
Company: ${session.company || "General"}

Transcript:
${transcriptText}

Generate the evaluation report.`;

    let url = "";
    let headers: Record<string, string> = { "Content-Type": "application/json" };
    let reqBody: any = {};

    // Query selected LLM provider synchronously for JSON response
    switch (providerLower) {
      case "groq":
        url = "https://api.groq.com/v1/chat/completions";
        headers["Authorization"] = `Bearer ${finalApiKey}`;
        reqBody = {
          model: "llama-3.1-8b-instant",
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: userPrompt }
          ],
          response_format: { type: "json_object" }
        };
        break;

      case "openai":
        url = "https://api.openai.com/v1/chat/completions";
        headers["Authorization"] = `Bearer ${finalApiKey}`;
        reqBody = {
          model: "gpt-4o-mini",
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: userPrompt }
          ],
          response_format: { type: "json_object" }
        };
        break;

      case "xai":
        url = "https://api.x.ai/v1/chat/completions";
        headers["Authorization"] = `Bearer ${finalApiKey}`;
        reqBody = {
          model: "grok-beta",
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: userPrompt }
          ]
        };
        break;

      case "anthropic":
        url = "https://api.anthropic.com/v1/messages";
        headers["x-api-key"] = finalApiKey;
        headers["anthropic-version"] = "2023-06-01";
        reqBody = {
          model: "claude-3-5-haiku-20241022",
          system: systemPrompt,
          messages: [
            { role: "user", content: userPrompt }
          ],
          max_tokens: 1000
        };
        break;

      case "gemini":
        url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${finalApiKey}`;
        reqBody = {
          contents: [
            {
              role: "user",
              parts: [{ text: `${systemPrompt}\n\n${userPrompt}` }]
            }
          ],
          generationConfig: {
            responseMimeType: "application/json"
          }
        };
        break;

      default:
        return NextResponse.json({ error: `Unsupported provider: ${providerLower}` }, { status: 400 });
    }

    const response = await fetch(url, {
      method: "POST",
      headers,
      body: JSON.stringify(reqBody)
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`LLM provider returned error: ${errorText}`);
    }

    const result = await response.json();
    let textOutput = "";

    switch (providerLower) {
      case "groq":
      case "openai":
      case "xai":
        textOutput = result.choices?.[0]?.message?.content || "";
        break;
      case "anthropic":
        textOutput = result.content?.[0]?.text || "";
        break;
      case "gemini":
        textOutput = result.candidates?.[0]?.content?.parts?.[0]?.text || "";
        break;
    }

    // Clean up any markdown code fences in case the model ignored formatting rules
    textOutput = textOutput.replace(/```json/g, "").replace(/```/g, "").trim();
    const evaluation = JSON.parse(textOutput);

    // Save report in Mongoose document
    session.report = {
      communication_score: Number(evaluation.communication_score) || 0,
      technical_score: Number(evaluation.technical_score) || 0,
      overall_score: Number(evaluation.overall_score) || 0,
      feedback: evaluation.feedback || "",
      improvement_guide: evaluation.improvement_guide || ""
    };

    await session.save();

    // Deduct 5 credits from user
    user.credits = Math.max(0, user.credits - 5);
    await user.save();

    console.log(`[REPORT GENERATION] Compiled report for ${user.email}. Charged 5 credits. Remaining: ${user.credits}`);

    return NextResponse.json({ success: true, report: session.report });
  } catch (err: any) {
    console.error("[REPORT GENERATION ERROR]", err);
    return NextResponse.json({ error: err.message || "Failed to generate report evaluation" }, { status: 500 });
  }
}
