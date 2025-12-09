import React, { useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ProductCard from "../components/ProductCard2";
import FilterSidebar from "../components/FilterSidebar";
import SortBar from "../components/SortBar";
import Breadcrumb from "../components/Breadcrumb";

const unstitchedwinterProducts = [
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

export default function UnstitchedWinterPage() {
  const [filters, setFilters] = useState({
    above1000: false,
    below1000: false,
    newArrival: false,
    discount: "",
    rating: "",
  });

  const [sort, setSort] = useState("");
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  // Filtering Logic
  let filtered = unstitchedwinterProducts.filter((p) => {
    if (filters.above1000 && p.price <= 1000) return false;
    if (filters.below1000 && p.price >= 1000) return false;
    if (filters.newArrival && !p.new) return false;
    if (filters.discount && p.off < filters.discount) return false;
    if (filters.rating && p.rating < filters.rating) return false;
    return true;
  });

  // Sorting Logic
  if (sort === "low-high") filtered.sort((a, b) => a.price - b.price);
  if (sort === "high-low") filtered.sort((a, b) => b.price - a.price);
  if (sort === "new") filtered = filtered.filter((p) => p.new);
  if (sort === "above1000") filtered = filtered.filter((p) => p.price > 1000);
  if (sort === "below1000") filtered = filtered.filter((p) => p.price < 1000);

  return (
    <>
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 mt-5 mb-20">

        <Breadcrumb category="Unstitched Winter" />

        <h1 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8">
          Unstitched Winter Wear
        </h1>

        {/* ========= MOBILE FILTER + SORT BAR ========= */}
        <div className="sm:hidden mb-6 flex items-center justify-between gap-3">
          <button
            onClick={() => setShowMobileFilters(true)}
            className="
              flex-1 py-2 
              bg-black text-white rounded-full 
              text-sm shadow-md text-center
            "
          >
            Filters
          </button>

          <div className="flex-1">
            <SortBar setSort={setSort} mobile={true} />
          </div>
        </div>

        <div className="flex gap-10">

          {/* ========= DESKTOP SIDEBAR ========= */}
          <div className="hidden sm:block w-64 flex-shrink-0">
            <FilterSidebar filters={filters} setFilters={setFilters} />
          </div>

          {/* ========= PRODUCTS AREA ========= */}
          <div className="flex-1">

            {/* Desktop Sort */}
            <div className="hidden sm:block mb-6">
              <SortBar setSort={setSort} />
            </div>

            {/* Product Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-10">
              {filtered.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>

          </div>
        </div>

        {/* ========= MOBILE FILTER POPUP ========= */}
        {showMobileFilters && (
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex">

            <div className="w-[80%] sm:w-[45%] bg-white h-full p-6 pt-0 overflow-y-auto shadow-xl">
              <h2 className="text-xl font-semibold mb-4">Filters</h2>

              <FilterSidebar filters={filters} setFilters={setFilters} />

              <button
                onClick={() => setShowMobileFilters(false)}
                className="w-full mt-25 py-2 bg-black text-white rounded-full"
              >
                Apply Filters
              </button>
            </div>

            <div
              className="flex-1"
              onClick={() => setShowMobileFilters(false)}
            ></div>
          </div>
        )}

      </div>

      <Footer />
    </>
  );
}
