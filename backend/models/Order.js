import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    items: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
        },
        name: String,
        image: String,

        size: {
          type: String,
          required: true, // ✅ SIZE IS MANDATORY
        },

        price: Number,
        originalPrice: Number,
        qty: Number,
      },
    ],

    address: {
      label: String,
      addressLine: String,
      city: String,
      state: String,
      pincode: String,
    },

    paymentMethod: {
      type: String,
      enum: ["upi", "card", "cod"],
      required: true,
    },

    pricing: {
      mrp: Number,
      discount: Number,
      total: Number,
    },

    paymentStatus: {
      type: String,
      enum: ["pending", "paid"],
      default: "pending",
    },

    orderStatus: {
      type: String,
      enum: ["placed", "confirmed", "shipped", "delivered"],
      default: "placed",
    },
    shipment: {
  pushed: { type: Boolean, default: false },
  shiprocketOrderId: String,
  awb: String,
  courier: String,
  trackingUrl: String,
  status: { type: String, default: "Pending" }
}

  },
  { timestamps: true }
);

export default mongoose.model("Order", orderSchema);
