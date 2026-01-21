import express from "express";
import {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  getAllProductsAdmin
} from "../controllers/productController.js";
import protect from "../middleware/authMiddleware.js";
import uploadProductImages from "../middleware/uploadProductImages.js";

const router = express.Router();

/* ================= ADMIN ROUTES ================= */
router.post("/", createProduct);
router.get("/", getAllProducts); 
router.get("/:id", getProductById);
router.put("/:id", uploadProductImages.array("images", 10), updateProduct);
router.delete("/:id", protect, deleteProduct);

export default router;
