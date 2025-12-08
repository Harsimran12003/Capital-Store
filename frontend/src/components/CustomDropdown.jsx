import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiChevronDown } from "react-icons/fi";

export default function CustomDropdown({ label, value, options, onChange }) {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setOpen(!open)}
        className="
          w-full p-3 rounded-xl bg-white text-sm
          border border-[#e5c7cf]
          shadow-md hover:shadow-lg
          flex justify-between items-center
          transition-all
        "
      >
        <span>{value ? value : label}</span>
        <FiChevronDown
          className={`transition-all cursor-pointer ${open ? "rotate-180" : ""}`}
          size={18}
        />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.15 }}
            className="
              absolute left-0 w-full mt-2 rounded-xl z-20
              bg-white shadow-lg border border-[#e5c7cf]
              overflow-hidden
            "
          >
            {options.map((opt) => (
              <button
                key={opt.value}
                className="
                  w-full text-left p-3 text-sm
                  hover:bg-[#fce8ee]
                  transition cursor-pointer
                "
                onClick={() => {
                  onChange(opt.value);
                  setOpen(false);
                }}
              >
                {opt.label}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
