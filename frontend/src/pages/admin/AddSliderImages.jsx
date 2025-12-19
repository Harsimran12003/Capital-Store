import React, { useState, useEffect } from "react";
import AdminLayout from "./AdminLayout";
import { FiUpload, FiSave } from "react-icons/fi";

export default function AddSliderImages() {
  const [sliders, setSliders] = useState(Array(6).fill(null));

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
  };

  /* ✅ SAVE SLIDES (NO HOOKS HERE) */
  const handleSave = async () => {
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
  };

  return (
    <AdminLayout>
      {/* PAGE HEADER */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">
          Hero Slider Images
        </h1>
        <p className="text-gray-500 mt-1">
          Upload or replace homepage hero slider images
        </p>
      </div>

      {/* SLIDER GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {sliders.map((img, index) => (
          <div
            key={index}
            className="bg-white rounded-2xl shadow-md border overflow-hidden"
          >
            {/* IMAGE PREVIEW */}
            <div className="h-44 bg-gray-100 flex items-center justify-center">
              {img ? (
                <img
                  src={img}
                  alt={`Slider ${index + 1}`}
                  className="h-full w-full object-cover"
                />
              ) : (
                <span className="text-gray-400 text-sm">
                  No image uploaded
                </span>
              )}
            </div>

            {/* CARD FOOTER */}
            <div className="p-4">
              <h3 className="font-semibold text-gray-700 mb-3">
                Slider Image {index + 1}
              </h3>

              <label className="flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium rounded-xl cursor-pointer
                bg-green-600 text-white hover:bg-green-700 transition">
                <FiUpload />
                {img ? "Replace Image" : "Upload Image"}
                <input
                  type="file"
                  accept="image/*"
                  hidden
                  onChange={(e) =>
                    handleImageChange(index, e.target.files[0])
                  }
                />
              </label>
            </div>
          </div>
        ))}
      </div>

      {/* SAVE BUTTON */}
      <div className="mt-10 flex justify-end">
        <button
          className="flex items-center gap-2 px-6 py-3 rounded-xl bg-green-600 text-white font-semibold
          hover:bg-green-700 transition shadow-md"
          onClick={handleSave}
        >
          <FiSave />
          Save Changes
        </button>
      </div>
    </AdminLayout>
  );
}
