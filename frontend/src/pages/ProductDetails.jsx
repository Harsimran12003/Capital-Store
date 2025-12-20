import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { motion, AnimatePresence } from "framer-motion";
import { FiHeart, FiShoppingCart, FiCheckCircle } from "react-icons/fi";
import { FaStar } from "react-icons/fa";
import useAuth from "../hooks/useAuth";


// Swiper
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Thumbs, FreeMode } from "swiper/modules";

export default function ProductDetails() {
  const { user } = useAuth();

  const { id } = useParams();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [thumbsSwiper, setThumbsSwiper] = useState(null);
  const [liked, setLiked] = useState(false);
  const [qty, setQty] = useState(0);
  const [showToast, setShowToast] = useState(false);

  /* ================= FETCH PRODUCT ================= */
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(`https://capital-store-backend.vercel.app/api/products/${id}`);
        const data = await res.json();
        setProduct(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  /* ================= LOADING / ERROR ================= */
  if (loading) {
    return (
      <>
        <Navbar />
        <p className="text-center py-20 text-gray-500">Loading product...</p>
        <Footer />
      </>
    );
  }

  if (!product) {
    return (
      <>
        <Navbar />
        <p className="text-center py-20 text-red-500">
          Product not found
        </p>
        <Footer />
      </>
    );
  }

  /* ================= MEDIA ================= */
  const media = [
    ...(product.images || []).map((img) => ({ type: "image", src: img })),
    product.video ? { type: "video", src: product.video } : null,
  ].filter(Boolean);

  const openLightbox = (i) => {
    setLightboxIndex(i);
    setLightboxOpen(true);
  };

  const handleAddToCart = () => {
  if (!user) {
    alert("Please login first to add items to cart");
    return;
  }

  setQty(1);
  setShowToast(true);
  setTimeout(() => setShowToast(false), 2000);
};


  return (
    <>
      <Navbar />

      {/* TOAST */}
      <AnimatePresence>
        {showToast && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 30 }}
            className="fixed bottom-6 right-6 bg-[#4D192B] text-white px-6 py-4 rounded-2xl shadow-xl z-50 flex gap-2"
          >
            <FiShoppingCart />
            Added to Cart
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 mt-5 mb-24">

        {/* BREADCRUMB */}
        <p className="text-gray-500 text-sm mb-6">
          Home / {product.category} /{" "}
          <span className="font-semibold">{product.name}</span>
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">

          {/* ================= LEFT: IMAGES ================= */}
          <div>
            <Swiper
              modules={[Navigation, Pagination, Thumbs]}
              navigation
              pagination={{ clickable: true }}
              thumbs={{ swiper: thumbsSwiper }}
              className="rounded-2xl shadow-lg"
            >
              {media.map((item, i) => (
                <SwiperSlide key={i}>
                  <div onClick={() => openLightbox(i)} className="cursor-zoom-in">
                    {item.type === "image" ? (
                      <img
                        src={item.src}
                        className="w-full h-[420px] object-contain rounded-2xl"
                      />
                    ) : (
                      <video
                        src={item.src}
                        muted
                        className="w-full h-[420px] object-cover rounded-2xl"
                      />
                    )}
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>

            {/* THUMBNAILS */}
            <Swiper
              onSwiper={setThumbsSwiper}
              modules={[FreeMode, Thumbs]}
              slidesPerView={4}
              spaceBetween={10}
              freeMode
              watchSlidesProgress
              className="mt-4"
            >
              {media.map((item, i) => (
                <SwiperSlide key={i}>
                  {item.type === "image" ? (
                    <img src={item.src} className="h-20 rounded-xl object-cover" />
                  ) : (
                    <video src={item.src} muted className="h-20 rounded-xl object-cover" />
                  )}
                </SwiperSlide>
              ))}
            </Swiper>
          </div>

          {/* ================= RIGHT: INFO ================= */}
          <div>
            <h1 className="text-3xl font-bold text-[#4D192B]">
              {product.name}
            </h1>

            {/* RATING */}
            <div className="flex gap-1 mt-2">
              {[...Array(5)].map((_, i) => (
                <FaStar
                  key={i}
                  className={i < product.rating ? "text-yellow-500" : "text-gray-300"}
                />
              ))}
            </div>

            {/* PRICE */}
            <div className="mt-4 flex items-center gap-4">
  {product.discountedPrice > 0 &&
  product.discountedPrice < product.originalPrice ? (
    <>
      <span className="text-3xl font-bold">
        ₹{product.discountedPrice}
      </span>
      <span className="line-through text-gray-400">
        ₹{product.originalPrice}
      </span>
      <span className="text-red-600 font-semibold">
        {product.discountPercent}% OFF
      </span>
    </>
  ) : (
    <span className="text-3xl font-bold">
      ₹{product.originalPrice}
    </span>
  )}
</div>

            <p className="mt-4 text-gray-700">{product.description}</p>

            {/* WISHLIST */}
            <button
              className="flex gap-2 mt-5 text-[#4D192B]"
              onClick={() => setLiked(!liked)}
            >
              <FiHeart className={liked ? "text-red-500" : ""} />
              {liked ? "Wishlisted" : "Add to Wishlist"}
            </button>

            {/* CART */}
            <div className="mt-6">
              {qty === 0 ? (
                <button
                  onClick={handleAddToCart}
                  className="px-8 py-3 bg-[#4D192B] text-white rounded-full"
                >
                  Add to Cart
                </button>
              ) : (
                <div className="flex gap-6 bg-[#4D192B] text-white px-6 py-3 rounded-full w-fit">
                  <button onClick={() => setQty(qty - 1)}>-</button>
                  <span>{qty}</span>
                  <button onClick={() => setQty(qty + 1)}>+</button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}
