import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  apiVersion: "2026-05-27.dahlia" as any,
});

export async function POST(request: Request) {
  try {
    const { priceId, email } = await request.json();

    if (!priceId || !email) {
      return NextResponse.json(
        { error: "Price ID and user email are required" },
        { status: 400 }
      );
    }

    console.log(`[STRIPE] Creating checkout session for ${email} with price ${priceId}`);

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "subscription",
      customer_email: email,
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      success_url: `${process.env.NEXTAUTH_URL || "http://localhost:3000"}/dashboard/account?checkout=success`,
      cancel_url: `${process.env.NEXTAUTH_URL || "http://localhost:3000"}/pricing?checkout=cancel`,
    });

    return NextResponse.json({ success: true, url: session.url });
  } catch (error: any) {
    console.error("[STRIPE ERROR] Checkout session creation failed:", error);
    return NextResponse.json(
      { error: error.message || "Internal billing error" },
      { status: 550 }
    );
  }
}
