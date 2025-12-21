import React from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { FiTrash2, FiShoppingCart, FiHeart } from "react-icons/fi";
import { motion } from "framer-motion";
import { useWishlist } from "../context/WishlistContext";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";

export default function Wishlist() {
  const { user } = useAuth();
  const { wishlist, toggleWishlist } = useWishlist();
  const { addToCart } = useCart();

  // Not logged in
  if (!user) {
    return (
      <>
        <Navbar />
        <div className="text-center py-32">
          <h2 className="text-2xl font-semibold mb-3">
            Please login to view your wishlist
          </h2>
          <Link
            to="/login"
            className="px-6 py-3 rounded-full bg-[#4D192B] text-white font-semibold"
          >
            Login
          </Link>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 mt-5 mb-24">

        {/* HEADER */}
        <header className="flex items-center gap-4 mb-0">
          <div className="w-12 h-12 rounded-full bg-[#4D192B] flex items-center justify-center text-white">
            <FiHeart size={22} />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold">My Wishlist</h1>
            <p className="text-sm text-gray-500">
              {wishlist.length} items saved
            </p>
          </div>
        </header>

        {/* EMPTY STATE */}
        {wishlist.length === 0 ? (
          <div className="text-center py-24">
            <FiHeart className="text-6xl mx-auto text-gray-300 mb-4" />
            <h2 className="text-xl font-semibold mb-7">
              Your wishlist is empty
            </h2>
            <Link
              to="/"
              className="px-6 py-3 rounded-full bg-[#4D192B] text-white mt-10"
            >
              Continue Shopping
            </Link>
          </div>
        ) : (
          /* PRODUCT GRID */
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-2">
            {wishlist.map((item) => (
              <motion.div
                key={item.productId}
                whileHover={{ y: -6 }}
                className="bg-white rounded-2xl shadow-md p-4 relative"
              >
                {/* IMAGE */}
                <div className="relative">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="h-65 w-full  rounded-xl"
                  />

                  {/* REMOVE */}
                  <button
                    onClick={() => toggleWishlist({ _id: item.productId })}
                    className="absolute top-3 right-3 text-gray-500 hover:text-red-600 bg-white rounded-full p-1 shadow-md"
                  >
                    <FiTrash2 />
                  </button>
                </div>

                {/* INFO */}
                <div className="mt-4">
                  <h3 className="font-semibold text-[#3b0b11]">
                    {item.name}
                  </h3>

                  <div className="text-lg font-bold mt-2">
                    ₹{item.price}
                  </div>

                  {/* MOVE TO CART */}
                  <button
                    onClick={() => {
                      addToCart({
                        _id: item.productId,
                        name: item.name,
                        images: [item.image],
                        originalPrice: item.price,
                        discountedPrice: 0,
                      });
                      toggleWishlist({ _id: item.productId });
                    }}
                    className="mt-4 w-full flex items-center justify-center gap-2 
                    py-2 rounded-full bg-[#4D192B] text-white"
                  >
                    <FiShoppingCart />
                    Move to Cart
                  </button>
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
