import React from "react";
import ProductCard from "./ProductCard2";

const WINE = "#4D192B";

export default function BestsellerGrid({ items = [] }) {
  if (!items.length) return null;

  return (
    <section className="relative max-w-7xl mx-auto px-4 mt-24 mb-28">
      {/* HEADING */}
      <div className="text-center mb-12">
        <h3
          className="text-4xl md:text-5xl font-bold tracking-wide"
          style={{ color: WINE }}
        >
          Our Bestsellers
        </h3>
        <div className="mt-3 h-[2px] w-20 mx-auto bg-[#4D192B]/40 rounded-full" />
      </div>

      {/* GRID */}
      <div
        className="
          grid
          grid-cols-1
          sm:grid-cols-2
          md:grid-cols-3
          lg:grid-cols-4
          gap-8
          place-items-center
        "
      >
        {items.map((p, i) => (
          <div
            key={`${p._id}-${i}`}
            className="w-full max-w-[280px]"
          >
            <div className="rounded-2xl shadow-[0_22px_55px_-18px_rgba(0,0,0,0.28)] transition-shadow duration-700 hover:shadow-[0_28px_70px_-20px_rgba(0,0,0,0.35)]">
              <ProductCard product={p} />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
