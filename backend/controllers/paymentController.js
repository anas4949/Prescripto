// ✅ Import dependencies
import Stripe from "stripe";
import dotenv from "dotenv";
import appointmentModel from "../models/appointmentModel.js";

// ✅ Load environment variables FIRST
dotenv.config();

// ✅ Verify Stripe key before initializing
if (!process.env.STRIPE_SECRET_KEY) {
  console.error("❌ STRIPE_SECRET_KEY is missing in .env file!");
  throw new Error("Stripe secret key not configured");
}

// ✅ Initialize Stripe with your secret key
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// ✅ Create Checkout Session
export const createCheckoutSession = async (req, res) => {
  try {
    const { appointmentId } = req.body;
    const appointment = await appointmentModel.findById(appointmentId);

    if (!appointment) {
      return res.json({ success: false, message: "Appointment not found" });
    }

    // ✅ Create a Stripe Checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: `Appointment with ${appointment.docData.name}`,
              description: appointment.docData.speciality,
            },
            unit_amount: appointment.amount * 100, // Convert to cents
          },
          quantity: 1,
        },
      ],
      success_url: `${process.env.FRONTEND_URL}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.FRONTEND_URL}/my-appointments`,
      metadata: { appointmentId },
    });

    console.log("✅ Stripe Session Created:", session.id);
    res.json({ success: true, url: session.url });
  } catch (error) {
    console.error("❌ Stripe error:", error);
    res.json({ success: false, message: error.message });
  }
};

// ✅ Verify Payment and Update Appointment
export const verifyPayment = async (req, res) => {
  try {
    const { sessionId } = req.body;

    // ✅ Retrieve the checkout session from Stripe
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (session.payment_status === "paid") {
      const appointmentId = session.metadata.appointmentId;

      // ✅ Mark appointment as paid in MongoDB
      await appointmentModel.findByIdAndUpdate(appointmentId, { payment: true });

      return res.json({ success: true, message: "Payment verified successfully" });
    } else {
      return res.json({ success: false, message: "Payment not completed yet" });
    }
  } catch (error) {
    console.error("Error verifying payment:", error);
    res.json({ success: false, message: error.message });
  }
};
