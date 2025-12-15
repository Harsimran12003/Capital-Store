import React, { useState, useEffect } from "react";
import {
  FiHeart,
  FiShoppingCart,
  FiUser,
  FiMenu,
  FiX,
  FiSearch,
  FiTag,
  FiLogOut,
} from "react-icons/fi";
import PromoTicker from "./PromoTicker";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

const BRAND = "#4D192B";

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scroll, setScroll] = useState(false);
  const [focus, setFocus] = useState(false);
  const [mobileSearch, setMobileSearch] = useState(false);

  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScroll(window.scrollY > 15);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const navItems = [
    { name: "Readymade", to: "/readymade", icon: <FiTag /> },
    { name: "Unstitched", to: "/unstitched", icon: <FiTag /> },
    { name: "Cotton", to: "/cotton", icon: <FiTag /> },
    { name: "Winter", to: "/winter", icon: <FiTag /> },
    { name: "Partywear", to: "/partywear", icon: <FiTag /> },
    { name: "Bestseller", to: "/bestseller", icon: <FiTag /> },
    { name: "New Arrival", to: "/new-arrival", icon: <FiTag /> },
  ];

  return (
    <>
      {/* NAVBAR */}
      <header
        className={`fixed top-0 left-0 w-full z-[200] backdrop-blur-xl transition-all duration-500 ${
          scroll ? "bg-white/95 shadow-md" : "bg-white/70"
        }`}
      >
        {/* TOP NAV ROW */}
        <div
          className={`max-w-7xl mx-auto flex items-center justify-between px-4 sm:px-6 transition-all duration-500 ${
            scroll ? "py-2" : "py-3"
          }`}
        >
          {/* LOGO */}
          <Link to="/" className="flex-shrink-0">
            <img
              src="/logo.png"
              alt="Capital Store"
              className={`w-auto transition-all duration-500 ${
                scroll ? "h-[36px]" : "h-[44px]"
              }`}
            />
          </Link>

          {/* DESKTOP SEARCH */}
          <div className="hidden md:flex flex-1 justify-center px-4">
            <div
              className={`flex items-center gap-3 rounded-full border shadow-inner transition-all duration-300 ${
                focus
                  ? "w-[300px] lg:w-[360px] bg-white border-gray-300"
                  : "w-[250px] lg:w-[320px] bg-gray-100 border-transparent"
              } py-1.5`}
            >
              <FiSearch className="text-gray-500 text-lg ml-2" />
              <input
                placeholder="Search..."
                onFocus={() => setFocus(true)}
                onBlur={() => setFocus(false)}
                className="bg-transparent w-full outline-none text-sm"
              />
            </div>
          </div>

          {/* MOBILE ICONS */}
          <div className="flex items-center gap-4">
            {/* Search icon toggles mobile search */}
            <button
              className="md:hidden text-2xl text-gray-700"
              onClick={() => setMobileSearch(true)}
            >
              <FiSearch />
            </button>

            <Link to="/wishlist" className="relative">
              <FiHeart className="text-xl text-gray-800" />
              <span className="absolute -top-1 -right-2 bg-[#AF1238] text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center">
                3
              </span>
            </Link>

            <Link to="/cart" className="relative">
              <FiShoppingCart className="text-xl text-gray-800" />
              <span className="absolute -top-1 -right-2 bg-green-600 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center">
                2
              </span>
            </Link>
            <Link to="/login" className="relative md:hidden">
              <FiUser className="text-xl text-gray-800" />
            </Link>

            {/* Account (desktop only) */}
            <Link to="/login" className="hidden sm:block">
              <FiUser className="text-xl text-gray-800" />
            </Link>

            {/* MOBILE MENU BUTTON */}
            <button
              className="xl:hidden text-3xl"
              onClick={() => setMobileOpen(true)}
              aria-label="Open menu"
            >
              <FiMenu />
            </button>
          </div>
        </div>

        {/* DESKTOP NAV ROW */}
        <div className="hidden xl:block border-t border-gray-100">
          <nav className="max-w-7xl mx-auto px-6 flex items-center justify-center gap-10 text-[15px] font-medium text-gray-800 py-2.5">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.to}
                className="relative group tracking-wide"
              >
                <span className="group-hover:text-[#6D0A1E] transition-colors">
                  {item.name}
                </span>
                <span className="absolute left-0 -bottom-1 h-[2px] w-0 bg-[#6D0A1E] group-hover:w-full transition-all duration-500" />
              </Link>
            ))}
          </nav>
        </div>

        {/* MOBILE SEARCH DROPDOWN */}
        {mobileSearch && (
          <div className="md:hidden bg-white px-4 py-3 border-t shadow-md animate-slideDown flex items-center gap-3">
            <FiSearch className="text-gray-600 text-xl" />
            <input
              autoFocus
              placeholder="Search products..."
              className="w-full bg-transparent outline-none text-[15px]"
            />
            <button
              onClick={() => setMobileSearch(false)}
              className="text-2xl text-gray-600"
            >
              <FiX />
            </button>
          </div>
        )}
      </header>

      {/* SPACER BELOW NAVBAR */}
      <div className="h-[64px] md:h-[80px] xl:h-[110px]" />

      {/* PROMO TICKER UNDER NAV */}
      {location.pathname === "/" && <PromoTicker />}

      {/* MOBILE SIDEBAR MENU - STYLISH */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            {/* backdrop */}
            <motion.div
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[450]"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
            />

            <motion.aside
              className="fixed top-0 right-0 w-[320px] sm:w-[360px] h-full bg-gradient-to-b from-white/95 to-white/90 shadow-2xl p-6 z-[500] overflow-y-auto"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 260, damping: 30 }}
            >
              <div className="flex items-center justify-between mb-4">
                

                <button
                  onClick={() => setMobileOpen(false)}
                  className="p-2 rounded-full bg-white border shadow-sm text-gray-600"
                  aria-label="Close menu"
                >
                  <FiX />
                </button>
              </div>            

              <div className="mb-4">
                <div className="relative">
                  <FiSearch className="absolute left-3 top-3 text-gray-400" />
                  <input
                    placeholder="Search in store..."
                    className="w-full pl-10 pr-3 py-3 rounded-lg border border-[#f0e7df] bg-white text-sm outline-none shadow-sm"
                  />
                </div>
              </div>

              <nav className="mb-6">
                {navItems.map((item) => (
                  <Link
                    key={item.name}
                    to={item.to}
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center gap-3 py-3 px-2 rounded-lg hover:bg-[#fff6ea] transition-colors"
                  >
                    <span className="text-[#6D0A1E]">{item.icon}</span>
                    <span className="text-sm font-medium text-[#3b0b11]">
                      {item.name}
                    </span>
                  </Link>
                ))}
              </nav>              

                                 
              <div className="mt-6 text-sm text-gray-600 flex items-center justify-between">
                
                <button className="flex items-center gap-2 text-sm text-[#3b0b11]">
                  <FiLogOut /> Sign out
                </button>
              </div>

              <div className="mt-6 text-xs text-gray-400">
                
                <div className="mt-2">
                  © {new Date().getFullYear()} CapitalStore
                </div>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
