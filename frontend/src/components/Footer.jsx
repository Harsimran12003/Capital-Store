import React from "react";
import { motion } from "framer-motion";
import { FiInstagram, FiFacebook, FiYoutube, FiArrowUp } from "react-icons/fi";

const WINE = "#4D192B";

export default function Footer() {
  return (
    <footer className="relative overflow-hidden bg-gradient-to-b from-white via-[#fff4f6] to-[#f7e6e9] pt-24 pb-14 mt-32">

      {/* ====================== TOP WAVING GRADIENT AURA ===================== */}
      <motion.div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[1200px] h-[240px] rounded-full bg-[#4D192B]/15 blur-[140px]"
        animate={{
          scale: [1, 1.08, 1],
          opacity: [0.45, 0.7, 0.45],
        }}
        transition={{ duration: 8, repeat: Infinity }}
      />

      {/* ====================== ANIMATED SHINE SWEEP OVER FOOTER ===================== */}
      <motion.div
        className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-white/15 to-transparent"
        animate={{ x: ["-100%", "150%"] }}
        transition={{ duration: 6, repeat: Infinity }}
        style={{ pointerEvents: "none" }}
      />

      {/* ====================== FLOATING PARTICLES ===================== */}
      {Array.from({ length: 22 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-[6px] h-[6px] bg-[#4D192B]/25 rounded-full"
          initial={{
            x: Math.random() * 1400,
            y: Math.random() * 350,
            opacity: 0.25,
          }}
          animate={{
            y: "-=60",
            opacity: [0.2, 0.7, 0.2],
            scale: [0.8, 1.3, 0.8],
          }}
          transition={{
            duration: 4 + Math.random() * 6,
            repeat: Infinity,
            repeatType: "mirror",
          }}
        />
      ))}

      {/* ====================== MAIN CONTAINER ===================== */}
      <motion.div
        className="max-w-7xl mx-auto px-6 relative"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        viewport={{ once: true }}
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">

          {/* ================= BRAND COLUMN ================= */}
          <motion.div
            whileHover={{ y: -5 }}
            transition={{ duration: 0.3 }}
          >
            <h4
              className="text-[38px] font-extrabold tracking-wide drop-shadow-sm"
              style={{ color: WINE }}
            >
              Capital Store
            </h4>

            <p className="text-sm text-gray-600 mt-3 leading-relaxed max-w-xs">
              Redefining elegance through premium fabrics, artisan craftsmanship, 
              and timeless luxury essentials.
            </p>

            {/* Social Icons Row */}
            <div className="flex gap-5 mt-6">
              {[FiInstagram, FiFacebook, FiYoutube].map((Icon, idx) => (
                <motion.div
                  key={idx}
                  whileHover={{
                    scale: 1.22,
                    rotate: 3,
                    boxShadow: "0 8px 18px rgba(0,0,0,0.15)",
                  }}
                  className="p-3 bg-white rounded-full shadow-md border border-gray-200 cursor-pointer"
                >
                  <Icon className="text-gray-700 hover:text-[#4D192B]" size={22} />
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* ================= QUICK LINKS ================= */}
          <motion.div
            whileHover={{ y: -5 }}
            transition={{ duration: 0.3 }}
            className="text-sm text-gray-700"
          >
            <h5 className="font-bold mb-3 text-lg" style={{ color: WINE }}>
              Explore
            </h5>

            <ul className="space-y-3">
              {["Home", "Products", "About Us", "Offers", "Contact"].map((t, i) => (
                <motion.li
                  key={i}
                  whileHover={{ x: 6 }}
                  className="relative group cursor-pointer"
                >
                  {t}
                  <span className="absolute left-0 -bottom-[3px] h-[2px] w-0 bg-[#4D192B] transition-all duration-300 group-hover:w-full"></span>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* ================= CONTACT COLUMN ================= */}
          <motion.div
            whileHover={{ y: -5 }}
            transition={{ duration: 0.3 }}
            className="text-sm text-gray-700"
          >
            <h5 className="font-bold mb-3 text-lg" style={{ color: WINE }}>
              Get in Touch
            </h5>

            <ul className="space-y-3">
              <motion.li whileHover={{ x: 6 }} className="relative group cursor-pointer">
                contact@capitalstore.in
                <span className="absolute left-0 -bottom-[3px] h-[2px] w-0 bg-[#4D192B] group-hover:w-full transition-all"></span>
              </motion.li>

              <motion.li whileHover={{ x: 6 }} className="relative group cursor-pointer">
                +91 99999 99999
                <span className="absolute left-0 -bottom-[3px] h-[2px] w-0 bg-[#4D192B] group-hover:w-full transition-all"></span>
              </motion.li>
            </ul>
          </motion.div>
        </div>

        {/* ================= BOTTOM DIVIDER ================= */}
        <motion.div
          className="w-full h-[1px] bg-gray-300 mt-16"
          initial={{ width: 0 }}
          whileInView={{ width: "100%" }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        />

        {/* ================= COPYRIGHT ================= */}
        <motion.div
          className="text-center mt-6 text-sm text-gray-500 tracking-wide"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.7, delay: 0.2 }}
        >
          © {new Date().getFullYear()}{" "}
          <span className="font-semibold" style={{ color: WINE }}>
            Capital Store
          </span>{" "}
          — Crafted With Elegance.
        </motion.div>

        

      </motion.div>
    </footer>
  );
}
