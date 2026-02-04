import Order from "../models/Order.js";
import User from "../models/User.js";
import { createShiprocketOrder } from "../services/shiprocketService.js";

import { sendOrderConfirmationEmail } from "../utils/sendEmail.js";

export const createOrder = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user || user.selectedAddress === null) {
      return res.status(400).json({ message: "Address not selected" });
    }

    const { items, paymentMethod, pricing } = req.body;
    const address = user.addresses[user.selectedAddress];

    const order = await Order.create({
      user: user._id,
      items,
      address,
      paymentMethod,
      pricing,
      paymentStatus: paymentMethod === "cod" ? "paid" : "pending",
      orderStatus: paymentMethod === "cod" ? "placed" : "pending",
    });

    if (paymentMethod === "cod") {
      await sendOrderConfirmationEmail(user.email, order);
    }

    res.status(201).json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

