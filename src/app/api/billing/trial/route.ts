import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import { User } from "@/models/User";
import { Referral } from "@/models/Referral";
import jwt from "jsonwebtoken";

const NEXTAUTH_SECRET = process.env.NEXTAUTH_SECRET || "cracktheloop_secret_auth_key_2026_z8y";

export async function POST(req: Request) {
  const authHeader = req.headers.get("authorization");
  const jwtToken = authHeader && authHeader.startsWith("Bearer ") ? authHeader.substring(7) : null;

  if (!jwtToken) {
    return NextResponse.json({ error: "Unauthorized. Token missing." }, { status: 401 });
  }

  try {
    const decoded: any = jwt.verify(jwtToken, NEXTAUTH_SECRET);
    await connectToDatabase();

    const user = await User.findById(decoded.user_id);
    if (!user) {
      return NextResponse.json({ error: "User not found." }, { status: 404 });
    }

    // Check if the user already has a subscription or trial active
    if (user.subscription_tier !== "free" && user.subscription_tier !== undefined) {
      return NextResponse.json({ error: "You already have an active subscription or trial plan." }, { status: 400 });
    }

    // Set trial expiration (7 days from now)
    const trialExpiry = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    user.subscription_tier = "trial";
    user.trial_expires_at = trialExpiry;

    let grantedCredits = 15;

    // Apply Referral Credit Bonuses using Referral collection
    const referral = await Referral.findOne({ referred_user: user._id });
    if (referral && !referral.trial_bonus_paid) {
      const referrer = await User.findById(referral.referrer);
      if (referrer) {
        // Referred user gets +20% (15 * 1.2 = 18 credits)
        grantedCredits = 18;

        // Referrer gets +50% of base (15 * 0.5 = 7.5, rounded up to 8 credits)
        referrer.credits = (referrer.credits || 0) + 8;
        await referrer.save();

        referral.status = "trial_activated";
        referral.trial_bonus_paid = true;
        referral.referrer_trial_bonus = 8;
        referral.referred_trial_bonus = 3; // 18 - 15 = 3
        await referral.save();
        
        console.log(`[REFERRAL SUCCESS] Trial activated for ${user.email}. Referrer ${referrer.email} credited +8 credits, referee got +3 credits.`);
      }
    } else if (!referral && user.referred_by) {
      // Fallback: If referral record was missing but user.referred_by exists
      const referrer = await User.findOne({ referral_code: user.referred_by });
      if (referrer && referrer._id.toString() !== user._id.toString()) {
        grantedCredits = 18;
        referrer.credits = (referrer.credits || 0) + 8;
        await referrer.save();

        await Referral.create({
          referrer: referrer._id,
          referred_user: user._id,
          referral_code: user.referred_by,
          status: "trial_activated",
          trial_bonus_paid: true,
          purchase_bonus_paid: false,
          referrer_trial_bonus: 8,
          referred_trial_bonus: 3,
        });
        console.log(`[REFERRAL FALLBACK] Trial activated for ${user.email} (created referral). Referrer ${referrer.email} got +8 credits.`);
      }
    }

    user.credits = grantedCredits;
    await user.save();

    console.log(`[TRIAL ACTIVATION] Activated 7-day trial with ${grantedCredits} credits for ${user.email}`);

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
        trial_expires_at: user.trial_expires_at,
      }
    });
  } catch (err: any) {
    console.error("[TRIAL ACTIVATION ERROR]", err);
    return NextResponse.json({ error: err.message || "Failed to activate trial" }, { status: 500 });
  }
}
