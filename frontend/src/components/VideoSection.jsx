import React from "react";
import { motion } from "framer-motion";

export default function VideoSection() {
  return (
    <section className="relative max-w-7xl mx-auto px-4 mt-24 overflow-visible">

      {/* 🔵 Soft background spotlight */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-[#7B1F2E]/10 blur-[140px] opacity-60 pointer-events-none" />

      {/* 🫧 Floating blobs (very subtle luxury motion) */}
      {Array.from({ length: 6 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-20 h-20 rounded-full bg-[#7B1F2E]/10 blur-2xl opacity-30"
          style={{
            left: `${10 + Math.random() * 80}%`,
            top: `${20 + Math.random() * 60}px`,
          }}
          animate={{
            y: ["0px", "-40px", "0px"],
            scale: [1, 1.12, 1],
          }}
          transition={{
            duration: 6 + Math.random() * 4,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}

      {/* MAIN GLASS CARD */}
      <motion.div
        className="
          relative backdrop-blur-xl bg-white/40 border border-white/30
          rounded-3xl p-10 shadow-xl flex flex-col md:flex-row gap-10
        "
        initial={{ opacity: 0, y: 35 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        viewport={{ once: true }}
        whileHover={{ scale: 1.01 }}
      >

        {/* LEFT SECTION – ANIMATED HEADING + TEXT */}
        <motion.div
          className="w-full md:w-1/2 relative"
          initial={{ opacity: 0, x: -25 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          viewport={{ once: true }}
        >
          {/* Subtle moving light */}
          <motion.div
            className="absolute -top-6 -left-6 w-32 h-32 bg-[#7B1F2E]/20 blur-2xl rounded-full"
            animate={{ x: [0, 10, 0], y: [0, 8, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          />

          {/* ✨ Split Reveal Heading */}
          <motion.h3
            className="text-5xl font-extrabold tracking-tight mb-3"
            style={{ color: "#7B1F2E" }}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <motion.span
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
            >
              About
            </motion.span>
            <br />
            <motion.span
              className="inline-block"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35, duration: 0.6 }}
            >
              Capital&nbsp;Store
            </motion.span>

            {/* Gold Shine Underline */}
            <motion.div
              className="h-[3px] bg-[#7B1F2E] mt-2 rounded-full"
              initial={{ width: 0 }}
              whileInView={{ width: "55%" }}
              transition={{ duration: 0.8, ease: "easeOut", delay: 0.4 }}
            />
          </motion.h3>

          {/* Supporting text */}
          <motion.p
            className="mt-4 text-gray-700 text-sm leading-relaxed"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.7 }}
          >
            We blend premium craftsmanship, deep-rooted heritage, and modern
            luxury. Every outfit is made to elevate your confidence and redefine
            elegance — one detail at a time.
          </motion.p>
        </motion.div>

        {/* RIGHT SECTION – VIDEO WITH CINEMATIC FRAME */}
        <motion.div
          className="w-full md:w-1/2 relative group"
          initial={{ opacity: 0, x: 25 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          viewport={{ once: true }}
        >

          {/* Soft rotating glow rings */}
          <motion.div
            className="absolute inset-0 rounded-3xl bg-gradient-to-br from-transparent via-white/30 to-transparent blur-2xl pointer-events-none"
            animate={{ rotate: [0, 6, 0] }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          />

          {/* Shine Swipe */}
          <motion.div
            className="absolute inset-0 w-[40%] bg-gradient-to-r from-transparent via-white/50 to-transparent skew-x-12 blur-lg opacity-0 group-hover:opacity-100"
            animate={{ x: ["-150%", "200%"] }}
            transition={{ duration: 1.8, repeat: Infinity }}
          />

          <motion.iframe
            whileHover={{ scale: 1.035 }}
            transition={{ duration: 0.4 }}
            className="
              w-full h-64 md:h-60 lg:h-72 
              rounded-2xl shadow-2xl border border-white/40
            "
            src="https://www.youtube.com/embed/dQw4w9WgXcQ"
            title="Brand Video"
            allowFullScreen
          />
        </motion.div>
      </motion.div>
    </section>
  );
}
