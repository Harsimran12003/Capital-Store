import React, { useState, useEffect } from "react";
import AdminLayout from "./AdminLayout";
import { FiEdit, FiTrash2 } from "react-icons/fi";

export default function ViewProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [editingId, setEditingId] = useState(null);
  const [expandedId, setExpandedId] = useState(null);
  const [editForm, setEditForm] = useState({});

  const uploadImageToCloudinary = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onloadend = async () => {
      try {
        const res = await fetch(
          "https://capital-store-backend.vercel.app/api/upload/product-image",
          {
            method: "POST",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ image: reader.result }),
          }
        );

        const data = await res.json();
        if (!res.ok) throw new Error(data.message);

        resolve(data.imageUrl);
      } catch (err) {
        reject(err);
      }
    };

    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

  /* ================= FETCH PRODUCTS ================= */
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch(
          "https://capital-store-backend.vercel.app/api/products",
          { credentials: "include" }
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

  /* ================= HANDLERS ================= */
  const handleEditChange = (e) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  };

  const handleSaveEdit = async (_id) => {
    const res = await fetch(
      `https://capital-store-backend.vercel.app/api/products/${_id}`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(editForm),
      }
    );

    const updated = await res.json();
    setProducts(products.map((p) => (p._id === _id ? updated : p)));
    setEditingId(null);
  };

  const handleDelete = async (_id) => {
    if (!window.confirm("Delete this product?")) return;

    await fetch(
      `https://capital-store-backend.vercel.app/api/products/${_id}`,
      {
        method: "DELETE",
        credentials: "include",
      }
    );

    setProducts(products.filter((p) => p._id !== _id));
  };

  return (
    <AdminLayout>
      {/* HEADER */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">View Products</h1>
        <p className="text-gray-500 mt-1">
          Manage your product listings
        </p>
      </div>

      {loading && (
        <p className="text-center text-gray-500 py-10">
          Loading products...
        </p>
      )}

      {/* TABLE */}
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-100 text-gray-600 uppercase text-xs">
              <tr>
                <th className="px-6 py-4 text-left">Product</th>
                <th className="px-6 py-4 text-left">Category</th>
                <th className="px-6 py-4 text-left">Pricing</th>
                <th className="px-6 py-4 text-left">Discount</th>
                <th className="px-6 py-4 text-left">Rating</th>
                <th className="px-6 py-4 text-left">Created</th>
                <th className="px-6 py-4 text-center">Actions</th>
              </tr>
            </thead>

            <tbody>
              {products.length > 0 ? (
                products.map((p) => (
                  <React.Fragment key={p._id}>
                    {/* MAIN ROW */}
                    <tr className="hover:bg-gray-50 transition">
                      {/* PRODUCT */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-4">
                          <img
                            src={p.images?.[0] || "/placeholder.png"}
                            className="h-12 w-12 rounded-lg object-cover border"
                          />

                          <div>
                            {editingId === p._id ? (
                              <input
                                name="name"
                                value={editForm.name}
                                onChange={handleEditChange}
                                className="border px-2 py-1 rounded w-full text-sm"
                              />
                            ) : (
                              <p className="font-semibold text-gray-800">
                                {p.name}
                              </p>
                            )}

                            <button
                              onClick={() =>
                                setExpandedId(
                                  expandedId === p._id ? null : p._id
                                )
                              }
                              className="text-xs text-[#4D192B] hover:underline"
                            >
                              {expandedId === p._id
                                ? "Hide details"
                                : "View details"}
                            </button>
                          </div>
                        </div>
                      </td>

                      {/* CATEGORY */}
                      <td className="px-6 py-4">
                        {editingId === p._id ? (
                          <>
                            <select
                              name="category"
                              value={editForm.category}
                              onChange={handleEditChange}
                              className="border px-2 py-1 rounded text-sm mb-1 w-full"
                            >
                              <option>Readymade</option>
                              <option>Unstitched</option>
                            </select>

                            <select
                              name="subCategory"
                              value={editForm.subCategory}
                              onChange={handleEditChange}
                              className="border px-2 py-1 rounded text-sm w-full"
                            >
                              <option>Cotton</option>
                              <option>Winter</option>
                              <option>Partywear</option>
                            </select>
                          </>
                        ) : (
                          <>
                            <span className="px-3 py-1 text-xs rounded-full bg-green-100 text-green-700">
                              {p.category}
                            </span>
                            <p className="text-xs text-gray-500">
                              {p.subCategory}
                            </p>
                          </>
                        )}
                      </td>

                      {/* PRICING */}
                      <td className="px-6 py-4">
                        {editingId === p._id ? (
                          <>
                            <input
                              name="discountedPrice"
                              value={editForm.discountedPrice}
                              onChange={handleEditChange}
                              type="number"
                              className="border px-2 py-1 rounded w-full mb-1 text-sm"
                            />
                            <input
                              name="originalPrice"
                              value={editForm.originalPrice}
                              onChange={handleEditChange}
                              type="number"
                              className="border px-2 py-1 rounded w-full text-sm"
                            />
                          </>
                        ) : (
                          <>
                            <p className="font-semibold">
                              ₹{p.discountedPrice}
                            </p>
                            <p className="text-xs text-gray-400 line-through">
                              ₹{p.originalPrice}
                            </p>
                          </>
                        )}
                      </td>

                      {/* DISCOUNT */}
                      <td className="px-6 py-4">
                        {p.discountPercent > 0 ? (
                          <span className="px-3 py-1 text-xs rounded-full bg-red-100 text-red-600">
                            {p.discountPercent}% OFF
                          </span>
                        ) : (
                          <span className="text-xs text-gray-400">—</span>
                        )}
                      </td>

                      {/* RATING */}
                      <td className="px-6 py-4 text-yellow-600 font-medium">
                        ⭐ {p.rating}
                      </td>

                      {/* CREATED */}
                      <td className="px-6 py-4 text-gray-500 text-sm">
                        {new Date(p.createdAt).toLocaleDateString()}
                      </td>

                      {/* ACTIONS */}
                      <td className="px-6 py-4">
                        <div className="flex justify-center gap-3">
                          {editingId === p._id ? (
                            <>
                              <button
                                className="px-3 py-1 bg-green-600 text-white rounded text-xs"
                                onClick={() => handleSaveEdit(p._id)}
                              >
                                Save
                              </button>
                              <button
                                className="px-3 py-1 bg-gray-200 rounded text-xs"
                                onClick={() => setEditingId(null)}
                              >
                                Cancel
                              </button>
                            </>
                          ) : (
                            <>
                              <button
                                className="p-2 rounded-lg bg-blue-100 text-blue-600"
                                onClick={() => {
                                  setEditingId(p._id);
                                  setEditForm({
                                    name: p.name,
                                    description: p.description,
                                    category: p.category,
                                    subCategory: p.subCategory,
                                    originalPrice: p.originalPrice,
                                    discountedPrice: p.discountedPrice,
                                    images: p.images || [""],
                                    video: p.video || "",
                                  });
                                }}
                              >
                                <FiEdit />
                              </button>

                              <button
                                className="p-2 rounded-lg bg-red-100 text-red-600"
                                onClick={() => handleDelete(p._id)}
                              >
                                <FiTrash2 />
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>

                    {/* EXPANDED DETAILS ROW */}
                    {expandedId === p._id && (
                      <tr className="bg-gray-50">
                        <td colSpan="7" className="px-8 py-6">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* DESCRIPTION */}
                            <div>
                              <h4 className="text-sm font-semibold mb-1">
                                Description
                              </h4>
                              {editingId === p._id ? (
                                <textarea
                                  name="description"
                                  value={editForm.description}
                                  onChange={handleEditChange}
                                  rows={3}
                                  className="border rounded w-full px-3 py-2 text-sm"
                                />
                              ) : (
                                <p className="text-sm text-gray-600">
                                  {p.description}
                                </p>
                              )}
                            </div>

                            {/* IMAGES */}
                            {/* IMAGES */}
<div>
  <h4 className="text-sm font-semibold mb-2">Images</h4>

  <div className="grid grid-cols-3 gap-3">
    {editForm.images?.map((img, i) => (
      <img
        key={i}
        src={img}
        className="h-16 w-full object-cover rounded border"
      />
    ))}
  </div>

  {editingId === p._id && (
    <label className="inline-block mt-3 text-xs text-[#4D192B] cursor-pointer hover:underline">
      + Upload image
      <input
        type="file"
        accept="image/*"
        hidden
        onChange={async (e) => {
          const file = e.target.files[0];
          if (!file) return;

          try {
            const imageUrl = await uploadImageToCloudinary(file);
            setEditForm({
              ...editForm,
              images: [...editForm.images, imageUrl],
            });
          } catch {
            alert("Image upload failed");
          }
        }}
      />
    </label>
  )}
</div>


                            {/* VIDEO */}
                            <div>
                              <h4 className="text-sm font-semibold mb-1">
                                Video
                              </h4>
                              {editingId === p._id ? (
                                <input
                                  name="video"
                                  value={editForm.video}
                                  onChange={handleEditChange}
                                  className="border px-2 py-1 rounded w-full text-sm"
                                  placeholder="Video URL"
                                />
                              ) : p.video ? (
                                <video
                                  src={p.video}
                                  controls
                                  className="w-48 h-28 rounded border"
                                />
                              ) : (
                                <p className="text-xs text-gray-400">
                                  No video
                                </p>
                              )}
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="7"
                    className="px-6 py-10 text-center text-gray-400"
                  >
                    No products found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
}
