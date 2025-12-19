import React, { useState , useEffect} from "react";
import AdminLayout from "./AdminLayout";
import { FiEdit, FiTrash2 } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

export default function ViewProducts() {
  const [editingId, setEditingId] = useState(null);
const [editForm, setEditForm] = useState({});

  const [products, setProducts] = useState([]);
const [loading, setLoading] = useState(true);
  useEffect(() => {
  const fetchProducts = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/products", {
        credentials: "include",
      });
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

const handleEditChange = (e) => {
  setEditForm({ ...editForm, [e.target.name]: e.target.value });
};

const handleSaveEdit = async (_id) => {
  const res = await fetch(`http://localhost:5000/api/products/${_id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(editForm),
  });

  const updated = await res.json();

  setProducts(products.map((p) => (p._id === _id ? updated : p)));
  setEditingId(null);
};


  const handleDelete = async (_id) => {
  if (!window.confirm("Are you sure you want to delete this product?")) return;

  await fetch(`http://localhost:5000/api/products/${_id}`, {
    method: "DELETE",
    credentials: "include",
  });

  setProducts(products.filter((p) => p._id !== _id));
};

  return (
    <AdminLayout>
      {/* HEADER */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">
          View Products
        </h1>
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
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden ">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-100 text-gray-600">
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


            <tbody className="div_ide-y">
              {products.length > 0 ? (
                products.map((p) => (
                  <tr key={p._id} className="hover:bg-gray-50">
  {/* PRODUCT */}
  <td className="px-6 py-4 flex items-center gap-4">
   
{editingId === p._id ? (
  <div className="space-y-1">
    {editForm.images?.map((img, i) => (
      <input
        key={i}
        type="text"
        value={img}
        onChange={(e) => {
          const updated = [...editForm.images];
          updated[i] = e.target.value;
          setEditForm({ ...editForm, images: updated });
        }}
        className="border px-2 py-1 rounded w-full text-xs"
        placeholder={`Image ${i + 1} URL`}
      />
    ))}
  </div>
) : (
  <div className="flex gap-2 flex-wrap">
    {p.images?.map((img, idx) => (
      <img
        key={idx}
        src={img}
        className="h-12 w-12 rounded-lg object-cover border"
      />
    ))}
  </div>
)}
{/* VIDEO */}
<div className="mt-2">
  {editingId === p._id ? (
    <input
      type="text"
      name="video"
      value={editForm.video || ""}
      onChange={handleEditChange}
      placeholder="Video URL"
      className="border px-2 py-1 rounded w-full text-xs"
    />
  ) : p.video ? (
    <video
      src={p.video}
      controls
      className="w-28 h-16 rounded-lg object-cover border"
    />
  ) : (
    <span className="text-xs text-gray-400">No video</span>
  )}
</div>


    <div>
      {editingId === p._id ? (
  <input
    name="name"
    value={editForm.name}
    onChange={handleEditChange}
    className="border px-2 py-1 rounded w-full text-sm"
  />
) : (
  <p className="font-semibold text-gray-800">{p.name}</p>
)}

      {editingId === p._id ? (
  <textarea
    name="description"
    value={editForm.description}
    onChange={handleEditChange}
    rows={2}
    className="border px-2 py-1 rounded w-full text-sm resize-none"
  />
) : (
  <p className="text-xs text-gray-500 line-clamp-1">
    {p.description}
  </p>
)}

    </div>
  </td>

  {/* CATEGORY */}
  <td className="px-6 py-4">
    <div className="flex flex-col gap-1">
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
    <p className="text-xs text-gray-500">{p.subCategory}</p>
  </>
)}

    </div>
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
    <p className="font-semibold">₹{p.discountedPrice}</p>
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
  <td className="px-6 py-4">
    <span className="text-sm font-medium text-yellow-600">
      ⭐ {p.rating}
    </span>
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
    images: p.images || Array(5).fill(""),
    video: p.video || "",
      }); }}
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
                ))
              ) : (
                <tr>
                  <td
                    colSpan="5"
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
