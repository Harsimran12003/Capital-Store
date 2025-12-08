import React, { useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { FiTrash2 } from "react-icons/fi";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

export default function Cart() {
  const [cart, setCart] = useState([
    {
      id: 1,
      name: "Premium Cotton Kurta",
      img: "/p1.jpg",
      price: 999,
      mrp: 1599,
      qty: 1,
      size: "M",
    },
    {
      id: 2,
      name: "Winter Woolen Suit",
      img: "/p2.jpg",
      price: 1499,
      mrp: 2199,
      qty: 2,
      size: "L",
    },
  ]);

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

  const removeItem = (id) => setCart((items) => items.filter((i) => i.id !== id));

  const totalMRP = cart.reduce((sum, i) => sum + i.mrp * i.qty, 0);
  const totalPrice = cart.reduce((sum, i) => sum + i.price * i.qty, 0);
  const discount = totalMRP - totalPrice;
  const delivery = totalPrice > 999 ? 0 : 79;

  return (
    <>
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 mt-45 mb-24 grid grid-cols-1 lg:grid-cols-3 gap-10">

        {/* LEFT SIDE */}
        <div className="lg:col-span-2 space-y-6">
          <h1 className="text-3xl font-bold mb-4">Shopping Bag</h1>

          {cart.map((item) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="
                flex gap-6 bg-white p-6 rounded-3xl 
                shadow-xl border border-gray-200/60 
                hover:shadow-2xl transition-all
              "
            >
              {/* IMAGE */}
              <img
                src={item.img}
                className="w-32 h-36 rounded-xl object-cover shadow-md"
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
                  <span className="line-through text-gray-400">
                    ₹{item.mrp}
                  </span>
                  <span className="text-green-600 font-medium">
                    {Math.round(((item.mrp - item.price) / item.mrp) * 100)}% OFF
                  </span>
                </div>

                {/* Quantity */}
                <div className="flex items-center gap-5 mt-3">
                  <button
                    onClick={() => decreaseQty(item.id)}
                    className="
                      w-9 h-9 bg-gray-200 rounded-full 
                      flex items-center justify-center text-xl
                    "
                  >
                    -
                  </button>

                  <span className="text-lg font-bold">{item.qty}</span>

                  <button
                    onClick={() => increaseQty(item.id)}
                    className="
                      w-9 h-9 bg-gray-200 rounded-full 
                      flex items-center justify-center text-xl
                    "
                  >
                    +
                  </button>
                </div>
              </div>

              {/* DELETE */}
              <button onClick={() => removeItem(item.id)}>
                <FiTrash2
                  size={24}
                  className="text-gray-500 hover:text-red-600 transition"
                />
              </button>
            </motion.div>
          ))}
        </div>

        {/* RIGHT SIDE (SUMMARY) */}
<div className="space-y-6 sticky top-32">
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    whileHover={{ y: -4 }}
    transition={{ duration: 0.4 }}
    className="
      relative bg-white/80 backdrop-blur-xl 
      p-7 rounded-3xl shadow-[0_8px_30px_rgba(0,0,0,0.12)]
      border border-[#4D192B]/20
      overflow-hidden
    "
  >
    {/* TOP GRADIENT BAR (NO CLICK BLOCK) */}
    <div
      className="
        pointer-events-none
        absolute top-0 left-0 w-full h-1.5 
        bg-gradient-to-r from-[#4D192B] to-[#8b4b63]
      "
    />

    {/* MAIN CONTENT ABOVE ALL OVERLAYS */}
    <div className="relative z-10">
      <h2 className="text-2xl font-bold mb-6 text-[#4D192B]">
        Price Summary
      </h2>

      <div className="space-y-4 text-gray-700 text-[15px]">
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

        <div className="h-px w-full bg-gradient-to-r from-transparent via-gray-300 to-transparent mt-3" />

        <div className="flex justify-between text-xl font-bold text-[#4D192B]">
          <span>Total</span>
          <span>₹{totalPrice + delivery}</span>
        </div>
      </div>

      {/* YOU SAVE BOX */}
      <div
        className="
          mt-5 p-3 rounded-xl bg-green-50 text-green-700 
          font-medium text-sm flex items-center gap-2 border border-green-300
        "
      >
        <span className="text-lg">💰</span>
        You saved ₹{discount} on this order!
      </div>

      {/* BUTTON — LINK AS BUTTON */}
      <Link
        to="/address"
        className="
          block w-full mt-6 py-3.5 rounded-full 
          bg-gradient-to-r from-[#4D192B] to-[#2a0e19]
          text-white font-semibold text-lg tracking-wide
          shadow-lg cursor-pointer text-center
          hover:shadow-xl active:scale-95 transition
        "
      >
        Proceed to Address
      </Link>
    </div>

    {/* BOTTOM GLOW (NO CLICK BLOCK) */}
    <div
      className="
        pointer-events-none
        absolute -bottom-10 left-1/2 -translate-x-1/2 
        w-40 h-40 bg-[#4D192B]/20 blur-3xl rounded-full
      "
    />
  </motion.div>
</div>
</div>

      <Footer />
    </>
  );
}
