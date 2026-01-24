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
      <h1 className="text-3xl font-bold mb-6">Add New Product</h1>

      <div className="bg-white rounded-2xl shadow-lg p-8">
        <form className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* LEFT */}
          <div className="space-y-6">
            <input
              name="name"
              placeholder="Product Name"
              className="w-full px-4 py-3 border rounded-xl"
              onChange={handleChange}
            />

            <textarea
              name="description"
              placeholder="Description"
              rows="4"
              className="w-full px-4 py-3 border rounded-xl"
              onChange={handleChange}
            />

            <div className="grid grid-cols-2 gap-4">
              <input
                name="originalPrice"
                type="number"
                placeholder="Original Price"
                className="px-4 py-3 border rounded-xl"
                onChange={handleChange}
              />
              <input
                name="discountedPrice"
                type="number"
                placeholder="Discounted Price"
                className="px-4 py-3 border rounded-xl"
                onChange={handleChange}
              />
            </div>

            <select
              name="category"
              className="px-4 py-3 border rounded-xl"
              onChange={handleChange}
            >
              <option value="">Select Category</option>
              <option>Readymade</option>
              <option>Unstitched</option>
            </select>

            <select
              name="subCategory"
              className="px-4 py-3 border rounded-xl"
              onChange={handleChange}
            >
              <option value="">Select Subcategory</option>
              <option>Cotton</option>
              <option>Winter</option>
              <option>Partywear</option>
            </select>

            {form.category === "Unstitched" && (
              <input
                type="number"
                placeholder="Stock Quantity"
                className="px-4 py-3 border rounded-xl"
                onChange={(e) =>
                  setStock({ ...stock, quantity: e.target.value })
                }
              />
            )}

            {form.category === "Readymade" && (
              <div className="grid grid-cols-3 gap-3">
                {["S", "M", "L", "XL", "XXL"].map((size) => (
                  <input
                    key={size}
                    type="number"
                    placeholder={size}
                    className="px-3 py-2 border rounded-lg"
                    onChange={(e) =>
                      setStock({ ...stock, [size]: e.target.value })
                    }
                  />
                ))}
              </div>
            )}
          </div>

          {/* RIGHT */}
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              {images.map((img, i) => (
                <label
                  key={i}
                  className="h-28 border-2 border-dashed rounded-xl flex items-center justify-center cursor-pointer"
                >
                  {img ? (
                    <img src={img} className="h-full w-full object-cover rounded-xl" />
                  ) : (
                    <span className="text-xs text-gray-400">Upload Image</span>
                  )}
                  <input
                    hidden
                    type="file"
                    accept="image/*"
                    onChange={(e) =>
                      handleImageChange(i, e.target.files[0])
                    }
                  />
                </label>
              ))}
            </div>

            <label className="h-40 border-2 border-dashed rounded-xl flex flex-col items-center justify-center cursor-pointer">
              {video ? (
                <video src={video} controls className="h-full w-full rounded-xl" />
              ) : (
                <>
                  <FiUpload />
                  <span className="text-sm text-gray-400">
                    Upload Product Video
                  </span>
                </>
              )}
              <input
                hidden
                type="file"
                accept="video/*"
                onChange={(e) => handleVideoChange(e.target.files[0])}
              />
            </label>
          </div>
        </form>

        <div className="mt-10 flex justify-end">
          <button
            onClick={handleSave}
            className="flex items-center gap-2 px-7 py-3 bg-green-600 text-white rounded-xl"
          >
            <FiSave /> Save Product
          </button>
        </div>
      </div>
    </AdminLayout>
  );
}
