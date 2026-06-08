import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import { User } from "@/models/User";
import { sendEmail } from "@/lib/mailgun";
import crypto from "crypto";

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
        { status: 400 }
      );
    }

    await connectToDatabase();

    // Find user or check if new
    let user = await User.findOne({ email });

    if (user) {
      // Existing user: Password check is required
      if (!password) {
        return NextResponse.json(
          { error: "password_required", message: "Password is required for login" },
          { status: 400 }
        );
      }

      const hashedPassword = hashPassword(password);
      if (user.password && user.password !== hashedPassword) {
        return NextResponse.json(
          { error: "invalid_credentials", message: "Invalid email or password" },
          { status: 401 }
        );
      }
    } else {
      // New user registration: name and password are required
      if (!name || !name.trim() || !password || password.trim().length < 6) {
        return NextResponse.json(
          {
            error: "registration_required",
            message: "Full Name and a password (min 6 characters) are required to create an account"
          },
          { status: 400 }
        );
      }
    }

    // Generate 6-digit numeric OTP code
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes expiry

    if (!user) {
      let generatedRefCode = "";
      try {
        generatedRefCode = await generateUniqueReferralCode();
      } catch (codeErr) {
        console.error("[AUTH] Failed to generate referral code during signup:", codeErr);
        // Fall through - code will be generated on first dashboard load via /api/referrals
      }

      let referredByCode: string | null = null;
      if (referralCode && referralCode.trim()) {
        const referrer = await User.findOne({ referral_code: referralCode.trim() });
        if (referrer) {
          // Use the input code directly - don't read referrer.referral_code back from
          // the document, as a stale Mongoose schema cache can return it as null
          // even though the query found the referrer by that exact value.
          referredByCode = referralCode.trim();
          console.log(`[AUTH] New user ${email} referred by ${referrer.email} (code: ${referredByCode})`);
        } else {
          console.warn(`[AUTH] Referral code "${referralCode.trim()}" not found. Proceeding without referral.`);
        }
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
      console.log(`[AUTH] Creating new user: ${email}, ref_code: ${generatedRefCode || "(none - will backfill)"}`);
    } else {
      // Handle password migration if user existed without password
      if (!user.password && password) {
        user.password = hashPassword(password);
      }
      // Generate referral code if missing (safety net for legacy accounts)
      if (!user.referral_code) {
        try {
          user.referral_code = await generateUniqueReferralCode();
          console.log(`[AUTH] Assigned missing referral code to existing user ${email}: ${user.referral_code}`);
        } catch (codeErr) {
          console.error("[AUTH] Failed to generate referral code for existing user:", codeErr);
        }
      }
    }

    user.otp_code = otpCode;
    user.otp_expiry = otpExpiry;
    await user.save();
    console.log(`[AUTH] Generated OTP for ${email}: ${otpCode}`);

    // Send email using Mailgun
    try {
      await sendEmail({
        to: email,
        subject: "CrackTheLoop - Your Verification Code",
        html: `
          <div style="font-family: sans-serif; max-width: 500px; margin: auto; padding: 20px; border: 1px solid #ffffff15; border-radius: 12px; background-color: #0b0d19; color: #f8fafc;">
            <h2 style="color: #6610f2; text-align: center;">Verify Your Account</h2>
            <p style="font-size: 14px; color: #94a3b8; line-height: 1.5;">
              Use the following 6-digit verification code to authenticate your CrackTheLoop session (valid for 10 minutes).
            </p>
            <div style="background-color: #0d1125; border: 1px dashed #0dcaf040; padding: 15px; border-radius: 8px; text-align: center; margin: 20px 0;">
              <span style="font-family: monospace; font-size: 32px; font-weight: bold; letter-spacing: 6px; color: #0dcaf0;">${otpCode}</span>
            </div>
            <p style="font-size: 11px; color: #64748b; text-align: center; margin-top: 20px;">
              If you did not request this, please ignore this email.
            </p>
          </div>
        `,
        text: `Your CrackTheLoop verification code is: ${otpCode}`,
      });
    } catch (mailgunError: any) {
      console.warn(`[MAILGUN WARNING] Failed to send email via Mailgun: ${mailgunError.message || mailgunError}. OTP logged in console.`);
    }

    return NextResponse.json({ success: true, message: "Verification code sent successfully" });
  } catch (error: any) {
    console.error("[AUTH ERROR] Send OTP failed:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}
