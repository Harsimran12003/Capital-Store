import React, { useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { FiTrash2 } from "react-icons/fi";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";

export default function Cart() {
  const { cart, updateQty, removeFromCart } = useCart();

  const increaseQty = (id) =>
    setCart((items) =>
      items.map((item) =>
        item.id === id ? { ...item, qty: item.qty + 1 } : item
      )
    );

  const decreaseQty = (id) =>
    setCart((items) =>
      items.map((item) =>
        item.id === id && item.qty > 1
          ? { ...item, qty: item.qty - 1 }
          : item
      )
    );

  const removeItem = (id) =>
    setCart((items) => items.filter((i) => i.id !== id));

  const totalMRP = cart.reduce((sum, i) => sum + i.mrp * i.qty, 0);
  const totalPrice = cart.reduce((sum, i) => sum + i.price * i.qty, 0);
  const discount = totalMRP - totalPrice;
  const delivery = totalPrice > 999 ? 0 : 79;

  return (
    <>
      <Navbar />

      {/* MAIN CONTAINER */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 mt-5 mb-24 grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* ================= LEFT SIDE: CART ITEMS ================= */}
        <div className="lg:col-span-2 space-y-6">
          <h1 className="text-2xl sm:text-3xl font-bold mb-4">Shopping Bag</h1>

          {cart.map((item) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              className="
                flex flex-col sm:flex-row gap-5 sm:gap-6 
                bg-white p-5 sm:p-6 rounded-3xl 
                shadow-xl border border-gray-200/60 
                hover:shadow-2xl transition-all
              "
            >
              {/* IMAGE */}
              <img
                src={item.img}
                className="w-full sm:w-32 h-40 sm:h-36 rounded-xl object-cover shadow-md"
              />

              {/* DETAILS */}
              <div className="flex-1 space-y-2">
                <h2 className="font-semibold text-lg text-[#4D192B]">
                  {item.name}
                </h2>

                <p className="text-gray-500 text-sm">
                  Size: <span className="font-semibold">{item.size}</span>
                </p>

                <div className="flex items-center gap-3 mt-1">
                  <span className="text-xl font-bold">₹{item.price}</span>
                  <span className="line-through text-gray-400">₹{item.mrp}</span>
                  <span className="text-green-600 font-medium">
                    {Math.round(((item.mrp - item.price) / item.mrp) * 100)}% OFF
                  </span>
                </div>

                {/* Quantity Controls */}
                <div className="flex items-center gap-6 mt-3">
                  <button
                    onClick={() => updateQty(item.productId, item.qty - 1)}
                    className="w-9 h-9 bg-gray-200 rounded-full flex items-center justify-center text-xl"
                  >
                    –
                  </button>

                  <span className="text-lg font-bold">{item.qty}</span>

                  <button
                    onClick={() => updateQty(item.productId, item.qty + 1)}

                    className="w-9 h-9 bg-gray-200 rounded-full flex items-center justify-center text-xl"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* DELETE BUTTON */}
              <button
                onClick={() => removeItem(item.id)}
                className="self-start sm:self-center"
              >
                <FiTrash2
                  size={22}
                  className="text-gray-500 hover:text-red-600 transition"
                />
              </button>
            </motion.div>
          ))}
        </div>

        {/* ================= RIGHT SIDE: PRICE SUMMARY ================= */}
        <div className="space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="
              bg-white/90 backdrop-blur-xl sticky top-28 
              p-6 sm:p-7 rounded-3xl shadow-xl 
              border border-[#4D192B]/20 
              relative overflow-hidden
            "
          >
            {/* Top Accent Line */}
            <div className="pointer-events-none absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-[#4D192B] to-[#8b4b63]" />

            <h2 className="text-xl sm:text-2xl font-bold mb-5 text-[#4D192B]">Price Summary</h2>

            <div className="space-y-4 text-gray-700 text-sm sm:text-base">
              <div className="flex justify-between">
                <span>Total MRP</span>
                <span className="font-medium">₹{totalMRP}</span>
              </div>

              <div className="flex justify-between">
                <span>Discount</span>
                <span className="text-green-600 font-semibold">-₹{discount}</span>
              </div>

              <div className="flex justify-between">
                <span>Delivery Fee</span>
                <span className={delivery === 0 ? "text-green-600" : ""}>
                  {delivery === 0 ? "Free" : `₹${delivery}`}
                </span>
              </div>

              <div className="h-px bg-gray-300 my-3" />

              <div className="flex justify-between text-xl font-bold text-[#4D192B]">
                <span>Total</span>
                <span>₹{totalPrice + delivery}</span>
              </div>
            </div>

            {/* Savings Box */}
            <div className="mt-5 p-3 rounded-xl bg-green-50 text-green-700 
              border border-green-300 text-sm font-medium flex items-center gap-2">
              💰 You saved ₹{discount} on this order!
            </div>

            {/* Proceed Button */}
            <Link
              to="/address"
              className="
                block w-full mt-6 py-3.5 rounded-full text-center
                bg-gradient-to-r from-[#4D192B] to-[#2a0e19]
                text-white font-semibold text-lg shadow-lg
                hover:shadow-xl active:scale-95 transition
              "
            >
              Proceed to Address
            </Link>

            {/* Bottom Glow */}
            <div className="pointer-events-none absolute -bottom-10 left-1/2 -translate-x-1/2 w-40 h-40 bg-[#4D192B]/20 blur-3xl rounded-full" />
          </motion.div>
        </div>
      </div>

      <Footer />
    </>
  );
}
