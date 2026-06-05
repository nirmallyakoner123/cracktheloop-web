import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import { InterviewSession } from "@/models/InterviewSession";
import { User } from "@/models/User";
import { TokenUsage } from "@/models/TokenUsage";
import { logCreditTransaction } from "@/lib/transactions";
import jwt from "jsonwebtoken";

const NEXTAUTH_SECRET = process.env.NEXTAUTH_SECRET || "cracktheloop_secret_auth_key_2026_z8y";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: corsHeaders,
  });
}

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const authHeader = req.headers.get("authorization");
  const jwtToken = authHeader && authHeader.startsWith("Bearer ") ? authHeader.substring(7) : null;
  if (!jwtToken) {
    return NextResponse.json({ error: "Unauthorized. Token required." }, { status: 401, headers: corsHeaders });
  }

  try {
    const decoded: any = jwt.verify(jwtToken, NEXTAUTH_SECRET);
    const { id } = await params;

    // Force server-managed OpenAI key and gpt-4o
    const serverOpenAIKey = process.env.OPENAI_API_KEY;
    if (!serverOpenAIKey) {
      return NextResponse.json({ error: "Server API Key is not configured." }, { status: 500, headers: corsHeaders });
    }
    const finalApiKey = serverOpenAIKey;
    const providerLower: string = "openai";

    await connectToDatabase();

    const user = await User.findById(decoded.user_id);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404, headers: corsHeaders });
    }

    // Verify credit balance (5 credits per analysis)
    if (user.credits < 5) {
      return NextResponse.json(
        { error: "Insufficient credits. Running an evaluation report requires 5 credits." },
        { status: 402, headers: corsHeaders }
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
          { status: 403, headers: corsHeaders }
        );
      }
    }

    const session = await InterviewSession.findOne({
      _id: id,
      user_id: decoded.user_id
    });

    if (!session) {
      return NextResponse.json({ error: "Interview session not found or access denied" }, { status: 404, headers: corsHeaders });
    }

    if (!session.transcript || session.transcript.length === 0) {
      return NextResponse.json({ error: "Cannot evaluate an empty interview transcript" }, { status: 400, headers: corsHeaders });
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
          model: "gpt-4o",
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
        return NextResponse.json({ error: `Unsupported provider: ${providerLower}` }, { status: 400, headers: corsHeaders });
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

    // Clean up any markdown code fences or preambles in case the model ignored formatting rules
    let cleanedOutput = textOutput.trim();
    cleanedOutput = cleanedOutput.replace(/```json/g, "").replace(/```/g, "").trim();

    // Safely extract the first valid JSON object block if the LLM output includes preambles
    const firstBrace = cleanedOutput.indexOf('{');
    const lastBrace = cleanedOutput.lastIndexOf('}');
    if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
      cleanedOutput = cleanedOutput.substring(firstBrace, lastBrace + 1);
    }

    let evaluation: any;
    try {
      evaluation = JSON.parse(cleanedOutput);
    } catch (parseErr) {
      console.error("[REPORT GENERATION] Failed to parse LLM response JSON:", cleanedOutput, parseErr);
      throw new Error("Invalid report JSON returned by the AI provider");
    }

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
    user.total_burn_credits = (user.total_burn_credits || 0) + 5;
    await user.save();

    // Parse token usage from the API response
    let promptTokens = 0;
    let completionTokens = 0;
    let totalTokens = 0;
    let modelName: string = providerLower;

    if (result.usage) {
      promptTokens = result.usage.prompt_tokens || result.usage.input_tokens || 0;
      completionTokens = result.usage.completion_tokens || result.usage.output_tokens || 0;
      totalTokens = result.usage.total_tokens || (promptTokens + completionTokens);
    } else if (result.usageMetadata) {
      promptTokens = result.usageMetadata.promptTokenCount || 0;
      completionTokens = result.usageMetadata.candidatesTokenCount || 0;
      totalTokens = promptTokens + completionTokens;
    }

    // Fallback estimation if no usage statistics are available from provider
    if (promptTokens === 0) {
      promptTokens = Math.ceil((systemPrompt.length + userPrompt.length) / 3.8);
    }
    if (completionTokens === 0) {
      completionTokens = Math.ceil(textOutput.length / 3.8);
    }
    if (totalTokens === 0) {
      totalTokens = promptTokens + completionTokens;
    }

    // Cost calculations (Standard rates as of 2026)
    let inputPricePerM = 0.15;
    let outputPricePerM = 0.60;

    if (providerLower === "openai") {
      modelName = "gpt-4o";
      inputPricePerM = 2.50;
      outputPricePerM = 10.00;
    } else if (providerLower === "groq") {
      modelName = "llama-3.1-8b-instant";
      inputPricePerM = 0.15;
      outputPricePerM = 0.60;
    } else if (providerLower === "anthropic") {
      modelName = "claude-3-5-haiku-20241022";
      inputPricePerM = 0.80;
      outputPricePerM = 4.00;
    }

    const aiCost = ((promptTokens * inputPricePerM) + (completionTokens * outputPricePerM)) / 1000000;

    // Log TokenUsage to database
    try {
      await TokenUsage.create({
        user_id: user._id,
        session_id: id,
        model_name: modelName,
        input_tokens: promptTokens,
        output_tokens: completionTokens,
        prompt_tokens: promptTokens,
        completion_tokens: completionTokens,
        total_tokens: totalTokens,
        cost: aiCost,
        request_type: "report",
        metadata: {
          session_id: id,
          role: session.role,
          company: session.company,
          transcript_length: session.transcript.length,
          provider: providerLower
        }
      });
      console.log(`[TOKEN USAGE] Logged for report: user=${user.email}, model=${modelName}, prompt_tokens=${promptTokens}, completion_tokens=${completionTokens}, cost=$${aiCost.toFixed(6)}`);
    } catch (dbErr) {
      console.error("[TOKEN USAGE ERROR] Failed to log report token usage:", dbErr);
    }

    await logCreditTransaction(user._id, 5, "burn", "report_evaluation", modelName);

    console.log(`[REPORT GENERATION] Compiled report for ${user.email}. Charged 5 credits. Remaining: ${user.credits}`);

    return NextResponse.json({ success: true, report: session.report }, { headers: corsHeaders });
  } catch (err: any) {
    console.error("[REPORT GENERATION ERROR]", err);
    return NextResponse.json({ error: err.message || "Failed to generate report evaluation" }, { status: 500, headers: corsHeaders });
  }
}
