import React, { useState } from "react";
import AdminLayout from "./AdminLayout";
import { FiEdit, FiTrash2 } from "react-icons/fi";

const dummyProducts = [
  {
    id: 1,
    name: "Cotton Kurti",
    category: "Readymade",
    subCategory: "Cotton",
    price: 1999,
    discountPrice: 1499,
    image: "https://via.placeholder.com/80",
    createdAt: "12 Aug 2025",
  },
  {
    id: 2,
    name: "Winter Suit Set",
    category: "Unstitched",
    subCategory: "Winter Wear",
    price: 3499,
    discountPrice: 2799,
    image: "https://via.placeholder.com/80",
    createdAt: "15 Aug 2025",
  },
];

export default function ViewProducts() {
  const [products, setProducts] = useState(dummyProducts);

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      setProducts(products.filter((p) => p.id !== id));
    }
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

      {/* TABLE */}
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-100 text-gray-600">
              <tr>
                <th className="px-6 py-4 text-left">Product</th>
                <th className="px-6 py-4 text-left">Category</th>
                <th className="px-6 py-4 text-left">Prices</th>
                <th className="px-6 py-4 text-left">Created</th>
                <th className="px-6 py-4 text-center">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y">
              {products.length > 0 ? (
                products.map((p) => (
                  <tr key={p.id} className="hover:bg-gray-50">
                    {/* PRODUCT */}
                    <td className="px-6 py-4 flex items-center gap-4">
                      <img
                        src={p.image}
                        alt={p.name}
                        className="h-14 w-14 rounded-xl object-cover border"
                      />
                      <div>
                        <p className="font-semibold text-gray-800">
                          {p.name}
                        </p>
                        <p className="text-xs text-gray-500">
                          {p.subCategory}
                        </p>
                      </div>
                    </td>

                    {/* CATEGORY */}
                    <td className="px-6 py-4">
                      <span className="px-3 py-1 text-xs rounded-full bg-green-100 text-green-700">
                        {p.category}
                      </span>
                    </td>

                    {/* PRICES */}
                    <td className="px-6 py-4">
                      <p className="font-semibold">
                        ₹{p.discountPrice}
                      </p>
                      <p className="text-xs text-gray-400 line-through">
                        ₹{p.price}
                      </p>
                    </td>

                    {/* CREATED */}
                    <td className="px-6 py-4 text-gray-500">
                      {p.createdAt}
                    </td>

                    {/* ACTIONS */}
                    <td className="px-6 py-4">
                      <div className="flex justify-center gap-3">
                        <button
                          className="p-2 rounded-lg bg-blue-100 text-blue-600 hover:bg-blue-200 transition"
                          onClick={() =>
                            alert(`Edit product ID: ${p.id}`)
                          }
                        >
                          <FiEdit />
                        </button>

                        <button
                          className="p-2 rounded-lg bg-red-100 text-red-600 hover:bg-red-200 transition"
                          onClick={() => handleDelete(p.id)}
                        >
                          <FiTrash2 />
                        </button>
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
