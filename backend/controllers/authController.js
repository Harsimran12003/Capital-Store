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

    sendToken(user, res); 
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* LOGIN */
export const loginUser = async (req, res) => {
  try {
    const { loginId, password } = req.body;

    if (!loginId || !password) {
      return res.status(400).json({ message: "Email/Phone and password required" });
    }

    // Find by email OR phone
    const user = await User.findOne({
      $or: [{ email: loginId }, { phone: loginId }]
    });

    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // If Google-only account
    if (user.authProvider === "google") {
      return res.status(400).json({
        message: "Please login using Google",
      });
    }

    // Check password
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Success
    sendToken(user, res);

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

export const getAddresses = async (req, res) => {
  const user = await User.findById(req.user._id);
  res.json({ addresses: user.addresses });
};


export const selectAddress = async (req, res) => {
  const { index } = req.body;

  const user = await User.findById(req.user._id);
  user.selectedAddress = index;
  await user.save();

  res.json({ success: true });
};



