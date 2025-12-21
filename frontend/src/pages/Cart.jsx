import React from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { FiTrash2 } from "react-icons/fi";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";

export default function Cart() {
  const { cart, updateQty, removeFromCart } = useCart();

  // totals
  const totalMRP = cart.reduce(
    (sum, i) => sum + i.originalPrice * i.qty,
    0
  );
  const totalPrice = cart.reduce(
    (sum, i) =>
      sum +
      (i.discountedPrice > 0
        ? i.discountedPrice
        : i.originalPrice) *
        i.qty,
    0
  );
  const discount = totalMRP - totalPrice;
  const delivery = totalPrice > 999 ? 0 : 79;

  return (
    <>
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 mt-5 mb-24 grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* LEFT: ITEMS */}
        <div className="lg:col-span-2 space-y-6">
          <h1 className="text-2xl sm:text-3xl font-bold mb-4">
            Shopping Bag
          </h1>

          {cart.length === 0 && (
            <p className="text-gray-500">Your cart is empty</p>
          )}

          {cart.map((item) => (
            <motion.div
              key={item.productId}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col sm:flex-row gap-5 bg-white p-5 rounded-3xl shadow-xl"
            >
              {/* IMAGE */}
              <img
                src={item.images[0]}
                alt={item.name}
                className="w-full sm:w-32 h-36 rounded-xl object-cover"
              />

              {/* DETAILS */}
              <div className="flex-1">
                <h2 className="font-semibold text-lg text-[#4D192B]">
                  {item.name}
                </h2>

                <div className="flex items-center gap-3 mt-2">
                  <span className="text-xl font-bold">
                    ₹
                    {item.discountedPrice > 0
                      ? item.discountedPrice
                      : item.originalPrice}
                  </span>

                  {item.discountedPrice > 0 && (
                    <span className="line-through text-gray-400">
                      ₹{item.originalPrice}
                    </span>
                  )}
                </div>

                {/* QTY CONTROLS */}
                <div className="flex items-center gap-4 mt-4">
                  <button
                    onClick={() => {
                      if (item.qty === 1) {
                        removeFromCart(item.productId);
                      } else {
                        updateQty(item.productId, item.qty - 1);
                      }
                    }}
                    className="w-9 h-9 bg-gray-200 rounded-full text-xl"
                  >
                    –
                  </button>

                  <span className="font-bold">{item.qty}</span>

                  <button
                    onClick={() =>
                      updateQty(item.productId, item.qty + 1)
                    }
                    className="w-9 h-9 bg-gray-200 rounded-full text-xl"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* DELETE */}
              <button
                onClick={() => removeFromCart(item.productId)}
                className="self-start sm:self-center"
              >
                <FiTrash2 className="text-gray-500 hover:text-red-600" />
              </button>
            </motion.div>
          ))}
        </div>

        {/* RIGHT: SUMMARY */}
        <div>
          <div className="bg-white p-6 rounded-3xl shadow-xl sticky top-28">
            <h2 className="text-xl font-bold mb-4 text-[#4D192B]">
              Price Summary
            </h2>

            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span>Total MRP</span>
                <span>₹{totalMRP}</span>
              </div>

              <div className="flex justify-between">
                <span>Discount</span>
                <span className="text-green-600">
                  -₹{discount}
                </span>
              </div>

              <div className="flex justify-between">
                <span>Delivery</span>
                <span>{delivery === 0 ? "Free" : `₹${delivery}`}</span>
              </div>

              <div className="border-t pt-3 flex justify-between text-lg font-bold">
                <span>Total</span>
                <span>₹{totalPrice + delivery}</span>
              </div>
            </div>

            <Link
              to="/address"
              className="block mt-6 text-center bg-[#4D192B] text-white py-3 rounded-full font-semibold"
            >
              Proceed to Address
            </Link>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}
