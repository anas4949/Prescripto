import express from "express";
import { createCheckoutSession, verifyPayment } from "../controllers/paymentController.js";
import { authUser } from "../middlewares/authUser.js";

const router = express.Router();

router.post("/create-checkout-session", authUser, createCheckoutSession);
router.post("/verify-payment", verifyPayment);

export default router;
