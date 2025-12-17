import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import passport from "passport";
import connectDB from "./config/db.js";
import "./config/passport.js";
import cookieParser from "cookie-parser";


dotenv.config();
connectDB();

import authRoutes from "./routes/authRoutes.js";

const app = express();
app.use(cookieParser());

app.use(
  cors({
    origin: "http://localhost:5173", 
    credentials: true,               
    methods: ["GET", "POST", "PUT", "DELETE"],
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(passport.initialize());

app.use("/api/auth", authRoutes);

app.get("/", (req, res) => {
  res.send("Capital Store API is running 🚀");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`Server running on port ${PORT}`)
);

export default app;