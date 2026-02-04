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
router.get("/:id", authMiddleware, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate("user", "email name");

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // Security: user can only view their own order
    if (order.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: "Not authorized" });
    }

    res.json(order);
  } catch (err) {
    console.error("Get Order Error:", err);
    res.status(500).json({ message: "Server error" });
  }
});



export default router;
