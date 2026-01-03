import React from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { motion } from "framer-motion";
import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";
import {
  FiMapPin,
  FiShoppingBag,
  FiCreditCard,
  FiCheckCircle,
} from "react-icons/fi";

export default function OrderSummary() {
  const { cart } = useCart();
  const navigate = useNavigate();

  const getPrice = (i) =>
    i.discountedPrice > 0 ? i.discountedPrice : i.originalPrice;

  const mrp = cart.reduce((s, i) => s + Number(i.originalPrice || 0) * i.qty, 0);
  const total = cart.reduce((s, i) => s + Number(getPrice(i) || 0) * i.qty, 0);
  const discount = mrp - total;

  const steps = [
    { id: 0, icon: <FiMapPin size={20} />, label: "Address" },
    { id: 1, icon: <FiShoppingBag size={20} />, label: "Summary" },
    { id: 2, icon: <FiCreditCard size={20} />, label: "Payment" },
  ];

  return (
    <>
      <Navbar />

      <div
        className="min-h-screen py-15 mt-5 pb-32"
        style={{
          background:
            "radial-gradient(1200px 600px at 10% 10%, rgba(77,25,43,0.12), transparent 10%), radial-gradient(900px 500px at 90% 90%, rgba(60,20,30,0.08), transparent 10%), linear-gradient(180deg, #fffaf8 0%, #f9f6f4 100%)",
        }}
      >
        <div className="max-w-5xl mx-auto px-6">

          {/* ================= STEP INDICATOR ================= */}
          <div className="relative mb-16">
            <div className="absolute inset-x-0 top-6 h-1">
              <div className="w-full h-0.5 bg-gradient-to-r from-transparent via-[#d4b98c50] to-transparent" />
            </div>

            <div className="flex justify-between relative z-10">
              {steps.map((step) => (
                <div key={step.id} className="flex-1 text-center">
                  <div
                    className={`mx-auto w-14 h-14 rounded-full flex items-center justify-center shadow-lg ${
                      step.id <= 1
                        ? "bg-gradient-to-br from-[#d4b98c] to-[#b88a4a] text-white ring-2 ring-[#d4b98c] ring-offset-2"
                        : "bg-gray-200 text-gray-400"
                    }`}
                  >
                    {step.id < 1 ? <FiCheckCircle size={20} /> : step.icon}
                  </div>
                  <p
                    className={`mt-3 text-sm font-semibold ${
                      step.id === 1 ? "text-[#4D192B]" : "text-gray-400"
                    }`}
                  >
                    {step.label}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* ================= HEADER ================= */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-10"
          >
            <h1 className="text-4xl font-extrabold text-[#3b0b11] mb-2">
              Order Summary
            </h1>
            <p className="text-gray-600 text-lg">
              Please review your items before proceeding to payment
            </p>
          </motion.div>

          {/* ================= ITEMS ================= */}
          <div className="space-y-6 mb-10">
            {cart.map((item) => (
              <motion.div
                key={item.productId + item.size}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex gap-5 bg-white/80 backdrop-blur-xl p-5 rounded-2xl shadow-xl"
              >
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-28 h-28 rounded-xl object-cover"
                />

                <div className="flex-1">
                  <h3 className="font-semibold text-lg text-[#4D192B]">
                    {item.name}
                  </h3>

                  <p className="text-sm text-gray-600 mt-1">
                    Size: <b>{item.size}</b> • Qty: {item.qty}
                  </p>

                  ₹{item.discountedPrice > 0 ? item.discountedPrice : item.originalPrice}

                </div>
              </motion.div>
            ))}
          </div>

          {/* ================= PRICE SUMMARY ================= */}
          <div className="bg-white/80 backdrop-blur-xl p-6 rounded-2xl shadow-xl mb-10">
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span>Total MRP</span>
                <span>₹{mrp}</span>
              </div>

              <div className="flex justify-between text-green-600">
                <span>Discount</span>
                <span>-₹{discount}</span>
              </div>

              <hr className="border-dashed" />

              <div className="flex justify-between text-lg font-bold">
                <span>Total</span>
                <span className="text-[#4D192B]">₹{total}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ================= STICKY CTA ================= */}
      <div className="fixed bottom-0 left-0 w-full bg-white/80 backdrop-blur-xl py-5 border-t">
        <div className="max-w-5xl mx-auto px-6 flex justify-between items-center">
          <span className="text-sm text-gray-600 ">
            Review complete? Continue to payment
          </span>

          <motion.button
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate("/payment")}
            className="px-10 py-3.5 rounded-full text-lg font-semibold
              bg-gradient-to-r from-[#d4b98c] to-[#b88a4a] cursor-pointer"
          >
            Continue to Payment
          </motion.button>
        </div>
      </div>

      <Footer />
    </>
  );
}
