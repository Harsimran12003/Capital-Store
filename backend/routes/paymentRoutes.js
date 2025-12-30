import express from "express";
import protect from "../middleware/authMiddleware.js";
import {
  createPhonePePayment,
  phonePeCallback,
} from "../controllers/paymentController.js";

const router = express.Router();

router.post("/phonepe/create", protect, createPhonePePayment);
router.post("/phonepe/callback/:orderId", phonePeCallback);
router.get("/payment/debug", (req,res)=>{
  res.json({
    merchantId: process.env.PHONEPE_MERCHANT_ID,
    saltKey: process.env.PHONEPE_SALT_KEY ? "Exists" : "Missing",
    saltIndex: process.env.PHONEPE_SALT_INDEX,
    env: process.env.PHONEPE_ENV
  });
});


export default router;
