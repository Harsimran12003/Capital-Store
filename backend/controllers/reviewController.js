import Review from "../models/Review.js";
import Product from "../models/Product.js";

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

    // Prevent duplicate review by same user
    const alreadyReviewed = await Review.findOne({
      product: product._id,
      user: req.user._id,
    });

    if (alreadyReviewed) {
      return res.status(400).json({ message: "Already reviewed" });
    }

    const review = await Review.create({
      product: product._id,
      user: req.user._id,
      userName: req.user.name,
      rating,
      text,
      images,
    });

    // ⭐ update product rating
    const reviews = await Review.find({ product: product._id });
    product.rating = Math.round(
      reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
    );
    await product.save();

    res.status(201).json(review);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
