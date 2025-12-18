import HeroSlider from "../models/HeroSlider.js";

/* GET SLIDES (PUBLIC) */
export const getHeroSlides = async (req, res) => {
  const slides = await HeroSlider.find().sort({ order: 1 });
  res.json(slides);
};

/* CREATE / UPDATE SLIDES (ADMIN) */
export const saveHeroSlides = async (req, res) => {
  const slides = req.body;

  for (const slide of slides) {
    await HeroSlider.findOneAndUpdate(
      { order: slide.order },
      { imageUrl: slide.imageUrl },
      { upsert: true }
    );
  }

  res.json({ message: "Hero slider updated" });
};
