import React from "react";
import ProductCard from "./ProductCard";

const WINE = "#7B1F2E";

export default function BestsellerGrid({ items }) {
  return (
    <section id="bestseller" className="max-w-7xl mx-auto px-4 mt-14">
      <div className="flex justify-between">
        <h3 className="text-2xl font-semibold" style={{ color: WINE }}>
          Bestsellers
        </h3>
        <a href="/products" className="text-sm text-gray-500">View All</a>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 mt-6">
        {items.map((p) => (
          <ProductCard key={p.id} p={p} />
        ))}
      </div>
    </section>
  );
}
