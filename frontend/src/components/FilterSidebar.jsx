import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiChevronDown } from "react-icons/fi";
import CustomDropdown from "./CustomDropdown";

const BRAND = "#4D192B";

/** Collapsible Section */
function Section({ sectionId, title, open, setOpen, children }) {
  const isOpen = open[sectionId];

  return (
    <div className="mb-8">
      <button
        onClick={() => setOpen({ ...open, [sectionId]: !isOpen })}
        className="
          flex items-center justify-between w-full
          text-[15px] font-semibold tracking-wide
          pb-2 border-b border-[#d8b9c1]
          text-[#4D192B]
        "
      >
        {title}
        <FiChevronDown
          className={`transition-all ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25 }}
            className="pt-4 pl-1"
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function FilterSidebar({ filters, setFilters }) {
  const [open, setOpen] = useState({
    price: true,
    new: true,
    discount: true,
    rating: true,
  });

  const maxPrice = filters.maxPrice || 2000;

  const handleReset = () => {
    setFilters({
      below1000: false,
      above1000: false,
      newArrival: false,
      discount: "",
      rating: "",
      maxPrice: 2000,
    });
  };

  /** Elegant dropdown card design */
  const dropdownClass = `
  w-full p-3 text-sm rounded-xl
  bg-white border border-[#e5c7cf]
  shadow-md hover:shadow-lg
  transition-all cursor-pointer
  appearance-none
  pr-10
  outline-none
  focus:ring-2 focus:ring-[#4D192B]/40
  focus:border-[#4D192B] 
`;


  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="
        w-68 p-7 rounded-3xl shadow-2xl 
        bg-gradient-to-br from-white via-[#fff6f9] to-[#fbe8ee]
        border border-[#e9cfd6]
        backdrop-blur-xl
        sticky top-32 h-max 
      "
    >
      {/* Header */}
      <h2 className="text-xl font-bold mb-6 text-[#4D192B] tracking-wide">
        Filters
      </h2>

      {/* PRICE RANGE */}
      <Section sectionId="price" title="Price Range" open={open} setOpen={setOpen}>
        <div className="mb-4">
          <input
            type="range"
            min="100"
            max="5000"
            value={maxPrice}
            onChange={(e) =>
              setFilters({ ...filters, maxPrice: Number(e.target.value) })
            }
            className="w-full accent-[#4D192B] cursor-pointer"
          />
          <p className="text-sm text-gray-700 mt-1">
            Up to <span className="font-semibold">₹{maxPrice}</span>
          </p>
        </div>

        <label className="flex items-center gap-2 text-sm mb-2">
          <input
            type="checkbox"
            checked={filters.below1000}
            onChange={(e) =>
              setFilters({ ...filters, below1000: e.target.checked })
            }
            className="accent-[#4D192B]"
          />
          Below ₹1000
        </label>

        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={filters.above1000}
            onChange={(e) =>
              setFilters({ ...filters, above1000: e.target.checked })
            }
            className="accent-[#4D192B]"
          />
          Above ₹1000
        </label>
      </Section>

      
      {/* DISCOUNT DROPDOWN */}
      <Section sectionId="discount" title="Discounts" open={open} setOpen={setOpen}>
        <div className="relative">
          <CustomDropdown
  label="All Discounts"
  value={filters.discount}
  onChange={(val) => setFilters({ ...filters, discount: val })}
  options={[
    { value: "", label: "All Discounts" },
    { value: "10", label: "10% & above" },
    { value: "20", label: "20% & above" },
    { value: "30", label: "30% & above" },
    { value: "50", label: "50% & above" },
  ]}
/>

        </div>
      </Section>

      {/* RATINGS DROPDOWN */}
      <Section sectionId="rating" title="Ratings" open={open} setOpen={setOpen}>
        <div className="relative">
          <CustomDropdown
  label="All Ratings"
  value={filters.rating}
  onChange={(val) => setFilters({ ...filters, rating: val })}
  options={[
    { value: "", label: "All Ratings" },
    { value: "4", label: "4 ★ & above" },
    { value: "3", label: "3 ★ & above" },
  ]}
/>


        </div>
      </Section>

      {/* RESET BUTTON */}
      <button
        onClick={handleReset}
        className="
          w-full mt-4 py-3 text-center rounded-xl text-sm font-semibold
          bg-[#4D192B] text-white shadow-lg cursor-pointer
          hover:opacity-90 active:scale-[0.97] transition-all
        "
      >
        Reset Filters
      </button>
    </motion.div>
  );
}
