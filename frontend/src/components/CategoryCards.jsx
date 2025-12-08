import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const WINE = "#4D192B";

const sampleCategories = [
  { id: 1, name: "Unstitched", img: "stitched.jpeg", link: "/unstitched" },
  { id: 2, name: "Readymade", img: "readymade.webp", link: "/readymade" },
];

// Static blob (no morph animation)
const staticBlob =
  "M421,305Q410,360,360,402Q310,444,246,453Q182,462,128,424Q74,386,62,323Q50,260,69,205Q88,150,139,114Q190,78,249,73Q308,68,360,103Q412,138,422,199Q432,260,421,305Z";

export default function CategoryCards() {
  return (
    <motion.section
      initial={{ opacity: 0, y: 40, scale: 0.98 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.9, ease: "easeOut" }}
      viewport={{ once: true }}
      className="relative max-w-5xl mx-auto px-4 mt-24 mb-20"
    >
      {/* HEADING */}
      <div className="flex justify-center">
        <motion.h3
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          viewport={{ once: true }}
          className="text-4xl font-bold mb-12 text-center tracking-wide relative"
          style={{ color: WINE }}
        >
          Shop by Category
          <motion.span
            initial={{ width: 0 }}
            whileInView={{ width: "100%" }}
            transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
            className="absolute left-1/2 -translate-x-1/2 -bottom-2 h-[3px]"
            style={{ backgroundColor: WINE }}
          />
        </motion.h3>
      </div>

      {/* GRID */}
      <div className="grid grid-cols-2 gap-12 relative">
        {sampleCategories.map((c, index) => (
          <motion.div
            key={c.id}
            initial={{ opacity: 0, scale: 0.85, y: 40 }}
            whileInView={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.7, delay: index * 0.2 }}
            viewport={{ once: true }}
            className="relative group cursor-pointer"
          >
            {/* Static Blob (no animation) */}
            <svg
              viewBox="0 0 500 500"
              xmlns="http://www.w3.org/2000/svg"
              className="absolute -top-10 -left-10 w-[260px] h-[260px] -z-20 blur-2xl opacity-70"
            >
              <path d={staticBlob} fill="rgba(255,180,180,0.40)" />
            </svg>

            {/* LINK WRAP */}
            <Link to={c.link} aria-label={`Shop ${c.name}`}>
              {/* CARD – No floating, no movement */}
              <div className="relative rounded-3xl overflow-hidden shadow-xl shadow-black/20 transform transition-transform duration-300 hover:-translate-y-2">
                {/* IMAGE */}
                <motion.img
                  src={c.img}
                  alt={c.name}
                  className="w-full h-78 object-cover rounded-3xl"
                  whileHover={{
                    scale: 1.08,
                    filter: "brightness(1.08)",
                  }}
                  transition={{ duration: 0.5 }}
                />

                {/* Inner Glow */}
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-all duration-500"></div>

                {/* Bottom fade */}
                <div className="absolute bottom-0 w-full h-15 bg-gradient-to-t from-black/60 to-transparent backdrop-blur-sm"></div>

                {/* TEXT */}
                <div className="absolute bottom-5 w-full text-center">
                  <span className="text-white font-bold tracking-wide text-xl drop-shadow-[2px_2px_8px_rgba(0,0,0,0.7)]">
                    {c.name}
                  </span>
                </div>

                {/* Glow Border */}
                <motion.div
                  className="absolute inset-0 rounded-3xl border-2 border-transparent"
                  whileHover={{ borderColor: "rgba(255,255,255,0.45)" }}
                />
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </motion.section>
  );
}
