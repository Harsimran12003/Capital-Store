import React, { useState , useEffect } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ProductCard from "../components/ProductCard2";
import FilterSidebar from "../components/FilterSidebar";
import SortBar from "../components/SortBar";
import Breadcrumb from "../components/Breadcrumb";



export default function CottonPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
  const fetchCottonProducts = async () => {
    try {
      const res = await fetch(
        "http://localhost:5000/api/products?subCategory=Cotton"
      );
      const data = await res.json();
      setProducts(data);
    } catch (err) {
      console.error("Failed to fetch cotton products", err);
    } finally {
      setLoading(false);
    }
  };

  fetchCottonProducts();
}, []);

  const [filters, setFilters] = useState({
    above1000: false,
    below1000: false,
    newArrival: false,
    discount: "",
    rating: "",
  });

  const [sort, setSort] = useState("");
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  const isNew = (date) => {
  const diffDays =
    (new Date() - new Date(date)) / (1000 * 60 * 60 * 24);
  return diffDays <= 20; // new if added in last 7 days
};


  // FILTER LOGIC
  let filtered = products.filter((p) => {
  if (filters.maxPrice && p.discountedPrice > filters.maxPrice) return false;
  if (filters.above1000 && p.discountedPrice <= 1000) return false;
  if (filters.below1000 && p.discountedPrice >= 1000) return false;
  if (filters.newArrival && !isNew(p.createdAt)) return false;
  if (filters.discount && p.discountPercent < Number(filters.discount)) return false;
  if (filters.rating && p.rating < Number(filters.rating)) return false;
  return true;
});


  // SORTING LOGIC
  if (sort === "low-high")
  filtered.sort((a, b) => a.discountedPrice - b.discountedPrice);

  if (sort === "high-low")
    filtered.sort((a, b) => b.discountedPrice - a.discountedPrice);

  if (sort === "new")
    filtered = filtered.filter((p) => isNew(p.createdAt));

  if (sort === "above1000")
    filtered = filtered.filter((p) => p.discountedPrice > 1000);

  if (sort === "below1000")
    filtered = filtered.filter((p) => p.discountedPrice < 1000);


  return (
    <>
      <Navbar />

      {/* MAIN WRAPPER */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 mt-5 mb-20">

        <Breadcrumb category="Cotton" />

        <h1 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8">
          Cotton Wear
        </h1>

        {/* MOBILE FILTER + SORT ROW */}
<div className="sm:hidden mb-6 flex items-center justify-between gap-3">

  {/* FILTER BUTTON */}
  <button
    onClick={() => setShowMobileFilters(true)}
    className="
      flex-1 py-2 
      bg-black text-white rounded-full 
      text-sm shadow-md 
      text-center
    "
  >
    Filters
  </button>

  {/* SORT DROPDOWN */}
  <div className="flex-1">
    <SortBar setSort={setSort} mobile={true} />
  </div>

</div>
        <div className="flex gap-10">

          {/* DESKTOP SIDEBAR */}
          <div className="hidden sm:block w-64 flex-shrink-0">
            <FilterSidebar filters={filters} setFilters={setFilters} />
          </div>

          {/* RIGHT SIDE — SORT + PRODUCTS */}
          <div className="flex-1">

            {/* SORTBAR DESKTOP */}
            <div className="hidden sm:block mb-6">
              <SortBar setSort={setSort} />
            </div>

            {loading && (
  <p className="text-center text-gray-500">Loading products...</p>
)}

{!loading && filtered.length === 0 && (
  <p className="text-center text-gray-500">
    No cotton products found.
  </p>
)}

            {/* ========================= PRODUCTS GRID ========================= */}
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-10 ">
              {filtered.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        </div>

        {/* ========================= MOBILE FILTER POPUP ========================= */}
        {showMobileFilters && (
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex">
            
            {/* Sidebar panel */}
            <div className="w-[80%] sm:w-[45%] bg-white h-full p-6 pt-0  overflow-y-auto shadow-xl">
              <h2 className="text-xl font-semibold mb-4">Filters</h2>

              <FilterSidebar filters={filters} setFilters={setFilters} />

              <button
                onClick={() => setShowMobileFilters(false)}
                className="w-full mt-25 py-2 bg-black text-white rounded-full"
              >
                Apply Filters
              </button>
            </div>

            {/* Click outside to close */}
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
