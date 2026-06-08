import { headers } from "next/headers";
import { NextResponse } from "next/server";
import Stripe from "stripe";
import { connectToDatabase } from "@/lib/db";
import { User } from "@/models/User";
import { Referral } from "@/models/Referral";
import { logCreditTransaction, logSubscriptionHistory } from "@/lib/transactions";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  apiVersion: "2026-05-27.dahlia" as any,
});

// Plan map: base credits & tier names
const PLAN_MAP: Record<string, { tier: string; credits: number }> = {
  "price_1TeCnyEkHwm1l3fZV45CSLvV": { tier: "starter", credits: 100 },
  "price_1TeCpEEkHwm1l3fZej0zzJhb": { tier: "pro", credits: 300 },
  "price_1TeCpaEkHwm1l3fZj9f7Gh31": { tier: "elite", credits: 1000 },
};

// Referral multipliers (from plans.md)
const REFERRED_USER_MULTIPLIER = 1.2;  // +20% credits for referred buyer
const REFERRER_BONUS_RATIO = 0.5;  // +50% of base credits for referrer

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
            console.log(`[WEBHOOK] Linked Stripe IDs for ${email} on checkout.session.completed`);
          }
        }
        break;
      }

      case "checkout.session.expired": {
        const session = event.data.object as Stripe.Checkout.Session;
        console.log(`[WEBHOOK] Checkout session expired: ${session.id}`);
        break;
      }

      case "customer.created": {
        const customer = event.data.object as Stripe.Customer;
        console.log(`[WEBHOOK] Stripe customer created: ${customer.id}`);
        if (customer.email) {
          const user = await User.findOne({ email: customer.email });
          if (user) {
            user.stripe_customer_id = customer.id;
            await user.save();
            console.log(`[WEBHOOK] Linked Stripe customer ID ${customer.id} to user ${user.email} on customer.created`);
          }
        }
        break;
      }

      case "customer.updated": {
        const customer = event.data.object as Stripe.Customer;
        console.log(`[WEBHOOK] Stripe customer updated: ${customer.id}`);
        break;
      }

      case "customer.deleted": {
        const customer = event.data.object as Stripe.Customer;
        console.log(`[WEBHOOK] Stripe customer deleted: ${customer.id}`);
        const user = await User.findOne({ stripe_customer_id: customer.id });
        if (user) {
          const oldTier = user.subscription_tier || "free";
          user.is_subscribed = false;
          user.subscription_tier = "free";
          user.credits = 0;
          user.plan_allocated_credits = 0;
          user.stripe_customer_id = undefined;
          user.stripe_subscription_id = undefined;
          await user.save();
          await logSubscriptionHistory(
            user._id,
            oldTier,
            "cancel",
            0,
            "deleted_customer"
          );
          console.log(`[WEBHOOK] Revoked subscription and cleared Stripe IDs for deleted customer: ${user.email}`);
        }
        break;
      }

      case "customer.subscription.created": {
        const subscription = event.data.object as Stripe.Subscription;
        const customerId = subscription.customer as string;
        let user = await User.findOne({ stripe_customer_id: customerId });

        if (!user) {
          try {
            const customer = await stripe.customers.retrieve(customerId) as Stripe.Customer;
            if (customer && customer.email) {
              user = await User.findOne({ email: customer.email });
              if (user) {
                user.stripe_customer_id = customerId;
              }
            }
          } catch (err: any) {
            console.error(`[WEBHOOK] Error retrieving customer for subscription.created:`, err.message);
          }
        }

        if (user) {
          user.stripe_subscription_id = subscription.id;
          const status = subscription.status;
          if (status === "active" || status === "trialing") {
            user.is_subscribed = true;
          }
          await user.save();
          console.log(`[WEBHOOK] Linked subscription ${subscription.id} for user ${user.email} on subscription.created (status: ${status})`);
        }
        break;
      }

      case "customer.subscription.updated": {
        const subscription = event.data.object as Stripe.Subscription;
        const customerId = subscription.customer as string;
        let user = await User.findOne({
          $or: [
            { stripe_subscription_id: subscription.id },
            { stripe_customer_id: customerId }
          ]
        });

        if (user) {
          user.stripe_subscription_id = subscription.id;
          const status = subscription.status;
          const isActive = status === "active" || status === "trialing";

          if (isActive) {
            user.is_subscribed = true;
            const priceId = subscription.items.data[0]?.price.id;
            if (priceId && PLAN_MAP[priceId]) {
              const plan = PLAN_MAP[priceId];
              const oldTier = user.subscription_tier || "free";
              if (user.subscription_tier !== plan.tier) {
                user.subscription_tier = plan.tier;
                user.plan_allocated_credits = plan.credits;
                const action = oldTier === "free" ? "start" : "change";
                await logSubscriptionHistory(
                  user._id,
                  plan.tier,
                  action,
                  plan.credits,
                  subscription.id
                );
                console.log(`[WEBHOOK] Subscription updated to tier: ${plan.tier} for user ${user.email}`);
              }
            }
          } else {
            const oldTier = user.subscription_tier || "free";
            user.is_subscribed = false;
            user.subscription_tier = "free";
            user.credits = 0;
            user.plan_allocated_credits = 0;
            await logSubscriptionHistory(
              user._id,
              oldTier,
              "cancel",
              0,
              subscription.id
            );
            console.log(`[WEBHOOK] Subscription inactive (status: ${status}) for user ${user.email}`);
          }
          await user.save();
        }
        break;
      }

      case "customer.subscription.paused": {
        const subscription = event.data.object as Stripe.Subscription;
        const customerId = subscription.customer as string;
        const user = await User.findOne({ stripe_customer_id: customerId });
        if (user) {
          user.is_subscribed = false;
          await user.save();
          console.log(`[WEBHOOK] Subscription paused for user ${user.email}`);
        }
        break;
      }

      case "customer.subscription.resumed": {
        const subscription = event.data.object as Stripe.Subscription;
        const customerId = subscription.customer as string;
        const user = await User.findOne({ stripe_customer_id: customerId });
        if (user) {
          const isActive = subscription.status === "active" || subscription.status === "trialing";
          if (isActive) {
            user.is_subscribed = true;
            await user.save();
            console.log(`[WEBHOOK] Subscription resumed for user ${user.email}`);
          }
        }
        break;
      }

      case "invoice.payment_failed": {
        const invoice = event.data.object as Stripe.Invoice;
        const customerId = invoice.customer as string;
        const user = await User.findOne({ stripe_customer_id: customerId });
        if (user) {
          user.is_subscribed = false;
          await user.save();
          console.warn(`[WEBHOOK] Payment failed for ${user.email}. Access suspended.`);
        }
        break;
      }

      case "invoice.payment_action_required": {
        const invoice = event.data.object as Stripe.Invoice;
        const customerId = invoice.customer as string;
        const user = await User.findOne({ stripe_customer_id: customerId });
        if (user) {
          user.is_subscribed = false;
          await user.save();
          console.warn(`[WEBHOOK] Payment action required for ${user.email}. Access suspended.`);
        }
        break;
      }

      case "invoice.upcoming": {
        const invoice = event.data.object as Stripe.Invoice;
        console.log(`[WEBHOOK] Upcoming invoice for customer ${invoice.customer}: attempt on ${invoice.next_payment_attempt ? new Date(invoice.next_payment_attempt * 1000).toISOString() : 'unknown'}`);
        break;
      }

      case "charge.refunded": {
        const charge = event.data.object as Stripe.Charge;
        console.log(`[WEBHOOK] Charge refunded: ${charge.id}`);
        const user = await User.findOne({ stripe_customer_id: charge.customer as string });
        if (user) {
          const oldTier = user.subscription_tier || "free";
          user.is_subscribed = false;
          user.subscription_tier = "free";
          const lostCredits = user.credits || 0;
          user.credits = 0;
          user.plan_allocated_credits = 0;

          if (lostCredits > 0) {
            user.total_burn_credits = (user.total_burn_credits || 0) + lostCredits;
            await logCreditTransaction(user._id, lostCredits, "burn", "charge_refunded");
          }
          await logSubscriptionHistory(
            user._id,
            oldTier,
            "cancel",
            0,
            charge.payment_intent as string || ""
          );
          await user.save();
          console.log(`[WEBHOOK] Refund processed. Revoked subscription/credits for user: ${user.email}`);
        }
        break;
      }

      case "invoice.payment_succeeded": {
        const invoice = event.data.object as any;
        const subscriptionId = invoice.subscription as string;
        const customerId = invoice.customer as string;

        // Find the user - prioritise email lookup
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
          else if (amount < 5000) plan = { tier: "pro", credits: 300 };
          else plan = { tier: "elite", credits: 1000 };
          console.log(`[WEBHOOK WARNING] No priceId match. Used amount_paid fallback → tier: ${plan.tier}`);
        }

        // Determine action
        const oldTier = user.subscription_tier || "free";
        const action = oldTier === "free" ? "start" : (oldTier === plan.tier ? "renew" : "change");

        user.subscription_tier = plan.tier;
        user.plan_allocated_credits = plan.credits;

        // ── Referral Bonus Logic ─────────────────────────────────────────
        const referral = await Referral.findOne({ referred_user: user._id });
        if (referral) {
          if (!referral.purchase_bonus_paid) {
            // This is their first purchase! Pay out the bonus.
            const referrer = await User.findById(referral.referrer);

            // Referred user gets +20% on top of base credits
            const bonusCredits = Math.ceil(plan.credits * REFERRED_USER_MULTIPLIER);
            user.credits = bonusCredits;
            user.total_gain_credits = (user.total_gain_credits || 0) + bonusCredits;

            let referrerBonus = 0;
            if (referrer) {
              referrerBonus = Math.ceil(plan.credits * REFERRER_BONUS_RATIO);
              referrer.credits = (referrer.credits || 0) + referrerBonus;
              referrer.total_gain_credits = (referrer.total_gain_credits || 0) + referrerBonus;
              await referrer.save();
              console.log(`[REFERRAL] Referrer ${referrer.email} credited +${referrerBonus} credits (50% of ${plan.credits})`);
              await logCreditTransaction(referrer._id, referrerBonus, "add", "referral_purchase_bonus");
            }

            // Update referral status and paid flag
            referral.status = "subscribed";
            referral.purchase_bonus_paid = true;
            referral.referrer_purchase_bonus = referrerBonus;
            referral.referred_purchase_bonus = bonusCredits - plan.credits;
            referral.purchase_tier = plan.tier;
            await referral.save();

            console.log(`[REFERRAL] Referred user ${user.email} gets ${bonusCredits} credits (+20% of ${plan.credits})`);
            await logCreditTransaction(user._id, plan.credits, "add", "subscription_purchase");
            await logCreditTransaction(user._id, bonusCredits - plan.credits, "add", "referral_purchase_bonus");
          } else {
            // Already paid out purchase bonus on a previous cycle/invoice.
            // Give them standard plan credits.
            user.credits = plan.credits;
            user.total_gain_credits = (user.total_gain_credits || 0) + plan.credits;
            console.log(`[REFERRAL] User ${user.email} already had purchase bonus paid. Loaded standard plan credits: ${plan.credits}`);
            await logCreditTransaction(user._id, plan.credits, "add", "subscription_purchase");
          }
        } else if (user.referred_by) {
          // Fallback: If referral record was missing but user has referred_by, create it, pay out bonus
          const referrer = await User.findOne({ referral_code: user.referred_by });
          if (referrer && referrer._id.toString() !== user._id.toString()) {
            const bonusCredits = Math.ceil(plan.credits * REFERRED_USER_MULTIPLIER);
            user.credits = bonusCredits;
            user.total_gain_credits = (user.total_gain_credits || 0) + bonusCredits;

            const referrerBonus = Math.ceil(plan.credits * REFERRER_BONUS_RATIO);
            referrer.credits = (referrer.credits || 0) + referrerBonus;
            referrer.total_gain_credits = (referrer.total_gain_credits || 0) + referrerBonus;
            await referrer.save();
            await logCreditTransaction(referrer._id, referrerBonus, "add", "referral_purchase_bonus");

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
            await logCreditTransaction(user._id, plan.credits, "add", "subscription_purchase");
            await logCreditTransaction(user._id, bonusCredits - plan.credits, "add", "referral_purchase_bonus");
          } else {
            user.credits = plan.credits;
            user.total_gain_credits = (user.total_gain_credits || 0) + plan.credits;
            await logCreditTransaction(user._id, plan.credits, "add", "subscription_purchase");
          }
        } else {
          // Non-referred user gets standard base credits
          user.credits = plan.credits;
          user.total_gain_credits = (user.total_gain_credits || 0) + plan.credits;
          await logCreditTransaction(user._id, plan.credits, "add", "subscription_purchase");
        }
        // ─────────────────────────────────────────────────────────────────

        await logSubscriptionHistory(
          user._id,
          plan.tier,
          action,
          plan.credits,
          subscriptionId
        );

        await user.save();
        console.log(`[WEBHOOK] Subscription active for ${user.email}. Tier: ${user.subscription_tier}, Credits: ${user.credits}`);
        break;
      }

      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription;
        const user = await User.findOne({
          $or: [
            { stripe_subscription_id: subscription.id },
            { stripe_customer_id: subscription.customer as string }
          ]
        });
        if (user) {
          const oldTier = user.subscription_tier || "free";
          const lostCredits = user.credits || 0;

          user.is_subscribed = false;
          user.subscription_tier = "free";
          user.credits = 0;
          user.plan_allocated_credits = 0;

          if (lostCredits > 0) {
            user.total_burn_credits = (user.total_burn_credits || 0) + lostCredits;
            await logCreditTransaction(user._id, lostCredits, "burn", "subscription_ended");
          }
          await logSubscriptionHistory(
            user._id,
            oldTier,
            "cancel",
            0,
            subscription.id
          );

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

