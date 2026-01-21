import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: String,
    description: String,

    originalPrice: Number,
    discountedPrice: Number,

    discountPercent: {
      type: Number,
      default: 0,
    },

    category: String, // Readymade | Unstitched
    subCategory: String,

    images: [String],
    video: String,

    rating: {
      type: Number,
      default: 0,
    },

    // 🔥 NEW: Stock Management
    stock: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
      /*
        Unstitched → { quantity: 50 }
        Readymade → { S: 10, M: 20, L: 15, XL: 5, XXL: 2 }
      */
    },
  },
  { timestamps: true }
);

export default mongoose.model("Product", productSchema);
