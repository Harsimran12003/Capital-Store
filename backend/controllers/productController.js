import Product from "../models/Product.js";

export const createProduct = async (req, res) => {
  try {
    const {
      originalPrice,
      discountedPrice,
    } = req.body;

    let discountPercent = 0;

    if (
      originalPrice &&
      discountedPrice &&
      originalPrice > discountedPrice
    ) {
      discountPercent = Math.round(
        ((originalPrice - discountedPrice) / originalPrice) * 100
      );
    }

    const product = await Product.create({
      ...req.body,
      discountPercent,
      rating: 0, 
    });

    res.status(201).json(product);
  } catch (err) {
    console.error("Create product error:", err);
    res.status(500).json({ message: err.message });
  }
};
