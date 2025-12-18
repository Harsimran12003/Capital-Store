import mongoose from "mongoose";

const heroSliderSchema = new mongoose.Schema(
  {
    imageUrl: { type: String, required: true },
    order: { type: Number, required: true },
  },
  { timestamps: true }
);

export default mongoose.model("HeroSlider", heroSliderSchema);
