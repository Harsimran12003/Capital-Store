import React from "react";

const WINE = "#7B1F2E";

const sampleCategories = [
  { id: 1, name: "Stitched" },
  { id: 2, name: "Readymade" },
];

export default function CategoryCards() {
  return (
    <section className="max-w-7xl mx-auto px-4 mt-12">
      <h3 className="text-2xl font-semibold mb-4" style={{ color: WINE }}>
        Shop by Category
      </h3>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
        {sampleCategories.map((c) => (
          <a key={c.id} href={`/category/${c.name.toLowerCase()}`} className="border p-4 rounded-2xl hover:shadow-md">
            <div className="w-full h-32 bg-gray-100 rounded-lg flex items-center justify-center mb-3">
              Image
            </div>
            <div className="text-center font-medium">{c.name}</div>
          </a>
        ))}
      </div>
    </section>
  );
}
