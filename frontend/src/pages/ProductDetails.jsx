import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { motion, AnimatePresence } from "framer-motion";
import { FiHeart, FiShoppingCart } from "react-icons/fi";
import { FaStar } from "react-icons/fa";
import useAuth from "../hooks/useAuth";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";

// Swiper
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Thumbs, FreeMode } from "swiper/modules";

export default function ProductDetails() {
  const sizes = ["S", "M", "L", "XL", "XXL"];
  const [selectedSize, setSelectedSize] = useState(null);

  const { user } = useAuth();
  const { addToCart } = useCart();
  const { toggleWishlist, wishlist } = useWishlist();

  const { id } = useParams();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [thumbsSwiper, setThumbsSwiper] = useState(null);
  const [liked, setLiked] = useState(false);
  const [qty, setQty] = useState(0);
  const [showToast, setShowToast] = useState(false);
  const [added, setAdded] = useState(false);
  const [loginPrompt, setLoginPrompt] = useState(null);

  const [reviews, setReviews] = useState([]);
  const [newReview, setNewReview] = useState({
    rating: 0,
    text: "",
    images: [],
  });
  const [showReviewForm, setShowReviewForm] = useState(false);

  const [reviewLightboxOpen, setReviewLightboxOpen] = useState(false);
  const [reviewLightboxIndex, setReviewLightboxIndex] = useState(0);
  const [currentReviewImages, setCurrentReviewImages] = useState([]);

  const toBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
    });

  useEffect(() => {
    const fetchReviews = async () => {
      const res = await fetch(
        `https://capital-store-backend.vercel.app/api/reviews/${product._id}`
      );
      const data = await res.json();
      setReviews(data);
    };

    if (product) fetchReviews();
  }, [product]);

  /* ================= FETCH PRODUCT ================= */
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(
          `https://capital-store-backend.vercel.app/api/products/${id}`
        );
        const data = await res.json();
        setProduct(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  useEffect(() => {
    if (product) {
      setLiked(wishlist.some((item) => item.productId === product._id));
    }
  }, [wishlist, product]);

  const submitReview = async () => {
    try {
      const res = await fetch(
        `https://capital-store-backend.vercel.app/api/reviews/${product._id}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify(newReview),
        }
      );

      const data = await res.json();
      if (!res.ok) {
        alert(data.message || "Failed to submit review");
        return;
      }

      // Add instantly to UI
      setReviews([data, ...reviews]);

      // Reset
      setShowReviewForm(false);
      setNewReview({ rating: 0, text: "", images: [] });
    } catch (err) {
      console.log("Submit review error:", err);
    }
  };

  /* ================= LOADING / ERROR ================= */
  if (loading) {
    return (
      <>
        <Navbar />
        <p className="text-center py-20 text-gray-500">Loading product...</p>
        <Footer />
      </>
    );
  }

  if (!product) {
    return (
      <>
        <Navbar />
        <p className="text-center py-20 text-red-500">Product not found</p>
        <Footer />
      </>
    );
  }

  const isUnstitched = product?.category?.toLowerCase() === "unstitched";

  /* ================= MEDIA ================= */
  const media = [
    ...(product.images || []).map((img) => ({ type: "image", src: img })),
    product.video ? { type: "video", src: product.video } : null,
  ].filter(Boolean);

  const openLightbox = (i) => {
    setLightboxIndex(i);
    setLightboxOpen(true);
  };

  const openReviewLightbox = (images, index) => {
    setCurrentReviewImages(images);
    setReviewLightboxIndex(index);
    setReviewLightboxOpen(true);
  };

  const handleAddToCart = () => {
    if (!user) {
      setLoginPrompt("cart");
      return;
    }

    const sizeToAdd = isUnstitched ? "FREE" : selectedSize;

    if (!sizeToAdd) {
      alert("Please select a size");
      return;
    }

    addToCart(product, sizeToAdd);
    setAdded(true);
  };

  const overallRating =
    reviews.length > 0
      ? (
          reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
        ).toFixed(1)
      : 0;

  return (
    <>
      <Navbar />

      {/* TOAST */}
      <AnimatePresence>
        {showToast && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 30 }}
            className="fixed bottom-6 right-6 bg-[#4D192B] text-white px-6 py-4 rounded-2xl shadow-xl z-50 flex gap-2"
          >
            <FiShoppingCart />
            Added to Cart
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 mt-5 mb-24">
        {/* BREADCRUMB */}
        <div className="text-gray-500 text-sm mb-6">
          <Link to="/" className="hover:text-[#4D192B]">
            Home
          </Link>{" "}
          /{" "}
          <Link
            to={`/${product.category.toLowerCase()}`}
            className="hover:text-[#4D192B]"
          >
            {product.category}
          </Link>{" "}
          / <span className="font-semibold">{product.name}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* LEFT IMAGES */}
          <div>
            <Swiper
              modules={[Navigation, Pagination, Thumbs]}
              navigation
              pagination={{ clickable: true }}
              thumbs={{ swiper: thumbsSwiper }}
              className="rounded-2xl shadow-lg"
            >
              {media.map((item, i) => (
                <SwiperSlide key={i}>
                  <div
                    onClick={() => openLightbox(i)}
                    className="cursor-zoom-in"
                  >
                    {item.type === "image" ? (
                      <img
                        src={item.src}
                        className="w-full h-[420px] object-contain rounded-2xl"
                      />
                    ) : (
                      <video
                        src={item.src}
                        muted
                        className="w-full h-[420px] object-cover rounded-2xl"
                      />
                    )}
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>

            <Swiper
              onSwiper={setThumbsSwiper}
              modules={[FreeMode, Thumbs]}
              slidesPerView={4}
              spaceBetween={10}
              freeMode
              watchSlidesProgress
              className="mt-4"
            >
              {media.map((item, i) => (
                <SwiperSlide key={i}>
                  {item.type === "image" ? (
                    <img
                      src={item.src}
                      className="h-20 rounded-xl object-cover"
                    />
                  ) : (
                    <video
                      src={item.src}
                      muted
                      className="h-20 rounded-xl object-cover"
                    />
                  )}
                </SwiperSlide>
              ))}
            </Swiper>
          </div>

          {/* RIGHT DETAILS */}
          <div>
            <h1 className="text-3xl font-bold text-[#4D192B]">
              {product.name}
            </h1>

            <div className="flex gap-1 mt-2">
              {[...Array(5)].map((_, i) => (
                <FaStar
                  key={i}
                  className={
                    i < product.rating ? "text-yellow-500" : "text-gray-300"
                  }
                />
              ))}
            </div>

            {/* PRICE */}
            <div className="mt-4 flex items-center gap-4">
              {product.discountedPrice > 0 &&
              product.discountedPrice < product.originalPrice ? (
                <>
                  <span className="text-3xl font-bold">
                    ₹{product.discountedPrice}
                  </span>
                  <span className="line-through text-gray-400">
                    ₹{product.originalPrice}
                  </span>
                  <span className="text-red-600 font-semibold">
                    {product.discountPercent}% OFF
                  </span>
                </>
              ) : (
                <span className="text-3xl font-bold">
                  ₹{product.originalPrice}
                </span>
              )}
            </div>

            {/* SIZE SECTION */}
            <div className="mt-6">
              {/* UNSTITCHED → ONLY FREE SIZE BADGE */}
              {isUnstitched ? (
                <div className="px-5 py-2 inline-block rounded-full border bg-[#4D192B] text-white font-semibold">
                  Free Size
                </div>
              ) : (
                <>
                  <p className="font-semibold text-[#4D192B] mb-2">
                    Select Size
                  </p>

                  <div className="flex gap-3 flex-wrap">
                    {sizes.map((size) => (
                      <button
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        className={`px-4 py-2 rounded-full border font-semibold text-sm cursor-pointer ${
                          selectedSize === size
                            ? "bg-[#4D192B] text-white border-[#4D192B]"
                            : "bg-white text-[#4D192B] border-gray-300 hover:border-[#4D192B]"
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>

                  {!selectedSize && (
                    <p className="text-xs text-red-500 mt-2">
                      Please select a size
                    </p>
                  )}
                </>
              )}
            </div>

            <p
              className="mt-4 text-gray-700"
              style={{ whiteSpace: "pre-line" }}
            >
              {product.description}
            </p>

            {/* WISHLIST */}
            <button
              className="flex gap-2 mt-5 text-[#4D192B] cursor-pointer"
              onClick={() => {
                if (!user) {
                  setLoginPrompt("wishlist");
                  return;
                }
                toggleWishlist(product);
              }}
            >
              <FiHeart className={liked ? "text-red-500" : ""} />
              {liked ? "Wishlisted" : "Add to Wishlist"}
            </button>

            {/* CART BUTTON */}
            <div className="mt-6">
              {added ? (
                <Link to="/cart">
                  <button className="px-8 py-3 bg-green-600 text-white rounded-full cursor-pointer">
                    Go to Cart
                  </button>
                </Link>
              ) : (
                <button
                  onClick={handleAddToCart}
                  disabled={!isUnstitched && !selectedSize}
                  className={`px-8 py-3 rounded-full text-white cursor-pointer ${
                    isUnstitched || selectedSize
                      ? "bg-[#4D192B]"
                      : "bg-gray-400 cursor-not-allowed"
                  }`}
                >
                  Add to Cart
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
      {/* LOGIN MODAL */}
      <AnimatePresence>
        {loginPrompt && (
          <motion.div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[1000] flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setLoginPrompt(null)}
          >
            <motion.div
              className="bg-white rounded-2xl p-6 m-4 max-w-sm w-full shadow-2xl"
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-lg font-semibold text-[#3b0b11] mb-2">
                Login Required
              </h3>

              <p className="text-gray-600 text-sm mb-4">
                Please log in to access your {loginPrompt}.
              </p>

              <div className="flex gap-3">
                <Link
                  to="/login"
                  className="flex-1 bg-[#4D192B] text-white py-2 rounded-full text-center font-semibold cursor-pointer"
                  onClick={() => setLoginPrompt(null)}
                >
                  Login
                </Link>

                <button
                  onClick={() => setLoginPrompt(null)}
                  className="flex-1 border border-gray-300 py-2 rounded-full text-gray-700 cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ================== PREMIUM REVIEWS SECTION ================== */}
      <div className="max-w-6xl mx-auto px-4 mt-20 mb-20">
        <h2 className="text-3xl font-bold text-[#3B0B11] mb-2">
          Customer Reviews
        </h2>
        <p className="text-gray-500 mb-8">
          Real experiences from buyers like you
        </p>

        <div className="flex flex-col lg:flex-row gap-10">
          {/* -------- LEFT PANEL -------- */}
          <div className="lg:w-1/3 bg-white/80 backdrop-blur-xl shadow-[0_10px_40px_rgba(77,25,43,0.12)] rounded-3xl p-7 border border-[#4D192B15]">
            {/* Rating Figure */}
            <div className="flex items-center gap-4">
              <span className="text-6xl font-extrabold text-[#4D192B] leading-none">
                {overallRating}
              </span>

              <div>
                <div className="flex text-yellow-400 text-xl">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <FaStar
                      key={s}
                      className={
                        s <= Math.round(overallRating)
                          ? "text-yellow-400"
                          : "text-gray-300"
                      }
                    />
                  ))}
                </div>

                <p className="text-gray-500 text-sm">
                  Based on {reviews.length} reviews
                </p>
              </div>
            </div>

            {/* Rating bars */}
            <div className="mt-6 space-y-2">
              {[5, 4, 3, 2, 1].map((star) => {
                const count = reviews.filter((r) => r.rating === star).length;
                const percent = reviews.length
                  ? (count / reviews.length) * 100
                  : 0;

                return (
                  <div key={star} className="flex items-center gap-3">
                    <span className="w-6 text-sm font-semibold text-[#4D192B]">
                      {star}★
                    </span>

                    <div className="w-full h-2 bg-[#4D192B14] rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-[#4D192B] to-[#8b2c45]"
                        style={{ width: `${percent}%` }}
                      />
                    </div>

                    <span className="text-sm text-gray-500 w-10 text-right">
                      {count}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* CTA */}
            <div className="text-center mt-7">
              {user ? (
                <button
                  onClick={() => setShowReviewForm(!showReviewForm)}
                  className="px-6 py-2.5 bg-[#4D192B] text-white rounded-full font-semibold shadow-[0_8px_25px_rgba(77,25,43,0.3)] hover:scale-105 transition-all cursor-pointer"
                >
                  {showReviewForm ? "Cancel Review" : "Write a Review"}
                </button>
              ) : (
                <p className="text-gray-700 text-sm">
                  Please
                  <Link
                    to="/login"
                    className="text-[#4D192B] font-semibold mx-1 underline"
                  >
                    login
                  </Link>
                  to share your experience
                </p>
              )}
            </div>
          </div>

          {/* -------- RIGHT SECTION -------- */}
          <div className="lg:w-2/3">
            {/* Review Form */}
            {showReviewForm && (
              <div className="rounded-3xl p-7 mb-8 bg-white/90 backdrop-blur-xl shadow-[0_10px_40px_rgba(77,25,43,0.12)] border border-[#4D192B15]">
                <h3 className="text-xl font-bold text-[#4D192B] mb-4">
                  Share your experience
                </h3>

                <div className="flex gap-2 mb-3">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <FaStar
                      key={star}
                      size={28}
                      className={`cursor-pointer drop-shadow-sm ${
                        star <= newReview.rating
                          ? "text-yellow-400"
                          : "text-gray-300"
                      }`}
                      onClick={() =>
                        setNewReview({ ...newReview, rating: star })
                      }
                    />
                  ))}
                </div>

                <textarea
                  className="w-full border border-[#4D192B20] rounded-2xl p-3 outline-none focus:ring-2 focus:ring-[#4D192B50]"
                  rows="4"
                  placeholder="Write your review..."
                  value={newReview.text}
                  onChange={(e) =>
                    setNewReview({ ...newReview, text: e.target.value })
                  }
                />

                <input
                  type="file"
                  multiple
                  accept="image/*"
                  className="mt-3 cursor-pointer"
                  onChange={async (e) => {
                    const files = Array.from(e.target.files);
                    const converted = await Promise.all(
                      files.map((f) => toBase64(f))
                    );
                    setNewReview({ ...newReview, images: converted });
                  }}
                />

                <button
                  className="mt-5 bg-green-600 px-7 py-2.5 text-white rounded-full font-semibold shadow hover:scale-105 transition cursor-pointer"
                  onClick={submitReview}
                >
                  Submit Review
                </button>
              </div>
            )}

            {/* Reviews */}
            {reviews.length === 0 ? (
              <p className="text-gray-500">No reviews yet. Be the first ✨</p>
            ) : (
              <div className="space-y-6">
                {reviews.map((r, i) => (
                  <div
                    key={i}
                    className="rounded-3xl p-6 bg-white/90 backdrop-blur-xl shadow-[0_10px_40px_rgba(77,25,43,0.12)] border border-[#4D192B15]"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-semibold text-[#4D192B]">
                          {r.user?.name || r.userName || "Customer"}
                        </h4>

                        <div className="flex gap-1 text-yellow-400 mt-1">
                          {[...Array(5)].map((_, idx) => (
                            <FaStar
                              key={idx}
                              className={
                                idx < r.rating
                                  ? "text-yellow-400"
                                  : "text-gray-300"
                              }
                            />
                          ))}
                        </div>
                      </div>

                      {user &&
                        String(r.user?._id || r.user) === String(user?._id) && (
                          <button
                            className="text-red-500 text-sm hover:underline"
                            onClick={() => deleteReview(r._id)}
                          >
                            Delete
                          </button>
                        )}
                    </div>

                    <p className="mt-3 text-gray-700 leading-relaxed">
                      {r.text}
                    </p>

                    {r.images?.length > 0 && (
                      <div className="flex gap-3 mt-4 flex-wrap">
                        {r.images.map((img, idx) => (
                          <img
                            key={idx}
                            src={img}
                            className="h-20 w-20 rounded-2xl object-cover shadow cursor-pointer hover:scale-105 transition"
                            onClick={() => openReviewLightbox(r.images, idx)}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ================= REVIEW IMAGE LIGHTBOX ================= */}
      <AnimatePresence>
        {reviewLightboxOpen && (
          <motion.div
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[2000] flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setReviewLightboxOpen(false)}
          >
            <motion.div
              className="relative max-w-3xl w-[95%] bg-white rounded-3xl shadow-2xl p-5"
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close */}
              <button
                className="absolute top-3 right-3 text-gray-700 text-xl hover:text-black cursor-pointer"
                onClick={() => setReviewLightboxOpen(false)}
              >
                ✕
              </button>

              {/* Image */}
              <img
                src={currentReviewImages[reviewLightboxIndex]}
                className="w-full max-h-[70vh] object-contain rounded-2xl"
              />

              {/* Navigation */}
              <div className="flex justify-between mt-4">
                <button
                  className="px-4 py-2 rounded-full bg-[#4D192B] text-white disabled:bg-gray-400 cursor-pointer"
                  disabled={reviewLightboxIndex === 0}
                  onClick={() => setReviewLightboxIndex((prev) => prev - 1)}
                >
                  Prev
                </button>

                <button
                  className="px-4 py-2 rounded-full bg-[#4D192B] text-white disabled:bg-gray-400 cursor-pointer"
                  disabled={
                    reviewLightboxIndex === currentReviewImages.length - 1
                  }
                  onClick={() => setReviewLightboxIndex((prev) => prev + 1)}
                >
                  Next
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <Footer />
    </>
  );
}
