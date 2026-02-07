import Admin from "../models/Admin.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import Product from "../models/Product.js";
import Order from "../models/Order.js";


export const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const admin = await Admin.findOne({ email });
    if (!admin) return res.status(401).json({ message: "Invalid credentials" });

    const isMatch = password === admin.password;
    if (!isMatch) return res.status(401).json({ message: "Invalid credentials" });

    const token = jwt.sign(
      { id: admin._id, role: "admin" },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.cookie("admin_token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
    });

    res.json({ message: "Login successful" });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


export const updateAdminCredentials = async (req, res) => {
  try {
    const { email, oldPassword, newPassword } = req.body;

    const admin = await Admin.findOne();
    if (!admin) return res.status(404).json({ message: "Admin not found" });

    if (admin.password !== oldPassword)
      return res.status(401).json({ message: "Old password incorrect" });

    admin.email = email || admin.email;
    admin.password = newPassword || admin.password;

    await admin.save();

    res.json({ message: "Admin credentials updated successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getAllProductsAdmin = async (req, res) => {
  try {
    const { category, subCategory } = req.query;

    const query = {};
    if (category) query.category = category;
    if (subCategory) query.subCategory = subCategory;

    // 🔥 NO STOCK FILTER
    const products = await Product.find(query).sort({ createdAt: -1 });

    res.json(products);
  } catch (err) {
    console.error("Admin get products error:", err);
    res.status(500).json({ message: err.message });
  }
};

export const getAllOrdersAdmin = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("user", "name email")
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const updateOrderStatusAdmin = async (req, res) => {
  try {
    const { orderStatus, courierName } = req.body;

    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // ✅ update status
    if (orderStatus) {
      order.orderStatus = orderStatus;
    }

    // ✅ update courier
    if (courierName !== undefined) {
      order.courierName = courierName;
    }

    await order.save();

    // populate user again so frontend doesn’t lose it
    await order.populate("user", "name email");

    res.json(order);
  } catch (err) {
    console.error("Admin update order error:", err);
    res.status(500).json({ message: "Failed to update order" });
  }
};

export const deleteOrderAdmin = async (req, res) => {
  try {
    const order = await Order.findByIdAndDelete(req.params.id);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.json({ message: "Order deleted successfully" });
  } catch (err) {
    console.error("Admin delete order error:", err);
    res.status(500).json({ message: "Failed to delete order" });
  }
};


