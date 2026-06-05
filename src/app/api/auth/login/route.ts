import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import { User } from "@/models/User";
import { Referral } from "@/models/Referral";
import jwt from "jsonwebtoken";
import crypto from "crypto";

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

function hashPassword(password: string) {
  return crypto.createHash("sha256").update(password).digest("hex");
}

async function generateUniqueReferralCode() {
  let referralCode = "";
  let isUnique = false;
  while (!isUnique) {
    referralCode = "REF-" + Math.random().toString(36).substring(2, 8).toUpperCase();
    const existing = await User.findOne({ referral_code: referralCode });
    if (!existing) {
      isUnique = true;
    }
  }
  return referralCode;
}

export async function POST(request: Request) {
  try {
    const { email, password, name, referralCode } = await request.json();

    if (!email || !email.includes("@")) {
      return NextResponse.json(
        { error: "A valid email address is required" },
        { status: 400, headers: corsHeaders }
      );
    }

    if (!password || password.trim().length < 6) {
      return NextResponse.json(
        { error: "Password must be at least 6 characters" },
        { status: 400, headers: corsHeaders }
      );
    }

    await connectToDatabase();

    let user = await User.findOne({ email });

    if (user) {
      // Existing User: Login
      const hashedPassword = hashPassword(password);
      
      // If user has no password set (legacy), set it
      if (!user.password) {
        user.password = hashedPassword;
        await user.save();
      } else if (user.password !== hashedPassword) {
        return NextResponse.json(
          { error: "invalid_credentials", message: "Invalid email or password" },
          { status: 401, headers: corsHeaders }
        );
      }
      
      // Referral Code Safety Net
      if (!user.referral_code) {
        const rawDoc = await User.findOne({ _id: user._id }).lean<any>();
        if (rawDoc?.referral_code) {
          user.referral_code = rawDoc.referral_code;
        } else {
          try {
            user.referral_code = await generateUniqueReferralCode();
          } catch (codeErr) {
            console.error("[AUTH] Failed to assign referral code during login:", codeErr);
          }
        }
        await user.save();
      }
    } else {
      // New User: Registration / Login check
      // If name is not provided, it means they were trying to sign in with an unregistered email
      if (name === undefined || name === null) {
        return NextResponse.json(
          { error: "invalid_credentials", message: "Invalid email or password" },
          { status: 401, headers: corsHeaders }
        );
      }

      if (!name || !name.trim()) {
        return NextResponse.json(
          { 
            error: "registration_required", 
            message: "Full Name is required to create a new account" 
          },
          { status: 400, headers: corsHeaders }
        );
      }

      let generatedRefCode = "";
      try {
        generatedRefCode = await generateUniqueReferralCode();
      } catch (codeErr) {
        console.error("[AUTH] Failed to generate referral code during signup:", codeErr);
      }

      let referredByCode: string | null = null;
      if (referralCode && referralCode.trim()) {
        const referrer = await User.findOne({ referral_code: referralCode.trim() });
        if (!referrer) {
          return NextResponse.json(
            { error: "invalid_referral", message: "The referral code you entered is invalid" },
            { status: 400, headers: corsHeaders }
          );
        }
        if (referrer.email === email) {
          return NextResponse.json(
            { error: "invalid_referral", message: "You cannot refer yourself." },
            { status: 400, headers: corsHeaders }
          );
        }
        referredByCode = referralCode.trim();
        console.log(`[AUTH] New user ${email} referred by ${referrer.email} (code: ${referredByCode})`);
      }

      user = new User({
        email,
        name: name.trim(),
        password: hashPassword(password),
        referral_code: generatedRefCode || null,
        referred_by: referredByCode,
        is_subscribed: false,
        subscription_tier: "free",
        credits: 0,
      });

      await user.save();

      // Create Referral record if referred
      if (user.referred_by) {
        const referrer = await User.findOne({ referral_code: user.referred_by });
        if (referrer) {
          if (referrer._id.toString() !== user._id.toString()) {
            const existingReferral = await Referral.findOne({ referred_user: user._id });
            if (!existingReferral) {
              await Referral.create({
                referrer: referrer._id,
                referred_user: user._id,
                referral_code: user.referred_by,
                status: "pending",
                trial_bonus_paid: false,
                purchase_bonus_paid: false,
              });
              console.log(`[REFERRAL] Created referral linking ${referrer.email} -> ${user.email}`);
            }
          } else {
            user.referred_by = undefined;
            await user.save();
          }
        }
      }
    }

    // Generate JWT token
    const token = jwt.sign(
      {
        user_id: user._id,
        email: user.email,
        name: user.name || "",
        is_subscribed: user.is_subscribed,
        subscription_tier: user.subscription_tier,
        credits: user.credits,
        referral_code: user.referral_code || "",
        referred_by: user.referred_by || "",
        trial_expires_at: user.trial_expires_at || null,
      },
      NEXTAUTH_SECRET,
      { expiresIn: "30d" }
    );

    console.log(`[AUTH] Successful direct login for ${email}`);

    return NextResponse.json({
      success: true,
      token,
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
    }, { headers: corsHeaders });
  } catch (error: any) {
    console.error("[AUTH ERROR] Direct login/signup failed:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500, headers: corsHeaders }
    );
  }
}
