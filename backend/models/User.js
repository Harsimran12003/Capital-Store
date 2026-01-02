import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: String,
    email: { type: String, unique: true },
    phone: String,
    password: String,
    googleId: String,
    authProvider: {
      type: String,
      enum: ["local", "google"],
      default: "local",
    },
    addresses: [
  {
    label: String,
    addressLine: String,
    city: String,
    state: String,
    pincode: String,
    phone: String,
  },],
  selectedAddress: {
      type: Number,
      default: null,
    },
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
