import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import HeroSlider from "../components/HeroSlider";
import CategoryCards from "../components/CategoryCards";
import BestsellerGrid from "../components/BestsellerGrid";
import VideoSection from "../components/VideoSection";
import WhatsAppToggle from "../components/WhatsAppToggle";
import Footer from "../components/Footer";
import IntroScreen from "../components/IntroScreen";
import { bestsellerItems } from "../data/products";

// Sample product data
const sampleBestsellers = new Array(8).fill(0).map((_, i) => ({
  id: i + 1,
  name: `Elegant Kurta Set ${i + 1}`,
  desc: "Comfortable fabric — perfect for festive & daily wear",
  price: 2499 + i * 200,
  mrp: 3499 + i * 250,
  rating: (4 + (i % 2) * 0.5).toFixed(1),
  off: 30,
}));

export default function Homepage() {
  const [cartOpen, setCartOpen] = useState(false);
  const [bestsellers, setBestsellers] = useState([]);

  useEffect(() => setBestsellers(sampleBestsellers), []);

  return (
    <div className="bg-white text-gray-800 pt-[100px]">
      <IntroScreen />
      <Navbar />
      

      <HeroSlider />
      <CategoryCards />
      <BestsellerGrid items={ bestsellerItems } />
      <VideoSection />
      <Footer />
      <WhatsAppToggle />

      
    </div>
  );
}
