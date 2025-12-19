import express from "express";
import { createProduct } from "../controllers/productController.js";
import protect from "../middleware/authMiddleware.js";
import Product from "../models/Product.js";

const router = express.Router();

router.post("/", protect, createProduct);
router.get("/", async (req, res) => {
  const { subCategory } = req.query;
  const query = subCategory ? { subCategory } : {};
  const products = await Product.find(query).sort({ createdAt: -1 });
  res.json(products);
});


export default router;
