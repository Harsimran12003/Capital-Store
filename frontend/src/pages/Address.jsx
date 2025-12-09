import React, { useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { FiHome, FiBriefcase, FiPlus, FiMapPin, FiCreditCard, FiShoppingBag, FiCheckCircle, FiEdit2, FiTrash2 } from "react-icons/fi";

export default function Address() {
  const [selected, setSelected] = useState(null);
  const [showNewAddress, setShowNewAddress] = useState(false);

  const addresses = [
    {
      id: 1,
      name: "Anita",
      phone: "9876543210",
      address: "House No. 123, Sector 40, Chandigarh",
      type: "Home",
      city: "Chandigarh",
      pincode: "160040",
    },
    {
      id: 2,
      name: "Sneha",
      phone: "9876543210",
      address: "Office Plaza, Mohali",
      type: "Work",
      city: "Mohali",
      pincode: "160062",
    },
  ];

  const steps = [
    { id: 0, icon: <FiMapPin size={20} />, label: "Address", active: true, link: "/address" },
    { id: 1, icon: <FiCreditCard size={20} />, label: "Payment" },
    { id: 2, icon: <FiShoppingBag size={20} />, label: "Summary" },
  ];

  const getTypeIcon = (type) =>
    type === "Home" ? (
      <FiHome className="text-[#d4b98c]" size={20} />
    ) : (
      <FiBriefcase className="text-[#d4b98c]" size={20} />
    );

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
          {/* STEP INDICATOR */}
          <div className="relative mb-16">
            <div className="absolute inset-x-0 top-6 h-1 flex items-center">
              <div className="w-full h-0.5 bg-gradient-to-r from-transparent via-[#d4b98c50] to-transparent" />
            </div>

            <div className="flex items-center justify-between relative z-10">
              {steps.map((step) => (
                <motion.div
                  key={step.id}
                  whileHover={{ scale: 1.05 }}
                  className="text-center flex-1"
                >
                  <div
                    className={`mx-auto w-14 h-14 rounded-full flex items-center justify-center shadow-lg transition-all duration-300 ${
                      step.id === 0
                        ? "bg-gradient-to-br from-[#d4b98c] to-[#b88a4a] text-white ring-2 ring-[#d4b98c] ring-offset-2"
                        : "bg-gray-200 text-gray-400"
                    }`}
                    style={{ border: "1px solid rgba(212,185,140,0.16)" }}
                  >
                    {step.icon}
                  </div>
                  <p
                    className={`mt-3 text-sm font-semibold transition-colors duration-300 ${
                      step.id === 0 ? "text-[#4D192B]" : "text-gray-400"
                    }`}
                  >
                    {step.label}
                  </p>
                </motion.div>
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
              Choose Delivery Address
            </h1>
            <p className="text-gray-600 text-lg">
              Select where you'd like your order delivered
            </p>
          </motion.div>

          {/* GRID */}
          <div className="grid md:grid-cols-2 gap-8 mb-8">
            {/* 📦 SAVED ADDRESSES */}
            {addresses.map((a, idx) => (
              <motion.div
                key={a.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                whileHover={{ scale: 1.01 }}
                onClick={() => setSelected(a.id)}
                className={`
                  relative p-7 rounded-2xl border cursor-pointer 
                  bg-white/80 backdrop-blur-xl
                  shadow-xl
                  transition-all duration-300
                  ${
                    selected === a.id
                      ? "border-[#d4b98c] shadow-[0_10px_35px_rgba(212,185,140,0.2)] ring-2 ring-[#d4b98c] ring-offset-1"
                      : "border-[#d4b98c1a] hover:border-[#d4b98c33]"
                  }
                `}
                style={{
                  backdropFilter: "saturate(120%) blur(8px)",
                }}
              >
                {/* Selection Glow */}
                {selected === a.id && (
                  <motion.div
                    layoutId="selectedGlow"
                    className="absolute inset-0 rounded-2xl bg-gradient-to-br from-[#d4b98c08] to-transparent pointer-events-none"
                  />
                )}

                {/* Top Bar */}
                <div className="flex items-center justify-between mb-4 relative z-10">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-[#fff6ea] rounded-lg">
                      {getTypeIcon(a.type)}
                    </div>
                    <span className="bg-[#d4b98c]/15 text-[#8a5f2b] px-3 py-1 text-xs font-semibold rounded-full">
                      {a.type}
                    </span>
                  </div>
                  {selected === a.id && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="w-6 h-6 rounded-full bg-gradient-to-br from-[#d4b98c] to-[#b88a4a] flex items-center justify-center text-white"
                    >
                      <FiCheckCircle size={16} />
                    </motion.div>
                  )}
                </div>

                {/* Details */}
                <h2 className="font-bold text-xl text-[#3b0b11] relative z-10">{a.name}</h2>
                <p className="text-gray-600 text-sm mt-1 flex items-center gap-2 relative z-10">
                  {a.phone}
                </p>
                <p className="mt-4 text-gray-700 leading-relaxed relative z-10">
                  {a.address}
                </p>
                <p className="text-xs text-gray-500 mt-3 relative z-10">
                  📍 {a.city} - {a.pincode}
                </p>

                {/* Action Buttons */}
                <div className="mt-5 flex gap-3 relative z-10">
                  <button className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg bg-[#fff6ea] text-[#8a5f2b] text-sm font-semibold hover:bg-[#ffe8cc] transition">
                    <FiEdit2 size={16} /> Edit
                  </button>
                  <button className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg bg-red-50 text-red-600 text-sm font-semibold hover:bg-red-100 transition">
                    <FiTrash2 size={16} /> Delete
                  </button>
                </div>
              </motion.div>
            ))}

            {/* ➕ ADD NEW ADDRESS CARD */}
            <motion.button
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              whileHover={{ scale: 1.02 }}
              onClick={() => setShowNewAddress(!showNewAddress)}
              className="
                flex flex-col items-center justify-center
                p-7 rounded-2xl border-2 border-dashed border-[#d4b98c]/40
                bg-white/70 backdrop-blur-xl cursor-pointer
                shadow-lg
                hover:border-[#d4b98c] hover:shadow-[0_10px_35px_rgba(212,185,140,0.15)]
                transition-all duration-300
              "
              style={{ backdropFilter: "blur(8px)" }}
            >
              <motion.div
                animate={{ rotate: showNewAddress ? 45 : 0 }}
                transition={{ duration: 0.3 }}
              >
                <FiPlus size={38} className="text-[#d4b98c]" />
              </motion.div>
              <p className="mt-3 text-[#4D192B] font-semibold">Add New Address</p>
              <p className="text-xs text-gray-500 mt-1">Quick & Easy</p>
            </motion.button>
          </div>

          {/* NEW ADDRESS FORM */}
          {showNewAddress && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-8 rounded-2xl shadow-xl bg-white/80 border border-[#d4b98c1a] mb-8"
              style={{ backdropFilter: "blur(8px)" }}
            >
              <h3 className="text-2xl font-bold text-[#3b0b11] mb-6">Add New Address</h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Full Name</label>
                  <input
                    type="text"
                    placeholder="Your Name"
                    className="w-full px-4 py-3 rounded-lg border border-[#d4b98c33] bg-white/70 text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#d4b98c]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Phone Number</label>
                  <input
                    type="tel"
                    placeholder="9876543210"
                    className="w-full px-4 py-3 rounded-lg border border-[#d4b98c33] bg-white/70 text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#d4b98c]"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Address</label>
                  <textarea
                    placeholder="House No., Street, Colony"
                    rows={3}
                    className="w-full px-4 py-3 rounded-lg border border-[#d4b98c33] bg-white/70 text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#d4b98c]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">City</label>
                  <input
                    type="text"
                    placeholder="City"
                    className="w-full px-4 py-3 rounded-lg border border-[#d4b98c33] bg-white/70 text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#d4b98c]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Pincode</label>
                  <input
                    type="text"
                    placeholder="160040"
                    className="w-full px-4 py-3 rounded-lg border border-[#d4b98c33] bg-white/70 text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#d4b98c]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Address Type</label>
                  <select className="w-full px-4 py-3 rounded-lg border border-[#d4b98c33] bg-white/70 text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#d4b98c]">
                    <option>Home</option>
                    <option>Work</option>
                    <option>Other</option>
                  </select>
                </div>

                <div className="md:col-span-2 flex gap-3">
                  <motion.button
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setShowNewAddress(false)}
                    className="flex-1 py-3 rounded-lg border-2 border-[#d4b98c] text-[#4D192B] font-semibold hover:bg-[#fff6ea]"
                  >
                    Cancel
                  </motion.button>
                  <motion.button
                    whileTap={{ scale: 0.98 }}
                    className="flex-1 py-3 rounded-lg bg-gradient-to-r from-[#d4b98c] to-[#b88a4a] text-[#2b160e] font-semibold shadow-lg"
                  >
                    Save Address
                  </motion.button>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>

      {/* STICKY BOTTOM CTA */}
      <div className="fixed bottom-0 left-0 w-full bg-white/80 backdrop-blur-xl shadow-2xl py-5 border-t border-[#d4b98c]/10">
        <div className="max-w-5xl mx-auto px-6 flex justify-between items-center">
          <div className="text-sm text-gray-600">
            {selected ? (
              <span>
                📍 <span className="font-semibold text-[#4D192B]">Address selected</span>
              </span>
            ) : (
              <span className="text-gray-500">Please select an address to continue</span>
            )}
          </div>
          <Link to={selected ? "/payment" : "#"}>
            <motion.button
              whileTap={{ scale: 0.98 }}
              disabled={!selected}
              className={`
                px-10 py-3.5 rounded-full text-lg font-semibold tracking-wide
                bg-gradient-to-r from-[#d4b98c] to-[#b88a4a] text-[#2b160e]
                shadow-[0_10px_30px_rgba(212,185,140,0.2)]
                transition-all duration-300
                ${
                  selected
                    ? "hover:shadow-[0_15px_40px_rgba(212,185,140,0.3)] cursor-pointer"
                    : "opacity-50 cursor-not-allowed"
                }
              `}
            >
              Continue to Payment
            </motion.button>
          </Link>
        </div>
      </div>

      <Footer />
    </>
  );
}
