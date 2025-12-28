import React, { useState } from "react";
import { NavLink, Link } from "react-router-dom";
import {
  FiImage,
  FiPlusSquare,
  FiBox,
  FiShoppingCart,
  FiLogOut,
  FiMenu,
  FiX,
} from "react-icons/fi";

export default function AdminSidebar() {
  const [open, setOpen] = useState(false);

  const [collapse, setCollapse] = useState(() => {
    const saved = localStorage.getItem("adminSidebarCollapse");
    return saved === "true";
  });

  const toggleCollapse = () => {
  setCollapse(prev => {
    const newState = !prev;
    localStorage.setItem("adminSidebarCollapse", newState);

    // 🔥 Notify layout instantly
    window.dispatchEvent(new CustomEvent("sidebar-collapse-change", {
      detail: newState,
    }));

    return newState;
  });
};


  const navLinkClass = ({ isActive }) =>
  `group relative flex items-center ${
    collapse ? "justify-center px-0" : "gap-4 px-5"
  } py-3 rounded-xl transition-all duration-300
   ${
     isActive
       ? "bg-white/15 text-white shadow-lg backdrop-blur-md"
       : "text-[#F5E9ED] hover:bg-white/10"
   }`;


  const iconClass = `
  p-2 rounded-lg bg-white/10 text-[#F5E9ED]
  group-hover:bg-white/20 shrink-0
  ${collapse ? "mx-auto" : ""}
`;


  return (
    <>
      {/* Mobile Top Bar */}
      <div className="md:hidden flex items-center justify-between px-4 py-3 bg-[#4D192B] text-[#F5E9ED] fixed top-0 left-0 right-0 z-50">
        <div className="flex items-center gap-2">
          <img src="/logo.png" alt="logo" className="h-8 w-8 object-contain" />
          <span className="font-semibold tracking-wider">Capital Admin</span>
        </div>
        <button onClick={() => setOpen(true)}>
          <FiMenu size={22} />
        </button>
      </div>

      {/* Overlay */}
      {open && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-50 h-screen
        bg-gradient-to-b from-[#4D192B] via-[#3F1424] to-[#2B0D18]
        transform transition-all duration-300
        ${open ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
        ${collapse ? "md:w-20 w-72" : "w-72"}
      `}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="px-6 py-7 border-b border-white/10 flex items-center gap-4">
            <div className="h-12 w-12 rounded-xl bg-white/15 flex items-center justify-center">
              <img
                src="/logo.png"
                alt="Capital Store"
                className="h-10 w-10 object-contain"
              />
            </div>

            {!collapse && (
              <div>
                <h2 className="text-lg font-semibold tracking-widest text-[#F5E9ED]">
                  CAPITAL STORE
                </h2>
                <p className="text-[11px] tracking-wider text-[#D8BFC7]">
                  ADMIN PANEL
                </p>
              </div>
            )}

            {/* Mobile close */}
            <button className="ml-auto md:hidden" onClick={() => setOpen(false)}>
              <FiX size={18} />
            </button>

            {/* Desktop collapse toggle */}
            <button
              className="hidden md:flex ml-auto text-[#F5E9ED] opacity-90 hover:opacity-100 transition cursor-pointer"
              onClick={toggleCollapse}
            >
              <FiMenu size={20} />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-8 space-y-3">
            <NavLink to="/admin/slider" className={navLinkClass}>
              <span className={iconClass}>
                <FiImage />
              </span>
              {!collapse && "Hero Slider"}

              {/* Tooltip */}
              {collapse && (
                <span className="absolute left-full ml-3 px-3 py-1 rounded-md bg-black text-white text-xs opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap">
                  Hero Slider
                </span>
              )}
            </NavLink>

            <NavLink to="/admin/add-product" className={navLinkClass}>
              <span className={iconClass}>
                <FiPlusSquare />
              </span>
              {!collapse && "Add Product"}

              {collapse && (
                <span className="absolute left-full ml-3 px-3 py-1 rounded-md bg-black text-white text-xs opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap">
                  Add Product
                </span>
              )}
            </NavLink>

            <NavLink to="/admin/products" className={navLinkClass}>
              <span className={iconClass}>
                <FiBox />
              </span>
              {!collapse && "Products"}

              {collapse && (
                <span className="absolute left-full ml-3 px-3 py-1 rounded-md bg-black text-white text-xs opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap">
                  Products
                </span>
              )}
            </NavLink>

            <NavLink to="/admin/orders" className={navLinkClass}>
              <span className={iconClass}>
                <FiShoppingCart />
              </span>
              {!collapse && "Orders"}

              {collapse && (
                <span className="absolute left-full ml-3 px-3 py-1 rounded-md bg-black text-white text-xs opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap">
                  Orders
                </span>
              )}
            </NavLink>
          </nav>

          {/* Footer */}
          <div className="px-5 py-6 border-t border-white/10">
            <Link
              to="/"
              className="group relative flex items-center gap-4 px-4 py-3 rounded-xl
               text-[#F5E9ED] w-full transition"
            >
              <span className="p-2 rounded-lg bg-white/15">
                <FiLogOut />
              </span>
              {!collapse && "Logout"}

              {collapse && (
                <span className="absolute left-full ml-3 px-3 py-1 rounded-md bg-black text-white text-xs opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap">
                  Logout
                </span>
              )}
            </Link>

            {!collapse && (
              <p className="text-[11px] text-[#D8BFC7] mt-4 text-center tracking-wide">
                © {new Date().getFullYear()} Capital Store
              </p>
            )}
          </div>
        </div>
      </aside>
    </>
  );
}
