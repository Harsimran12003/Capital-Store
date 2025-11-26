import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import PromoTicker from "../components/PromoTicker";
import HeroSlider from "../components/HeroSlider";
import CategoryCards from "../components/CategoryCards";
import BestsellerGrid from "../components/BestsellerGrid";
import VideoSection from "../components/VideoSection";
import WhatsAppToggle from "../components/WhatsAppToggle";
import Footer from "../components/Footer";

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
      <Navbar onOpenCart={() => setCartOpen(true)} />

      <HeroSlider />
      <CategoryCards />
      <BestsellerGrid items={bestsellers} />
      <VideoSection />
      <Footer />
      <WhatsAppToggle />

      {cartOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-30 z-50 flex justify-end">
          <div className="w-full sm:w-96 bg-white h-full p-6">
            <div className="flex justify-between">
              <h3 className="font-semibold text-lg">Your Cart</h3>
              <button onClick={() => setCartOpen(false)}>Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
