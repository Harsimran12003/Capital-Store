import express from "express";
import cloudinary from "../config/cloudinary.js";
import protect from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/hero", protect, async (req, res) => {
  try {
    const { image } = req.body; // base64

    const upload = await cloudinary.uploader.upload(image, {
      folder: "capitalstore/hero",
    });

    res.json({ imageUrl: upload.secure_url });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
