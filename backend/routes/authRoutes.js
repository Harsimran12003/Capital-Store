import express from "express";
import passport from "passport";
import jwt from "jsonwebtoken";
import { registerUser, loginUser } from "../controllers/authController.js";
import protect from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/register", registerUser);

router.post("/login", loginUser);

router.post("/logout", (req, res) => {
  res.clearCookie("token");
  res.json({ success: true });
});
router.get("/me", protect, (req, res) => {
  res.json({ user: req.user });
});



/* GOOGLE AUTH */
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
  "/google/callback",
  passport.authenticate("google", { session: false }),
  (req, res) => {
    const token = jwt.sign(
      { id: req.user._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    // ✅ NO token in URL anymore
    res.redirect("https://www.capitalstorecs.com/");
  }
);


export default router;
