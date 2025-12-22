import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import sendToken from "../utils/sendToken.js";

/* REGISTER */
export const registerUser = async (req, res) => {
  try {
    const { name, email, phone, password } = req.body;

    const exists = await User.findOne({ email });
    if (exists) {
      return res.status(400).json({ message: "Account already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      phone,
      password: hashedPassword,
      authProvider: "local",
    });

    sendToken(user, res); // ✅ cookie set
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* LOGIN */
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    if (user.authProvider === "google") {
      return res.status(400).json({
        message: "Please login using Google",
      });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ message: "Invalid credentials" });

    sendToken(user, res); // ✅ cookie set
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const { name } = req.body;

    if (!name || name.trim() === "") {
      return res.status(400).json({ message: "Name is required" });
    }

    const user = await User.findById(req.user._id);
    user.name = name;
    await user.save();

    res.json({
      message: "Profile updated",
      user,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const addAddress = async (req, res) => {
  const user = await User.findById(req.user._id);

  user.addresses.push(req.body);
  await user.save();

  res.json({ addresses: user.addresses });
};

export const deleteAddress = async (req, res) => {
  const user = await User.findById(req.user._id);

  user.addresses.splice(req.params.index, 1);
  await user.save();

  res.json({ addresses: user.addresses });
};


