import express from "express";
import { getHeroSlides, saveHeroSlides } from "../controllers/heroSliderController.js";
import protect from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", getHeroSlides);
router.post("/", protect, saveHeroSlides);


export default router;
