import Order from "../models/Order.js";
import User from "../models/User.js";
import { createShiprocketOrder } from "../services/shiprocketService.js";

export const createOrder = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user || user.selectedAddress === null) {
      return res.status(400).json({ message: "Address not selected" });
    }

    const { items, paymentMethod, pricing } = req.body;
    const address = user.addresses[user.selectedAddress];

    // Create DB Order
    const order = await Order.create({
      user: user._id,
      items,
      address,
      paymentMethod,
      pricing,
      paymentStatus: "pending",
      orderStatus,
    });

    // Push to Shiprocket
    try {
      const ship = await createShiprocketOrder({ order, user, address });

      order.shipment = {
        shiprocket_order_id: ship.order_id,
        shipment_id: ship.shipment_id,
        awb: ship.awb,
        courier: ship.courier_name || "",
        status: "created"
      };

      await order.save();
    } catch (err) {
      console.log("Shiprocket Failed:", err.response?.data || err.message);
    }

    res.status(201).json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
