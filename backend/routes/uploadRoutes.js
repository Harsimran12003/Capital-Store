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

router.post("/product-image", protect, async (req, res) => {
  try {
    const { image } = req.body;

    if (!image) {
      return res.status(400).json({ message: "Image is required" });
    }

    const result = await cloudinary.uploader.upload(image, {
      folder: "capitalstore/products",
    });

    res.json({ imageUrl: result.secure_url });
  } catch (err) {
    console.error("Cloudinary upload error:", err);
    res.status(500).json({ message: "Image upload failed" });
  }
});


export default router;
