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

    // 1️⃣ Create Order as PENDING (NOT placed yet)
    const order = await Order.create({
      user: user._id,
      items,
      address,
      paymentMethod,
      pricing,
      paymentStatus: "pending",   // payment not completed
      orderStatus: "pending",      // not placed yet
    });

    // 2️⃣ If COD -> instantly confirm & ship
    if (paymentMethod === "cod") {
      order.paymentStatus = "paid";          // COD assumed paid in backend logic
      order.orderStatus = "placed";

      try {
        const ship = await createShiprocketOrder({ order, user, address });

        order.shipment = {
          shiprocket_order_id: ship.order_id,
          shipment_id: ship.shipment_id,
          awb: ship.awb,
          courier: ship.courier_name || "",
          status: "created"
        };
      } catch (err) {
        console.log("Shiprocket COD Failed:", err.response?.data || err.message);
      }

      await order.save();
    }

    return res.status(201).json(order);
  } catch (err) {
    console.error("Create Order Error:", err);
    return res.status(500).json({ message: err.message });
  }
};
