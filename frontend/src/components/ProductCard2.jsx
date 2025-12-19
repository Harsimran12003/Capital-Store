import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiHeart, FiShoppingCart } from "react-icons/fi";
import { FaStar } from "react-icons/fa";
import { Link } from "react-router-dom";

export default function ProductCard({ product }) {
  const [liked, setLiked] = useState(false);
  const [burst, setBurst] = useState(false);
  const [qty, setQty] = useState(0);

  const handleLike = (e) => {
    e.stopPropagation();
    e.preventDefault();
    setLiked(!liked);
    setBurst(true);
    setTimeout(() => setBurst(false), 500);
  };

  const handleAddToCart = (e) => {
    e.stopPropagation();
    e.preventDefault();
    setQty(1);
  };

  return (
    <motion.div
      className="
        rounded-2xl sm:rounded-3xl bg-white shadow-md 
        overflow-hidden group cursor-pointer
        border border-[#f0dce1]
        hover:shadow-2xl transition-all

        /* ⭐ Reduced overall height on mobile */
        h-auto
      "
      whileHover={{ y: -4, scale: 1.015 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
    >
      <Link to={`/product/${product._id}`}>

        {/* ================= IMAGE ================= */}
        <div className="relative">

          <img
            src={product.images[0]}
            alt={product.name}
            className="
              w-full               
              transition-all duration-700
              group-hover:scale-110

              /* ⭐ Reduce image height on mobile */
              h-60       /* Mobile */
              sm:h-55    /* Tablet */
              md:h-65    /* Desktop */
            "
          />

          {/* Light Overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/10 pointer-events-none" />

          {/* ================= HEART BUTTON ================= */}
          <div className="absolute top-2 right-2 sm:top-3 sm:right-3">
            <button
              onClick={handleLike}
              className="
                relative bg-white/90 p-1.5 sm:p-2 rounded-full shadow-lg 
                backdrop-blur-xl border border-[#e5c7cf]
                transition hover:scale-110 cursor-pointer
              "
            >
              <FiHeart
                size={18}
                className={liked ? "text-red-500" : "text-gray-700"}
              />
            </button>

            {/* ❤️ Burst Effect */}
            <AnimatePresence>
              {burst && (
                <motion.div
                  className="absolute inset-0 flex justify-center items-center pointer-events-none"
                  initial={{ scale: 0.6, opacity: 1 }}
                  animate={{ scale: 1.6, opacity: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.45 }}
                >
                  <div className="relative">
                    {[...Array(6)].map((_, i) => (
                      <motion.span
                        key={i}
                        className="absolute w-1.5 h-1.5 bg-red-400 rounded-full"
                        animate={{
                          x: Math.cos((i * 60 * Math.PI) / 180) * 18,
                          y: Math.sin((i * 60 * Math.PI) / 180) * 18,
                          opacity: 0,
                          scale: 0,
                        }}
                        transition={{ duration: 0.45 }}
                      />
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* ================= DISCOUNT TAG ================= */}
          {product.discountPercent > 0 && (
            <div
              className="
                absolute top-2 left-2 sm:top-3 sm:left-3 
                px-2 py-0.5 sm:px-3 sm:py-1 text-[10px] sm:text-xs font-semibold
                bg-gradient-to-r from-[#ff4d4d] to-[#d40000]
                text-white rounded-lg shadow-md
              "
            >
              {product.discountPercent}% OFF
            </div>
          )}
        </div>

        {/* ================= CONTENT ================= */}
        <div className="p-3 sm:p-4">

          {/* Title */}
          <h3 className="font-semibold text-[#4D192B] text-xs sm:text-sm tracking-wide line-clamp-2">
            {product.name}
          </h3>

          {/* Rating */}
          <div className="flex items-center gap-1 text-yellow-500 mt-1">
            {Array.from({ length: 5 }).map((_, i) => (
              <FaStar
                key={i}
                size={12}
                className={i < product.rating ? "opacity-100" : "opacity-30"}
              />
            ))}
          </div>

          {/* Price */}
          <div className="mt-2 flex items-center gap-1 sm:gap-2">
            <span className="font-bold text-gray-900 text-base sm:text-lg">
              ₹{product.discountedPrice}
            </span>
            <span className="line-through text-gray-400 text-xs sm:text-sm">
              ₹{product.originalPrice}
            </span>
          </div>
        </div>
      </Link>

      {/* ================= ADD TO CART ================= */}
      <div className="px-3 pb-3 sm:px-4 sm:pb-4">

        {qty === 0 ? (
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={handleAddToCart}
            className="
              w-full py-2 sm:py-2.5 rounded-full 
              text-xs sm:text-sm font-medium
              flex items-center justify-center gap-1.5 sm:gap-2
              bg-gradient-to-r from-[#4D192B] to-[#2a0e19]
              text-white shadow-md hover:shadow-lg
              transition-all cursor-pointer
            "
          >
            <FiShoppingCart size={14} className="sm:hidden" />
            <FiShoppingCart size={16} className="hidden sm:block" />
            Add to Cart
          </motion.button>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="
              flex items-center justify-between
              bg-[#4D192B] text-white rounded-full 
              py-1.5 px-4 sm:py-2 shadow-lg
            "
          >
            <button
              onClick={() => setQty(qty - 1)}
              className="text-lg font-bold px-2 sm:px-3 cursor-pointer"
            >
              –
            </button>
            <span className="font-semibold text-sm">{qty}</span>
            <button
              onClick={() => setQty(qty + 1)}
              className="text-lg font-bold px-2 sm:px-3 cursor-pointer"
            >
              +
            </button>
          </motion.div>
        )}

      </div>
    </motion.div>
  );
}
