import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: String,
    description: String,
    originalPrice: Number,
    discountedPrice: Number,
    category: String,
    subCategory: String,

    images: [String], // Cloudinary URLs
    video: String,    // Cloudinary URL
  },
  { timestamps: true }
);

export default mongoose.model("Product", productSchema);
