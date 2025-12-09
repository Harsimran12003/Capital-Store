import React, { useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { FiTrash2, FiShoppingCart, FiHeart, FiCheck } from "react-icons/fi";
import { motion } from "framer-motion";

export default function Wishlist() {
  const [wishlist, setWishlist] = useState([
    {
      id: 1,
      name: "Premium Cotton Kurta",
      img: "/p1.jpg",
      price: 999,
      mrp: 1599,
    },
    {
      id: 2,
      name: "Winter Woolen Suit",
      img: "/p2.jpg",
      price: 1499,
      mrp: 2199,
    },
  ]);

  const [cart, setCart] = useState([]);
  const [adding, setAdding] = useState([]);

  const removeFromWishlist = (id) =>
    setWishlist((items) => items.filter((item) => item.id !== id));

  const moveToCart = (item) => {
    if (adding.includes(item.id)) return;
    setAdding((s) => [...s, item.id]);

    setCart((prev) => [...prev, { ...item, qty: 1 }]);

    setTimeout(() => {
      removeFromWishlist(item.id);
      setAdding((s) => s.filter((i) => i !== item.id));
    }, 900);
  };

  const discountPercent = (item) =>
    Math.round(((item.mrp - item.price) / item.mrp) * 100);

  return (
    <>
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 mt-5 mb-24">

        {/* ================= HEADER ================= */}
        <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5 mb-8">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-gradient-to-br from-[#d4b98c] to-[#b88a4a] flex items-center justify-center text-white shadow-lg">
              <FiHeart size={22} />
            </div>

            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-[#3b0b11]">
                My Wishlist
              </h1>
              <p className="text-xs sm:text-sm text-gray-500 mt-1">
                Curated picks — save now, purchase later.
              </p>
            </div>
          </div>

          <div className="flex items-center justify-between sm:justify-end gap-4">
            <div className="text-sm text-gray-600">
              <span className="text-lg font-semibold text-[#4D192B]">
                {wishlist.length}
              </span>{" "}
              items
            </div>

            <Link to="/" className="hidden sm:inline-block">
              <motion.button
                whileHover={{ scale: 1.02 }}
                className="px-4 py-2 rounded-full bg-white border border-[#d4b98c1a] shadow-sm text-sm font-semibold cursor-pointer"
              >
                Continue Shopping
              </motion.button>
            </Link>
          </div>
        </header>

        {/* ================= EMPTY STATE ================= */}
        {wishlist.length === 0 ? (
          <div className="text-center py-24 px-4">
            <motion.div
              initial={{ scale: 0.98, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.4 }}
              className="inline-flex items-center justify-center w-36 h-36 sm:w-40 sm:h-40 rounded-full 
              bg-gradient-to-br from-[#fff7ef] to-[#fff2e6] shadow-lg mb-6"
            >
              <FiHeart className="text-5xl text-[#d4b98c]" />
            </motion.div>

            <h2 className="text-xl sm:text-2xl font-semibold text-[#3b0b11] mb-2">
              Your wishlist is empty
            </h2>

            <p className="text-gray-500 text-sm sm:text-base mb-6">
              Save your favourite pieces and find them here later.
            </p>

            <Link to="/">
              <motion.button
                whileHover={{ scale: 1.03 }}
                className="px-6 py-3 rounded-full bg-gradient-to-r from-[#d4b98c] to-[#b88a4a] 
                text-[#2b160e] font-semibold shadow-md"
              >
                Browse Collections
              </motion.button>
            </Link>
          </div>
        ) : (
          /* ================= PRODUCT GRID ================= */
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 sm:gap-8">
            {wishlist.map((item) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                whileHover={{
                  translateY: -6,
                  boxShadow: "0 18px 40px rgba(20,10,10,0.08)",
                }}
                className="relative rounded-2xl bg-white/70 backdrop-blur-md 
                border border-[#d4b98c1a] p-4 shadow-md overflow-hidden"
              >
                {/* Discount Badge */}
                <div className="absolute top-4 left-4 px-2 py-1 rounded-full bg-[#fff6ea] 
                  text-[#8a5f2b] text-xs font-semibold z-10">
                  -{discountPercent(item)}%
                </div>

                {/* Remove Button */}
                <button
                  onClick={() => removeFromWishlist(item.id)}
                  className="absolute top-4 right-4 text-gray-500 hover:text-red-600 z-10"
                >
                  <FiTrash2 size={18} />
                </button>

                {/* Image */}
                <div className="h-48 sm:h-52 w-full rounded-lg overflow-hidden shadow-inner">
                  <motion.img
                    src={item.img}
                    alt={item.name}
                    className="w-full h-full object-cover"
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.5 }}
                  />
                </div>

                {/* Product Info */}
                <div className="mt-4">
                  <h3 className="text-base sm:text-lg font-semibold text-[#3b0b11]">
                    {item.name}
                  </h3>

                  <p className="text-xs sm:text-sm text-gray-500 mt-1">
                    Elegant, premium finish
                  </p>

                  <div className="mt-3 flex items-end justify-between">
                    <div>
                      <div className="text-lg font-bold text-[#4D192B]">
                        ₹{item.price}
                      </div>
                      <div className="text-xs line-through text-gray-400">
                        ₹{item.mrp}
                      </div>
                    </div>

                    <div className="flex flex-col items-end gap-2">
                      {/* Move to Cart Button */}
                      <motion.button
                        onClick={() => moveToCart(item)}
                        whileTap={{ scale: 0.97 }}
                        className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-full 
                        text-xs sm:text-sm font-semibold shadow-sm transition
                        ${
                          adding.includes(item.id)
                            ? "bg-white border border-[#d4b98c] text-[#4D192B]"
                            : "bg-gradient-to-r from-[#4D192B] to-[#2a0e19] text-white"
                        }`}
                        disabled={adding.includes(item.id)}
                      >
                        {adding.includes(item.id) ? (
                          <>
                            <FiCheck size={16} />
                            <span>Added</span>
                          </>
                        ) : (
                          <>
                            <FiShoppingCart size={16} />
                            <span>Move to Cart</span>
                          </>
                        )}
                      </motion.button>

                      {/* Confetti dots */}
                      {adding.includes(item.id) && (
                        <div className="flex items-center gap-1 mt-1">
                          {Array.from({ length: 6 }).map((_, i) => (
                            <motion.span
                              key={i}
                              initial={{ y: 0, opacity: 0.9, scale: 0.7 }}
                              animate={{
                                y: -8 - Math.random() * 6,
                                opacity: 0,
                                scale: 0.5,
                              }}
                              transition={{ duration: 0.8, delay: i * 0.03 }}
                              className="w-1.5 h-1.5 rounded-full"
                              style={{
                                backgroundColor: `hsl(${30 + i * 30},70%,50%)`,
                              }}
                            />
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      <Footer />
    </>
  );
}
