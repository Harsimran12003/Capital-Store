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
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../context/AuthContext.jsx";
import InitialsBadge from "./InitialsBadge.jsx";
import Tooltip from "./Tooltip.jsx";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";

const BRAND = "#4D192B";

export default function Navbar() {
  const { cartCount } = useCart();
  const { wishlistCount } = useWishlist();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scroll, setScroll] = useState(false);
  const [focus, setFocus] = useState(false);
  const [mobileSearch, setMobileSearch] = useState(false);

  const location = useLocation();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [loginPrompt, setLoginPrompt] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [products, setProducts] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);


  useEffect(() => {
    const onScroll = () => setScroll(window.scrollY > 15);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch("https://capital-store-backend.vercel.app/api/products");
        const data = await res.json();
        setProducts(data);
      } catch (err) {
        console.error("Failed to fetch products", err);
      }
    };
    fetchProducts();
  }, []);

  const filteredProducts = products.filter((p) =>
    searchQuery &&
    (p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
     p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
     p.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
     (p.subCategory && p.subCategory.toLowerCase().includes(searchQuery.toLowerCase())))
  ).slice(0, 5); 

  const navItems = [
    { name: "Readymade", to: "/readymade", icon: <FiTag /> },
    { name: "Unstitched", to: "/unstitched", icon: <FiTag /> },
    { name: "Cotton", to: "/cotton", icon: <FiTag /> },
    { name: "Winter", to: "/winter", icon: <FiTag /> },
    { name: "Partywear", to: "/partywear", icon: <FiTag /> },
    { name: "Bestseller", to: "/bestseller", icon: <FiTag /> },
    { name: "New Arrival", to: "/new-arrival", icon: <FiTag /> },
  ];

  const mobileNavItems = [
    { name: "Readymade", to: "/readymade", icon: <FiTag /> },
    { name: "Unstitched", to: "/unstitched", icon: <FiTag /> },
    { name: "Cotton", to: "/cotton", icon: <FiTag /> },
    { name: "Winter", to: "/winter", icon: <FiTag /> },
    { name: "Partywear", to: "/partywear", icon: <FiTag /> },
    { name: "Bestseller", to: "/bestseller", icon: <FiTag /> },
    { name: "New Arrival", to: "/new-arrival", icon: <FiTag /> },
    { name: "Shipping Policy", to: "/shipping-policy", icon: <FiTag /> },
    { name: "Return & Exchange Policy", to: "/return-refund-policy", icon: <FiTag /> },
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
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setShowDropdown(e.target.value.length > 0);
                }}
                onFocus={() => setFocus(true)}
                className="bg-transparent w-full outline-none text-sm"
              />
            </div>
          </div>

          {/* SEARCH DROPDOWN */}
          {showDropdown && filteredProducts.length > 0 && (
            <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 w-[300px] lg:w-[360px] bg-white border border-gray-200 rounded-lg shadow-lg z-[300] max-h-80 overflow-y-auto">
              {filteredProducts.map((product) => (
                <Link
                  key={product._id}
                  to={`/product/${product._id}`}
                  className="flex items-center gap-3 p-3 hover:bg-gray-50 border-b border-gray-100 last:border-b-0"
                  onClick={() => {
                    setSearchQuery("");
                    setShowDropdown(false);
                  }}
                >
                  <img
                    src={product.images[0] || "/placeholder.png"}
                    alt={product.name}
                    className="w-10 h-10 rounded object-cover"
                  />
                  <div>
                    <p className="text-sm font-medium text-gray-900">{product.name}</p>
                    <p className="text-xs text-gray-500">₹{product.discountedPrice || product.originalPrice}</p>
                  </div>
                </Link>
              ))}
            </div>
          )}

          {/* MOBILE ICONS */}
          <div className="flex items-center gap-4">
            {/* Search icon toggles mobile search */}
            <button
              className="md:hidden text-2xl text-gray-700"
              onClick={() => setMobileSearch(true)}
            >
              <FiSearch />
            </button>

            <Tooltip text="Wishlist">
  <button
    onClick={() => {
      if (!user) {
        setLoginPrompt('wishlist');
      } else {
        navigate('/wishlist');
      }
    }}
    className="relative"
  >
    <FiHeart className="text-xl text-gray-800" />
    <span className="absolute -top-1 -right-2 bg-[#AF1238] text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center">
      {wishlistCount}
    </span>
  </button>
