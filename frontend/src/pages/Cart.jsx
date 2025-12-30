import React from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { FiTrash2 } from "react-icons/fi";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";

export default function Cart() {
  const { cart, updateQty, removeFromCart, updateSize } = useCart();
  const SIZES = ["S", "M", "L", "XL", "XXL"];

  const isUnstitched = (item) =>
    item?.category?.toLowerCase() === "unstitched";

  // Only require size for stitched items
  const hasMissingSize = cart.some(
    (item) => !isUnstitched(item) && !item.size
  );

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
  const delivery = 0;

  return (
    <>
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 mt-5 mb-24 grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* LEFT SIDE */}
        <div className={`lg:col-span-2 ${cart.length === 0 ? "lg:col-span-3" : ""} space-y-6`}>
          {cart.length > 0 && (
            <h1 className="text-2xl sm:text-3xl font-bold mb-4">
              Shopping Bag
            </h1>
          )}

          {cart.length === 0 ? (
            <div className="text-center py-9 px-4">
              <motion.div
                initial={{ scale: 0.98, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.4 }}
                className="inline-flex items-center justify-center w-36 h-36 sm:w-40 sm:h-40 rounded-full 
                bg-gradient-to-br from-[#fff7ef] to-[#fff2e6] shadow-lg mb-6"
              >
                <FiTrash2 className="text-5xl text-[#d4b98c]" />
              </motion.div>

              <h2 className="text-xl sm:text-2xl font-semibold text-[#3b0b11] mb-2">
                Your cart is empty
              </h2>

              <p className="text-gray-500 text-sm sm:text-base mb-6">
                Add some items to your cart and start shopping.
              </p>

              <Link to="/">
                <motion.button whileHover={{ scale: 1.03 }} className="px-6 py-3 rounded-full bg-[#4D192B] text-white font-semibold shadow-md">
                  Continue Shopping
                </motion.button>
              </Link>
            </div>
          ) : (
            cart.map((item) => (
              <motion.div
                key={`${item.productId}-${item.size}`}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col sm:flex-row gap-5 bg-white p-5 rounded-3xl shadow-xl mt-3"
              >
                {/* IMAGE */}
                <img
                  src={item.image || "/placeholder.png"}
                  alt={item.name}
                  className="w-full sm:w-32 h-36 rounded-xl"
                />

                {/* DETAILS */}
                <div className="flex-1">
                  <h2 className="font-semibold text-lg text-[#4D192B]">
                    {item.name}
                  </h2>

                  <div className="mt-1">
                    <label className="text-xs text-gray-500 block mb-1">
                      Size
                    </label>

                    {/* UNSTITCHED → SHOW BADGE */}
                    {isUnstitched(item) ? (
                      <div className="px-4 py-1 rounded-lg bg-[#4D192B] text-white w-fit text-sm">
                        Free Size
                      </div>
                    ) : (
                      <select
                        value={item.size || ""}
                        onChange={(e) =>
                          updateSize(item.productId, item.size, e.target.value)
                        }
                        className="border border-gray-300 rounded-lg px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-[#4D192B]/30"
                      >
                        <option value="" disabled>
                          Select Size
                        </option>

                        {SIZES.map((size) => (
                          <option key={size} value={size}>
                            {size}
                          </option>
                        ))}
                      </select>
                    )}
                  </div>

                  {/* PRICING */}
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

                  {/* QTY */}
                  <div className="flex items-center gap-4 mt-4">
                    <button
                      onClick={() => {
                        if (item.qty === 1) {
                          removeFromCart(item.productId, item.size);
                        } else {
                          updateQty(item.productId, item.size, item.qty - 1);
                        }
                      }}
                      className="w-9 h-9 bg-gray-200 rounded-full text-xl"
                    >
                      –
                    </button>

                    <span className="font-bold">{item.qty}</span>

                    <button
                      onClick={() =>
                        updateQty(item.productId, item.size, item.qty + 1)
                      }
                      className="w-9 h-9 bg-gray-200 rounded-full text-xl"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* DELETE */}
                <button
                  onClick={() =>
                    removeFromCart(item.productId, item.size)
                  }
                  className="self-start sm:self-center"
                >
                  <FiTrash2 className="text-gray-500 hover:text-red-600" />
                </button>
              </motion.div>
            ))
          )}
        </div>

        {/* RIGHT SUMMARY */}
        {cart.length > 0 && (
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

                <div className="border-t pt-3 flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span>₹{totalPrice + delivery}</span>
                </div>
              </div>

              <button
                onClick={() => {
                  if (hasMissingSize) {
                    alert("Please select size for all stitched items");
                    return;
                  }
                  window.location.href = "/address";
                }}
                className="block w-full mt-6 text-center bg-[#4D192B] text-white py-3 rounded-full font-semibold"
              >
                Proceed to Address
              </button>
            </div>
          </div>
        )}
      </div>

      <Footer />
    </>
  );
}
