import express from "express";
import protect from "../middleware/authMiddleware.js";
import upload from "../middleware/uploadReviewImages.js";
import {
  getProductReviews,
  addReview,
} from "../controllers/reviewController.js";

const router = express.Router();

// GET all reviews of a product
router.get("/:productId", getProductReviews);

// ADD review (login required)
router.post("/:productId", protect, upload.array("images", 5), addReview);

export default router;
