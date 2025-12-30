import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import passport from "passport";
import cookieParser from "cookie-parser";

import connectDB from "./config/db.js";
import "./config/passport.js";

import authRoutes from "./routes/authRoutes.js";
import heroSliderRoutes from "./routes/heroSliderRoutes.js";
import uploadRoutes from "./routes/uploadRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import reviewRoutes from "./routes/reviewRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";
import shiprocketRoutes from "./routes/shiprocketRoutes.js";
import shiprocketWebhook from "./routes/shiprocketWebhook.js";
import adminRoutes from "./routes/adminRoutes.js";

dotenv.config();

// CREATE APP FIRST
const app = express();

// MIDDLEWARES
app.use(cookieParser());

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://capital-store.vercel.app",
      "https://www.capitalstorecs.com", 
      "https://capitalstorecs.com"      
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  })
);
app.options("*", cors({
  origin: true,
  credentials: true,
}));


app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ CONNECT DB PER REQUEST (Vercel safe)
app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (err) {
    console.error("DB connection error:", err);
    res.status(500).json({ message: "Database connection failed" });
  }
});

// ✅ PASSPORT
app.use(passport.initialize());

// ✅ ROUTES
app.use("/api/auth", authRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/hero-slides", heroSliderRoutes);
app.use("/api/products", productRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/payment", paymentRoutes);
app.use("/api/shiprocket", shiprocketRoutes);
app.use("/api", shiprocketWebhook);

app.use("/api/admin", adminRoutes);

// ✅ ROOT
app.get("/", (req, res) => {
  res.send("Capital Store API is running 🚀");
});

// ✅ START SERVER
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on ${PORT}`));

export default app;