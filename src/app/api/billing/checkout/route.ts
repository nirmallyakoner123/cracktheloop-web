import { NextResponse } from "next/server";
import Stripe from "stripe";
import { connectToDatabase } from "@/lib/db";
import { User } from "@/models/User";

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

    await connectToDatabase();
    const dbUser = await User.findOne({ email });

    // Retrieve or create Stripe customer to pre-fill billing details/name
    let customer;
    const existingCustomers = await stripe.customers.list({ email, limit: 1 });
    if (existingCustomers.data.length > 0) {
      customer = existingCustomers.data[0];
      if (!customer.name && dbUser?.name) {
        customer = await stripe.customers.update(customer.id, {
          name: dbUser.name,
        });
      }
    } else {
      customer = await stripe.customers.create({
        email,
        name: dbUser?.name || undefined,
      });
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "subscription",
      customer: customer.id,
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
