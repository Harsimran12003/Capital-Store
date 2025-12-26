import express from "express";
import Order from "../models/Order.js";

const router = express.Router();

router.post("/shiprocket/webhook", async (req, res) => {
  try {
    console.log("Shiprocket Webhook:", req.body);

    const awb =
      req.body.awb ||
      req.body.awb_code ||
      req.body.awb_number;

    const status =
      req.body.current_status ||
      req.body.status ||
      req.body.current_status_code;

    if (!awb) return res.sendStatus(400);

    const order = await Order.findOne({ "shipment.awb": awb });

    if (!order) return res.sendStatus(404);

    order.shipment.status = status;
    order.orderStatus = status;

    await order.save();

    res.sendStatus(200);
  } catch (err) {
    console.error("Webhook Error:", err.message);
    res.sendStatus(500);
  }
});

export default router;
