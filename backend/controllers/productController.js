import Product from "../models/Product.js";

/* ================= CREATE PRODUCT ================= */
export const createProduct = async (req, res) => {
  try {
    const {
      originalPrice,
      discountedPrice,
      category,
      stock,
    } = req.body;

    let discountPercent = 0;

    if (originalPrice && discountedPrice && originalPrice > discountedPrice) {
      discountPercent = Math.round(
        ((originalPrice - discountedPrice) / originalPrice) * 100
      );
    }

    const product = await Product.create({
      ...req.body,
      discountPercent,
      rating: 0,
      stock, // 🔥 save stock
    });

    res.status(201).json(product);
  } catch (err) {
    console.error("Create product error:", err);
    res.status(500).json({ message: err.message });
  }
};


/* ================= GET ALL PRODUCTS ================= */
export const getAllProducts = async (req, res) => {
  try {
    const { category, subCategory } = req.query;

    const query = {};
    if (category) query.category = category;
    if (subCategory) query.subCategory = subCategory;

    const products = await Product.find(query).sort({ createdAt: -1 });
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* ================= GET SINGLE PRODUCT ================= */
export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product)
      return res.status(404).json({ message: "Product not found" });

    res.json(product);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* ================= UPDATE PRODUCT ================= */
export const updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product)
      return res.status(404).json({ message: "Product not found" });
    const { stock } = req.body;

if (stock) {
  product.stock = stock;
}

    const {
      name,
      description,
      originalPrice,
      discountedPrice,
      category,
      subCategory,
      images,
      video,
    } = req.body;

    product.name = name;
    product.description = description;
    product.originalPrice = originalPrice;
    product.discountedPrice = discountedPrice;
    product.category = category;
    product.subCategory = subCategory;
    product.images = images || product.images;
    product.video = video || product.video;

    // Recalculate discount percent
    if (
      originalPrice &&
      discountedPrice &&
      originalPrice > discountedPrice
    ) {
      product.discountPercent = Math.round(
        ((originalPrice - discountedPrice) / originalPrice) * 100
      );
    } else {
      product.discountPercent = 0;
    }

    await product.save();

    res.json(product);
  } catch (err) {
    console.error("Update product error:", err);
    res.status(500).json({ message: err.message });
  }
};


/* ================= DELETE PRODUCT ================= */
export const deleteProduct = async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: "Product deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
