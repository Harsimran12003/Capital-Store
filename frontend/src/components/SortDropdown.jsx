import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiChevronDown } from "react-icons/fi";
import {
  FiArrowDown,
  FiArrowUp,
  FiClock,
  FiStar,
  FiTrendingUp,
  FiTrendingDown,
} from "react-icons/fi";

export default function SortDropdown({ setSort }) {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState("Sort By");

  const menuRef = useRef(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClick(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const options = [
    { value: "", label: "Sort By", icon: <FiStar className="text-[#4D192B]" /> },
    { value: "low-high", label: "Price: Low to High", icon: <FiArrowDown className="text-[#4D192B]" /> },
    { value: "high-low", label: "Price: High to Low", icon: <FiArrowUp className="text-[#4D192B]" /> },
    { value: "new", label: "New Arrivals", icon: <FiClock className="text-[#4D192B]" /> },
    { value: "above1000", label: "Above ₹1000", icon: <FiTrendingUp className="text-[#4D192B]" /> },
    { value: "below1000", label: "Below ₹1000", icon: <FiTrendingDown className="text-[#4D192B]" /> },
  ];

  const handleSelect = (opt) => {
    setSelected(opt.label);
    setSort(opt.value);
    setOpen(false);
  };

  return (
    <div className="relative" ref={menuRef}>
      {/* Trigger Button */}
      <button
        onClick={() => setOpen(!open)}
        className="
          w-56 px-4 py-2.5 text-sm font-medium
          bg-white/80 backdrop-blur-xl
          border border-[#e5c7cf]
          rounded-xl shadow-md hover:shadow-lg
          flex items-center justify-between
          transition-all cursor-pointer
        "
      >
        <span className="flex items-center gap-2">
          {options.find((o) => o.label === selected)?.icon}
          {selected}
        </span>

        <FiChevronDown
          className={`transition-all ${open ? "rotate-180" : ""}`}
        />
      </button>

      {/* Dropdown Menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.15 }}
            className="
              absolute right-0 mt-2 w-56 rounded-xl z-20
              bg-white border border-[#e5c7cf] shadow-xl
              overflow-hidden
            "
          >
            {options.map((opt) => {
              const isSelected = selected === opt.label;

              return (
                <button
                  key={opt.value}
                  onClick={() => handleSelect(opt)}
                  className={`
                    w-full text-left px-4 py-2.5 text-sm flex items-center gap-2
                    transition cursor-pointer
                    ${isSelected ? "bg-[#f8dce4] font-medium" : "hover:bg-[#fce8ee]"}
                  `}
                >
                  {opt.icon}
                  {opt.label}
                </button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
