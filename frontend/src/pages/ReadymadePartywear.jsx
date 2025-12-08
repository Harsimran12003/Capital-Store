import React, { useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ProductCard from "../components/ProductCard2";
import FilterSidebar from "../components/FilterSidebar";
import SortBar from "../components/SortBar";
import Breadcrumb from "../components/Breadcrumb";

const readymadepartywearProducts = [
  {
    id: 1,
    name: "Premium Cotton Kurti",
    img: "/cotton1.webp",
    price: 899,
    mrp: 1299,
    off: 30,
    rating: 4,
    new: true,
  },
  {
    id: 2,
    name: "Designer Cotton Suit",
    img: "/cotton2.webp",
    price: 1299,
    mrp: 1999,
    off: 35,
    rating: 5,
    new: false,
  },
  {
    id: 3,
    name: "Printed Cotton Set",
    img: "/cotton3.webp",
    price: 749,
    mrp: 999,
    off: 25,
    rating: 4,
    new: true,
  },
];

export default function ReadymadePartywearPage() {
  const [filters, setFilters] = useState({
    above1000: false,
    below1000: false,
    newArrival: false,
    discount: "",
    rating: "",
  });

  const [sort, setSort] = useState("");

  // FILTER LOGIC
  let filtered = readymadepartywearProducts.filter((p) => {
    if (filters.above1000 && p.price <= 1000) return false;
    if (filters.below1000 && p.price >= 1000) return false;
    if (filters.newArrival && !p.new) return false;
    if (filters.discount && p.off < filters.discount) return false;
    if (filters.rating && p.rating < filters.rating) return false;
    return true;
  });

  // SORTING LOGIC
  if (sort === "low-high") filtered.sort((a, b) => a.price - b.price);
  if (sort === "high-low") filtered.sort((a, b) => b.price - a.price);
  if (sort === "new") filtered = filtered.filter((p) => p.new);
  if (sort === "above1000") filtered = filtered.filter((p) => p.price > 1000);
  if (sort === "below1000") filtered = filtered.filter((p) => p.price < 1000);

  return (
    <>
      <Navbar />

      <div className="max-w-7xl mx-auto px-6 mt-45 mb-20">
        <Breadcrumb category="Winter"/>

        <h1 className="text-3xl font-bold mb-8">Readymade Party Wear</h1>

        <div className="flex gap-10">
          <FilterSidebar filters={filters} setFilters={setFilters} />

          <div className="flex-1">
            <SortBar setSort={setSort} />

            {/* Products Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
              {filtered.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}
