import React, { useState, useEffect } from "react";
import AdminLayout from "./AdminLayout";
import { FiUpload, FiSave, FiImage, FiCheck } from "react-icons/fi";
import { motion } from "framer-motion";

export default function AddSliderImages() {
  const [sliders, setSliders] = useState(Array(6).fill(null));
  const [uploadingIndex, setUploadingIndex] = useState(null);
  const [saving, setSaving] = useState(false);

  /* ✅ FETCH EXISTING SLIDES ON PAGE LOAD */
  useEffect(() => {
    const fetchSlides = async () => {
      try {
        const res = await fetch("https://capital-store-backend.vercel.app/api/hero-slides");
        const data = await res.json();

        const filled = Array(6).fill(null);
        data.forEach((slide) => {
          filled[slide.order - 1] = slide.imageUrl;
        });

        setSliders(filled);
      } catch (err) {
        console.error("Failed to fetch hero slides", err);
      }
    };

    fetchSlides();
  }, []);

  /* ✅ CLOUDINARY IMAGE UPLOAD */
  const handleImageChange = async (index, file) => {
    if (!file) return;
    
    setUploadingIndex(index);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", "capitalstore_unsigned");

      const res = await fetch(
        "https://api.cloudinary.com/v1_1/daffddkqb/image/upload",
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await res.json();

      const updated = [...sliders];
      updated[index] = data.secure_url;
      setSliders(updated);
    } catch (err) {
      alert("Failed to upload image. Please try again.");
    } finally {
      setUploadingIndex(null);
    }
  };

  /* ✅ SAVE SLIDES */
  const handleSave = async () => {
    setSaving(true);
    try {
      const slides = sliders
        .filter(Boolean)
        .map((img, index) => ({
          imageUrl: img,
          order: index + 1,
        }));

      await fetch("https://capital-store-backend.vercel.app/api/hero-slides", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(slides),
      });

      alert("Hero slider updated successfully");
    } catch (err) {
      alert("Failed to save changes.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <AdminLayout>
      {/* PAGE HEADER + SAVE BUTTON */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-6">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Hero Slider Images</h1>
          <p className="text-gray-500 mt-1 font-medium">Manage the promotional banner images on your homepage.</p>
        </div>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleSave}
          disabled={saving}
          className="flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl bg-gradient-to-r from-[#4D192B] to-[#71233F] text-white font-bold shadow-[0_8px_20px_rgba(77,25,43,0.25)] hover:shadow-[0_10px_25px_rgba(77,25,43,0.35)] transition-all disabled:opacity-70 disabled:cursor-not-allowed tracking-wide w-full md:w-auto shrink-0"
        >
          {saving ? (
            <>
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <FiSave className="text-lg" /> Save Changes
            </>
          )}
        </motion.button>
      </div>

      {/* SLIDER GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {sliders.map((img, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="bg-white rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-200 overflow-hidden flex flex-col group hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all duration-300 relative"
          >
            {/* IMAGE PREVIEW */}
            <div className="h-56 bg-gray-50/80 border-b border-gray-200 relative group-hover:bg-gray-100 transition-colors">
              {img ? (
                <>
                  <img
                    src={img}
                    alt={`Slider ${index + 1}`}
                    className="h-full w-full object-cover"
                  />
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur px-3 py-1.5 rounded-lg shadow-sm border border-white/50 text-xs font-bold text-gray-800 flex items-center gap-1.5">
                    <FiCheck className="text-green-500" /> Uploaded
                  </div>
                </>
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-gray-400">
                  <FiImage className="text-4xl mb-3 text-gray-300" />
                  <span className="text-sm font-medium">No image provided</span>
                  <span className="text-xs text-gray-400 mt-1">Recommended: 1920x1080</span>
                </div>
              )}

              {/* UPLOADING OVERLAY */}
              {uploadingIndex === index && (
                <div className="absolute inset-0 bg-white/60 backdrop-blur-sm flex flex-col items-center justify-center z-10">
                   <div className="w-8 h-8 border-4 border-[#4D192B]/20 border-t-[#4D192B] rounded-full animate-spin mb-3"></div>
                   <p className="text-sm font-bold text-[#4D192B]">Uploading...</p>
                </div>
              )}
            </div>

            {/* CARD FOOTER */}
            <div className="p-6 flex-1 flex flex-col justify-between">
              <div className="mb-5 flex items-center gap-3">
                 <div className="h-8 w-8 rounded-lg bg-[#4D192B]/5 text-[#4D192B] font-extrabold flex items-center justify-center border border-[#4D192B]/10">
                    {index + 1}
                 </div>
                 <h3 className="font-extrabold text-gray-800">
                   Banner Position
                 </h3>
              </div>

              <label
                className={`relative flex items-center justify-center gap-2 px-4 py-3 text-sm font-bold rounded-xl cursor-pointer transition-all ${
                  img 
                  ? "bg-gray-50 text-gray-700 border border-gray-200 hover:bg-gray-100 hover:border-gray-300"
                  : "bg-[#4D192B]/5 text-[#4D192B] border border-[#4D192B]/10 hover:bg-[#4D192B]/10 hover:border-[#4D192B]/20"
                } ${uploadingIndex === index ? "pointer-events-none opacity-50" : ""}`}
              >
                <FiUpload className={img ? "text-gray-500" : "text-[#4D192B]"} />
                {img ? "Replace Image" : "Upload Image"}
                <input
                  type="file"
                  accept="image/*"
                  hidden
                  disabled={uploadingIndex === index}
                  onChange={(e) => handleImageChange(index, e.target.files[0])}
                />
              </label>
            </div>
          </motion.div>
        ))}
      </div>
    </AdminLayout>
  );
}
