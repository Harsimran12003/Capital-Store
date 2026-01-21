import React, { useState, useEffect, useMemo } from "react";
import AdminLayout from "./AdminLayout";
import { FiEdit, FiTrash2, FiX, FiUpload } from "react-icons/fi";

export default function ViewProducts() {
  const [stock, setStock] = useState({});

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [expandedId, setExpandedId] = useState(null);
  const [zoomImage, setZoomImage] = useState(null);

  /* ================= EDIT STATES ================= */
  const [editOpen, setEditOpen] = useState(false);
  const [editProduct, setEditProduct] = useState(null);
  const [images, setImages] = useState([]);
  const [video, setVideo] = useState("");

  /* ================= FILTER STATES ================= */
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [subCategory, setSubCategory] = useState("");
  const [discount, setDiscount] = useState("");
  const [rating, setRating] = useState("");
  const [priceRange, setPriceRange] = useState("");

  /* ================= FETCH PRODUCTS ================= */
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch(
          "https://capital-store-backend.vercel.app/api/admin/products",
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

  /* ================= FILTER LOGIC ================= */
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      if (search && !p.name.toLowerCase().includes(search.toLowerCase()))
        return false;
      if (category && p.category !== category) return false;
      if (subCategory && p.subCategory !== subCategory) return false;
      if (discount && p.discountPercent < Number(discount)) return false;
      if (rating && p.rating < Number(rating)) return false;

      if (priceRange) {
        const price =
        !p.discountedPrice || p.discountedPrice === 0 || p.discountedPrice === p.originalPrice
          ? p.originalPrice
          : p.discountedPrice;

        if (priceRange === "0-999" && !(price <= 999)) return false;
        if (priceRange === "1000-1999" && !(price >= 1000 && price <= 1999))
          return false;
        if (priceRange === "2000-4999" && !(price >= 2000 && price <= 4999))
          return false;
        if (priceRange === "5000+" && !(price >= 5000)) return false;
      }

      return true;
    });
  }, [products, search, category, subCategory, discount, rating, priceRange]);

  /* ================= DELETE ================= */
  const handleDelete = async (_id) => {
    if (!window.confirm("Delete this product?")) return;

    await fetch(
      `https://capital-store-backend.vercel.app/api/products/${_id}`,
      { method: "DELETE", credentials: "include" }
    );

    setProducts(products.filter((p) => p._id !== _id));
  };

  /* ================= OPEN EDIT ================= */
  const openEdit = (product) => {
  setEditProduct({ ...product });
  setImages(product.images || []);
  setVideo(product.video || "");

  // 🔥 Initialize stock safely
  if (product.category === "Unstitched") {
    setStock({
      quantity: product.stock?.quantity || 0,
    });
  } else {
    setStock({
      S: product.stock?.S || 0,
      M: product.stock?.M || 0,
      L: product.stock?.L || 0,
      XL: product.stock?.XL || 0,
      XXL: product.stock?.XXL || 0,
    });
  }

  setEditOpen(true);
};


  /* ================= CLOUDINARY UPLOADS ================= */
  const uploadImage = async (file) => {
    const f = new FormData();
    f.append("file", file);
    f.append("upload_preset", "capitalstore_unsigned");

    const res = await fetch(
      "https://api.cloudinary.com/v1_1/daffddkqb/image/upload",
      { method: "POST", body: f }
    );

    const data = await res.json();
    return data.secure_url;
  };

  const uploadVideo = async (file) => {
    const f = new FormData();
    f.append("file", file);
    f.append("upload_preset", "capitalstore_unsigned");

    const res = await fetch(
      "https://api.cloudinary.com/v1_1/daffddkqb/video/upload",
      { method: "POST", body: f }
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
      stock,
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

    setProducts(products.map((p) => (p._id === updated._id ? updated : p)));

    setEditOpen(false);
  };

  return (
    <AdminLayout>
      {/* HEADER */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Products</h1>
        <p className="text-gray-500 mt-1">
          Manage and control your product listings
        </p>
      </div>

      {/* FILTER BAR */}
      <div className="bg-white p-5 rounded-xl shadow mb-6 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <input
          placeholder="Search Product..."
          className="border rounded-lg px-3 py-2"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select
          className="border rounded-lg px-3 py-2"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          <option value="">Category</option>
          <option>Readymade</option>
          <option>Unstitched</option>
        </select>

        <select
          className="border rounded-lg px-3 py-2"
          value={subCategory}
          onChange={(e) => setSubCategory(e.target.value)}
        >
          <option value="">SubCategory</option>
          <option>Cotton</option>
          <option>Winter</option>
          <option>Partywear</option>
        </select>
        

        <select
          className="border rounded-lg px-3 py-2"
          value={discount}
          onChange={(e) => setDiscount(e.target.value)}
        >
          <option value="">Min Discount</option>
          <option value="10">10%+</option>
          <option value="20">20%+</option>
          <option value="30">30%+</option>
          <option value="50">50%+</option>
        </select>

        <select
          className="border rounded-lg px-3 py-2"
          value={rating}
          onChange={(e) => setRating(e.target.value)}
        >
          <option value="">Min Rating</option>
          <option value="1">⭐ 1+</option>
          <option value="2">⭐ 2+</option>
          <option value="3">⭐ 3+</option>
          <option value="4">⭐ 4+</option>
        </select>

        <select
          className="border rounded-lg px-3 py-2"
          value={priceRange}
          onChange={(e) => setPriceRange(e.target.value)}
        >
          <option value="">Price Range</option>
          <option value="0-999">Below ₹1000</option>
          <option value="1000-1999">₹1000 - ₹1999</option>
          <option value="2000-4999">₹2000 - ₹4999</option>
          <option value="5000+">₹5000+</option>
        </select>
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-100 text-gray-600 uppercase text-xs">
              <tr>
                <th className="px-6 py-4 text-left">Product</th>
                <th className="px-6 py-4">Category</th>
                <th className="px-6 py-4">MRP</th>
                <th className="px-6 py-4">Discounted</th>
                <th className="px-6 py-4">Discount</th>
                <th className="px-6 py-4">Rating</th>
                <th className="px-6 py-4 text-center">Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredProducts.map((p) => (
                <React.Fragment key={p._id}>
                  <tr className="hover:bg-gray-50 transition">
                    <td className="px-6 py-4">
                      <div className="flex gap-4 items-center">
                        <img
                          src={p.images?.[0]}
                          className="h-12 w-12 rounded-lg object-cover border cursor-pointer"
                          onClick={() => setZoomImage(p.images?.[0])}
                        />

                        <div>
                          <p className="font-semibold text-gray-800">
                            {p.name}
                          </p>
                          <button
                            onClick={() =>
                              setExpandedId(
                                expandedId === p._id ? null : p._id
                              )
                            }
                            className="text-[13px] text-[#4D192B] hover:underline cursor-pointer mt-1 "
                          >
                            {expandedId === p._id
                              ? "Hide Details"
                              : "View Details"}
                          </button>
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <div className="font-medium">{p.category}</div>
                      <div className="text-xs text-gray-500 mt-1">
                        {p.subCategory}
                      </div>
                    </td>

                    <td className="px-6 py-4 font-semibold text-gray-700">
                      ₹{p.originalPrice}
                    </td>

                    <td className="px-6 py-4 font-semibold text-green-700">
                      ₹{p.discountedPrice}
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

                    <td className="px-6 py-4 text-yellow-500 font-medium">
                      ⭐ {p.rating}
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex gap-3 justify-center">
                        <button
                          onClick={() => openEdit(p)}
                          className="p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 cursor-pointer"
                        >
                          <FiEdit />
                        </button>

                        <button
                          onClick={() => handleDelete(p._id)}
                          className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 cursor-pointer"
                        >
                          <FiTrash2 />
                        </button>
                      </div>
                    </td>
                  </tr>

                  {expandedId === p._id && (
                    <tr className="bg-gray-50">
                      <td colSpan={7} className="px-8 py-6">
                        <h4 className="font-semibold mb-2">Description</h4>
                        <p className="text-gray-600">{p.description}</p>

                        <h4 className="font-semibold mt-5 mb-2">
                          Product Images
                        </h4>

                        <div className="grid grid-cols-4 gap-4">
                          {p.images?.map((img, i) => (
                            <img
                              key={i}
                              src={img}
                              className="h-24 object-cover rounded border cursor-pointer"
                              onClick={() => setZoomImage(img)}
                            />
                          ))}
                        </div>

                        {p.video && (
                          <>
                            <h4 className="font-semibold mt-5 mb-2">
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

      {/* ================= IMAGE ZOOM ================= */}
      {zoomImage && (
        <div
          className="fixed inset-0 bg-black/70 flex justify-center items-center z-[2000]"
          onClick={() => setZoomImage(null)}
        >
          <img
            src={zoomImage}
            className="max-h-[90vh] max-w-[90vw] rounded-xl shadow-2xl border"
          />
        </div>
      )}

      {/* ================= EDIT MODAL ================= */}
      {editOpen && (
        <div className="fixed inset-0 bg-black/60 flex justify-center items-center z-[3000]">
          <div className="bg-white w-[95%] max-w-4xl rounded-2xl shadow-xl p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between">
              <h2 className="text-xl font-bold">Edit Product</h2>
              <button
                onClick={() => setEditOpen(false)}
                className="p-2 bg-gray-200 rounded-full cursor-pointer hover:bg-gray-300"
              >
                <FiX />
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-4">
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

              {/* ================= STOCK (ADDED) ================= */}
<div>
  <label className="font-semibold text-sm text-gray-700">
    Stock
  </label>

  {/* UNSTITCHED */}
  {editProduct.category === "Unstitched" && (
    <input
      type="number"
      min="0"
      className="mt-2 w-full px-4 py-2 border rounded"
      placeholder="Total Quantity"
      value={stock.quantity}
      onChange={(e) =>
        setStock({ quantity: Number(e.target.value) })
      }
    />
  )}

  {/* READYMADE */}
  {editProduct.category === "Readymade" && (
    <div className="grid grid-cols-3 gap-3 mt-2">
      {["S", "M", "L", "XL", "XXL"].map((size) => (
        <input
          key={size}
          type="number"
          min="0"
          className="px-3 py-2 border rounded"
          placeholder={size}
          value={stock[size]}
          onChange={(e) =>
            setStock({
              ...stock,
              [size]: Number(e.target.value),
            })
          }
        />
      ))}
    </div>
  )}
</div>


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
                        className="absolute top-1 right-1 bg-red-500 text-white text-xs px-1 rounded cursor-pointer"
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
                className="px-6 py-3 rounded-xl bg-green-600 text-white cursor-pointer"
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
