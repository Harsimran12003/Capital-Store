import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import HeroSlider from "../components/HeroSlider";
import CategoryCards from "../components/CategoryCards";
import BestsellerGrid from "../components/BestsellerGrid";
import VideoSection from "../components/VideoSection";
import WhatsAppToggle from "../components/WhatsAppToggle";
import Footer from "../components/Footer";
import IntroScreen from "../components/IntroScreen";

export default function Homepage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  /* ================= FETCH PRODUCTS ================= */
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch(
          "https://capital-store-backend.vercel.app/api/products"
        );
        const data = await res.json();

        setProducts(data.slice(0, 6));
      } catch (err) {
        console.error("Failed to fetch products", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);


  return (
    <div className="bg-white text-gray-800">
      <IntroScreen />
      <Navbar />

      <HeroSlider />
      <CategoryCards />
      <BestsellerGrid items={products} />
      <VideoSection />
      <Footer />
      <WhatsAppToggle />
    </div>
  );
}
