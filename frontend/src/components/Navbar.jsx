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
import { Link, useLocation } from "react-router-dom"; // ⬅️ LINK ADDED

const BRAND = "#4D192B";

export default function Navbar({ onOpenCart }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scroll, setScroll] = useState(false);
  const [focus, setFocus] = useState(false);

  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScroll(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // NAV ITEMS WITH ROUTES
  const navItems = [
    { name: "Readymade", to: "/readymade" },
    { name: "Unstitched", to: "/unstitched" },
    { name: "Cotton", to: "/cotton" },
    { name: "Winter", to: "/winter" },
    { name: "Partywear", to: "/partywear" },
    { name: "Bestseller", to: "/bestseller" },
    { name: "New Arrival", to: "/new-arrival" },
  ];

  return (
    <>
      {/* MAIN NAVBAR */}
      <header
        className={`fixed top-0 left-0 w-full z-[200] backdrop-blur-xl transition-all duration-500
        ${scroll ? "bg-white/95 shadow-[0_4px_15px_rgba(0,0,0,0.08)]" : "bg-white/80"}`}
      >
        <div
          className={`max-w-7xl mx-auto px-6 flex items-center justify-between transition-all duration-500
          ${scroll ? "py-0" : "py-4"}`}
        >
          {/* LOGO */}
          <Link to="/">
            <img
              src="/logo.png"
              alt="Capital Store"
              className={`cursor-pointer transition-all duration-500
              ${scroll ? "h-[52px]" : "h-[68px]"} w-auto`}
            />
          </Link>

          {/* SEARCH */}
          <div className="flex-1 flex justify-center px-4">
            <div
              className={`hidden md:flex items-center gap-3 rounded-full shadow-inner transition-all duration-300 border px-5
              ${
                focus
                  ? "w-[360px] bg-white border-gray-300"
                  : "w-[320px] bg-gray-100 border-transparent"
              }
              ${scroll ? "py-1.5" : "py-2.5"}`}
            >
              <FiSearch className="text-gray-600 text-lg" />
              <input
                onFocus={() => setFocus(true)}
                onBlur={() => setFocus(false)}
                placeholder="Search your style..."
                className="bg-transparent w-full outline-none text-sm"
              />
            </div>
          </div>

          {/* ICONS */}
<div
  className={`flex items-center gap-5 flex-shrink-0 transition-all duration-500
  ${scroll ? "scale-90" : "scale-100"}`}
>

  {/* ❤️ WISHLIST → /wishlist */}
  <Link to="/wishlist" className="relative group hover:scale-110 transition">
    <FiHeart className="text-2xl text-slate-800 group-hover:text-[#AF1238] transition" />
    <span className="absolute -top-1 -right-2 bg-[#AF1238] text-white text-[10px] w-4 h-4 flex items-center justify-center rounded-full">
      3
    </span>
  </Link>

  {/* 🛒 CART → /cart */}
  <Link
    to="/cart"
    className="relative group hover:scale-110 transition cursor-pointer"
  >
    <FiShoppingCart className="text-2xl text-slate-800 group-hover:text-green-700 transition" />
    <span className="absolute -top-1 -right-2 bg-green-600 text-white text-[10px] w-4 h-4 flex items-center justify-center rounded-full">
      2
    </span>
  </Link>

  {/* 👤 ACCOUNT → /account */}
  <Link to="/account" className="relative group hover:scale-110 transition">
    <FiUser className="text-2xl text-slate-800 group-hover:text-[#5C0E23] transition" />
  </Link>

  {/* 📱 MOBILE MENU */}
  <button
    className="xl:hidden text-3xl transition hover:scale-110"
    onClick={() => setMobileOpen((prev) => !prev)}
  >
    {mobileOpen ? <FiX /> : <FiMenu />}
  </button>
</div>

</div>
        {/* DESKTOP NAV */}
        <div
          className={`border-t border-gray-100 transition-all duration-500
          ${scroll ? "py-2" : "py-3"}`}
        >
          <nav className="hidden xl:flex max-w-7xl mx-auto px-6 items-center justify-center gap-10 text-[16px] font-medium text-slate-800">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.to}
                className="relative group tracking-wide"
              >
                <span className="group-hover:text-[#6D0A1E] transition-colors">
                  {item.name}
                </span>
                <span
                  className="absolute left-0 -bottom-1 h-[2px] w-0 bg-[#6D0A1E]
                  group-hover:w-full transition-all duration-500"
                />
              </Link>
            ))}
          </nav>
        </div>
      </header>

      <div className="mt-[50px]"></div>

      {/* SHOW TICKER ONLY ON HOMEPAGE */}
      {location.pathname === "/" && <PromoTicker />}

      {/* MOBILE SIDEBAR */}
      <div
        className={`fixed top-0 right-0 w-[280px] h-full bg-white shadow-2xl p-6 z-[300] transition-transform duration-500
        ${mobileOpen ? "translate-x-0" : "translate-x-full"}`}
      >
        <h2 className="text-xl font-bold mb-6" style={{ color: BRAND }}>
          Menu
        </h2>

        {navItems.map((item) => (
          <Link
            key={item.name}
            to={item.to}
            onClick={() => setMobileOpen(false)}
            className="block py-3 border-b cursor-pointer hover:text-[#6D0A1E] transition"
          >
            {item.name}
          </Link>
        ))}
      </div>
    </>
  );
}
