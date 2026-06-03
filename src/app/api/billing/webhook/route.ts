import { headers } from "next/headers";
import { NextResponse } from "next/server";
import Stripe from "stripe";
import { connectToDatabase } from "@/lib/db";
import { User } from "@/models/User";
import { Referral } from "@/models/Referral";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  apiVersion: "2026-05-27.dahlia" as any,
});

// Plan map: base credits & tier names
const PLAN_MAP: Record<string, { tier: string; credits: number }> = {
  "price_1TeCnyEkHwm1l3fZV45CSLvV": { tier: "starter", credits: 100 },
  "price_1TeCpEEkHwm1l3fZej0zzJhb": { tier: "pro",     credits: 300 },
  "price_1TeCpaEkHwm1l3fZj9f7Gh31": { tier: "elite",   credits: 1000 },
};

// Referral multipliers (from plans.md)
const REFERRED_USER_MULTIPLIER = 1.2;  // +20% credits for referred buyer
const REFERRER_BONUS_RATIO     = 0.5;  // +50% of base credits for referrer

export async function POST(request: Request) {
  try {
    const body = await request.text();
    const headersList = await headers();
    const signature = headersList.get("stripe-signature");

    if (!signature) {
      return NextResponse.json(
        { error: "Missing stripe-signature header" },
        { status: 400 }
      );
    }

    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(
        body,
        signature,
        process.env.STRIPE_WEBHOOK_SECRET || ""
      );
    } catch (err: any) {
      console.error(`[WEBHOOK ERROR] Signature verification failed:`, err.message);
      return NextResponse.json(
        { error: `Webhook Error: ${err.message}` },
        { status: 400 }
      );
    }

    console.log(`[WEBHOOK] Received Stripe Event: ${event.type}`);

    await connectToDatabase();

    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        const email = session.customer_email || session.customer_details?.email;
        const customerId = session.customer as string;
        const subscriptionId = session.subscription as string;

        if (email) {
          const user = await User.findOne({ email });
          if (user) {
            user.stripe_customer_id = customerId;
            user.stripe_subscription_id = subscriptionId;
            await user.save();
            console.log(`[WEBHOOK] Linked Stripe IDs for ${email}`);
          }
        }
        break;
      }

      case "invoice.payment_succeeded": {
        const invoice = event.data.object as any;
        const subscriptionId = invoice.subscription as string;
        const customerId     = invoice.customer as string;

        // Find the user — prioritise email lookup
        let user = null;
        if (invoice.customer_email) {
          user = await User.findOne({ email: invoice.customer_email });
        }
        if (!user) {
          user = await User.findOne({
            $or: [
              { stripe_subscription_id: subscriptionId },
              { stripe_customer_id: customerId },
            ],
          });
        }

        if (!user) {
          console.warn(`[WEBHOOK] No user found for invoice ${invoice.id}`);
          break;
        }

        user.is_subscribed = true;
        user.stripe_subscription_id = subscriptionId;
        user.stripe_customer_id = customerId;

        // Resolve price ID from invoice line items
        const lineItems = invoice.lines?.data || [];
        let priceId = "";
        if (lineItems.length > 0) {
          priceId =
            lineItems[0].price?.id ||
            lineItems[0].plan?.id ||
            (typeof lineItems[0].price === "string" ? lineItems[0].price : "") ||
            "";
        }
        console.log(`[WEBHOOK] Price ID: "${priceId}", Amount paid: ${invoice.amount_paid}`);

        // Determine base tier & credits
        let plan = PLAN_MAP[priceId];
        if (!plan) {
          // Fallback: derive from amount_paid (cents)
          const amount = invoice.amount_paid ?? 0;
          if (amount <= 0) break;
          else if (amount < 2500) plan = { tier: "starter", credits: 100 };
          else if (amount < 5000) plan = { tier: "pro",     credits: 300 };
          else                    plan = { tier: "elite",   credits: 1000 };
          console.log(`[WEBHOOK WARNING] No priceId match. Used amount_paid fallback → tier: ${plan.tier}`);
        }

        user.subscription_tier = plan.tier;

        // ── Referral Bonus Logic ─────────────────────────────────────────
        const referral = await Referral.findOne({ referred_user: user._id });
        if (referral) {
          if (!referral.purchase_bonus_paid) {
            // This is their first purchase! Pay out the bonus.
            const referrer = await User.findById(referral.referrer);
            
            // Referred user gets +20% on top of base credits
            const bonusCredits = Math.ceil(plan.credits * REFERRED_USER_MULTIPLIER);
            user.credits = bonusCredits;
            
            let referrerBonus = 0;
            if (referrer) {
              referrerBonus = Math.ceil(plan.credits * REFERRER_BONUS_RATIO);
              referrer.credits = (referrer.credits || 0) + referrerBonus;
              await referrer.save();
              console.log(`[REFERRAL] Referrer ${referrer.email} credited +${referrerBonus} credits (50% of ${plan.credits})`);
            }

            // Update referral status and paid flag
            referral.status = "subscribed";
            referral.purchase_bonus_paid = true;
            referral.referrer_purchase_bonus = referrerBonus;
            referral.referred_purchase_bonus = bonusCredits - plan.credits;
            referral.purchase_tier = plan.tier;
            await referral.save();

            console.log(`[REFERRAL] Referred user ${user.email} gets ${bonusCredits} credits (+20% of ${plan.credits})`);
          } else {
            // Already paid out purchase bonus on a previous cycle/invoice.
            // Give them standard plan credits.
            user.credits = plan.credits;
            console.log(`[REFERRAL] User ${user.email} already had purchase bonus paid. Loaded standard plan credits: ${plan.credits}`);
          }
        } else if (user.referred_by) {
          // Fallback: If referral record was missing but user has referred_by, create it, pay out bonus
          const referrer = await User.findOne({ referral_code: user.referred_by });
          if (referrer && referrer._id.toString() !== user._id.toString()) {
            const bonusCredits = Math.ceil(plan.credits * REFERRED_USER_MULTIPLIER);
            user.credits = bonusCredits;

            const referrerBonus = Math.ceil(plan.credits * REFERRER_BONUS_RATIO);
            referrer.credits = (referrer.credits || 0) + referrerBonus;
            await referrer.save();

            await Referral.create({
              referrer: referrer._id,
              referred_user: user._id,
              referral_code: user.referred_by,
              status: "subscribed",
              trial_bonus_paid: false, // trial skipped or not recorded
              purchase_bonus_paid: true,
              referrer_purchase_bonus: referrerBonus,
              referred_purchase_bonus: bonusCredits - plan.credits,
              purchase_tier: plan.tier,
            });
            console.log(`[REFERRAL FALLBACK] Subscribed referral created for ${user.email}. Referrer ${referrer.email} credited +${referrerBonus}.`);
          } else {
            user.credits = plan.credits;
          }
        } else {
          // Non-referred user gets standard base credits
          user.credits = plan.credits;
        }
        // ─────────────────────────────────────────────────────────────────

        await user.save();
        console.log(`[WEBHOOK] Subscription active for ${user.email}. Tier: ${user.subscription_tier}, Credits: ${user.credits}`);
        break;
      }

      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription;
        const user = await User.findOne({
          stripe_subscription_id: subscription.id,
        });
        if (user) {
          user.is_subscribed = false;
          user.subscription_tier = "free";
          user.credits = 0;
          await user.save();
          console.log(`[WEBHOOK] Subscription revoked for: ${user.email}`);
        }
        break;
      }

      default:
        console.log(`[WEBHOOK] Unhandled event: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error: any) {
    console.error("[WEBHOOK ERROR] Event processing failed:", error);
    return NextResponse.json(
      { error: "Webhook event handler execution error" },
      { status: 500 }
    );
  }
}

