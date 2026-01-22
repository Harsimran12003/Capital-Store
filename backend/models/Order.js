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
          required: true,
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
      phone: String,
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
      enum: ["pending", "placed", "confirmed", "shipped", "delivered"],
      default: "pending",
    },
    courierName: {
  type: String,
  default: "",
},

  },
  { timestamps: true },
);

export default mongoose.model("Order", orderSchema);
