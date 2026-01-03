import React from "react";
import { motion } from "framer-motion";

export default function VideoSection() {
  return (
    <section className="relative max-w-7xl mx-auto px-4 mt-24 overflow-visible mb-4">
      {/* Spotlight */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-[#7B1F2E]/10 blur-[140px] opacity-60 pointer-events-none" />

      {/* floating blobs */}
      {Array.from({ length: 6 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-20 h-20 rounded-full bg-[#7B1F2E]/10 blur-2xl opacity-30"
          style={{
            left: `${10 + Math.random() * 80}%`,
            top: `${20 + Math.random() * 60}px`,
          }}
          animate={{ y: ["0px", "-40px", "0px"], scale: [1, 1.12, 1] }}
          transition={{ duration: 6 + Math.random() * 4, repeat: Infinity }}
        />
      ))}

      {/* MAIN CARD */}
      <motion.div
        className="relative backdrop-blur-xl bg-white/40 border border-white/30 rounded-3xl p-10 shadow-xl flex flex-col md:flex-row gap-10"
        initial={{ opacity: 0, y: 35 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        {/* LEFT */}
        <motion.div
          className="w-full md:w-1/2 relative"
          initial={{ opacity: 0, x: -25 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          {/* moving glow */}
          <motion.div
            className="absolute -top-6 -left-6 w-32 h-32 bg-[#7B1F2E]/20 blur-2xl rounded-full"
            animate={{ x: [0, 10, 0], y: [0, 8, 0] }}
            transition={{ duration: 6, repeat: Infinity }}
          />

          {/* Heading */}
          <h3 className="text-4xl font-extrabold tracking-tight mb-2 text-[#7B1F2E]">
            About <br /> Capital Store
          </h3>
          <motion.div
            className="h-[3px] bg-[#7B1F2E] mt-2 rounded-full"
            initial={{ width: 0 }}
            whileInView={{ width: "55%" }}
            transition={{ duration: 0.8 }}
          />

          {/* Founder Card */}
          <div className="mt-6 flex items-center gap-4">
            <img
              src="./harish-chander.jpeg" 
              alt="Harish Chander Makkar"
              className="w-30 h-32 object-cover rounded-full border-4 border-white shadow-lg"
            />
            <div>
              <h4 className="text-xl font-bold text-[#7B1F2E]">
                Harish Chander Makkar
              </h4>
              <p className="text-gray-600 text-sm">Founder & CEO</p>
            </div>
          </div>

          {/* Description */}
          <p className="mt-5 text-gray-700 text-sm leading-relaxed">
            <span className="font-semibold text-[#7B1F2E]">"Early Years"</span> <br />
            Capital Store began in the early 1900s when Late Shri Chanan Dass
            Makkar started selling fabric cut pieces at Ghass Mandi, Chaura Bazar,
            Ludhiana. Over the years, his son{" "}
            <strong>Harish Chander Makkar</strong> continued the legacy with
            hardwork, passion for fashion, customer trust, and style innovation.
            Today, Capital Store stands strong on this legacy.
          </p>

          <p className="mt-4 text-gray-700 text-sm leading-relaxed">
            <span className="font-semibold text-[#7B1F2E]">"Capital Store Promise"</span>
            <br />
            When you buy from Capital Store, you don’t just buy an outfit — you
            buy a piece of traditional craftsmanship, curated with love, precision,
            and quality. We believe in personal style, high fashion, ethical
            practices, premium quality, and a customer-friendly experience.
          </p>
        </motion.div>

        {/* RIGHT – VIDEO */}
        <motion.div
          className="w-full md:w-1/2 relative group md:mt-35"
          initial={{ opacity: 0, x: 25 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <motion.div
            className="absolute inset-0 rounded-3xl bg-gradient-to-br from-transparent via-white/30 to-transparent blur-2xl pointer-events-none"
            animate={{ rotate: [0, 6, 0] }}
            transition={{ duration: 10, repeat: Infinity }}
          />

       
          <motion.iframe
            whileHover={{ scale: 1.035 }}
            transition={{ duration: 0.4 }}
            className="w-full h-64 md:h-60 lg:h-72 rounded-2xl shadow-2xl border border-white/40"
            src="https://www.youtube.com/embed/12rN7hpbpIo?si=085YZoJzC1pIac9b"
            title="Brand Video"
            allowFullScreen
          />
        </motion.div>
      </motion.div>
    </section>
  );
}
