import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiHeart, FiShoppingCart } from "react-icons/fi";
import { FaStar } from "react-icons/fa";
import { Link } from "react-router-dom";
import useAuth from "../hooks/useAuth.js";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";

export default function ProductCard({ product }) {
  const { user } = useAuth();
  const { addToCart } = useCart();
  const { toggleWishlist, wishlist } = useWishlist();

  const [liked, setLiked] = useState(false);
  const [added, setAdded] = useState(false);
  const [loginPrompt, setLoginPrompt] = useState(null);

  useEffect(() => {
    setLiked(wishlist.some(item => item.productId === product._id));
  }, [wishlist, product._id]);

  const handleAddToCart = (e) => {
    e.preventDefault();
    if (!user) return setLoginPrompt("cart");
    addToCart(product);
    setAdded(true);
  };

  const handleLike = (e) => {
    e.preventDefault();
    if (!user) return setLoginPrompt("wishlist");
    toggleWishlist(product);
    setLiked(!liked);
  };

  return (
    <div className="relative">
      <motion.div
        className="
          rounded-2xl sm:rounded-3xl bg-white shadow-md 
          overflow-hidden group cursor-pointer
          border border-[#f0dce1]
          hover:shadow-2xl transition-all
          flex flex-col h-full
        "
        whileHover={{ y: -4, scale: 1.01 }}
        transition={{ duration: 0.35, ease: "easeOut" }}
      >
        <Link to={`/product/${product._id}`}>
          {/* IMAGE */}
          <div className="relative">
            <img
              src={product.images[0]}
              alt={product.name}
              className="
                w-full 
                h-60
                sm:h-64
                md:h-64
                lg:h-60
                transition-all duration-700 group-hover:scale-110
              "
            />

            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/10" />

            {/* HEART */}
            <button
              onClick={handleLike}
              className="absolute top-2 right-2 sm:top-3 sm:right-3 bg-white/90 p-2 rounded-full shadow-md"
            >
              <FiHeart
                size={18}
                className={liked ? "text-red-500" : "text-gray-700"}
              />
            </button>

            {/* DISCOUNT */}
            {product.discountPercent > 0 && (
              <div className="absolute top-2 left-2 sm:top-3 sm:left-3 px-3 py-1 text-xs font-semibold bg-red-600 text-white rounded-lg shadow">
                {product.discountPercent}% OFF
              </div>
            )}
          </div>

          {/* CONTENT */}
          <div className="p-3 sm:p-4 flex flex-col flex-grow">
            <h3
              className="
                font-semibold text-[#4D192B] tracking-wide
                text-xs sm:text-sm
                line-clamp-2
                min-h-[32px]
                sm:min-h-[36px]
                md:min-h-[38px]
                lg:min-h-0
              "
            >
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

            {/* PRICE + ADD TO CART IN SAME ROW */}
            <div className="mt-3 flex items-center justify-between gap-2">
              {/* PRICE */}
              {product.discountedPrice > 0 &&
              product.discountedPrice < product.originalPrice ? (
                <div className="flex items-center gap-2">
                  <span className="font-bold text-gray-900 text-base sm:text-lg">
                    ₹{product.discountedPrice}
                  </span>
                  <span className="line-through text-gray-400 text-xs sm:text-sm">
                    ₹{product.originalPrice}
                  </span>
                </div>
              ) : (
                <span className="font-bold text-gray-900 text-base sm:text-lg">
                  ₹{product.originalPrice}
                </span>
              )}

              {/* ADD TO CART BUTTON */}
              {added ? (
                <Link
                  to="/cart"
                  onClick={(e) => e.stopPropagation()}
                  className="bg-green-600 text-white px-3 py-1.5 rounded-full text-xs sm:text-sm flex items-center gap-1 shadow"
                >
                  <FiShoppingCart size={14} />
                  Go to Cart
                </Link>
              ) : (
                <button
                  onClick={handleAddToCart}
                  className="bg-[#4D192B] text-white px-3 py-1.5 rounded-full text-xs sm:text-sm flex items-center gap-1 shadow"
                >
                  <FiShoppingCart size={14} />
                  Add
                </button>
              )}
            </div>
          </div>
        </Link>
      </motion.div>

      {/* LOGIN MODAL */}
      <AnimatePresence>
        {loginPrompt && (
          <motion.div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[1000] flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setLoginPrompt(null)}
          >
            <motion.div
              className="bg-white rounded-2xl p-6 m-4 max-w-sm w-full shadow-2xl"
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-lg font-semibold text-[#3b0b11] mb-2">
                Login Required
              </h3>

              <p className="text-gray-600 text-sm mb-4">
                Please log in to access your {loginPrompt}.
              </p>

              <div className="flex gap-3">
                <Link
                  to="/login"
                  className="flex-1 bg-[#4D192B] text-white py-2 rounded-full text-center font-semibold"
                  onClick={() => setLoginPrompt(null)}
                >
                  Login
                </Link>

                <button
                  onClick={() => setLoginPrompt(null)}
                  className="flex-1 border border-gray-300 py-2 rounded-full text-gray-700"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
