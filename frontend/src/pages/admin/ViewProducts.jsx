import React, { useState, useEffect, useMemo } from "react";
import AdminLayout from "./AdminLayout";
import { FiEdit, FiTrash2, FiX, FiUpload, FiSearch, FiFilter, FiTag, FiStar, FiDollarSign, FiChevronDown, FiChevronUp, FiImage, FiVideo, FiPlus, FiSave } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";

export default function ViewProducts() {
  const [stock, setStock] = useState({});

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [expandedId, setExpandedId] = useState(null);
  const [zoomImage, setZoomImage] = useState(null);

  /* ================= EDIT STATES ================= */
  const [editOpen, setEditOpen] = useState(false);
  const [editProduct, setEditProduct] = useState(null);
  const [images, setImages] = useState([]);
  const [video, setVideo] = useState("");

  /* ================= FILTER STATES ================= */
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [subCategory, setSubCategory] = useState("");
  const [discount, setDiscount] = useState("");
  const [rating, setRating] = useState("");
  const [priceRange, setPriceRange] = useState("");

  /* ================= FETCH PRODUCTS ================= */
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch(
          "https://capital-store-backend.vercel.app/api/admin/products",
          { credentials: "include" },
        );
        const data = await res.json();
        setProducts(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  /* ================= FILTER LOGIC ================= */
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      if (search && !p.name.toLowerCase().includes(search.toLowerCase()))
        return false;
      if (category && p.category !== category) return false;
      if (subCategory && p.subCategory !== subCategory) return false;
      if (discount && p.discountPercent < Number(discount)) return false;
      if (rating && p.rating < Number(rating)) return false;

      if (priceRange) {
        const price =
          !p.discountedPrice ||
          p.discountedPrice === 0 ||
          p.discountedPrice === p.originalPrice
            ? p.originalPrice
            : p.discountedPrice;

        if (priceRange === "0-999" && !(price <= 999)) return false;
        if (priceRange === "1000-1999" && !(price >= 1000 && price <= 1999))
          return false;
        if (priceRange === "2000-4999" && !(price >= 2000 && price <= 4999))
          return false;
        if (priceRange === "5000+" && !(price >= 5000)) return false;
      }

      return true;
    });
  }, [products, search, category, subCategory, discount, rating, priceRange]);

  /* ================= DELETE ================= */
  const handleDelete = async (_id) => {
    if (!window.confirm("Delete this product?")) return;

    await fetch(
      `https://capital-store-backend.vercel.app/api/products/${_id}`,
      { method: "DELETE", credentials: "include" },
    );

    setProducts(products.filter((p) => p._id !== _id));
  };

  /* ================= OPEN EDIT ================= */
  const openEdit = (product) => {
    setEditProduct({ ...product });
    setImages(product.images || []);
    setVideo(product.video || "");

    if (product.category === "Unstitched") {
      setStock({
        quantity: product.stock?.quantity || 0,
      });
    } else {
      setStock({
        S: product.stock?.S || 0,
        M: product.stock?.M || 0,
        L: product.stock?.L || 0,
        XL: product.stock?.XL || 0,
        XXL: product.stock?.XXL || 0,
      });
    }

    setEditOpen(true);
  };

  /* ================= CLOUDINARY UPLOADS ================= */
  const uploadImage = async (file) => {
    const f = new FormData();
    f.append("file", file);
    f.append("upload_preset", "capitalstore_unsigned");

    const res = await fetch(
      "https://api.cloudinary.com/v1_1/daffddkqb/image/upload",
      { method: "POST", body: f },
    );

    const data = await res.json();
    return data.secure_url;
  };

  const uploadVideo = async (file) => {
    const f = new FormData();
    f.append("file", file);
    f.append("upload_preset", "capitalstore_unsigned");

    const res = await fetch(
      "https://api.cloudinary.com/v1_1/daffddkqb/video/upload",
      { method: "POST", body: f },
    );

    const data = await res.json();
    return data.secure_url;
  };

  /* ================= SAVE EDIT ================= */
  const handleSave = async () => {
    const payload = {
      ...editProduct,
      images,
      video,
      stock,
    };

    const res = await fetch(
      `https://capital-store-backend.vercel.app/api/products/${editProduct._id}`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(payload),
      },
    );

    const updated = await res.json();
    setProducts(products.map((p) => (p._id === updated._id ? updated : p)));
    setEditOpen(false);
  };

  return (
    <AdminLayout>
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Products</h1>
          <p className="text-gray-500 mt-1 font-medium">Manage and control your product listings seamlessly</p>
        </div>
      </div>

      {/* FILTER BAR */}
      <div className="bg-white p-4 rounded-[2rem] shadow-sm border border-gray-100 mb-8 grid grid-cols-6 gap-3">
        <div className="w-full relative group">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#4D192B] transition-colors" />
          <input
            placeholder="Search..."
            className="w-full pl-9 pr-3 py-2.5 bg-gray-50/50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-[#4D192B]/20 focus:border-[#4D192B] transition-all outline-none font-medium text-sm"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="w-full relative group">
          <select
            className="w-full pl-3 pr-8 py-2.5 bg-gray-50/50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-[#4D192B]/20 focus:border-[#4D192B] transition-all outline-none appearance-none font-medium text-gray-700 text-sm"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="">All Categories</option>
            <option>Readymade</option>
            <option>Unstitched</option>
          </select>
          <FiFilter className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none group-focus-within:text-[#4D192B] transition-colors" />
        </div>

        <div className="w-full relative group">
          <select
            className="w-full pl-3 pr-8 py-2.5 bg-gray-50/50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-[#4D192B]/20 focus:border-[#4D192B] transition-all outline-none appearance-none font-medium text-gray-700 text-sm"
            value={subCategory}
            onChange={(e) => setSubCategory(e.target.value)}
          >
            <option value="">All SubCategories</option>
            <option>Cotton</option>
            <option>Winter</option>
            <option>Partywear</option>
          </select>
          <FiTag className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none group-focus-within:text-[#4D192B] transition-colors" />
        </div>
        
        <div className="w-full relative group">
          <select
            className="w-full pl-3 pr-8 py-2.5 bg-gray-50/50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-[#4D192B]/20 focus:border-[#4D192B] transition-all outline-none appearance-none font-medium text-gray-700 text-sm"
            value={discount}
            onChange={(e) => setDiscount(e.target.value)}
          >
            <option value="">Min Discount</option>
            <option value="10">10%+</option>
            <option value="20">20%+</option>
            <option value="30">30%+</option>
            <option value="50">50%+</option>
          </select>
          <FiChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none group-focus-within:text-[#4D192B] transition-colors" />
        </div>

        <div className="w-full relative group">
          <select
            className="w-full pl-3 pr-8 py-2.5 bg-gray-50/50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-[#4D192B]/20 focus:border-[#4D192B] transition-all outline-none appearance-none font-medium text-gray-700 text-sm"
            value={rating}
            onChange={(e) => setRating(e.target.value)}
          >
            <option value="">Min Rating</option>
            <option value="1">⭐ 1+</option>
            <option value="2">⭐ 2+</option>
            <option value="3">⭐ 3+</option>
            <option value="4">⭐ 4+</option>
          </select>
          <FiStar className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none group-focus-within:text-[#4D192B] transition-colors" />
        </div>

        <div className="w-full relative group">
          <select
            className="w-full pl-3 pr-8 py-2.5 bg-gray-50/50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-[#4D192B]/20 focus:border-[#4D192B] transition-all outline-none appearance-none font-medium text-gray-700 text-sm"
            value={priceRange}
            onChange={(e) => setPriceRange(e.target.value)}
          >
            <option value="">Price Range</option>
            <option value="0-999">Below ₹1000</option>
            <option value="1000-1999">₹1000 - ₹1999</option>
            <option value="2000-4999">₹2000 - ₹4999</option>
            <option value="5000+">₹5000+</option>
          </select>
          <FiDollarSign className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none group-focus-within:text-[#4D192B] transition-colors" />
        </div>
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-100 text-gray-500 uppercase text-[11px] font-bold tracking-wider">
              <tr>
                <th className="px-8 py-5 text-left">Product</th>
                <th className="px-6 py-5 text-left">Category</th>
                <th className="px-6 py-5 text-left">Pricing</th>
                <th className="px-6 py-5 text-left">Rating</th>
                <th className="px-8 py-5 text-center">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr>
                   <td colSpan={5} className="py-20 text-center text-gray-400 font-medium">Loading products...</td>
                </tr>
              ) : filteredProducts.length === 0 ? (
                <tr>
                   <td colSpan={5} className="py-20 text-center text-gray-400 font-medium">No products found matching your filters.</td>
                </tr>
              ) : (
                filteredProducts.map((p) => (
                  <React.Fragment key={p._id}>
                    <tr className="hover:bg-gray-50/80 transition-colors group">
                      <td className="px-8 py-5">
                        <div className="flex gap-5 items-center">
                          <div 
                            className="relative h-14 w-14 rounded-xl overflow-hidden shadow-sm border border-gray-200 cursor-pointer group-hover:shadow-md transition-all shrink-0" 
                            onClick={() => setZoomImage(p.images?.[0])}
                          >
                             <img src={p.images?.[0]} className="h-full w-full object-cover" />
                             <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                <FiSearch className="text-white drop-shadow-md" />
                             </div>
                          </div>

                          <div>
                            <p className="font-bold text-gray-900 text-base mb-0.5 line-clamp-1">{p.name}</p>
                            <button
                              onClick={() => setExpandedId(expandedId === p._id ? null : p._id)}
                              className="text-xs font-semibold text-[#4D192B] flex items-center gap-1 hover:text-[#71233F] transition-colors mt-1"
                            >
                              {expandedId === p._id ? (
                                <>Hide Details <FiChevronUp /></>
                              ) : (
                                <>View Details <FiChevronDown /></>
                              )}
                            </button>
                          </div>
                        </div>
                      </td>

                      <td className="px-6 py-5">
                        <div className="font-bold text-gray-800">{p.category}</div>
                        <div className="text-xs text-gray-500 mt-1 bg-gray-100 w-fit px-2 py-0.5 rounded-md font-medium">{p.subCategory}</div>
                      </td>

                      <td className="px-6 py-5">
                         <div className="flex flex-col items-start gap-1">
                            {p.discountedPrice && p.discountedPrice < p.originalPrice ? (
                              <>
                                <div className="font-extrabold text-green-600 text-base">₹{p.discountedPrice}</div>
                                <div className="flex items-center gap-2 text-xs">
                                  <span className="text-gray-400 font-semibold line-through">₹{p.originalPrice}</span>
                                  {p.discountPercent > 0 && (
                                    <span className="bg-red-50 text-red-600 font-bold px-1.5 py-0.5 rounded text-[10px]">{p.discountPercent}% OFF</span>
                                  )}
                                </div>
                              </>
                            ) : (
                              <div className="font-extrabold text-gray-800 text-base">₹{p.originalPrice}</div>
                            )}
                         </div>
                      </td>

                      <td className="px-6 py-5">
                        <div className="flex items-center gap-1.5 bg-yellow-50 w-fit px-2 py-1 rounded-lg border border-yellow-100">
                          <FiStar className="text-yellow-500 fill-yellow-500" />
                          <span className="font-bold text-yellow-700">{p.rating || 0}</span>
                        </div>
                      </td>

                      <td className="px-8 py-5">
                        <div className="flex gap-2 justify-center">
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => openEdit(p)}
                            className="p-2.5 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-100 hover:text-blue-700 transition-colors shadow-sm"
                            title="Edit Product"
                          >
                            <FiEdit className="text-[15px]" />
                          </motion.button>

                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => handleDelete(p._id)}
                            className="p-2.5 bg-red-50 text-red-600 rounded-xl hover:bg-red-100 hover:text-red-700 transition-colors shadow-sm"
                            title="Delete Product"
                          >
                            <FiTrash2 className="text-[15px]" />
                          </motion.button>
                        </div>
                      </td>
                    </tr>

                    <AnimatePresence>
                      {expandedId === p._id && (
                        <tr>
                          <td colSpan={5} className="p-0 border-b-0">
                            <motion.div 
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: "auto", opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.3, ease: "easeInOut" }}
                              className="bg-gray-50/80 overflow-hidden border-t border-gray-100 shadow-inner"
                            >
                              <div className="px-8 py-8 grid grid-cols-1 lg:grid-cols-2 gap-10">
                                {/* Left side info */}
                                <div>
                                  <h4 className="font-bold text-gray-800 text-xs uppercase tracking-wider mb-3 flex items-center gap-2">
                                    <span className="w-2 h-2 rounded-full bg-[#4D192B]"></span> Inventory Status
                                  </h4>
                                  <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm mb-6">
                                    {p.category === "Unstitched" && (
                                      <div className="text-gray-700 text-sm">
                                        <span className="px-4 py-2 border border-gray-200 rounded-full bg-gray-50 font-medium shadow-sm inline-block">
                                          <span className="font-bold">{p.stock?.quantity ?? 0}</span> units available
                                        </span>
                                      </div>
                                    )}
                                    {p.category === "Readymade" && (
                                      <div className="flex flex-wrap gap-3 text-gray-700 text-sm">
                                        {["S", "M", "L", "XL", "XXL"].map((size) => (
                                          <span
                                            key={size}
                                            className="px-4 py-2 border border-gray-200 rounded-full bg-gray-50 font-medium shadow-sm"
                                          >
                                            {size}: <span className="font-bold">{p.stock?.[size] ?? 0}</span>
                                          </span>
                                        ))}
                                      </div>
                                    )}
                                  </div>

                                  <h4 className="font-bold text-gray-800 text-xs uppercase tracking-wider mb-3 flex items-center gap-2">
                                    <span className="w-2 h-2 rounded-full bg-[#4D192B]"></span> Description
                                  </h4>
                                  <p className="text-gray-600 text-sm leading-relaxed bg-white p-5 rounded-2xl border border-gray-100 shadow-sm whitespace-pre-wrap">{p.description || "No description provided."}</p>
                                </div>

                                {/* Right side media */}
                                <div>
                                  <h4 className="font-bold text-gray-800 text-xs uppercase tracking-wider mb-3 flex items-center gap-2">
                                    <span className="w-2 h-2 rounded-full bg-[#4D192B]"></span> Product Media
                                  </h4>
                                  <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm grid grid-cols-2 sm:grid-cols-4 gap-4">
                                    {p.images?.map((img, i) => (
                                      <div key={i} className="relative group rounded-xl overflow-hidden border border-gray-100 aspect-square cursor-pointer shadow-sm" onClick={() => setZoomImage(img)}>
                                        <img src={img} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                                        <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[2px]">
                                          <FiSearch className="text-white text-xl drop-shadow-md" />
                                        </div>
                                      </div>
                                    ))}
                                    {p.video && (
                                      <div className="col-span-2 sm:col-span-4 mt-2">
                                        <video src={p.video} controls className="w-full rounded-xl border border-gray-100 aspect-video bg-black shadow-sm" />
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </motion.div>
                          </td>
                        </tr>
                      )}
                    </AnimatePresence>
                  </React.Fragment>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ================= IMAGE ZOOM ================= */}
      <AnimatePresence>
        {zoomImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm flex justify-center items-center z-[5000]"
            onClick={() => setZoomImage(null)}
          >
            <motion.img
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              src={zoomImage}
              className="max-h-[90vh] max-w-[90vw] rounded-2xl shadow-2xl border border-white/10 cursor-zoom-out"
              onClick={(e) => e.stopPropagation()}
            />
            <button className="absolute top-6 right-6 text-white hover:text-gray-300 bg-black/50 p-3 rounded-full backdrop-blur-md transition-colors" onClick={() => setZoomImage(null)}>
               <FiX className="text-2xl" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ================= EDIT MODAL ================= */}
      <AnimatePresence>
        {editOpen && (
          <div className="fixed inset-0 flex justify-center items-center z-[4000] p-4">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }} 
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => setEditOpen(false)}
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white w-full max-w-5xl rounded-[2rem] shadow-2xl p-6 md:p-10 max-h-[90vh] overflow-y-auto relative z-10 border border-gray-100"
            >
              <div className="flex justify-between items-center mb-8 pb-4 border-b border-gray-100">
                <h2 className="text-2xl font-extrabold text-gray-900 tracking-tight">Edit Product</h2>
                <button
                  onClick={() => setEditOpen(false)}
                  className="p-2.5 bg-gray-100 text-gray-600 rounded-full cursor-pointer hover:bg-gray-200 hover:text-gray-900 transition-colors"
                >
                  <FiX className="text-lg" />
                </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                {/* Left Side Inputs */}
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Product Name</label>
                    <input
                      value={editProduct.name}
                      onChange={(e) => setEditProduct({ ...editProduct, name: e.target.value })}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-[#4D192B]/20 focus:border-[#4D192B] transition-all outline-none font-medium"
                      placeholder="Product Name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Description</label>
                    <textarea
                      rows={4}
                      value={editProduct.description}
                      onChange={(e) => setEditProduct({ ...editProduct, description: e.target.value })}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-[#4D192B]/20 focus:border-[#4D192B] transition-all outline-none resize-none font-medium"
                      placeholder="Description"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1.5">Original Price</label>
                      <input
                        type="number"
                        value={editProduct.originalPrice}
                        onChange={(e) => setEditProduct({ ...editProduct, originalPrice: e.target.value })}
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-[#4D192B]/20 focus:border-[#4D192B] transition-all outline-none font-medium"
                        placeholder="₹0.00"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1.5">Discounted Price</label>
                      <input
                        type="number"
                        value={editProduct.discountedPrice}
                        onChange={(e) => setEditProduct({ ...editProduct, discountedPrice: e.target.value })}
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-[#4D192B]/20 focus:border-[#4D192B] transition-all outline-none font-medium"
                        placeholder="₹0.00"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1.5">Category</label>
                      <select
                        value={editProduct.category}
                        onChange={(e) => setEditProduct({ ...editProduct, category: e.target.value })}
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-[#4D192B]/20 focus:border-[#4D192B] transition-all outline-none font-medium appearance-none"
                      >
                        <option>Readymade</option>
                        <option>Unstitched</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1.5">Subcategory</label>
                      <select
                        value={editProduct.subCategory}
                        onChange={(e) => setEditProduct({ ...editProduct, subCategory: e.target.value })}
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-[#4D192B]/20 focus:border-[#4D192B] transition-all outline-none font-medium appearance-none"
                      >
                        <option>Cotton</option>
                        <option>Winter</option>
                        <option>Partywear</option>
                      </select>
                    </div>
                  </div>

                  {/* ================= STOCK ================= */}
                  <div className="bg-gray-50/80 p-5 rounded-2xl border border-gray-200">
                    <label className="block text-sm font-bold text-gray-800 mb-3">Inventory Stock</label>

                    {/* UNSTITCHED */}
                    {editProduct.category === "Unstitched" && (
                      <input
                        type="number"
                        min="0"
                        className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#4D192B]/20 focus:border-[#4D192B] transition-all outline-none font-medium"
                        placeholder="Total Quantity"
                        value={stock.quantity}
                        onChange={(e) => setStock({ quantity: Number(e.target.value) })}
                      />
                    )}

                    {/* READYMADE */}
                    {editProduct.category === "Readymade" && (
                      <div className="grid grid-cols-5 gap-3">
                        {["S", "M", "L", "XL", "XXL"].map((size) => (
                          <div key={size} className="flex flex-col items-center">
                            <span className="text-xs font-bold text-gray-600 mb-1.5">{size}</span>
                            <input
                              type="number"
                              min="0"
                              className="w-full px-2 py-2.5 bg-white text-center border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#4D192B]/20 focus:border-[#4D192B] transition-all outline-none font-medium shadow-sm"
                              placeholder="0"
                              value={stock[size]}
                              onChange={(e) => setStock({ ...stock, [size]: Number(e.target.value) })}
                            />
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Right Side Media */}
                <div className="space-y-6">
                  <div>
                    <div className="mb-2 flex justify-between items-end">
                      <label className="block text-sm font-semibold text-gray-700">Product Images</label>
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                      {images.map((img, i) => (
                        <div key={i} className="relative group rounded-xl overflow-hidden aspect-square border border-gray-200 shadow-sm">
                          <img src={img} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110" />
                          <button
                            onClick={() => setImages(images.filter((_, idx) => idx !== i))}
                            className="absolute top-2 right-2 bg-red-500/90 text-white p-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600 shadow-sm"
                            title="Remove Image"
                          >
                            <FiX className="text-sm" />
                          </button>
                        </div>
                      ))}

                      <label className="border-2 border-dashed border-gray-300 hover:border-[#4D192B]/50 rounded-xl flex flex-col justify-center items-center cursor-pointer aspect-square bg-gray-50 hover:bg-[#4D192B]/5 transition-all text-gray-400 hover:text-[#4D192B]">
                        <FiPlus className="text-2xl mb-1" />
                        <span className="text-xs font-semibold">Add Image</span>
                        <input
                          type="file"
                          hidden
                          accept="image/*"
                          onChange={async (e) => {
                            const url = await uploadImage(e.target.files[0]);
                            setImages([...images, url]);
                          }}
                        />
                      </label>
                    </div>
                  </div>

                  <div>
                    <div className="mb-2 flex justify-between items-end">
                      <label className="block text-sm font-semibold text-gray-700">Product Video</label>
                    </div>

                    <label className="relative border-2 border-dashed border-gray-300 hover:border-[#4D192B]/50 rounded-xl flex flex-col justify-center items-center cursor-pointer h-40 bg-gray-50 hover:bg-[#4D192B]/5 transition-all overflow-hidden group">
                      {video ? (
                        <>
                          <video src={video} controls className="h-full w-full object-cover bg-black" />
                          <div className="absolute top-2 right-2 bg-black/70 text-white text-xs font-semibold px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-md shadow-lg">
                            Change Video
                          </div>
                        </>
                      ) : (
                        <div className="flex flex-col items-center text-gray-400 group-hover:text-[#4D192B] transition-colors">
                          <FiVideo className="text-3xl mb-2 opacity-60" />
                          <span className="text-sm font-semibold">Upload New Video</span>
                        </div>
                      )}

                      <input
                        type="file"
                        hidden
                        accept="video/*"
                        onChange={async (e) => {
                          const url = await uploadVideo(e.target.files[0]);
                          setVideo(url);
                        }}
                      />
                    </label>
                  </div>
                </div>
              </div>

              <div className="mt-10 pt-6 border-t border-gray-100 flex justify-end">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleSave}
                  className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-[#4D192B] to-[#71233F] text-white font-bold shadow-[0_8px_20px_rgba(77,25,43,0.25)] hover:shadow-[0_10px_25px_rgba(77,25,43,0.35)] transition-all flex items-center gap-2 tracking-wide"
                >
                  <FiSave className="text-lg" /> Save Changes
                </motion.button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </AdminLayout>
  );
}
