import express from "express";
import {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
} from "../controllers/productController.js";
import protect from "../middleware/authMiddleware.js";

const router = express.Router();

/* ================= ADMIN ROUTES ================= */
router.post("/", protect, createProduct);
router.get("/", getAllProducts); 
router.get("/:id", protect, getProductById);
router.put("/:id", protect, updateProduct);
router.delete("/:id", protect, deleteProduct);

export default router;
