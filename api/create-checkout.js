// Creates the Stripe Checkout Session for the quiz match.
// POST /api/create-checkout  { product, refill, answers }
// Prices come from src/data/quiz.js on the server, never from the browser.

import Stripe from "stripe";
import { PRODUCTS, PRICE, REFILL, matchFor, isCompleteAnswers } from "../src/data/quiz.js";

export function buildCheckout(body) {
  const product = PRODUCTS[body?.product];
  if (!product) return { error: "Choose a body wash first." };
  const refill = body?.refill === true;
  const answers = isCompleteAnswers(body?.answers) ? body.answers : null;

  const lineItems = [
    {
      quantity: 1,
      price_data: {
        currency: "usd",
        unit_amount: PRICE.now * 100,
        product_data: { name: `Lumen Bath ${product.name}`, description: `${product.size}. Quiz price, 15% off.` },
      },
    },
  ];
  if (refill) {
    lineItems.push({
      quantity: 1,
      price_data: {
        currency: "usd",
        unit_amount: REFILL.price * 100,
        product_data: { name: `${product.short} ${REFILL.name}`, description: REFILL.detail },
      },
    });
  }

  return {
    lineItems,
    metadata: {
      product: product.id,
      refill: refill ? "yes" : "no",
      // Was this the quiz's own match, or did the visitor switch? Useful for tuning the quiz later.
      quizMatch: answers ? matchFor(answers) : "",
      skin: answers?.skin || "",
      time: answers?.time || "",
      scent: answers?.scent || "",
    },
  };
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  const order = buildCheckout(req.body);
  if (order.error) {
    res.status(400).json({ error: order.error });
    return;
  }

  const protocol = req.headers["x-forwarded-proto"] || "http";
  const origin = `${protocol}://${req.headers.host}`;

  try {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      adaptive_pricing: { enabled: false },
      allowed_payment_method_types: ["card"],
      line_items: order.lineItems,
      shipping_address_collection: { allowed_countries: ["US"] },
      shipping_options: [
        {
          shipping_rate_data: {
            display_name: "Free standard shipping",
            type: "fixed_amount",
            fixed_amount: { amount: 0, currency: "usd" },
            delivery_estimate: { minimum: { unit: "business_day", value: 3 }, maximum: { unit: "business_day", value: 5 } },
          },
        },
      ],
      metadata: order.metadata,
      success_url: `${origin}/thank-you.html?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/?checkout=cancelled`,
    });
    res.status(200).json({ url: session.url });
  } catch (err) {
    console.error("Stripe checkout error:", err.message);
    res.status(500).json({ error: "Checkout couldn't start. Please try again." });
  }
}
