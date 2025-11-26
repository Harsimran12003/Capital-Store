import React from "react";

export default function ProductCard({ p }) {
  return (
    <div className="border rounded-xl p-3 bg-white hover:shadow-lg transition">
      <div className="w-full h-48 bg-gray-200 rounded-lg flex items-center justify-center mb-2">
        Image
      </div>

      <h4 className="font-semibold text-sm">{p.name}</h4>
      <p className="text-xs text-gray-500 mt-1">{p.desc}</p>

      <div className="mt-3 flex justify-between">
        <div>
          <div className="font-semibold text-sm">₹{p.price}</div>
          <div className="line-through text-xs text-gray-400">₹{p.mrp}</div>
          <div className="text-xs text-green-600">{p.off}% off</div>
        </div>
        <div className="text-sm">⭐ {p.rating}</div>
      </div>
    </div>
  );
}
