import express from "express";
import { adminLogin , updateAdminCredentials, getAllProductsAdmin} from "../controllers/adminAuth.js";
import { verifyAdmin } from "../middleware/adminMiddleware.js";

const router = express.Router();

router.post("/login", adminLogin);
router.get("/check", verifyAdmin, (req, res) => {
  res.json({ message: "Authorized" });
});
router.put("/update-credentials", updateAdminCredentials);
router.get("/", protect, admin, getAllProductsAdmin);



export default router;
