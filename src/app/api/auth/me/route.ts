import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import { User } from "@/models/User";
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

export async function GET(req: Request) {
  const authHeader = req.headers.get("authorization");
  const jwtToken = authHeader && authHeader.startsWith("Bearer ") ? authHeader.substring(7) : null;
  
  if (!jwtToken) {
    return NextResponse.json({ error: "Unauthorized. Token missing." }, { status: 401, headers: corsHeaders });
  }

  try {
    const decoded: any = jwt.verify(jwtToken, NEXTAUTH_SECRET);
    await connectToDatabase();
    
    const user = await User.findById(decoded.user_id);
    if (!user) {
      return NextResponse.json({ error: "User not found." }, { status: 404, headers: corsHeaders });
    }

    const hasAccess = (user.credits || 0) >= 10;

    return NextResponse.json({
      success: true,
      user: {
        id: user._id,
        email: user.email,
        name: user.name || "",
        is_subscribed: user.is_subscribed,
        subscription_tier: user.subscription_tier,
        credits: user.credits,
        referral_code: user.referral_code || "",
        referred_by: user.referred_by || "",
        trial_expires_at: user.trial_expires_at || null,
      },
      config: hasAccess ? {
        deepgram_api_key: process.env.DEEPGRAM_API_KEY || "",
      } : null
    }, { headers: corsHeaders });
  } catch (err: any) {
    console.error("[AUTH ME ERROR]", err);
    return NextResponse.json({ error: "Invalid token" }, { status: 401, headers: corsHeaders });
  }
}
