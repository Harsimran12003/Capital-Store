import express from "express";
import {
  adminLogin,
  updateAdminCredentials,
  getAllProductsAdmin,
  getAllOrdersAdmin,
  updateOrderStatusAdmin,
} from "../controllers/adminAuth.js";
import { verifyAdmin } from "../middleware/adminMiddleware.js";

const router = express.Router();

router.post("/login", adminLogin);
router.get("/check", verifyAdmin, (req, res) => {
  res.json({ message: "Authorized" });
});


router.get("/products", verifyAdmin, getAllProductsAdmin);

router.put("/update-credentials", verifyAdmin, updateAdminCredentials);
router.get("/orders", verifyAdmin, getAllOrdersAdmin);
router.put("/orders/:id/status", verifyAdmin, updateOrderStatusAdmin);

export default router;
