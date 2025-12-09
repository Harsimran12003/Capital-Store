import React, { useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FiMapPin, FiCreditCard, FiShoppingBag, FiCheckCircle, FiTrash2 } from "react-icons/fi";

export default function OrderSummary() {
  
  const [currentStep, setCurrentStep] = useState(2); 
  const steps = [
    { id: 0, icon: <FiMapPin size={20} />, label: "Address", link: "/address" },
    { id: 1, icon: <FiCreditCard size={20} />, label: "Payment", link: "/payment" },
    { id: 2, icon: <FiShoppingBag size={20} />, label: "Summary", link: "/order-summary" },
  ];

  return (
    <>
      <Navbar />

      <div
        className="min-h-screen py-15 mt-5"
        style={{
          background:
            "radial-gradient(1200px 600px at 10% 10%, rgba(77,25,43,0.12), transparent 10%), radial-gradient(900px 500px at 90% 90%, rgba(60,20,30,0.08), transparent 10%), linear-gradient(180deg, #fffaf8 0%, #f9f6f4 100%)",
        }}
      >
        <div className="max-w-6xl mx-auto px-6">
          {/* STEP INDICATOR */}
          <div className="relative mb-12 max-w-3xl mx-auto">
            <div className="absolute inset-x-0 top-6 h-1 flex items-center">
              <div className="w-full h-0.5 bg-gradient-to-r from-transparent via-[#d4b98c50] to-transparent" />
            </div>

            <div className="flex items-center justify-between relative z-10">
              {steps.map((step) => (
                <Link key={step.id} to={step.link}>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.98 }}
                    className="text-center flex-1 focus:outline-none cursor-pointer w-full"
                    disabled={currentStep < step.id}
                  >
                    <div
                      className={`mx-auto w-14 h-14 rounded-full flex items-center justify-center shadow-md transition-all duration-300 ${
                        currentStep >= step.id
                          ? "bg-gradient-to-br from-[#d4b98c] to-[#b88a4a] text-white"
                          : "bg-gray-200 text-gray-400"
                      }`}
                      style={{ border: "1px solid rgba(212,185,140,0.16)" }}
                    >
                      {currentStep > step.id ? (
                        <FiCheckCircle size={20} />
                      ) : (
                        step.icon
                      )}
                    </div>
                    <p
                      className={`mt-3 text-sm font-medium transition-colors duration-300 ${
                        currentStep === step.id
                          ? "text-[#4D192B]"
                          : currentStep > step.id
                          ? "text-[#d4b98c]"
                          : "text-gray-400"
                      }`}
                    >
                      {step.label}
                    </p>
                  </motion.button>
                </Link>
              ))}
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* LEFT: Details */}
            <div className="lg:col-span-2 space-y-6">
              <motion.h1
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-4xl font-extrabold tracking-tight text-[#3b0b11]"
              >
                {currentStep === 0 && "Delivery Address"}
                {currentStep === 1 && "Payment Details"}
                {currentStep === 2 && "Review Your Order"}
              </motion.h1>

                          
              {/* STEP 2: ORDER SUMMARY */}
              {currentStep === 2 && (
                <>
                  {/* Delivery Address */}
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    whileHover={{ scale: 1.01 }}
                    className="p-6 rounded-2xl shadow-xl bg-gradient-to-br from-white/80 to-white/60 border border-[#d4b98c1a] relative overflow-hidden"
                    style={{
                      backdropFilter: "saturate(120%) blur(6px)",
                      boxShadow: "0 8px 30px rgba(20,10,10,0.06)",
                    }}
                  >
                    <h2 className="text-lg font-semibold text-[#4D192B] mb-2">Delivery Address</h2>
                    <p className="text-gray-700 leading-relaxed">
                      Sneha
                      <br /> House No. 123, Sector 40, Chandigarh
                      <br /> Phone: 9876543210
                    </p>
                    <div className="mt-4 text-sm text-gray-600">
                    </div>
                  </motion.div>

                  {/* Payment Method */}
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    whileHover={{ scale: 1.01 }}
                    className="p-6 rounded-2xl shadow-xl bg-white/80 border border-[#d4b98c1a] relative"
                    style={{ backdropFilter: "blur(6px)" }}
                  >
                    <h2 className="text-lg font-semibold text-[#4D192B] mb-2">Payment Method</h2>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-gray-800 font-medium">UPI (Google Pay)</p>
                        <p className="text-xs text-gray-500">Default payment</p>
                      </div>
                      <div className="text-xs text-green-600 font-semibold bg-green-50 px-3 py-1 rounded-full">Verified</div>
                    </div>
                  </motion.div>

                  {/* Items */}
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-6 rounded-2xl shadow-xl bg-white/80 border border-[#d4b98c1a]"
                    style={{ backdropFilter: "blur(6px)" }}
                  >
                    <div className="flex items-center justify-between mb-4">
                      <h2 className="text-lg font-semibold text-[#4D192B]">Items in Your Bag</h2>
                      <div className="text-sm text-gray-500">2 items</div>
                    </div>

                    {/* Product Row */}
                    <ProductRow
                      img="/p1.jpg"
                      title="Premium Cotton Kurta"
                      size="M"
                      price="₹999"
                    />
                    <ProductRow
                      img="/p2.jpg"
                      title="Winter Woolen Suit"
                      size="L"
                      price="₹1499"
                    />
                  </motion.div>
                </>
              )}
            </div>

            {/* RIGHT: Price Summary */}
            {currentStep === 2 && (
              <aside>
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  whileHover={{ scale: 1.01 }}
                  className="p-6 rounded-2xl shadow-2xl bg-gradient-to-br from-white/90 to-white/80 border border-[#d4b98c33] sticky top-28"
                  style={{
                    backdropFilter: "blur(8px)",
                    boxShadow: "0 14px 40px rgba(30,10,10,0.08)",
                  }}
                >
                  <h2 className="text-2xl font-bold text-[#3b0b11] mb-4">Price Summary</h2>

                  <div className="space-y-3 text-gray-700">
                    <Row label="Total MRP" value="₹3798" />
                    <Row label="Discount" value="-₹1300" valueClass="text-green-600" />
                    <Row label="Delivery Charges" value="Free" valueClass="text-green-600" />
                    <hr className="my-3 border-dashed border-gray-200" />
                    <div className="flex items-center justify-between text-xl font-bold text-[#4D192B]">
                      <span>Total Payable</span>
                      <span>₹2498</span>
                    </div>
                  </div>

                  <motion.button
                    whileTap={{ scale: 0.98 }}
                    className="w-full mt-6 py-4 rounded-full text-lg font-semibold bg-gradient-to-r from-[#d4b98c] to-[#b88a4a] text-[#2b160e] shadow-[0_10px_30px_rgba(212,185,140,0.18)] cursor-pointer hover:shadow-[0_15px_40px_rgba(212,185,140,0.3)] transition-all"
                  >
                    <div className="flex items-center justify-center gap-3">
                      <FiCheckCircle size={20} />
                      Place Order
                    </div>
                  </motion.button>

                  <div className="mt-4 text-xs text-gray-500">
                    Secure checkout • Easy returns • GST invoice available
                  </div>
                </motion.div>
              </aside>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}

function PaymentOption({ label, selected }) {
  return (
    <label className="flex items-center gap-3 p-3 rounded-lg border border-[#d4b98c33] bg-white/70 cursor-pointer hover:bg-white transition">
      <input type="radio" name="payment" defaultChecked={selected} className="w-4 h-4" />
      <span className="text-gray-800">{label}</span>
    </label>
  );
}

function ProductRow({ img, title, size, price }) {
  return (
    <div className="flex items-center gap-4 py-4 border-b last:border-b-0">
      <img src={img} alt="" className="w-24 h-28 object-cover rounded-xl shadow-sm" />
      <div className="flex-1">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-sm font-semibold text-[#3b0b11]">{title}</div>
            <div className="text-xs text-gray-500 mt-1">Size: {size}</div>
          </div>
          <div className="text-sm font-bold text-[#4D192B]">{price}</div>
        </div>
        <div className="mt-3 flex items-center gap-3">
          <button className="text-xs text-gray-500 hover:text-red-600 flex items-center gap-2 cursor-pointer">
            <FiTrash2 /> Remove
          </button>
        </div>
      </div>
    </div>
  );
}

function Row({ label, value, valueClass = "" }) {
  return (
    <div className="flex justify-between items-center text-sm">
      <span className="text-gray-600">{label}</span>
      <span className={`${valueClass}`}>{value}</span>
    </div>
  );
}
