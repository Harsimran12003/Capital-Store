import Review from "../models/Review.js";
import Product from "../models/Product.js";
import cloudinary from "../config/cloudinary.js";

// GET reviews for product
export const getProductReviews = async (req, res) => {
  try {
    const reviews = await Review.find({
      product: req.params.productId,
    })
      .populate("user", "name")
      .sort({ createdAt: -1 });

    res.json(reviews);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ADD review
export const addReview = async (req, res) => {
  try {
    const { rating, text, images = [] } = req.body;

    if (!rating || !text) {
      return res.status(400).json({ message: "Rating & review required" });
    }

    const product = await Product.findById(req.params.productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    const alreadyReviewed = await Review.findOne({
      product: product._id,
      user: req.user._id,
    });

    if (alreadyReviewed) {
      return res.status(400).json({ message: "Already reviewed" });
    }

    // ✅ Upload base64 images
    const uploadedImages = [];
    for (const img of images) {
      const upload = await cloudinary.uploader.upload(img, {
        folder: "capitalstore/reviews",
      });
      uploadedImages.push(upload.secure_url);
    }

    const review = await Review.create({
      product: product._id,
      user: req.user._id,
      userName: req.user.name,
      rating,
      text,
      images: uploadedImages,
    });

    res.status(201).json(review);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


export const deleteReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.reviewId);

    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }

    // 🔐 Ownership check
    if (review.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    // 🗑️ Delete images from Cloudinary
    for (const img of review.images) {
      const publicId = img.split("/").slice(-2).join("/").split(".")[0];
      await cloudinary.uploader.destroy(publicId);
    }

    // Remove review
    await review.deleteOne();

    // ⭐ Update product rating
    const product = await Product.findById(review.product);
    const reviews = await Review.find({ product: product._id });

    product.rating = reviews.length
      ? Math.round(reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length)
      : 0;

    await product.save();

    res.json({ message: "Review deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};