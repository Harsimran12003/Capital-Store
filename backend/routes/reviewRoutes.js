import express from "express";
import protect from "../middleware/authMiddleware.js";
import {
  getProductReviews,
  addReview,
} from "../controllers/reviewController.js";

const router = express.Router();

// GET all reviews of a product
router.get("/:productId", getProductReviews);

// ADD review (login required)
router.post("/:productId", protect, addReview);

export default router;
