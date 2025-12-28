import React, { useState, useEffect } from "react";
import AdminLayout from "./AdminLayout";
import { FiEdit, FiTrash2, FiX, FiUpload } from "react-icons/fi";

export default function ViewProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [expandedId, setExpandedId] = useState(null);

  // Editing states
  const [editOpen, setEditOpen] = useState(false);
  const [editProduct, setEditProduct] = useState(null);
  const [images, setImages] = useState([]);
  const [video, setVideo] = useState("");

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

  /* ================= DELETE PRODUCT ================= */
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

  /* ================= OPEN EDIT ================= */
  const openEdit = (product) => {
    setEditProduct({ ...product });
    setImages(product.images || []);
    setVideo(product.video || "");
    setEditOpen(true);
  };

  /* ================= IMAGE UPLOAD (CLOUDINARY) ================= */
  const uploadImage = async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "capitalstore_unsigned");

    const res = await fetch(
      "https://api.cloudinary.com/v1_1/daffddkqb/image/upload",
      { method: "POST", body: formData }
    );

    const data = await res.json();
    return data.secure_url;
  };

  /* ================= VIDEO UPLOAD ================= */
  const uploadVideo = async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "capitalstore_unsigned");

    const res = await fetch(
      "https://api.cloudinary.com/v1_1/daffddkqb/video/upload",
      { method: "POST", body: formData }
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
    };

    const res = await fetch(
      `https://capital-store-backend.vercel.app/api/products/${editProduct._id}`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(payload),
      }
    );

    const updated = await res.json();

    setProducts(products.map(p => p._id === updated._id ? updated : p));
    setEditOpen(false);
  };

  return (
    <AdminLayout>
      {/* HEADER */}
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Products</h1>
          <p className="text-gray-500 mt-1">
            Manage your product listings
          </p>
        </div>
      </div>

      {loading && (
        <p className="text-center text-gray-500 py-10">
          Loading products...
        </p>
      )}

      {/* PRODUCTS TABLE */}
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-100 text-gray-600 uppercase text-xs">
              <tr>
                <th className="px-6 py-4 text-left">Product</th>
                <th className="px-6 py-4">Category</th>
                <th className="px-6 py-4">Price</th>
                <th className="px-6 py-4">Discount</th>
                <th className="px-6 py-4">Rating</th>
                <th className="px-6 py-4">Actions</th>
              </tr>
            </thead>

            <tbody>
              {products.map((p) => (
                <React.Fragment key={p._id}>
                  <tr className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex gap-4 items-center">
                        <img
                          src={p.images?.[0] || "/placeholder.png"}
                          className="h-12 w-12 rounded-lg object-cover border"
                        />
                        <div>
                          <p className="font-semibold">{p.name}</p>
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
                      <p className="text-xs text-gray-500">
                        {p.subCategory}
                      </p>
                    </td>

                    <td className="px-6 py-4">
                      ₹{p.discountedPrice}
                    </td>

                    <td className="px-6 py-4">
                      {p.discountPercent > 0
                        ? `${p.discountPercent}%`
                        : "—"}
                    </td>

                    <td className="px-6 py-4 text-yellow-500">
                      ⭐ {p.rating}
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex gap-3 justify-center">
                        <button
                          onClick={() => openEdit(p)}
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
                      </div>
                    </td>
                  </tr>

                  {/* EXPANDED ROW */}
                  {expandedId === p._id && (
                    <tr className="bg-gray-50">
                      <td colSpan={6} className="px-8 py-6">
                        <h4 className="font-semibold mb-2">
                          Description
                        </h4>
                        <p className="text-gray-600">
                          {p.description}
                        </p>

                        <h4 className="font-semibold mt-4 mb-2">
                          Images
                        </h4>

                        <div className="grid grid-cols-4 gap-3">
                          {p.images?.map((img, i) => (
                            <img
                              key={i}
                              src={img}
                              className="h-24 object-cover rounded border"
                            />
                          ))}
                        </div>

                        {p.video && (
                          <>
                            <h4 className="font-semibold mt-4 mb-2">
                              Product Video
                            </h4>
                            <video
                              src={p.video}
                              controls
                              className="w-64 rounded border"
                            />
                          </>
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

      {/* ================= EDIT MODAL ================= */}
      {editOpen && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-[1000]">
          <div className="bg-white w-[95%] max-w-4xl rounded-2xl shadow-xl p-6 max-h-[90vh] overflow-y-auto">

            {/* HEADER */}
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">
                Edit Product
              </h2>

              <button
                onClick={() => setEditOpen(false)}
                className="p-2 bg-gray-200 rounded-full"
              >
                <FiX />
              </button>
            </div>

            {/* FORM */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

              {/* LEFT */}
              <div className="space-y-4">

                <input
                  value={editProduct.name}
                  onChange={(e) =>
                    setEditProduct({
                      ...editProduct,
                      name: e.target.value,
                    })
                  }
                  className="border w-full px-4 py-2 rounded"
                  placeholder="Product Name"
                />

                <textarea
                  rows={4}
                  value={editProduct.description}
                  onChange={(e) =>
                    setEditProduct({
                      ...editProduct,
                      description: e.target.value,
                    })
                  }
                  className="border w-full px-4 py-2 rounded"
                  placeholder="Description"
                />

                <div className="grid grid-cols-2 gap-4">
                  <input
                    type="number"
                    value={editProduct.originalPrice}
                    onChange={(e) =>
                      setEditProduct({
                        ...editProduct,
                        originalPrice: e.target.value,
                      })
                    }
                    className="border w-full px-4 py-2 rounded"
                    placeholder="Original Price"
                  />

                  <input
                    type="number"
                    value={editProduct.discountedPrice}
                    onChange={(e) =>
                      setEditProduct({
                        ...editProduct,
                        discountedPrice: e.target.value,
                      })
                    }
                    className="border w-full px-4 py-2 rounded"
                    placeholder="Discounted Price"
                  />
                </div>

                <select
                  value={editProduct.category}
                  onChange={(e) =>
                    setEditProduct({
                      ...editProduct,
                      category: e.target.value,
                    })
                  }
                  className="border w-full px-4 py-2 rounded"
                >
                  <option>Readymade</option>
                  <option>Unstitched</option>
                </select>

                <select
                  value={editProduct.subCategory}
                  onChange={(e) =>
                    setEditProduct({
                      ...editProduct,
                      subCategory: e.target.value,
                    })
                  }
                  className="border w-full px-4 py-2 rounded"
                >
                  <option>Cotton</option>
                  <option>Winter</option>
                  <option>Partywear</option>
                </select>
              </div>

              {/* RIGHT SIDE MEDIA */}
              <div className="space-y-4">
                <p className="font-semibold">Images</p>

                <div className="grid grid-cols-3 gap-3">
                  {images.map((img, i) => (
                    <div key={i} className="relative">
                      <img
                        src={img}
                        className="h-24 w-full object-cover rounded border"
                      />
                      <button
                        onClick={() =>
                          setImages(images.filter((_, idx) => idx !== i))
                        }
                        className="absolute top-1 right-1 bg-red-500 text-white text-xs px-1 rounded"
                      >
                        X
                      </button>
                    </div>
                  ))}

                  <label className="border-2 border-dashed h-24 rounded flex justify-center items-center cursor-pointer">
                    <FiUpload />
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

                <p className="font-semibold mt-2">Video</p>

                <label className="border-2 border-dashed h-28 rounded flex justify-center items-center cursor-pointer">
                  {video ? (
                    <video
                      src={video}
                      controls
                      className="h-full w-full rounded"
                    />
                  ) : (
                    <FiUpload />
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

            <div className="mt-6 flex justify-end">
              <button
                onClick={handleSave}
                className="px-6 py-3 rounded-xl bg-green-600 text-white"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
