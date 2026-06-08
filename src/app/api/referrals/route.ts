import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import { User } from "@/models/User";
import { Referral } from "@/models/Referral";
import jwt from "jsonwebtoken";

const NEXTAUTH_SECRET =
  process.env.NEXTAUTH_SECRET || "cracktheloop_secret_auth_key_2026_z8y";

function randomCode(): string {
  return "REF-" + Math.random().toString(36).substring(2, 8).toUpperCase();
}

export async function GET(req: Request) {
  const authHeader = req.headers.get("authorization");
  const jwtToken =
    authHeader && authHeader.startsWith("Bearer ")
      ? authHeader.substring(7)
      : null;

  if (!jwtToken) {
    return NextResponse.json(
      { error: "Unauthorized. Token missing." },
      { status: 401 }
    );
  }

  try {
    const decoded: any = jwt.verify(jwtToken, NEXTAUTH_SECRET);
    await connectToDatabase();

    // .lean() returns a plain JS object - bypasses Mongoose doc caching that hides fields
    const userDoc = await User.findById(decoded.user_id).lean<any>();
    if (!userDoc) {
      return NextResponse.json({ error: "User not found." }, { status: 404 });
    }

    let code: string = userDoc.referral_code || "";

    // Only assign a new code if the user genuinely has none
    if (!code) {
      for (let attempt = 0; attempt < 5; attempt++) {
        const candidate = randomCode();

        // Skip if this candidate already exists on another user
        const clash = await User.exists({ referral_code: candidate });
        if (clash) continue;

        try {
          // Update directly in DB - lean doc has no .save()
          await User.updateOne(
            { _id: userDoc._id, $or: [{ referral_code: null }, { referral_code: { $exists: false } }] },
            { $set: { referral_code: candidate } }
          );
          // Verify it was actually saved
          const check = await User.findById(userDoc._id).lean<any>();
          if (check?.referral_code) {
            code = check.referral_code;
            console.log(`[REFERRALS] Assigned new code to ${userDoc.email}: ${code}`);
          }
        } catch (saveErr: any) {
          // Duplicate key: another concurrent request beat us - re-fetch
          const fresh = await User.findById(userDoc._id).lean<any>();
          if (fresh?.referral_code) code = fresh.referral_code;
        }
        break;
      }
    }

    if (!code) {
      return NextResponse.json(
        { error: "Could not assign referral code." },
        { status: 500 }
      );
    }

    const appUrl =
      (process.env.NEXT_PUBLIC_APP_URL || "https://cracktheloop.com").replace(
        /\/$/,
        ""
      );
    const referralLink = `${appUrl}/login?ref=${code}`;

    // Query referrals where this user is the referrer
    const referrals = await Referral.find({ referrer: userDoc._id })
      .populate("referred_user", "email name is_subscribed subscription_tier created_at")
      .sort({ created_at: -1 })
      .lean();

    // Filter out any referrals where the referred user was deleted/doesn't exist
    const validReferrals = referrals.filter((r: any) => r.referred_user);

    const totalReferrals = validReferrals.length;
    const subscribedReferrals = validReferrals.filter(
      (r: any) => r.referred_user.is_subscribed
    ).length;

    const bonusEarned = validReferrals.reduce((sum: number, r: any) => {
      return sum + (r.referrer_trial_bonus || 0) + (r.referrer_purchase_bonus || 0);
    }, 0);

    return NextResponse.json({
      success: true,
      referral_code: code,
      referral_link: referralLink,
      total_referrals: totalReferrals,
      subscribed_referrals: subscribedReferrals,
      bonus_credits_earned: bonusEarned,
      referred_users: validReferrals.map((r: any) => {
        const u = r.referred_user;
        return {
          email: u.email,
          name: u.name || "",
          is_subscribed: u.is_subscribed || false,
          subscription_tier: u.subscription_tier || "free",
          joined_at: r.created_at || u.created_at,
          bonus_earned: (r.referrer_trial_bonus || 0) + (r.referrer_purchase_bonus || 0),
        };
      }),
    });
  } catch (err: any) {
    console.error("[REFERRALS ERROR]", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
