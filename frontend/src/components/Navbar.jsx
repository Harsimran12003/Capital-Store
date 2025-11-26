import React, { useState, useEffect } from "react";
import {
  FiHeart,
  FiShoppingCart,
  FiUser,
  FiMenu,
  FiX,
  FiSearch,
} from "react-icons/fi";
import PromoTicker from "./PromoTicker";

const WINE = "#6D0A1E";

export default function Navbar({ onOpenCart }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scroll, setScroll] = useState(false);
  const [searchFocus, setSearchFocus] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScroll(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navItems = [
    "Readymade",
    "Unstitched",
    "Cotton",
    "Winter",
    "Partywear",
    "Bestseller",
    "New Arrival",
  ];

  return (
    <>
      <header
        className={`fixed top-0 w-full z-[200] 
        transition-all duration-500
        ${scroll ? "backdrop-blur-2xl bg-white/95 shadow-xl h-[70px]" : "bg-white/70 h-[95px]"}`}
      >
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between h-full">
          
          {/* LOGO */}
          <h1
            className={`font-extrabold tracking-[6px] cursor-pointer uppercase transition-all duration-500 ${
              scroll ? "text-3xl" : "text-4xl"
            }`}
            style={{ color: WINE, fontFamily: "serif" }}
          >
            Capital Store
          </h1>

          {/* SEARCH BOX */}
          <div
            className={`hidden md:flex items-center rounded-full px-5 py-2 transition-all duration-300 shadow-inner
            ${searchFocus ? "w-96 bg-white border border-gray-300" : "w-72 bg-gray-100"}`}
          >
            <FiSearch className="text-gray-600 text-lg" />
            <input
              onFocus={() => setSearchFocus(true)}
              onBlur={() => setSearchFocus(false)}
              type="text"
              placeholder="Search your style..."
              className="bg-transparent w-full outline-none ml-3 text-sm"
            />
          </div>

          {/* ACTION ICONS */}
          <div className="flex items-center gap-6">
            <button className="relative hover:scale-110 transition group">
              <FiHeart className="text-2xl" />
              <span className="absolute -top-1 -right-2 text-[10px] bg-[#6D0A1E] text-white w-4 h-4 flex items-center justify-center rounded-full">3</span>
              <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-xs bg-black text-white px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 transition">Wishlist</span>
            </button>

            <button onClick={onOpenCart} className="relative hover:scale-110 transition group">
              <FiShoppingCart className="text-2xl" />
              <span className="absolute -top-1 -right-2 text-[10px] bg-green-600 text-white w-4 h-4 flex items-center justify-center rounded-full">2</span>
              <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-xs bg-black text-white px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 transition">Cart</span>
            </button>

            <button className="hover:scale-110 transition group">
              <FiUser className="text-2xl" />
              <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-xs bg-black text-white px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 transition">Account</span>
            </button>

            <button
              className="xl:hidden text-4xl transition hover:scale-110"
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              {mobileOpen ? <FiX /> : <FiMenu />}
            </button>
          </div>
        </div>

        {/* DESKTOP NAV MENU */}
        <nav className="hidden xl:flex items-center justify-center gap-10 mt-1 pb-3 font-medium text-[18px]">
          {navItems.map((item) => (
            <p
              key={item}
              className="relative cursor-pointer hover:text-[#6D0A1E] transition-all group"
            >
              {item}
              <span className="absolute w-0 h-[2px] bg-[#6D0A1E] left-0 -bottom-1 group-hover:w-full transition-all duration-500"></span>
            </p>
          ))}
        </nav>
      </header>

      {/* SCROLL GAP FOR TICKER */}
      <div className="mt-[50px]">
        <PromoTicker />
      </div>

      {/* MOBILE SIDEBAR */}
      <div
        className={`fixed top-0 right-0 w-[270px] h-full bg-white shadow-2xl p-6 z-[500] transition-transform duration-500 ${
          mobileOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <h2 className="text-xl font-bold mb-6" style={{ color: WINE }}>
          Menu
        </h2>
        {navItems.map((item) => (
          <p className="py-3 border-b cursor-pointer hover:text-[#6D0A1E]" key={item}>
            {item}
          </p>
        ))}
      </div>
    </>
  );
}
