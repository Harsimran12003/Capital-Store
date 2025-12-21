import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ProductCard from "../components/ProductCard2";
import FilterSidebar from "../components/FilterSidebar";
import SortBar from "../components/SortBar";
import Breadcrumb from "../components/Breadcrumb";

export default function NewArrivalPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [filters, setFilters] = useState({
    above1000: false,
    below1000: false,
    newArrival: false,
    discount: "",
    rating: "",
    maxPrice: 5000,
  });

  const [sort, setSort] = useState("");
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  /* ================= FETCH PRODUCTS ================= */
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch("https://capital-store-backend.vercel.app/api/products");
        const data = await res.json();
        setProducts(data);
      } catch (err) {
        console.error("Failed to load products", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  /* ================= FILTER LOGIC ================= */
  let filtered = products.filter((p) => {
    // Filter for new arrivals: created within last 20 days
    const createdDate = new Date(p.createdAt);
    const now = new Date();
    const daysDiff = (now - createdDate) / (1000 * 60 * 60 * 24);
    if (daysDiff > 20) return false;

    if (filters.above1000 && p.discountedPrice <= 1000) return false;
    if (filters.below1000 && p.discountedPrice >= 1000) return false;
    if (filters.newArrival && !p.isNew) return false;
    if (filters.discount && p.discountPercent < filters.discount) return false;
    if (filters.rating && p.rating < filters.rating) return false;
    if (filters.maxPrice && p.discountedPrice > filters.maxPrice) return false;
    return true;
  });

  /* ================= SORT LOGIC ================= */
  if (sort === "low-high")
    filtered.sort((a, b) => a.discountedPrice - b.discountedPrice);

  if (sort === "high-low")
    filtered.sort((a, b) => b.discountedPrice - a.discountedPrice);

  if (sort === "new")
    filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  return (
    <>
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 mt-5 mb-20">
        <Breadcrumb category="New Arrivals" />

        <h1 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8">
          New Arrivals
        </h1>

        {/* MOBILE FILTER + SORT */}
        <div className="sm:hidden mb-6 flex gap-3">
          <button
            onClick={() => setShowMobileFilters(true)}
            className="flex-1 py-2 bg-black text-white rounded-full text-sm"
          >
            Filters
          </button>
          <div className="flex-1">
            <SortBar setSort={setSort} mobile />
          </div>
        </div>

        <div className="flex gap-10">
          {/* DESKTOP FILTER */}
          <div className="hidden sm:block w-64">
            <FilterSidebar filters={filters} setFilters={setFilters} />
          </div>

          {/* PRODUCTS */}
          <div className="flex-1">
            <div className="hidden sm:block mb-6">
              <SortBar setSort={setSort} />
            </div>

            {loading ? (
              <p className="text-center text-gray-500 py-20">
                Loading products...
              </p>
            ) : filtered.length === 0 ? (
              <p className="text-center text-gray-400 py-20">
                No products found
              </p>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-10">
                {filtered.map((p) => (
                  <ProductCard key={p._id} product={p} />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* MOBILE FILTER PANEL */}
        {showMobileFilters && (
          <div className="fixed inset-0 bg-black/40 z-50 flex">
            <div className="w-[80%] bg-white h-full p-6 overflow-y-auto">
              <h2 className="text-xl font-semibold mb-4">Filters</h2>
              <FilterSidebar filters={filters} setFilters={setFilters} />
              <button
                onClick={() => setShowMobileFilters(false)}
                className="w-full mt-6 py-2 bg-black text-white rounded-full"
              >
                Apply Filters
              </button>
            </div>
            <div
              className="flex-1"
              onClick={() => setShowMobileFilters(false)}
            />
          </div>
        )}
      </div>

      <Footer />
    </>
  );
}
