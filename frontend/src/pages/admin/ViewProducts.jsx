import React, { useState, useEffect } from "react";
import AdminLayout from "./AdminLayout";
import { FiEdit, FiTrash2 } from "react-icons/fi";

export default function ViewProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [editingId, setEditingId] = useState(null);
  const [expandedId, setExpandedId] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [selectedImages, setSelectedImages] = useState([]);

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
    const formData = new FormData();

    // append normal fields
    Object.entries(editForm).forEach(([key, value]) => {
      if (key !== "images") {
        formData.append(key, value);
      }
    });

    // existing images
    formData.append("images", JSON.stringify(editForm.images || []));

    // new uploaded images
    selectedImages.forEach((file) => {
      formData.append("images", file);
    });

    const res = await fetch(
      `https://capital-store-backend.vercel.app/api/products/${_id}`,
      {
        method: "PUT",
        credentials: "include",
        body: formData, // ❌ no headers
      }
    );

    const updated = await res.json();
    setProducts(products.map((p) => (p._id === _id ? updated : p)));

    setEditingId(null);
    setSelectedImages([]);
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
        <p className="text-gray-500 mt-1">Manage your product listings</p>
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
                <th className="px-6 py-4">Category</th>
                <th className="px-6 py-4">Pricing</th>
                <th className="px-6 py-4">Discount</th>
                <th className="px-6 py-4">Rating</th>
                <th className="px-6 py-4">Created</th>
                <th className="px-6 py-4">Actions</th>
              </tr>
            </thead>

            <tbody>
              {products.map((p) => (
                <React.Fragment key={p._id}>
                  {/* MAIN ROW */}
                  <tr className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex gap-4 items-center">
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
                              className="border px-2 py-1 rounded text-sm"
                            />
                          ) : (
                            <p className="font-semibold">{p.name}</p>
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

                    <td className="px-6 py-4">
                      <span className="px-3 py-1 text-xs rounded-full bg-green-100 text-green-700">
                        {p.category}
                      </span>
                      <p className="text-xs text-gray-500">{p.subCategory}</p>
                    </td>

                    <td className="px-6 py-4">
                      <p className="font-semibold">₹{p.discountedPrice}</p>
                      <p className="text-xs line-through text-gray-400">
                        ₹{p.originalPrice}
                      </p>
                    </td>

                    <td className="px-6 py-4">
                      {p.discountPercent > 0 ? (
                        <span className="px-3 py-1 text-xs bg-red-100 text-red-600 rounded-full">
                          {p.discountPercent}% OFF
                        </span>
                      ) : (
                        "—"
                      )}
                    </td>

                    <td className="px-6 py-4 text-yellow-600 font-medium">
                      ⭐ {p.rating}
                    </td>

                    <td className="px-6 py-4 text-sm text-gray-500">
                      {new Date(p.createdAt).toLocaleDateString()}
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex justify-center gap-3">
                        {editingId === p._id ? (
                          <>
                            <button
                              onClick={() => handleSaveEdit(p._id)}
                              className="px-3 py-1 bg-green-600 text-white rounded text-xs"
                            >
                              Save
                            </button>
                            <button
                              onClick={() => setEditingId(null)}
                              className="px-3 py-1 bg-gray-200 rounded text-xs"
                            >
                              Cancel
                            </button>
                          </>
                        ) : (
                          <>
                            <button
                              onClick={() => {
                                setEditingId(p._id);
                                setEditForm({
                                  name: p.name,
                                  description: p.description,
                                  category: p.category,
                                  subCategory: p.subCategory,
                                  originalPrice: p.originalPrice,
                                  discountedPrice: p.discountedPrice,
                                  images: p.images || [],
                                  video: p.video || "",
                                });
                              }}
                              className="p-2 bg-blue-100 text-blue-600 rounded-lg"
                            >
                              <FiEdit />
                            </button>
                            <button
                              onClick={() => handleDelete(p._id)}
                              className="p-2 bg-red-100 text-red-600 rounded-lg"
                            >
                              <FiTrash2 />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>

                  {/* EXPANDED */}
                  {expandedId === p._id && (
                    <tr className="bg-gray-50">
                      <td colSpan="7" className="px-8 py-6">
                        <h4 className="font-semibold mb-2">Images</h4>

                        <div className="grid grid-cols-4 gap-3">
                          {editForm.images?.map((img, i) => (
                            <img
                              key={i}
                              src={img}
                              className="h-20 object-cover rounded border"
                            />
                          ))}
                        </div>

                        {editingId === p._id && (
                          <input
                            type="file"
                            multiple
                            accept="image/*"
                            onChange={(e) =>
                              setSelectedImages([...e.target.files])
                            }
                            className="mt-3 text-sm"
                          />
                        )}
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
}
