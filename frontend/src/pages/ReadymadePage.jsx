import React from "react";
import { motion } from "framer-motion";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Link } from "react-router-dom";

const WINE = "#4D192B";

const readymadeCategories = [
  { id: 1, name: "Cotton Wear", img: "cotton.webp", link: "/readymade/cotton" },
  { id: 2, name: "Winter Wear", img: "winter.webp", link: "/readymade/winter" },
  { id: 3, name: "Party Wear", img: "partywear.webp", link: "/readymade/partywear" },
];

export default function ReadymadePage() {
  return (
    <>
      <Navbar />

      {/* ===================== PREMIUM SLIM HERO ===================== */}
      <section className="relative w-[1000px] h-[140px] mt-[150px] rounded-b-2xl overflow-hidden justify-center mx-auto shadow-xl">

        {/* Luxury gradient */}
        <motion.div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(135deg, #3C0F20, #6B2C3A 40%, #A66A7A 90%)",
            backgroundSize: "200% 200%",
          }}
          animate={{ backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }}
          transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
        />

        {/* Gloss shine */}
        <div className="absolute top-0 left-0 w-full h-20 bg-white/10 blur-xl" />

        {/* Floating glow */}
        <motion.div
          className="absolute left-1/2 -translate-x-1/2 top-10 w-[500px] h-[160px] rounded-full bg-white/20 blur-[100px]"
          animate={{ opacity: [0.3, 0.5, 0.3], scale: [1, 1.08, 1] }}
          transition={{ duration: 6, repeat: Infinity }}
        />

        {/* Content */}
        <div className="absolute inset-0 flex flex-col justify-center items-center text-center px-6">
          <motion.h1
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-white text-3xl font-extrabold tracking-wide"
          >
            Readymade Collection
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="text-gray-200 text-sm mt-2 max-w-xl leading-relaxed"
          >
            Discover modern elegance with premium stitched outfits.
          </motion.p>
        </div>
      </section>

      {/* ===================== CATEGORY SECTION ===================== */}
      <section className="max-w-6xl mx-auto px-6 mt-12 mb-24 relative">

        {/* Heading */}
        <div className="flex flex-col items-center mb-14">
          <h2 className="text-3xl font-bold tracking-wide" style={{ color: WINE }}>
            Choose Your Style
          </h2>
          <div className="mt-3 w-20 h-[3px] rounded-full" style={{ background: WINE }}></div>
          <div className="w-36 h-[20px] bg-[#4D192B]/20 blur-xl mt-2"></div>
        </div>

        {/* ===================== GRID ===================== */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-12">
          {readymadeCategories.map((cat, index) => (
            <Link key={cat.id} to={cat.link}>
              <motion.div
                className="relative overflow-hidden rounded-3xl shadow-xl cursor-pointer group bg-black/5"
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.75, delay: index * 0.2 }}
                viewport={{ once: true }}
                whileHover={{
                  scale: 1.06,
                  boxShadow: "0 18px 45px rgba(0,0,0,0.22)",
                }}
              >
                {/* CATEGORY IMAGE */}
                <motion.img
                  src={cat.img}
                  alt={cat.name}
                  className="w-full h-72 object-cover rounded-3xl"
                  whileHover={{ scale: 1.1 }}
                  transition={{ duration: 0.6 }}
                />

                {/* DARK OVERLAY */}
                <div className="absolute inset-0 bg-black/35 group-hover:bg-black/20 transition-all duration-500" />

                {/* CATEGORY NAME */}
                <div className="absolute bottom-6 w-full text-center">
                  <h3 className="text-white text-2xl font-bold drop-shadow-2xl">
                    {cat.name}
                  </h3>
                </div>

                {/* ===================== GOLD SLIDE REVEAL ===================== */}
                <motion.div
                  initial={{ x: 0 }}
                  whileInView={{ x: "110%" }}
                  transition={{
                    duration: 1.2,
                    ease: "easeInOut",
                    delay: index * 0.2,
                  }}
                  viewport={{ once: true }}
                  className="absolute top-0 left-0 w-full h-full z-20 pointer-events-none"
                  style={{
                    background:
                      "linear-gradient(90deg, #E4C58A 0%, #C99B5D 50%, #E4C58A 100%)",
                    backgroundSize: "200% 200%",
                    boxShadow: "0 0 35px rgba(0,0,0,0.25)",
                  }}
                />
              </motion.div>
            </Link>
          ))}
        </div>
      </section>

      <Footer />
    </>
  );
}
