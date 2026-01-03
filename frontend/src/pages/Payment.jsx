import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FaMoneyBillWave, FaGooglePay } from "react-icons/fa";

import {
  FiMapPin,
  FiShoppingBag,
  FiCheckCircle,
  FiCreditCard,
} from "react-icons/fi";

import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";

const API_URL = "https://capital-store-backend.vercel.app/api";

export default function Payment() {
  const [method, setMethod] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState(null);

  const { cart, clearCart } = useCart();
  const navigate = useNavigate();

  /* ================= FETCH SELECTED ADDRESS ================= */
  useEffect(() => {
    fetch(`${API_URL}/auth/address`, {
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        const addresses = data.addresses || [];
        const storedIndex = Number(
          localStorage.getItem("selectedAddressIndex")
        );

        let selected = null;

        if (Number.isInteger(storedIndex) && addresses[storedIndex]) {
          selected = addresses[storedIndex];
        } else {
          selected = addresses[0]; // fallback
        }

        setSelectedAddress(selected || null);
      })
      .catch(() => setSelectedAddress(null));
  }, []);

  const getPrice = (i) =>
    i.discountedPrice > 0 ? i.discountedPrice : i.originalPrice;

  const mrp = cart.reduce(
    (s, i) => s + Number(i.originalPrice || 0) * i.qty,
    0
  );
  const total = cart.reduce((s, i) => s + Number(getPrice(i) || 0) * i.qty, 0);
  const discount = mrp - total;

  const city = selectedAddress?.city?.toString().trim().toLowerCase() || "";
  const isCODAllowed = city === "ludhiana";

  const steps = [
    { id: 0, icon: <FiMapPin />, label: "Address" },
    { id: 1, icon: <FiShoppingBag />, label: "Summary" },
    { id: 2, icon: <FiCreditCard />, label: "Payment" },
  ];

  const paymentMethods = [
    {
      id: "upi",
      icon: <FaGooglePay />,
      title: "UPI / Card / NetBanking",
      desc: "PhonePe • Cards • NetBanking",
      badge: "Recommended",
    },
    {
      id: "cod",
      icon: <FaMoneyBillWave />,
      title: "Cash on Delivery",
      desc: "Pay when you receive",
      badge: "Only in Ludhiana",
      disabled: !isCODAllowed,
    },
  ];

  /* ================= PLACE ORDER ================= */
  const handlePayment = async () => {
    if (!method || loading) return;
    if (method === "cod" && !isCODAllowed)
      return alert("COD is available only in Ludhiana");

    setLoading(true);

    try {
      const orderRes = await fetch(`${API_URL}/orders`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          paymentMethod: method,
          items: cart,
          pricing: { mrp, discount, total },
        }),
      });

      const order = await orderRes.json();
      if (!orderRes.ok) throw new Error("Order creation failed");

      if (method === "cod") {
        clearCart();
        navigate(`/order-summary/${order._id}`);
        return;
      }

      const payRes = await fetch(`${API_URL}/payment/phonepe/create`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderId: order._id,
          amount: total,
        }),
      });

      const payData = await payRes.json();
      if (!payRes.ok || !payData.redirectUrl)
        throw new Error("PhonePe initiation failed");

      window.location.href = payData.redirectUrl;
    } catch (err) {
      console.error(err);
      alert("Payment failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />

      <div
        className="min-h-screen py-16 mt-5"
        style={{
          background:
            "radial-gradient(1200px 600px at 10% 10%, rgba(77,25,43,0.12), transparent 10%), radial-gradient(900px 500px at 90% 90%, rgba(60,20,30,0.08), transparent 10%), linear-gradient(180deg, #fffaf8 0%, #f9f6f4 100%)",
        }}
      >
        <div className="max-w-5xl mx-auto px-6">
          <div className="relative mb-16">
            <div className="absolute inset-x-0 top-6 h-0.5 bg-gradient-to-r from-transparent via-[#d4b98c50] to-transparent" />
            <div className="flex justify-between relative z-10">
              {steps.map((s) => (
                <div key={s.id} className="flex-1 text-center">
                  <div
                    className={`mx-auto w-14 h-14 rounded-full flex items-center justify-center shadow-lg
                        ${
                          s.id < 2
                            ? "bg-gradient-to-br from-[#d4b98c] to-[#b88a4a] text-white"
                            : "bg-gradient-to-br from-[#d4b98c] to-[#b88a4a] text-white ring-2 ring-[#d4b98c]"
                        }
                      `}
                  >
                    {s.id < 2 ? <FiCheckCircle /> : s.icon}
                  </div>
                  <p className="mt-3 text-sm font-semibold">{s.label}</p>
                </div>
              ))}
            </div>
          </div>

          <h1 className="text-4xl font-extrabold text-[#3b0b11] mb-4">
            Choose Payment Method
          </h1>

          {selectedAddress && (
            <p className="mb-6 text-sm">
              Delivering to:
              <strong> {selectedAddress.city}</strong>
            </p>
          )}

          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-4">
              {paymentMethods.map((pm) => (
                <label
                  key={pm.id}
                  onClick={() => !pm.disabled && setMethod(pm.id)}
                  className={`flex items-center gap-5 p-6 rounded-2xl cursor-pointer border shadow-lg ${
                    method === pm.id
                      ? "border-[#d4b98c] bg-white"
                      : "bg-white/70"
                  } ${pm.disabled ? "opacity-50 cursor-not-allowed" : ""}`}
                >
                  <input type="radio" checked={method === pm.id} readOnly />
                  <div className="text-4xl text-[#4D192B]">{pm.icon}</div>
                  <div className="flex-1">
                    <h3 className="font-semibold">{pm.title}</h3>
                    <p className="text-sm text-gray-600">{pm.desc}</p>

                    {pm.id === "cod" && pm.disabled && (
                      <p className="text-xs text-red-500 mt-1">
                        COD available only for Ludhiana
                      </p>
                    )}
                  </div>
                  <span className="px-3 py-1 text-xs bg-[#fff6ea] rounded-full">
                    {pm.badge}
                  </span>
                </label>
              ))}
            </div>

            <aside>
              <div className="p-6 rounded-2xl bg-white shadow-2xl sticky top-28">
                <h2 className="text-xl font-bold mb-4">Order Summary</h2>

                <div className="space-y-2 text-sm mb-6">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>₹{mrp}</span>
                  </div>
                  <div className="flex justify-between text-green-600">
                    <span>Discount</span>
                    <span>-₹{discount}</span>
                  </div>
                  <hr />
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span>₹{total}</span>
                  </div>
                </div>

                <motion.button
                  whileTap={{ scale: 0.98 }}
                  disabled={!method || loading}
                  onClick={handlePayment}
                  className={`w-full py-4 rounded-full text-lg font-semibold bg-gradient-to-r from-[#d4b98c] to-[#b88a4a] ${
                    !method || loading ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                >
                  {loading ? "Processing..." : "Continue to Pay"}
                </motion.button>

                <p className="mt-4 text-xs text-center text-gray-500">
                  🔒 Secure & Encrypted Payment
                </p>
              </div>
            </aside>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}
