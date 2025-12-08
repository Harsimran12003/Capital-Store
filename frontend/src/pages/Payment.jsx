import React, { useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FaMoneyBillWave, FaGooglePay, FaCreditCard, FaRupeeSign } from "react-icons/fa";
import { FiMapPin, FiCreditCard, FiShoppingBag, FiCheckCircle, FiLock } from "react-icons/fi";

export default function Payment() {
  const [method, setMethod] = useState("");
  const [cardDetails, setCardDetails] = useState({ number: "", expiry: "", cvv: "" });

  const steps = [
    { id: 0, icon: <FiMapPin size={20} />, label: "Address", link: "/address" },
    { id: 1, icon: <FiCreditCard size={20} />, label: "Payment", active: true },
    { id: 2, icon: <FiShoppingBag size={20} />, label: "Summary" },
  ];

  const paymentMethods = [
    { id: "upi", icon: <FaGooglePay />, title: "UPI", desc: "GPay • PhonePe • Paytm", badge: "Fastest" },
    { id: "card", icon: <FaCreditCard />, title: "Debit / Credit Card", desc: "Visa • Mastercard • AMEX", badge: "Secure" },
    { id: "cod", icon: <FaMoneyBillWave />, title: "Cash on Delivery", desc: "Pay when you receive", badge: "Flexible" },
  ];

  return (
    <>
      <Navbar />

      <div
        className="min-h-screen py-15 mt-35"
        style={{
          background:
            "radial-gradient(1200px 600px at 10% 10%, rgba(77,25,43,0.12), transparent 10%), radial-gradient(900px 500px at 90% 90%, rgba(60,20,30,0.08), transparent 10%), linear-gradient(180deg, #fffaf8 0%, #f9f6f4 100%)",
        }}
      >
        <div className="max-w-5xl mx-auto px-6">
          {/* STEP INDICATOR */}
          <div className="relative mb-16">
            <div className="absolute inset-x-0 top-6 h-1 flex items-center">
              <div className="w-full h-0.5 bg-gradient-to-r from-transparent via-[#d4b98c50] to-transparent" />
            </div>

            <div className="flex items-center justify-between relative z-10">
              {steps.map((step) => (
                <Link key={step.id} to={step.link || "#"} className="flex-1">
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    className={`text-center ${step.link ? "cursor-pointer" : "cursor-default"}`}
                  >
                    <div
                      className={`mx-auto w-14 h-14 rounded-full flex items-center justify-center shadow-lg transition-all duration-300 ${
                        step.id < 1
                          ? "bg-gradient-to-br from-[#d4b98c] to-[#b88a4a] text-white"
                          : step.id === 1
                          ? "bg-gradient-to-br from-[#d4b98c] to-[#b88a4a] text-white ring-2 ring-[#d4b98c] ring-offset-2"
                          : "bg-gray-200 text-gray-400"
                      }`}
                      style={{ border: "1px solid rgba(212,185,140,0.16)" }}
                    >
                      {step.id < 1 ? <FiCheckCircle size={20} /> : step.icon}
                    </div>
                    <p
                      className={`mt-3 text-sm font-semibold transition-colors duration-300 ${
                        step.id < 1
                          ? "text-[#d4b98c]"
                          : step.id === 1
                          ? "text-[#4D192B]"
                          : "text-gray-400"
                      }`}
                    >
                      {step.label}
                    </p>
                  </motion.div>
                </Link>
              ))}
            </div>
          </div>

          {/* HEADER */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-12"
          >
            <h1 className="text-4xl font-extrabold text-[#3b0b11] mb-3 tracking-tight">
              Choose Payment Method
            </h1>
            <p className="text-gray-600 text-lg">
              Select your preferred way to pay. All transactions are secure and encrypted.
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* LEFT: Payment Methods */}
            <div className="lg:col-span-2 space-y-4">
              {paymentMethods.map((pm, idx) => (
                <motion.label
                  key={pm.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  whileHover={{ scale: 1.01 }}
                  onClick={() => setMethod(pm.id)}
                  className={`
                    flex items-center gap-5 p-6 rounded-2xl cursor-pointer
                    shadow-lg border transition-all duration-300 relative overflow-hidden
                    ${
                      method === pm.id
                        ? "bg-gradient-to-br from-white/95 to-white/80 border-[#d4b98c] shadow-2xl"
                        : "bg-white/70 border-[#d4b98c1a] hover:border-[#d4b98c33]"
                    }
                  `}
                  style={{ backdropFilter: "blur(6px)" }}
                >
                  {/* Background glow */}
                  {method === pm.id && (
                    <motion.div
                      layoutId="payment-glow"
                      className="absolute inset-0 bg-gradient-to-r from-[#d4b98c08] to-transparent pointer-events-none"
                    />
                  )}

                  <input
                    type="radio"
                    name="payment"
                    checked={method === pm.id}
                    readOnly
                    className="w-5 h-5 cursor-pointer accent-[#d4b98c]"
                  />

                  <div
                    className={`text-4xl transition-colors duration-300 ${
                      method === pm.id ? "text-[#d4b98c]" : "text-[#4D192B]"
                    }`}
                  >
                    {pm.icon}
                  </div>

                  <div className="flex-1 relative z-10">
                    <h3 className="font-semibold text-lg text-[#3b0b11]">{pm.title}</h3>
                    <p className="text-sm text-gray-600 mt-0.5">{pm.desc}</p>
                  </div>

                  <div
                    className="px-3 py-1 rounded-full text-xs font-semibold bg-[#fff6ea] text-[#8a5f2b] relative z-10"
                  >
                    {pm.badge}
                  </div>

                  {method === pm.id && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="w-6 h-6 rounded-full bg-gradient-to-br from-[#d4b98c] to-[#b88a4a] flex items-center justify-center text-white relative z-10"
                    >
                      <FiCheckCircle size={16} />
                    </motion.div>
                  )}
                </motion.label>
              ))}

              {/* Card Details Form */}
              {method === "card" && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-6 rounded-2xl shadow-lg bg-white/80 border border-[#d4b98c1a] mt-6"
                  style={{ backdropFilter: "blur(6px)" }}
                >
                  <h3 className="text-lg font-semibold text-[#4D192B] mb-4">Card Details</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Card Number</label>
                      <input
                        type="text"
                        placeholder="1234 5678 9012 3456"
                        maxLength={19}
                        className="w-full px-4 py-3 rounded-lg border border-[#d4b98c33] bg-white/70 text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#d4b98c]"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Expiry</label>
                        <input
                          type="text"
                          placeholder="MM/YY"
                          maxLength={5}
                          className="w-full px-4 py-3 rounded-lg border border-[#d4b98c33] bg-white/70 text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#d4b98c]"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">CVV</label>
                        <input
                          type="text"
                          placeholder="123"
                          maxLength={3}
                          className="w-full px-4 py-3 rounded-lg border border-[#d4b98c33] bg-white/70 text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#d4b98c]"
                        />
                      </div>
                    </div>
                    <div className="text-xs text-gray-500 flex items-center gap-2">
                      <FiLock size={14} />
                      Your card details are 100% secure and encrypted
                    </div>
                  </div>
                </motion.div>
              )}
            </div>

            {/* RIGHT: Order Summary */}
            <aside>
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-6 rounded-2xl shadow-2xl bg-gradient-to-br from-white/90 to-white/80 border border-[#d4b98c33] sticky top-28"
                style={{
                  backdropFilter: "blur(8px)",
                  boxShadow: "0 14px 40px rgba(30,10,10,0.08)",
                }}
              >
                <h2 className="text-xl font-bold text-[#3b0b11] mb-4">Order Summary</h2>

                <div className="space-y-4 mb-6 pb-6 border-b border-gray-200">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Premium Cotton Kurta</span>
                    <span className="font-semibold text-[#4D192B]">₹999</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Winter Woolen Suit</span>
                    <span className="font-semibold text-[#4D192B]">₹1499</span>
                  </div>
                </div>

                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="text-gray-800">₹2498</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Discount</span>
                    <span className="text-green-600 font-medium">-₹1300</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Shipping</span>
                    <span className="text-green-600 font-medium">Free</span>
                  </div>
                  <hr className="my-2 border-dashed" />
                  <div className="flex justify-between">
                    <span className="font-bold text-[#4D192B]">Total</span>
                    <span className="text-2xl font-bold text-[#d4b98c]">₹1198</span>
                  </div>
                </div>

                <Link to={method ? "/order-summary" : "#"} className="block">
                  <motion.button
                    whileTap={{ scale: 0.98 }}
                    disabled={!method}
                    className={`
                      w-full py-4 rounded-full text-lg font-semibold
                      bg-gradient-to-r from-[#d4b98c] to-[#b88a4a] text-[#2b160e]
                      shadow-[0_10px_30px_rgba(212,185,140,0.18)]
                      transition-all duration-300
                      ${!method ? "opacity-50 cursor-not-allowed" : "hover:shadow-[0_15px_40px_rgba(212,185,140,0.25)] cursor-pointer"}
                    `}
                  >
                    Continue to Review
                  </motion.button>
                </Link>

                <div className="mt-4 text-xs text-gray-500 text-center">
                  🔒 Secure & Encrypted Payment
                </div>
              </motion.div>
            </aside>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}
