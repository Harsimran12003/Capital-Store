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
    e.stopPropagation();   // Prevent opening product page
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
        rounded-3xl bg-white shadow-lg 
        overflow-hidden group cursor-pointer
        border border-[#f0dce1]
        hover:shadow-2xl transition-all
      "
      whileHover={{ y: -6, scale: 1.02 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
    >

      {/* ========= 🔗 LINK WRAPS MAIN CONTENT ========= */}
      <Link to={`/product/${product.id}`}>

        {/* IMAGE */}
        <div className="relative">
          <img
            src={product.img}
            alt={product.name}
            className="
              w-full h-72 object-cover 
              group-hover:scale-110 
              transition-all duration-700
            "
          />

          {/* Overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/10 pointer-events-none" />

          {/* HEART BUTTON */}
          <div className="absolute top-3 right-3">

            <button
              onClick={handleLike}
              className="
                relative bg-white/90 p-2 rounded-full shadow-lg 
                backdrop-blur-xl border border-[#e5c7cf]
                transition hover:scale-110
              "
            >
              <FiHeart size={20} className={liked ? "text-red-500" : "text-gray-700"} />
            </button>

            {/* BURST */}
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
                        className="absolute w-2 h-2 bg-red-400 rounded-full"
                        animate={{
                          x: Math.cos((i * 60 * Math.PI) / 180) * 20,
                          y: Math.sin((i * 60 * Math.PI) / 180) * 20,
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

          {/* DISCOUNT TAG */}
          {product.off > 0 && (
            <div className="
              absolute top-3 left-3 px-3 py-1 text-xs font-semibold
              bg-gradient-to-r from-[#ff4d4d] to-[#d40000]
              text-white rounded-lg shadow-md
            ">
              {product.off}% OFF
            </div>
          )}
        </div>

        {/* CONTENT */}
        <div className="p-4">
          <h3 className="font-semibold text-[#4D192B] text-sm tracking-wide">
            {product.name}
          </h3>

          {/* RATING */}
          <div className="flex items-center gap-1 text-yellow-500 mt-1">
            {Array.from({ length: 5 }).map((_, i) => (
              <FaStar key={i} size={14} className={i < product.rating ? "opacity-100" : "opacity-30"} />
            ))}
          </div>

          {/* PRICE */}
          <div className="mt-2 flex items-center gap-2">
            <span className="font-bold text-gray-900 text-lg">₹{product.price}</span>
            <span className="line-through text-gray-400 text-sm">₹{product.mrp}</span>
          </div>
        </div>

      </Link>
      {/* END OF LINK WRAPPER */}
      {/* ======================================= */}

      {/* ADD TO CART SECTION */}
      <div className="px-4 pb-4">
        {qty === 0 ? (
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={handleAddToCart}
            className="
              w-full py-2.5 rounded-full text-sm font-medium
              flex items-center justify-center gap-2
              bg-gradient-to-r from-[#4D192B] to-[#2a0e19]
              text-white shadow-md hover:shadow-lg
              transition-all
            "
          >
            <FiShoppingCart size={16} />
            Add to Cart
          </motion.button>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="
              flex items-center justify-between
              bg-[#4D192B] text-white rounded-full py-2 px-4
              shadow-lg
            "
          >
            <button onClick={() => setQty(qty - 1)} className="text-lg font-bold px-3">–</button>
            <span className="font-semibold">{qty}</span>
            <button onClick={() => setQty(qty + 1)} className="text-lg font-bold px-3">+</button>
          </motion.div>
        )}
      </div>

    </motion.div>
  );
}
