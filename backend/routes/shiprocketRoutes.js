import express from "express";
import { trackShipmentByAWB } from "../services/shiprocketService.js";
import Order from "../models/Order.js";

const router = express.Router();

router.get("/track/:orderId", async (req, res) => {
  try {
    const order = await Order.findById(req.params.orderId);

    if (!order || !order.shipment?.awb)
      return res.status(404).json({ message: "Shipment not found" });

    const data = await trackShipmentByAWB(order.shipment.awb);

    res.json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
