import express from "express";
import protect from "../middleware/authMiddleware.js";
import { createOrder } from "../controllers/orderController.js";
import authMiddleware from "../middleware/authMiddleware.js";
import Order from "../models/Order.js";

const router = express.Router();

router.post("/", protect, createOrder);
router.get("/my", authMiddleware, async (req, res) => {
  const orders = await Order.find({ user: req.user._id })
    .sort({ createdAt: -1 });

  res.json(orders);
});


export default router;
