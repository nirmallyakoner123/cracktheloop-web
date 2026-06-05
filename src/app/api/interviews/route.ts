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

function getUserIdFromRequest(req: Request) {
  const authHeader = req.headers.get("authorization");
  const jwtToken = authHeader && authHeader.startsWith("Bearer ") ? authHeader.substring(7) : null;
  if (!jwtToken) return null;
  try {
    const decoded: any = jwt.verify(jwtToken, NEXTAUTH_SECRET);
    return decoded.user_id;
  } catch (err) {
    return null;
  }
}

export async function POST(req: Request) {
  const userId = getUserIdFromRequest(req);
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized. Valid token required." }, { status: 401, headers: corsHeaders });
  }

  try {
    const body = await req.json();
    const { role, company, transcript, sessionId, totalTime, totalSttOnTime } = body;

    if (!role || !transcript || !Array.isArray(transcript) || transcript.length === 0) {
      return NextResponse.json({ error: "A non-empty transcript is required to save an interview session" }, { status: 400, headers: corsHeaders });
    }

    await connectToDatabase();

    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404, headers: corsHeaders });
    }

    // Fetch and aggregate token usages from this session
    let totalInputTokens = 0;
    let totalOutputTokens = 0;
    let totalCost = 0;
    let tokenUsagesIds: any[] = [];

    if (sessionId) {
      const usages = await TokenUsage.find({ session_id: sessionId });
      for (const usage of usages) {
        totalInputTokens += usage.input_tokens || 0;
        totalOutputTokens += usage.output_tokens || 0;
        totalCost += usage.cost || 0;
        tokenUsagesIds.push(usage._id);
      }
    }

    // Check if session already exists
    let existingSession = null;
    if (sessionId) {
      existingSession = await InterviewSession.findOne({ session_id: sessionId });
    }

    // Trial limit check (maximum 1 saved interview session) - skip for existing session updates!
    if (user.subscription_tier === "trial" && !existingSession) {
      const interviewCount = await InterviewSession.countDocuments({ user_id: userId });
      if (interviewCount >= 1) {
        return NextResponse.json(
          { error: "Free Trial limit reached. You can only save exactly 1 interview session. Please purchase a plan to continue." },
          { status: 403, headers: corsHeaders }
        );
      }
    }

    // Calculate duration of the interview
    let durationSeconds = 0;
    if (typeof totalTime === "number") {
      durationSeconds = totalTime;
    } else if (transcript.length > 1) {
      const timestamps = transcript.map((t: any) => new Date(t.timestamp).getTime()).filter((t: number) => !isNaN(t));
      if (timestamps.length > 1) {
        const minTime = Math.min(...timestamps);
        const maxTime = Math.max(...timestamps);
        durationSeconds = (maxTime - minTime) / 1000;
      }
    }

    const durationMinutes = durationSeconds / 60;
    
    // Credit calculation: 1 credit per minute, minimum 10 credits
    let creditsToDeduct = 10;
    if (durationMinutes > 10) {
      creditsToDeduct = 10 + Math.ceil(durationMinutes - 10);
    }

    const finalTotalTime = Math.round(durationSeconds);
    const finalTotalSttOnTime = typeof totalSttOnTime === "number" ? Math.round(totalSttOnTime) : finalTotalTime;

    const cleanTranscript = transcript.map((turn: any) => {
      let cleanSender = turn.sender;
      if (cleanSender === "user") {
        cleanSender = "candidate";
      }
      return {
        sender: cleanSender,
        text: turn.text,
        timestamp: turn.timestamp ? new Date(turn.timestamp) : new Date()
      };
    });

    if (existingSession) {
      // Calculate delta credits relative to what was already charged
      const alreadyCharged = existingSession.credits_charged || 0;
      const delta = creditsToDeduct - alreadyCharged;

      if (delta > 0) {
        if (user.credits < delta) {
          return NextResponse.json(
            { error: `Insufficient credits. Updating this session requires ${delta} additional credits, but you only have ${user.credits} remaining.` },
            { status: 402, headers: corsHeaders }
          );
        }
        
        user.credits = Math.max(0, user.credits - delta);
        user.total_burn_credits = (user.total_burn_credits || 0) + delta;
        await user.save();
        await logCreditTransaction(user._id, delta, "burn", "interview_save");
      }

      existingSession.role = role;
      existingSession.company = company || existingSession.company || "General Interview Session";
      existingSession.transcript = cleanTranscript;
      existingSession.credits_charged = Math.max(alreadyCharged, creditsToDeduct);
      existingSession.total_input_tokens = totalInputTokens;
      existingSession.total_output_tokens = totalOutputTokens;
      existingSession.total_cost = totalCost;
      existingSession.token_usages = tokenUsagesIds;
      existingSession.total_time = finalTotalTime;
      existingSession.total_stt_on_time = finalTotalSttOnTime;
      
      await existingSession.save();

      console.log(`[INTERVIEW UPDATED] Updated session ${existingSession._id} for ${user.email}. Charged delta ${delta > 0 ? delta : 0} credits. Remaining: ${user.credits}`);

      return NextResponse.json({ success: true, interview: existingSession }, { headers: corsHeaders });
    } else {
      // Save new session
      if (user.credits < creditsToDeduct) {
        return NextResponse.json(
          { error: `Insufficient credits. Saving this session requires ${creditsToDeduct} credits, but you only have ${user.credits} remaining.` },
          { status: 402, headers: corsHeaders }
        );
      }

      const sessionData: any = {
        user_id: userId,
        role,
        company: company || "General Interview Session",
        transcript: cleanTranscript,
        credits_charged: creditsToDeduct,
        total_input_tokens: totalInputTokens,
        total_output_tokens: totalOutputTokens,
        total_cost: totalCost,
        token_usages: tokenUsagesIds,
        total_time: finalTotalTime,
        total_stt_on_time: finalTotalSttOnTime,
      };
      
      if (sessionId) {
        sessionData.session_id = sessionId;
      }

      const newSession = new InterviewSession(sessionData);
      await newSession.save();

      // Deduct credits and save user
      user.credits = Math.max(0, user.credits - creditsToDeduct);
      user.total_burn_credits = (user.total_burn_credits || 0) + creditsToDeduct;
      await user.save();

      await logCreditTransaction(user._id, creditsToDeduct, "burn", "interview_save");

      console.log(`[INTERVIEW COMPLETED] Saved new session for ${user.email}. Charged ${creditsToDeduct} credits (duration: ${durationMinutes.toFixed(2)} min). Remaining: ${user.credits}`);

      return NextResponse.json({ success: true, interview: newSession }, { headers: corsHeaders });
    }
  } catch (err: any) {
    console.error("[INTERVIEWS POST ERROR]", err);
    return NextResponse.json({ error: err.message || "Failed to save session" }, { status: 500, headers: corsHeaders });
  }
}

export async function GET(req: Request) {
  const userId = getUserIdFromRequest(req);
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized. Valid token required." }, { status: 401, headers: corsHeaders });
  }

  try {
    await connectToDatabase();

    // Query and populate the user_id relation, sorted by creation timestamp descending
    const sessions = await InterviewSession.find({ user_id: userId })
      .populate("user_id")
      .sort({ created_at: -1 });

    return NextResponse.json({ success: true, interviews: sessions }, { headers: corsHeaders });
  } catch (err: any) {
    console.error("[INTERVIEWS GET ERROR]", err);
    return NextResponse.json({ error: err.message || "Failed to load sessions" }, { status: 500, headers: corsHeaders });
  }
}
