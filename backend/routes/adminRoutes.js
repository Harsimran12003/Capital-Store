import express from "express";
import {
  adminLogin,
  updateAdminCredentials,
  getAllProductsAdmin,
} from "../controllers/adminAuth.js";
import { verifyAdmin } from "../middleware/adminMiddleware.js";

const router = express.Router();

router.post("/login", adminLogin);
router.get("/check", verifyAdmin, (req, res) => {
  res.json({ message: "Authorized" });
});


router.get("/products", verifyAdmin, getAllProductsAdmin);

router.put("/update-credentials", verifyAdmin, updateAdminCredentials);

export default router;
