import React from "react";
import ProductCard from "./ProductCard";
import { motion } from "framer-motion";

const WINE = "#4D192B";

export default function BestsellerGrid({ items }) {
  return (
    <motion.section
      id="bestseller"
      className="max-w-7xl mx-auto px-4 mt-20 overflow-visible relative"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: "easeOut" }}
      viewport={{ once: true }}
    >
      {/* ===================== HEADING ===================== */}
      <div className="text-center relative w-fit mx-auto mb-3">
        <h3
          className="text-5xl font-bold tracking-wide"
          style={{ color: WINE }}
        >
          Bestsellers
        </h3>

        {/* ✨ Underline Sweep */}
        <motion.div
          className="absolute left-0 right-0 mx-auto bottom-[-6px] h-[3px] bg-[#4D192B]"
          initial={{ width: 0 }}
          whileInView={{ width: "100%" }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        />
      </div>

      {/* View All – centered */}
      <div className="text-center mt-1 mb-6">
        <a
          href="/products"
          className="text-sm text-gray-500 relative inline-block group"
        >
          View All
          <span
            className="
              absolute left-0 -bottom-1 h-[1px] w-0 bg-gray-600 
              transition-all duration-300 group-hover:w-full
            "
          />
        </a>
      </div>

      {/* ===================== GRID ===================== */}
      <motion.div
        className="grid grid-cols-2 sm:grid-cols-4 gap-6 mt-6 overflow-visible relative"
        initial="hidden"
        whileInView="visible"
        variants={{
          hidden: {},
          visible: { transition: { staggerChildren: 0.12 } },
        }}
        viewport={{ once: true }}
      >
        {items.map((p) => (
          <motion.div
            key={p.id}
            variants={{
              hidden: { opacity: 0, y: 30 },
              visible: {
                opacity: 1,
                y: 0,
                transition: { duration: 0.6, ease: "easeOut" },
              },
            }}
          >
            <ProductCard p={p} />
          </motion.div>
        ))}
      </motion.div>
    </motion.section>
  );
}
