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

    category: String,
    subCategory: String,

    images: [String],
    video: String,
    
    rating: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Product", productSchema);
