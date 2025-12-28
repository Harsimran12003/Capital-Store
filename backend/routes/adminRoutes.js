import express from "express";
import { adminLogin } from "../controllers/adminAuth.js";
import { verifyAdmin } from "../middleware/adminMiddleware.js";

const router = express.Router();

router.post("/login", adminLogin);
router.get("/check", verifyAdmin, (req, res) => {
  res.json({ message: "Authorized" });
});

export default router;
