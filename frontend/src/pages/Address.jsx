import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import {
  FiHome,
  FiBriefcase,
  FiPlus,
  FiMapPin,
  FiCreditCard,
  FiShoppingBag,
  FiCheckCircle,
  FiEdit2,
  FiTrash2,
} from "react-icons/fi";

const API_URL = import.meta.env.VITE_API_URL;

export default function Address() {
  const navigate = useNavigate();

  const [addresses, setAddresses] = useState([]);
  const [selected, setSelected] = useState(null);
  const [showNewAddress, setShowNewAddress] = useState(false);

  /* ================= FETCH ADDRESSES ================= */
  useEffect(() => {
    fetch(`${API_URL}/auth/address`, {
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => setAddresses(data.addresses || []))
      .catch(() => setAddresses([]));
  }, []);

  /* ================= CONTINUE HANDLER ================= */
  const continueToPayment = async () => {
    if (selected === null) return;

    await fetch(`${API_URL}/auth/select-address`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ index: selected }),
    });

    navigate("/payment");
  };

  const steps = [
    { id: 0, icon: <FiMapPin size={20} />, label: "Address" },
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

      <div className="min-h-screen py-15 mt-5 pb-32"
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
                      step.id === 0
                        ? "bg-gradient-to-br from-[#d4b98c] to-[#b88a4a] text-white"
                        : "bg-gray-200 text-gray-400"
                    }`}
                  >
                    {step.icon}
                  </div>
                  <p
                    className={`mt-3 text-sm font-semibold ${
                      step.id === 0 ? "text-[#4D192B]" : "text-gray-400"
                    }`}
                  >
                    {step.label}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* ================= HEADER ================= */}
          <h1 className="text-4xl font-extrabold text-[#3b0b11] mb-3">
            Choose Delivery Address
          </h1>
          <p className="text-gray-600 text-lg mb-10">
            Select where you'd like your order delivered
          </p>

          {/* ================= ADDRESS GRID ================= */}
          <div className="grid md:grid-cols-2 gap-8 mb-8">

            {addresses.map((a, idx) => (
              <motion.div
                key={idx}
                whileHover={{ scale: 1.01 }}
                onClick={() => setSelected(idx)}
                className={`p-7 rounded-2xl border cursor-pointer bg-white/80 shadow-xl ${
                  selected === idx
                    ? "border-[#d4b98c] ring-2 ring-[#d4b98c]"
                    : "border-[#d4b98c1a]"
                }`}
              >
                <div className="flex justify-between mb-4">
                  <div className="flex items-center gap-3">
                    {getTypeIcon(a.label)}
                    <span className="text-xs font-semibold">{a.label}</span>
                  </div>
                  {selected === idx && (
                    <FiCheckCircle className="text-[#d4b98c]" />
                  )}
                </div>

                <h2 className="font-bold text-xl">{a.label}</h2>
                <p className="mt-2 text-gray-700">{a.addressLine}</p>
                <p className="text-sm text-gray-500 mt-1">
                  {a.city} - {a.pincode}
                </p>
              </motion.div>
            ))}

            {/* ADD NEW ADDRESS CARD (UI ONLY) */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              onClick={() => setShowNewAddress(!showNewAddress)}
              className="flex flex-col items-center justify-center p-7 rounded-2xl border-2 border-dashed border-[#d4b98c]/40 bg-white/70 cursor-pointer"
            >
              <FiPlus size={36} className="text-[#d4b98c]" />
              <p className="mt-3 font-semibold">Add New Address</p>
            </motion.div>
          </div>
        </div>
      </div>

      {/* ================= STICKY CTA ================= */}
      <div className="fixed bottom-0 left-0 w-full bg-white/80 backdrop-blur-xl py-5 border-t">
        <div className="max-w-5xl mx-auto px-6 flex justify-between items-center">
          <span className="text-sm">
            {selected !== null
              ? "📍 Address selected"
              : "Please select an address to continue"}
          </span>

          <motion.button
            whileTap={{ scale: 0.98 }}
            disabled={selected === null}
            onClick={continueToPayment}
            className={`px-10 py-3.5 rounded-full text-lg font-semibold bg-gradient-to-r from-[#d4b98c] to-[#b88a4a] ${
              selected === null ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            Continue to Payment
          </motion.button>
        </div>
      </div>

      <Footer />
    </>
  );
}