</Tooltip>

            <Tooltip text="Cart">
  <button
    onClick={() => {
      if (!user) {
        setLoginPrompt('cart');
      } else {
        navigate('/cart');
      }
    }}
    className="relative"
  >
    <FiShoppingCart className="text-xl text-gray-800" />
    <span className="absolute -top-1 -right-2 bg-green-600 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center">
      {cartCount}
    </span>
  </button>
</Tooltip>

            {/* ACCOUNT ICON – MOBILE */}
            <Link
  to={user ? "/profile" : "/login"}
  className="relative md:hidden"
>
  {user ? (
    <InitialsBadge name={user.name} size={34} />
  ) : (
    <FiUser className="text-xl text-gray-800" />
  )}
</Link>
            {/* ACCOUNT ICON – DESKTOP */}
            <Link
  to={user ? "/profile" : "/login"}
  className="hidden sm:block"
>
  {user ? (
    <InitialsBadge name={user.name} size={36} />
  ) : (
    <FiUser className="text-xl text-gray-800" />
  )}
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
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setShowDropdown(e.target.value.length > 0);
              }}
              className="w-full bg-transparent outline-none text-[15px]"
            />
            <button
              onClick={() => {
                setMobileSearch(false);
                setSearchQuery("");
                setShowDropdown(false);
              }}
              className="text-2xl text-gray-600"
            >
              <FiX />
            </button>
          </div>
        )}

        {/* MOBILE SEARCH RESULTS */}
        {mobileSearch && showDropdown && filteredProducts.length > 0 && (
          <div className="md:hidden bg-white border-t shadow-md max-h-60 overflow-y-auto">
            {filteredProducts.map((product) => (
              <Link
                key={product._id}
                to={`/product/${product._id}`}
                className="flex items-center gap-3 p-3 hover:bg-gray-50 border-b border-gray-100 last:border-b-0"
                onClick={() => {
                  setMobileSearch(false);
                  setSearchQuery("");
                  setShowDropdown(false);
                }}
              >
                <img
                  src={product.images[0] || "/placeholder.png"}
                  alt={product.name}
                  className="w-10 h-10 rounded object-cover"
                />
                <div>
                  <p className="text-sm font-medium text-gray-900">{product.name}</p>
                  <p className="text-xs text-gray-500">₹{product.discountedPrice || product.originalPrice}</p>
                </div>
              </Link>
            ))}
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
                  
                </div>
              </div>

              <nav className="mb-6">
                {mobileNavItems.map((item) => (
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
                
                {user && (
  <button
    onClick={logout}
    className="flex items-center gap-2 text-sm text-[#3b0b11]"
  >
    <FiLogOut /> Sign out
  </button>
)}
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

      {/* LOGIN PROMPT MODAL */}
      <AnimatePresence>
        {loginPrompt && (
          <motion.div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[1000] flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setLoginPrompt(null)}
          >
            <motion.div
              className="bg-white rounded-2xl p-6 m-4 max-w-sm w-full shadow-2xl"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-lg font-semibold text-[#3b0b11] mb-2">
                Login Required
              </h3>
              <p className="text-gray-600 text-sm mb-4">
                Please log in to access your {loginPrompt}.
              </p>
              <div className="flex gap-3">
                <Link
                  to="/login"
                  className="flex-1 bg-[#4D192B] text-white py-2 rounded-full text-center font-semibold"
                  onClick={() => setLoginPrompt(null)}
                >
                  Login
                </Link>
                <button
                  onClick={() => setLoginPrompt(null)}
                  className="flex-1 border border-gray-300 py-2 rounded-full text-gray-700"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
