import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import { User } from "@/models/User";
import { Referral } from "@/models/Referral";
import jwt from "jsonwebtoken";

const NEXTAUTH_SECRET = process.env.NEXTAUTH_SECRET || "cracktheloop_secret_auth_key_2026_z8y";

export async function POST(request: Request) {
  try {
    const { email, code } = await request.json();

    if (!email || !code) {
      return NextResponse.json(
        { error: "Email and verification code are required" },
        { status: 400 }
      );
    }

    await connectToDatabase();

    const user = await User.findOne({ email });

    if (!user) {
      return NextResponse.json(
        { error: "No pending verification found for this email" },
        { status: 404 }
      );
    }

    // Verify OTP matches and is not expired
    if (!user.otp_code || user.otp_code !== code.trim()) {
      return NextResponse.json(
        { error: "Invalid verification code" },
        { status: 400 }
      );
    }

    if (!user.otp_expiry || new Date() > user.otp_expiry) {
      return NextResponse.json(
        { error: "Verification code has expired" },
        { status: 400 }
      );
    }

    // OTP validated successfully! Clear code
    user.otp_code = undefined;
    user.otp_expiry = undefined;

    // ── Referral Code Safety Net ────────────────────────────────────────────
    // Use lean() to read the raw document and bypass Mongoose schema caching.
    // Without this, a stale schema can make user.referral_code appear null even
    // when the value IS stored in MongoDB - causing valid codes to be overwritten.
    if (!user.referral_code) {
      const rawDoc = await User.findOne({ _id: user._id }).lean<any>();
      if (rawDoc?.referral_code) {
        // Code exists in MongoDB but stale schema hid it - restore to Mongoose doc
        user.referral_code = rawDoc.referral_code;
        console.log(`[AUTH] Restored existing referral code ${rawDoc.referral_code} for ${email}`);
      } else {
        // Genuinely missing - generate a fresh one
        try {
          let candidate = "";
          let isUnique = false;
          while (!isUnique) {
            candidate = "REF-" + Math.random().toString(36).substring(2, 8).toUpperCase();
            const clash = await User.findOne({ referral_code: candidate }).lean();
            if (!clash) isUnique = true;
          }
          user.referral_code = candidate;
          console.log(`[AUTH] Safety-net: assigned referral code ${candidate} to ${email}`);
        } catch (codeErr) {
          console.error("[AUTH] Failed to assign referral code during verify:", codeErr);
        }
      }
    }
    // ────────────────────────────────────────────────────────────────────────

    await user.save();

    // ── Create Referral relationship ─────────────────────────────────────────
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
            console.log(`[REFERRAL] Created verified referral record linking referrer ${referrer.email} -> referee ${user.email}`);
          }
        } else {
          console.warn(`[REFERRAL WARNING] Self-referral detected and ignored for ${email}`);
          user.referred_by = undefined;
          await user.save();
        }
      } else {
        console.warn(`[REFERRAL WARNING] Referrer code "${user.referred_by}" not found in DB for ${email}`);
      }
    }
    // ────────────────────────────────────────────────────────────────────────

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
      { expiresIn: "30d" } // Active session for 30 days
    );

    console.log(`[AUTH] Successfully verified OTP for ${email}`);

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
    });
  } catch (error: any) {
    console.error("[AUTH ERROR] Verify OTP failed:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}
