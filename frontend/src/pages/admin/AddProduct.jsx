import React, { useState } from "react";
import AdminLayout from "./AdminLayout";
import { FiUpload, FiSave, FiImage, FiVideo, FiPlus } from "react-icons/fi";
import { motion } from "framer-motion";

export default function AddProduct() {
  const [form, setForm] = useState({
    name: "",
    description: "",
    originalPrice: "",
    discountedPrice: "",
    category: "",
    subCategory: "",
  });

  const [stock, setStock] = useState({
    quantity: "",
    S: "",
    M: "",
    L: "",
    XL: "",
    XXL: "",
  });

  const [images, setImages] = useState(Array(5).fill(null));
  const [video, setVideo] = useState(null);

  /* ---------------- HANDLERS ---------------- */

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleImageChange = async (index, file) => {
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "capitalstore_unsigned");

    const res = await fetch(
      "https://api.cloudinary.com/v1_1/daffddkqb/image/upload",
      { method: "POST", body: formData }
    );

    const data = await res.json();
    const updated = [...images];
    updated[index] = data.secure_url;
    setImages(updated);
  };

  const handleVideoChange = async (file) => {
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "capitalstore_unsigned");

    const res = await fetch(
      "https://api.cloudinary.com/v1_1/daffddkqb/video/upload",
      { method: "POST", body: formData }
    );

    const data = await res.json();
    setVideo(data.secure_url);
  };

  const handleSave = async () => {
    if (!form.name || !form.category) {
      alert("Please fill required fields");
      return;
    }

    const payload = {
      ...form,
      originalPrice: Number(form.originalPrice),
      discountedPrice: Number(form.discountedPrice),
      images: images.filter(Boolean),
      video,
      stock:
        form.category === "Unstitched"
          ? { quantity: Number(stock.quantity) }
          : {
              S: Number(stock.S || 0),
              M: Number(stock.M || 0),
              L: Number(stock.L || 0),
              XL: Number(stock.XL || 0),
              XXL: Number(stock.XXL || 0),
            },
    };

    await fetch("https://capital-store-backend.vercel.app/api/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(payload),
    });

    alert("✅ Product added successfully");

    setForm({
      name: "",
      description: "",
      originalPrice: "",
      discountedPrice: "",
      category: "",
      subCategory: "",
    });

    setStock({
      quantity: "",
      S: "",
      M: "",
      L: "",
      XL: "",
      XXL: "",
    });

    setImages(Array(5).fill(null));
    setVideo(null);
  };

  /* ---------------- UI ---------------- */

  return (
    <AdminLayout>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Add New Product</h1>
          <p className="text-gray-500 mt-1 font-medium">Fill in the details to add a new product to your catalog.</p>
        </div>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-6 md:p-10 border border-gray-100"
      >
        <form className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* LEFT COLUMN - Form Fields */}
          <div className="lg:col-span-7 space-y-8">
            {/* Basic Info Section */}
            <div>
              <h2 className="text-lg font-bold text-gray-800 mb-5 border-b border-gray-100 pb-2">Basic Information</h2>
              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Product Name <span className="text-red-500">*</span></label>
                  <input
                    name="name"
                    value={form.name}
                    placeholder="Enter product name"
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-[#4D192B]/20 focus:border-[#4D192B] transition-all outline-none font-medium"
                    onChange={handleChange}
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Description</label>
                  <textarea
                    name="description"
                    value={form.description}
                    placeholder="Enter detailed description"
                    rows="5"
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-[#4D192B]/20 focus:border-[#4D192B] transition-all outline-none resize-none font-medium"
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>

            {/* Pricing Section */}
            <div>
              <h2 className="text-lg font-bold text-gray-800 mb-5 border-b border-gray-100 pb-2">Pricing Details</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Original Price (₹)</label>
                  <input
                    name="originalPrice"
                    value={form.originalPrice}
                    type="number"
                    placeholder="0.00"
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-[#4D192B]/20 focus:border-[#4D192B] transition-all outline-none font-medium"
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Discounted Price (₹)</label>
                  <input
                    name="discountedPrice"
                    value={form.discountedPrice}
                    type="number"
                    placeholder="0.00"
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-[#4D192B]/20 focus:border-[#4D192B] transition-all outline-none font-medium"
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>

            {/* Category & Stock Section */}
            <div>
              <h2 className="text-lg font-bold text-gray-800 mb-5 border-b border-gray-100 pb-2">Category & Inventory</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Category <span className="text-red-500">*</span></label>
                  <select
                    name="category"
                    value={form.category}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-[#4D192B]/20 focus:border-[#4D192B] transition-all outline-none font-medium"
                    onChange={handleChange}
                  >
                    <option value="">Select Category</option>
                    <option>Readymade</option>
                    <option>Unstitched</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Subcategory</label>
                  <select
                    name="subCategory"
                    value={form.subCategory}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-[#4D192B]/20 focus:border-[#4D192B] transition-all outline-none font-medium"
                    onChange={handleChange}
                  >
                    <option value="">Select Subcategory</option>
                    <option>Cotton</option>
                    <option>Winter</option>
                    <option>Partywear</option>
                  </select>
                </div>
              </div>

              {form.category === "Unstitched" && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="overflow-hidden">
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Total Stock Quantity</label>
                  <input
                    type="number"
                    value={stock.quantity}
                    placeholder="Enter total quantity available"
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-[#4D192B]/20 focus:border-[#4D192B] transition-all outline-none font-medium"
                    onChange={(e) => setStock({ ...stock, quantity: e.target.value })}
                  />
                </motion.div>
              )}

              {form.category === "Readymade" && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="overflow-hidden bg-gray-50/50 p-6 rounded-2xl border border-gray-100">
                  <label className="block text-sm font-bold text-gray-800 mb-4">Stock by Size</label>
                  <div className="grid grid-cols-5 gap-4">
                    {["S", "M", "L", "XL", "XXL"].map((size) => (
                      <div key={size} className="flex flex-col items-center">
                        <div className="w-11 h-11 bg-white border border-gray-200 rounded-xl flex items-center justify-center text-sm font-bold text-gray-700 mb-2 shadow-sm">
                          {size}
                        </div>
                        <input
                          type="number"
                          value={stock[size]}
                          placeholder="0"
                          className="w-full px-2 py-2.5 text-center bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#4D192B]/20 focus:border-[#4D192B] transition-all outline-none font-medium shadow-sm"
                          onChange={(e) => setStock({ ...stock, [size]: e.target.value })}
                        />
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </div>
          </div>

          {/* RIGHT COLUMN - Media Uploads */}
          <div className="lg:col-span-5 space-y-8">
            <div>
              <h2 className="text-lg font-bold text-gray-800 mb-5 border-b border-gray-100 pb-2">Product Media</h2>
              
              <div className="mb-2 flex justify-between items-end">
                <label className="block text-sm font-semibold text-gray-700">Product Images</label>
                <span className="text-xs text-gray-500 font-medium bg-gray-100 px-2 py-1 rounded-md">Up to 5 images</span>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {images.map((img, i) => (
                  <label
                    key={i}
                    className={`relative group flex flex-col items-center justify-center border-2 border-dashed rounded-2xl cursor-pointer overflow-hidden transition-all bg-gray-50 hover:bg-gray-100 ${
                      i === 0 ? "col-span-2 h-64" : "h-32"
                    } ${img ? "border-transparent shadow-md" : "border-gray-300 hover:border-[#4D192B]/50 hover:bg-[#4D192B]/5"}`}
                  >
                    {img ? (
                      <>
                        <img src={img} className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110" alt={`Upload ${i+1}`} />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center backdrop-blur-sm">
                          <span className="text-white text-xs font-bold tracking-wide bg-white/20 border border-white/40 px-4 py-2 rounded-full backdrop-blur-md shadow-lg">Change Image</span>
                        </div>
                      </>
                    ) : (
                      <div className="flex flex-col items-center text-gray-400 group-hover:text-[#4D192B] transition-colors duration-300">
                        {i === 0 ? <FiImage className="text-5xl mb-3 opacity-60" /> : <FiPlus className="text-2xl mb-2 opacity-60" />}
                        <span className="text-sm font-semibold">{i === 0 ? "Upload Main Image" : "Add Image"}</span>
                        {i === 0 && <span className="text-xs font-medium mt-1 text-gray-400">High-res recommended</span>}
                      </div>
                    )}
                    <input hidden type="file" accept="image/*" onChange={(e) => handleImageChange(i, e.target.files[0])} />
                  </label>
                ))}
              </div>
            </div>

            <div>
              <div className="mb-2 flex justify-between items-end">
                <label className="block text-sm font-semibold text-gray-700">Product Video</label>
                <span className="text-xs text-gray-500 font-medium bg-gray-100 px-2 py-1 rounded-md">Optional</span>
              </div>
              <label className="relative group h-48 border-2 border-dashed border-gray-300 hover:border-[#4D192B]/50 rounded-2xl flex flex-col items-center justify-center cursor-pointer overflow-hidden transition-all bg-gray-50 hover:bg-[#4D192B]/5">
                {video ? (
                  <>
                    <video src={video} controls className="h-full w-full object-cover bg-black" />
                    <div className="absolute top-3 right-3 bg-black/70 text-white text-xs font-semibold px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-md shadow-lg">
                      Change Video
                    </div>
                  </>
                ) : (
                  <div className="flex flex-col items-center text-gray-400 group-hover:text-[#4D192B] transition-colors duration-300">
                    <FiVideo className="text-5xl mb-3 opacity-60" />
                    <span className="text-sm font-semibold">Upload Product Video</span>
                    <span className="text-xs font-medium text-gray-400 mt-1">MP4, WebM or OGG (Max 20MB)</span>
                  </div>
                )}
                <input hidden type="file" accept="video/*" onChange={(e) => handleVideoChange(e.target.files[0])} />
              </label>
            </div>
          </div>
        </form>

        <div className="mt-10 pt-8 border-t border-gray-100 flex justify-end gap-4">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleSave}
            className="flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-[#4D192B] to-[#71233F] text-white font-bold rounded-xl shadow-[0_8px_20px_rgba(77,25,43,0.25)] hover:shadow-[0_10px_25px_rgba(77,25,43,0.35)] transition-all text-sm tracking-wide cursor-pointer"
          >
            <FiSave className="text-xl" /> Add Product
          </motion.button>
        </div>
      </motion.div>
    </AdminLayout>
  );
}
