import React, { useEffect, useState, useRef } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useParams, Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import emailjs from "emailjs-com";

export default function OrderSuccess() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const { clearCart } = useCart();
  const emailSentRef = useRef(false); 

  useEffect(() => {
    fetch(`https://capital-store-backend.vercel.app/api/orders/${id}`, {
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        setOrder(data);
        clearCart();
      });
  }, [id, clearCart]);

  /* ================= SEND EMAIL USING EMAILJS ================= */
  useEffect(() => {
    if (!order || emailSentRef.current) return;

    emailSentRef.current = true;

    emailjs
      .send(
        "service_dp4jzds",    
        "template_ut6t1do",   
        {
          to_email: order.user?.email || order.address?.email,

          order_id: order._id,
          total: order.pricing.total,
          payment_method: order.paymentMethod.toUpperCase(),
          address: `${order.address.addressLine}, ${order.address.city}, ${order.address.state} - ${order.address.pincode}`,
        },
        "gElbIlin_Gvn2LL0d"      
      )
      .then(() => {
        console.log("✅ Order confirmation email sent");
        console.log("ORDER USER:", order.user);
      })
      .catch((err) => {
        console.error("❌ EmailJS error:", err);
        console.log("ORDER USER:", order.user);

      });
  }, [order]);

  if (!order)
    return (
      <div className="min-h-screen flex justify-center items-center">
        Loading...
      </div>
    );

  return (
    <>
      <Navbar />

      <div className="max-w-4xl mx-auto px-6 py-16 mt-6 text-center">
        <h1 className="text-4xl font-bold text-green-700">
          🎉 Order Placed Successfully!
        </h1>

        <p className="mt-3 text-gray-600">
          Thank you for shopping with Capital Store.
        </p>

        <div className="bg-white shadow-xl rounded-2xl p-6 mt-6">
          <h3 className="text-xl font-bold">Order ID</h3>
          <p className="font-mono mt-1">{order._id}</p>

          <h3 className="text-lg font-semibold mt-4">
            Payment Method: {order.paymentMethod.toUpperCase()}
          </h3>

          <h3 className="text-lg font-semibold mt-2">
            Status: {order.orderStatus}
          </h3>

          {order.shipment?.awb ? (
            <>
              <p className="mt-2 text-green-700 font-semibold">
                Shipment Created 🚚
              </p>

              <p className="mt-1">
                AWB: <b>{order.shipment.awb}</b>
              </p>

              <Link
                to={`/track/${order._id}`}
                className="mt-5 inline-block px-6 py-3 rounded-full bg-[#4D192B] text-white"
              >
                Track Shipment
              </Link>
            </>
          ) : (
            <p className="mt-3 text-orange-500">
              ⏳ Shipment is being created…
            </p>
          )}
        </div>

        <Link
          to="/"
          className="mt-6 inline-block text-[#4D192B] underline cursor-pointer"
        >
          Continue Shopping
        </Link>
      </div>

      <Footer />
    </>
  );
}
