import React, { useState, useEffect } from "react";
import { FaWhatsapp } from "react-icons/fa";
import { FiArrowUp } from "react-icons/fi";
import { motion } from "framer-motion";

export default function WhatsAppToggle() {
  const [open, setOpen] = useState(false);
  const [visible, setVisible] = useState(false); // show both buttons

  useEffect(() => {
    const handleScroll = () => {
      const section = document.getElementById("slider"); // your trigger point
      if (!section) return;

      const rect = section.getBoundingClientRect();

      if (rect.top < 0) {
        setVisible(true);
      } else {
        setVisible(false);
        setOpen(false); // close popup if user scrolls up
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (!visible) return null; // nothing until scroll

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-4">

      {/* ================= Popup Box ================= */}
      {open && (
        <div
          className="p-4 w-64 bg-white border rounded-xl shadow-xl"
          style={{ animation: "fadeSlide 0.3s ease-out" }}
        >
          <h4 className="font-semibold text-sm text-gray-800">Chat with us</h4>
          <p className="text-xs text-gray-500 mt-1">Hello 👋 How can we help you?</p>

          <a
            href="https://wa.me/9888320496"
            target="_blank"
            rel="noreferrer"
            className="block text-center mt-3 px-3 py-2 rounded font-semibold 
            text-white flex items-center justify-center gap-2"
            style={{ background: "#25D366" }}
          >
            <FaWhatsapp size={16} />
            Open WhatsApp
          </a>
        </div>
      )}

      {/* ================= WhatsApp Floating Button ================= */}
      <motion.button
        onClick={() => setOpen(!open)}
        whileHover={{ scale: 1.15 }}
        whileTap={{ scale: 0.9 }}
        className="p-3 rounded-full shadow-xl text-white flex items-center justify-center"
        style={{ background: "#25D366" }}
      >
        <FaWhatsapp size={22} />
      </motion.button>

      {/* ================= Scroll To Top Button ================= */}
      <motion.button
        whileHover={{ scale: 1.15 }}
        whileTap={{ scale: 0.9 }}
        animate={{
          boxShadow: [
            "0 0 0px rgba(77,25,43,0.4)",
            "0 0 15px rgba(77,25,43,0.6)",
            "0 0 0px rgba(77,25,43,0.4)",
          ],
        }}
        transition={{ duration: 2, repeat: Infinity }}
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        className="p-3 rounded-full bg-[#4D192B] text-white shadow-xl"
      >
        <FiArrowUp size={22} />
      </motion.button>

      {/* Animation Keyframe */}
      <style>{`
        @keyframes fadeSlide {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
