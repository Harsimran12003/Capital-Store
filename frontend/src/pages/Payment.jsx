import React, { useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FaMoneyBillWave,
  FaGooglePay,
  FaCreditCard,
} from "react-icons/fa";
import {
  FiMapPin,
  FiCreditCard as FiCard,
  FiShoppingBag,
  FiCheckCircle,
  FiCreditCard
} from "react-icons/fi";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";

export default function Payment() {
  const [method, setMethod] = useState("");
  const [loading, setLoading] = useState(false);

  const { cart, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  /* ================= PRICING ================= */
  const mrp = cart.reduce((s, i) => s + i.originalPrice * i.qty, 0);
  const total = cart.reduce((s, i) => s + i.price * i.qty, 0);
  const discount = mrp - total;

  /* ================= STEPS ================= */
  const steps = [
  { id: 0, icon: <FiMapPin />, label: "Address" },
  { id: 1, icon: <FiShoppingBag />, label: "Summary" },
  { id: 2, icon: <FiCreditCard />, label: "Payment" },
];


  /* ================= PAYMENT METHODS ================= */
  const paymentMethods = [
    {
      id: "online",
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
      badge: "Flexible",
    },
  ];

  /* ================= PLACE ORDER ================= */
  const handlePayment = async () => {
    if (!method || loading) return;

    setLoading(true);

    try {
      /* 1️⃣ CREATE ORDER */
      const orderRes = await fetch(
        "https://capital-store-backend.vercel.app/api/orders",
        {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            paymentMethod: method,
            items: cart, // includes size
            pricing: { mrp, discount, total },
          }),
        }
      );

      const order = await orderRes.json();
      if (!orderRes.ok) throw new Error("Order creation failed");

      /* 2️⃣ IF COD → DONE */
      if (method === "cod") {
        clearCart();
        navigate(`/order-summary/${order._id}`);
        return;
      }

      /* 3️⃣ PHONEPE PAYMENT */
      const payRes = await fetch(
        "https://capital-store-backend.vercel.app/api/payment/phonepe/create",
        {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            orderId: order._id,
            amount: total,
          }),
        }
      );

      const payData = await payRes.json();
      if (!payRes.ok || !payData.redirectUrl)
        throw new Error("PhonePe initiation failed");

      /* 4️⃣ REDIRECT TO PHONEPE */
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

          {/* ================= STEPS ================= */}
          <div className="relative mb-16">
            <div className="absolute inset-x-0 top-6 h-0.5 bg-gradient-to-r from-transparent via-[#d4b98c50] to-transparent" />
            <div className="flex justify-between relative z-10">
              {steps.map((s) => (
                <Link key={s.id} to={s.link || "#"} className="flex-1">
                  <div className="text-center">
                    <div
                      className={`mx-auto w-14 h-14 rounded-full flex items-center justify-center shadow-lg
                        ${
                          s.id < 2
                            ? "bg-gradient-to-br from-[#d4b98c] to-[#b88a4a] text-white"
                            : s.id === 2
                            ? "bg-gradient-to-br from-[#d4b98c] to-[#b88a4a] text-white ring-2 ring-[#d4b98c] ring-offset-2"
                            : "bg-gray-200 text-gray-400"
                        }
                      `}
                    >
                      {s.id < 2 ? <FiCheckCircle /> : s.icon}
                    </div>
                    <p className="mt-3 text-sm font-semibold">{s.label}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* ================= HEADER ================= */}
          <h1 className="text-4xl font-extrabold text-[#3b0b11] mb-4">
            Choose Payment Method
          </h1>
          <p className="text-gray-600 mb-10">
            Secure payments powered by PhonePe
          </p>

          <div className="grid lg:grid-cols-3 gap-8">

            {/* ================= LEFT ================= */}
            <div className="lg:col-span-2 space-y-4">
              {paymentMethods.map((pm) => (
                <label
                  key={pm.id}
                  onClick={() => setMethod(pm.id)}
                  className={`flex items-center gap-5 p-6 rounded-2xl cursor-pointer border shadow-lg ${
                    method === pm.id
                      ? "border-[#d4b98c] bg-white"
                      : "bg-white/70"
                  }`}
                >
                  <input
                    type="radio"
                    checked={method === pm.id}
                    readOnly
                  />
                  <div className="text-4xl text-[#4D192B]">{pm.icon}</div>
                  <div className="flex-1">
                    <h3 className="font-semibold">{pm.title}</h3>
                    <p className="text-sm text-gray-600">{pm.desc}</p>
                  </div>
                  <span className="px-3 py-1 text-xs bg-[#fff6ea] rounded-full">
                    {pm.badge}
                  </span>
                </label>
              ))}
            </div>

            {/* ================= RIGHT ================= */}
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
                    !method || loading
                      ? "opacity-50 cursor-not-allowed"
                      : ""
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
