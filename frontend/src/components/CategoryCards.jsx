import React from "react";
import { motion } from "framer-motion";

const WINE = "#4D192B";

const sampleCategories = [
  { id: 1, name: "Stitched", img: "/categories/stitched.jpg" },
  { id: 2, name: "Readymade", img: "/categories/readymade.jpg" },
];

// Floating Animation for card bobbing
const floatTransition = {
  repeat: Infinity,
  repeatType: "mirror",
  duration: 3,
  ease: "easeInOut",
};

// Blob shapes for morphing effect
const blobPaths = [
  "M421,305Q410,360,360,402Q310,444,246,453Q182,462,128,424Q74,386,62,323Q50,260,69,205Q88,150,139,114Q190,78,249,73Q308,68,360,103Q412,138,422,199Q432,260,421,305Z",
  "M413,311Q393,362,351,399Q309,436,252,445Q195,454,143,425Q91,396,66,344Q41,292,55,234Q69,176,116,139Q163,102,223,79Q283,56,332,94Q382,132,407,191Q432,250,413,311Z",
  "M399,303Q407,356,366,397Q325,438,267,442Q209,446,159,417Q109,388,80,339Q51,290,60,231Q69,172,113,133Q157,94,215,67Q273,40,330,74Q387,108,394,179Q401,250,399,303Z",
];

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

    {/* Underline Reveal */}
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
            {/* ✨ MORPHING BLOB BEHIND CARD ✨ */}
            <motion.svg
              viewBox="0 0 500 500"
              xmlns="http://www.w3.org/2000/svg"
              className="absolute -top-10 -left-10 w-[260px] h-[260px] -z-20 blur-2xl opacity-70"
            >
              <motion.path
                initial={false}
                animate={{
                  d: blobPaths,
                  fill: [
                    "rgba(255,180,180,0.40)",
                    "rgba(255,210,240,0.45)",
                    "rgba(255,170,200,0.40)",
                  ],
                }}
                transition={{
                  duration: 8,
                  repeat: Infinity,
                  repeatType: "mirror",
                  ease: "easeInOut",
                }}
              />
            </motion.svg>

            {/* FLOATING CARD */}
            {/* FLOATING CARD */}
<motion.div
  whileHover={{
    scale: 1.06,
    rotateZ: 0.6,
    transition: { type: "spring", stiffness: 240, damping: 15 }
  }}
  animate={{
    y: [-6, 6, -6]
  }}
  transition={floatTransition} // this controls floating animation
  className="relative rounded-3xl overflow-hidden shadow-xl shadow-black/20"
>
              {/* IMAGE */}
              <motion.img
                src={c.img}
                alt={c.name}
                className="w-full h-72 object-cover rounded-3xl"
                whileHover={{
                  scale: 1.12,
                  filter: "brightness(1.15) contrast(1.1)",
                }}
                transition={{ duration: 1 }}
              />

              {/* Inner Glow */}
              <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-all duration-500"></div>

              {/* Shine sweep */}
              <div className="absolute inset-0 overflow-hidden">
                <motion.div
                  className="
                    absolute top-0 left-[-120%] 
                    w-[200%] h-full
                    bg-gradient-to-r from-transparent via-white/40 to-transparent 
                    opacity-0 group-hover:opacity-100 rounded-3xl
                  "
                  animate={{ x: ["-120%", "140%"] }}
                  transition={{ duration: 1.4, ease: "easeOut" }}
                />
              </div>

              {/* Bottom fade */}
              <div className="
                absolute bottom-0 w-full h-20 
                bg-gradient-to-t from-black/60 to-transparent 
                backdrop-blur-sm
              "></div>

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
            </motion.div>
          </motion.div>
        ))}
      </div>
    </motion.section>
  );
}
