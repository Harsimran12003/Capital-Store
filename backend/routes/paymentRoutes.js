import express from "express";
import protect from "../middleware/authMiddleware.js";
import {
  createPhonePePayment,
  phonePeCallback,
} from "../controllers/paymentController.js";

const router = express.Router();

router.post("/phonepe/create", protect, createPhonePePayment);
router.post("/phonepe/callback/:orderId", phonePeCallback);
router.post("/phonepe/callback/:orderId", phonePeCallback);


export default router;
