import React, { useState } from "react";
import AdminLayout from "./AdminLayout";
import { FiUpload, FiSave } from "react-icons/fi";

export default function AddProduct() {
  const [form, setForm] = useState({
  name: "",
  description: "",
  originalPrice: "",
  discountedPrice: "",
  category: "",
  subCategory: "",
});


const handleChange = (e) => {
  setForm({ ...form, [e.target.name]: e.target.value });
};

  const [images, setImages] = useState(Array(5).fill(null));
  const [video, setVideo] = useState(null);

  const handleImageChange = async (index, file) => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append(
    "upload_preset",
    "capitalstore_unsigned"
  );

  const res = await fetch(
    `https://api.cloudinary.com/v1_1/daffddkqb/image/upload`,
    { method: "POST", body: formData }
  );

  const data = await res.json();

  const updated = [...images];
  updated[index] = data.secure_url; 
  setImages(updated);
};

  const handleVideoChange = async (file) => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append(
    "upload_preset",
    "capitalstore_unsigned"
  );

  const res = await fetch(
    `https://api.cloudinary.com/v1_1/daffddkqb/video/upload`,
    { method: "POST", body: formData }
  );

  const data = await res.json();
  setVideo(data.secure_url);
};

const handleSave = async () => {
  const payload = {
    ...form,
    originalPrice: Number(form.originalPrice),
    discountedPrice: Number(form.discountedPrice),
    images: images.filter(Boolean),
    video,
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

  setImages(Array(5).fill(null));
  setVideo(null);

};

  return (
    <AdminLayout>
      {/* HEADER */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">
          Add New Product
        </h1>
        <p className="text-gray-500 mt-1">
          Fill product details and upload media
        </p>
      </div>

      {/* FORM */}
      <div className="bg-white rounded-2xl shadow-lg p-8">
        <form className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* LEFT SECTION */}
          <div className="space-y-6">
            {/* PRODUCT NAME */}
            <div>
              <label className="font-semibold text-sm text-gray-700">
                Product Name
              </label>
              <input
              name="name"
                type="text"
                onChange={handleChange}
                placeholder="Enter product name"
                className="mt-2 w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-green-500 outline-none"
              />
            </div>

            {/* DESCRIPTION */}
            <div>
              <label className="font-semibold text-sm text-gray-700">
                Description
              </label>
              <textarea
              name="description"
                rows="4"
                onChange={handleChange}
                placeholder="Product description"
                className="mt-2 w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-green-500 outline-none"
              />
            </div>

            {/* PRICES */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="font-semibold text-sm text-gray-700">
                  Original Price (₹)
                </label>
                <input
                  name="originalPrice"
                  type="number"
                  onChange={handleChange}
                  className="mt-2 w-full px-4 py-3 border rounded-xl"
                />
              </div>

              <div>
                <label className="font-semibold text-sm text-gray-700">
                  Discounted Price (₹)
                </label>
                <input
                  name="discountedPrice"
                  type="number"
                  onChange={handleChange}
                  className="mt-2 w-full px-4 py-3 border rounded-xl"
                />
              </div>
            </div>

            {/* CATEGORY */}
            <div>
              <label className="font-semibold text-sm text-gray-700">
                Category
              </label>
              <select className="mt-2 w-full px-4 py-3 border rounded-xl" name="category" onChange={handleChange}>
                <option value="">Select category</option>
                <option>Readymade</option>
                <option>Unstitched</option>
              </select>
            </div>

            {/* SUBCATEGORY */}
            <div>
              <label className="font-semibold text-sm text-gray-700">
                Sub Category
              </label>
              <select className="mt-2 w-full px-4 py-3 border rounded-xl " name="subCategory" onChange={handleChange}>
                <option value="">Select sub-category</option>
                <option>Cotton</option>
                <option>Winter</option>
                <option>Partywear</option>
              </select>
            </div>

                        
          </div>

          {/* RIGHT SECTION */}
          <div className="space-y-6">
            {/* IMAGE UPLOAD */}
            <div>
              <h3 className="font-semibold text-gray-700 mb-3">
                Product Images (5)
              </h3>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {images.map((img, i) => (
                  <label
                    key={i}
                    className="h-28 border-2 border-dashed rounded-xl flex items-center justify-center cursor-pointer hover:border-green-500 transition"
                  >
                    {img ? (
                      <img
                        src={img}
                        alt=""
                        className="h-full w-full object-cover rounded-xl"
                      />
                    ) : (
                      <span className="text-xs text-gray-400 text-center px-2">
                        Upload Image {i + 1}
                      </span>
                    )}
                    <input
                      
                      type="file"
                      accept="image/*"
                      hidden
                      onChange={(e) =>
                        handleImageChange(i, e.target.files[0])
                      }
                    />
                  </label>
                ))}
              </div>
            </div>

            {/* VIDEO UPLOAD */}
            <div>
              <h3 className="font-semibold text-gray-700 mb-3">
                Product Video (1)
              </h3>

              <label className="h-40 border-2 border-dashed rounded-xl flex flex-col items-center justify-center cursor-pointer hover:border-green-500 transition">
                {video ? (
                  <video
                    src={video}
                    controls
                    className="h-full w-full object-cover rounded-xl"
                  />
                ) : (
                  <>
                    <FiUpload className="text-2xl text-gray-400 mb-2" />
                    <span className="text-sm text-gray-400">
                      Upload product video
                    </span>
                  </>
                )}
                <input
                  type="file"
                  accept="video/*"
                  hidden
                  onChange={(e) => handleVideoChange(e.target.files[0])}
                />
              </label>
            </div>
          </div>
        </form>

        {/* SAVE BUTTON */}
        <div className="mt-10 flex justify-end">
          <button
            type="button"
            className="flex items-center gap-2 px-7 py-3 rounded-xl bg-green-600 text-white font-semibold
            hover:bg-green-700 transition shadow-lg cursor-pointer"
            onClick={handleSave}
          >
            <FiSave />
            Save Product
          </button>
        </div>
      </div>
    </AdminLayout>
  );
}
