import express from "express";
import passport from "passport";
import jwt from "jsonwebtoken";
import { registerUser, loginUser, updateProfile, addAddress, deleteAddress } from "../controllers/authController.js";
import protect from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/register", registerUser);

router.post("/login", loginUser);

router.post("/logout", (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: true,       // MUST match cookie
    sameSite: "none",   // MUST match cookie
  });

  res.status(200).json({ success: true });
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
      secure: true,       
      sameSite: "none",    
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    // NO token in URL anymore
    res.redirect("https://www.capitalstorecs.com/");
  }
);

router.put("/update-profile", protect, updateProfile);
router.post("/address", protect, addAddress);
router.delete("/address/:index", protect, deleteAddress);


export default router;