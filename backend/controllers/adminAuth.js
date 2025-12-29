import Admin from "../models/Admin.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

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