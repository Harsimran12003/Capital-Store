import express from "express";
import protect from "../middleware/authMiddleware.js";
import {
  createPhonePePayment,
  verifyPhonePePayment,
} from "../controllers/paymentController.js";

const router = express.Router();

router.post("/phonepe/create", protect, createPhonePePayment);
router.post("/phonepe/verify", verifyPhonePePayment);

export default router;
