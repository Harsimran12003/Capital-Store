import React, { useState , useEffect } from "react";
import { useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { motion, AnimatePresence } from "framer-motion";
import { FiHeart, FiShoppingCart, FiCheckCircle } from "react-icons/fi";
import { FaStar } from "react-icons/fa";

import { allProducts } from "../data/products";

// Swiper Imports
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Thumbs, FreeMode } from "swiper/modules";

export default function ProductDetails() {
  const [lightboxOpen, setLightboxOpen] = useState(false);
const [lightboxIndex, setLightboxIndex] = useState(0);

const openLightbox = (index) => {
  setLightboxIndex(index);
  setLightboxOpen(true);
};

const closeLightbox = () => setLightboxOpen(false);

const nextImage = () => {
  setLightboxIndex((prev) => (prev + 1) % media.length);
};

const prevImage = () => {
  setLightboxIndex((prev) => (prev - 1 + media.length) % media.length);
};

  useEffect(() => {
  const handleKey = (e) => {
    if (!lightboxOpen) return;
    if (e.key === "Escape") closeLightbox();
    if (e.key === "ArrowRight") nextImage();
    if (e.key === "ArrowLeft") prevImage();
  };

  window.addEventListener("keydown", handleKey);
  return () => window.removeEventListener("keydown", handleKey);
}, [lightboxOpen]);

  const { id } = useParams();
  const product = allProducts.find((p) => p.id === Number(id));

  const [liked, setLiked] = useState(false);
  const [qty, setQty] = useState(0);
  const [thumbsSwiper, setThumbsSwiper] = useState(null);
  const [showToast, setShowToast] = useState(false);

  const handleAddToCart = () => {
    setQty(1);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2000);
  };

  const media = [
    ...product.images.map((img) => ({ type: "image", src: img })),
    product.video ? { type: "video", src: product.video } : null,
  ].filter(Boolean); 

  return (
    <>
      <Navbar />

      {/* Toast Message */}
      <AnimatePresence>
        {showToast && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 30 }}
            transition={{ duration: 0.4 }}
            className="fixed bottom-6 right-6 bg-[#4D192B] text-white px-6 py-4 rounded-2xl shadow-2xl z-50 flex items-center gap-3"
          >
            <FiShoppingCart size={22} />
            <span className="font-medium">Added to Cart!</span>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-7xl mx-auto px-6 mt-40 mb-24">

        {/* Breadcrumb */}
        <p className="text-gray-500 text-sm mb-6">
          Home / {product.category} /
          <span className="font-semibold"> {product.name}</span>
        </p>

        {/* =================== MAIN PRODUCT SECTION =================== */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-14">

          {/* LEFT: SWIPER PRODUCT SLIDER */}
          <div>

            <Swiper
              modules={[Navigation, Pagination, Thumbs]}
              spaceBetween={10}
              navigation
              pagination={{ clickable: true }}
              thumbs={{ swiper: thumbsSwiper }}
              className="rounded-2xl shadow-xl"
            >
              {media.map((item, i) => (
                <SwiperSlide key={i}>
  <div onClick={() => openLightbox(i)} className="cursor-zoom-in">
    {item.type === "image" ? (
      <img
        src={item.src}
        className="w-full h-[500px] object-cover rounded-2xl"
      />
    ) : (
      <video
        src={item.src}
        className="w-full h-[500px] object-cover rounded-2xl"
        muted
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
              spaceBetween={12}
              slidesPerView={6}
              freeMode={true}
              watchSlidesProgress={true}
              className="mt-5"
            >
              {media.map((item, i) => (
                <SwiperSlide key={i}>
                  {item.type === "image" ? (
                    <img
                      src={item.src}
                      className="w-full h-20 rounded-xl object-cover shadow-md cursor-pointer"
                    />
                  ) : (
                    <video
                      src={item.src}
                      muted
                      className="w-full h-20 rounded-xl object-cover shadow-md cursor-pointer"
                    />
                  )}
                </SwiperSlide>
              ))}
            </Swiper>
          </div>

          {/* RIGHT: PRODUCT INFO */}
          <div className="pr-6">
            <h1 className="text-4xl font-bold text-[#4D192B] leading-snug">
              {product.name}
            </h1>

            {/* Rating */}
            <div className="flex items-center gap-1 mt-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <FaStar
                  key={i}
                  size={22}
                  className={i < product.rating ? "text-yellow-500" : "text-gray-300"}
                />
              ))}
              <span className="ml-2 text-gray-600">{product.rating} / 5</span>
            </div>

            {/* Price */}
            <div className="mt-5 flex items-center gap-4">
              <span className="text-4xl font-bold">₹{product.price}</span>
              <span className="line-through text-gray-400 text-xl">₹{product.mrp}</span>
              <span className="text-red-600 text-xl font-semibold">{product.off}% OFF</span>
            </div>

            <p className="mt-5 text-gray-700 text-lg leading-relaxed">{product.description}</p>

            {/* Wishlist */}
            <button
              className="flex items-center gap-3 mt-6 text-[#4D192B] font-semibold"
              onClick={() => setLiked(!liked)}
            >
              <FiHeart size={26} className={liked ? "text-red-500" : ""} />
              {liked ? "Wishlisted" : "Add to Wishlist"}
            </button>

            {/* Add to Cart */}
            <div className="mt-8">
              {qty === 0 ? (
                <motion.button
                  whileTap={{ scale: 0.96 }}
                  className="
                    w-64 py-3 rounded-full text-white text-lg font-semibold
                    bg-gradient-to-r from-[#4D192B] to-[#2c0e19]
                    shadow-lg hover:shadow-xl transition-all
                  "
                  onClick={handleAddToCart}
                >
                  <FiShoppingCart className="inline-block mr-2" />
                  Add to Cart
                </motion.button>
              ) : (
                <motion.div
                  className="
                    flex items-center gap-8 bg-[#4D192B] text-white 
                    rounded-full py-3 px-6 shadow-lg text-lg w-fit
                  "
                  initial={{ opacity: 0.6, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                >
                  <button onClick={() => setQty(qty - 1)} className="text-2xl">-</button>
                  <span>{qty}</span>
                  <button onClick={() => setQty(qty + 1)} className="text-2xl">+</button>
                </motion.div>
              )}
            </div>
          </div>
        </div>

        {/* ===================== REVIEWS ===================== */}
        <div className="mt-32">
          <h2 className="text-4xl font-extrabold text-[#4D192B] tracking-wide">
            Customer Reviews
          </h2>
          <p className="text-gray-500 mt-2 text-lg">Verified reviews from real customers</p>

          <div className="w-32 h-1 mt-4 rounded-full bg-[#4D192B]/40"></div>

          {product.reviews?.length ? (
            <div className="space-y-12 mt-10">
              {product.reviews.map((r, index) => (
                <motion.div
                  key={index}
                  className="p-8 rounded-3xl bg-white/70 border border-[#4D192B]/20 
                    backdrop-blur-xl shadow-lg hover:shadow-2xl transition-all"
                >
                  <div className="flex items-start gap-6">
                    <img
                      src={r.avatar || "/user.png"}
                      alt="avatar"
                      className="w-16 h-16 rounded-full object-cover border shadow"
                    />

                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <h3 className="text-xl font-semibold">{r.user}</h3>
                        <FiCheckCircle className="text-green-600 text-lg" />
                        <span className="text-sm text-gray-500">Verified Buyer</span>
                      </div>

                      <div className="flex items-center gap-1 mt-2">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <FaStar
                            key={i}
                            size={18}
                            className={i < r.rating ? "text-yellow-500" : "text-gray-300"}
                          />
                        ))}
                      </div>

                      <p className="text-gray-700 mt-3">{r.comment}</p>

                      {r.images?.length > 0 && (
                        <div className="flex gap-4 mt-4">
                          {r.images.map((img, i) => (
                            <img
                              key={i}
                              src={img}
                              className="w-28 h-28 rounded-xl object-cover border shadow-md"
                            />
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 mt-6">No reviews yet.</p>
          )}
        </div>
      </div>
      {/* FULLSCREEN LIGHTBOX VIEWER */}
<AnimatePresence>
  {lightboxOpen && (
    <motion.div
      className="fixed inset-0 bg-black/90 backdrop-blur-lg z-[999] flex items-center justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Close Button */}
      <button
        className="absolute top-6 right-6 text-white text-3xl font-bold"
        onClick={closeLightbox}
      >
        ✕
      </button>

      {/* Prev Button */}
      <button
        className="absolute left-6 text-white text-4xl font-bold"
        onClick={prevImage}
      >
        ‹
      </button>

      {/* Next Button */}
      <button
        className="absolute right-6 text-white text-4xl font-bold"
        onClick={nextImage}
      >
        ›
      </button>

      {/* Content */}
      <motion.div
        key={lightboxIndex}
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="max-w-4xl w-full px-6"
      >
        {media[lightboxIndex].type === "image" ? (
          <img
            src={media[lightboxIndex].src}
            className="w-full max-h-[90vh] object-contain rounded-xl"
          />
        ) : (
          <video
            src={media[lightboxIndex].src}
            controls
            autoPlay
            className="w-full max-h-[90vh] object-contain rounded-xl"
          />
        )}
      </motion.div>
    </motion.div>
  )}
</AnimatePresence>


      <Footer />
    </>
  );
}
