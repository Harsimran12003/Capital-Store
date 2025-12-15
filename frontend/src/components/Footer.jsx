import React from "react";
import { motion } from "framer-motion";
import { FiInstagram, FiFacebook, FiYoutube } from "react-icons/fi";

const WINE = "#4D192B";

export default function Footer() {
  return (
    <footer className="relative overflow-hidden bg-gradient-to-b from-white via-[#fff4f6] to-[#f7e6e9] pt-20 pb-12 ">

      {/* ====================== SOFT BACKGROUND GLOW (Optimized) ===================== */}
      <motion.div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[180px] rounded-full bg-[#4D192B]/10 blur-[100px]"
        animate={{
          opacity: [0.4, 0.6, 0.4],
          y: [0, -15, 0]
        }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* ====================== VERY LIGHT SHINE EFFECT ===================== */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
        animate={{ x: ["-120%", "130%"] }}
        transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
        style={{ pointerEvents: "none" }}
      />

      {/* ====================== MINIMAL FLOATING PARTICLES (Only 6 instead of 22) ===================== */}
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-[6px] h-[6px] bg-[#4D192B]/20 rounded-full"
          initial={{
            x: Math.random() * 1200,
            y: Math.random() * 240,
            opacity: 0.3,
            scale: 0.8,
          }}
          animate={{
            y: "-=40",
            opacity: [0.3, 0.6, 0.35],
            scale: [0.8, 1.1, 0.85],
          }}
          transition={{
            duration: 6 + Math.random() * 6,
            repeat: Infinity,
            repeatType: "mirror",
            ease: "easeInOut"
          }}
        />
      ))}

      {/* ====================== MAIN FOOTER CONTENT ===================== */}
      <motion.div
        className="max-w-7xl mx-auto px-6 relative"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">

          {/* ================= BRAND COLUMN ================= */}
          <div>
            <h4
              className="text-[36px] font-extrabold tracking-wide"
              style={{ color: WINE }}
            >
              Capital Store
            </h4>

            <p className="text-sm text-gray-600 mt-3 max-w-xs leading-relaxed">
              Redefining elegance through premium fabrics, artisan craftsmanship,
              and timeless luxury essentials.
            </p>

            {/* Social Icons */}
            <div className="flex gap-4 mt-6">
              {[FiInstagram, FiFacebook, FiYoutube].map((Icon, idx) => (
                <motion.div
                  key={idx}
                  whileHover={{ scale: 1.15 }}
                  className="p-3 bg-white rounded-full shadow-md border border-gray-200 cursor-pointer"
                >
                  <Icon className="text-gray-700 hover:text-[#4D192B]" size={22} />
                </motion.div>
              ))}
            </div>
          </div>

          {/* ================= QUICK LINKS ================= */}
          <div className="text-sm text-gray-700">
            <h5 className="font-bold mb-3 text-lg" style={{ color: WINE }}>
              Explore
            </h5>

            <ul className="space-y-3">
              {["Home", "Products", "About Us", "Offers", "Contact"].map((t, i) => (
                <motion.li
                  key={i}
                  whileHover={{ x: 4 }}
                  transition={{ duration: 0.2 }}
                  className="cursor-pointer relative"
                >
                  {t}
                  <span className="absolute left-0 -bottom-[3px] w-0 h-[2px] bg-[#4D192B] transition-all duration-300 group-hover:w-full"></span>
                </motion.li>
              ))}
            </ul>
          </div>

          {/* ================= CONTACT COLUMN ================= */}
          <div className="text-sm text-gray-700">
            <h5 className="font-bold mb-3 text-lg" style={{ color: WINE }}>
              Get in Touch
            </h5>

            <ul className="space-y-3">
              <motion.li whileHover={{ x: 4 }} className="cursor-pointer">
                capitalstorecs@yahoo.com
              </motion.li>
              <motion.li whileHover={{ x: 4 }} className="cursor-pointer">
                +91 98883 20496
              </motion.li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="w-full h-[1px] bg-gray-300 mt-10"></div>

        {/* Copyright */}
        <div className="text-center mt-5 text-sm text-gray-500 tracking-wide">
          © {new Date().getFullYear()}{" "}
          <span style={{ color: WINE }} className="font-semibold">
            Capital Store
          </span>{" "}
          — Crafted With Elegance.
          <p className="mt-6 text-[12px]">Powered by Excellence Web Services</p>
        </div>
      </motion.div>
    </footer>
  );
}
