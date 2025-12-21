import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { motion, AnimatePresence } from "framer-motion";
import { FiHeart, FiShoppingCart, FiCheckCircle } from "react-icons/fi";
import { FaStar } from "react-icons/fa";
import useAuth from "../hooks/useAuth";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";

// Swiper
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Thumbs, FreeMode } from "swiper/modules";

export default function ProductDetails() {
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

  // Reviews state
  const [reviews, setReviews] = useState([]);

  const [newReview, setNewReview] = useState({ rating: 0, text: "", images: [] });
  const [showReviewForm, setShowReviewForm] = useState(false);

  // Review lightbox state
  const [reviewLightboxOpen, setReviewLightboxOpen] = useState(false);
  const [reviewLightboxIndex, setReviewLightboxIndex] = useState(0);
  const [currentReviewImages, setCurrentReviewImages] = useState([]);

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
        const res = await fetch(`https://capital-store-backend.vercel.app/api/products/${id}`);
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
      setLiked(wishlist.some(item => item.productId === product._id));
    }
  }, [wishlist, product]);
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
        <p className="text-center py-20 text-red-500">
          Product not found
        </p>
        <Footer />
      </>
    );
  }

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
      setLoginPrompt('cart');
      return;
    }
    addToCart(product);
    setAdded(true);
  };

  // Calculate overall rating
  const overallRating = reviews.length > 0 ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1) : 0;

  // Handle review submission
  const handleSubmitReview = async () => {
  if (!user) {
    setLoginPrompt("review");
    return;
  }

  const res = await fetch(
    `https://capital-store-backend.vercel.app/api/reviews/${product._id}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({
        rating: newReview.rating,
        text: newReview.text,
        images: newReview.images.map(file =>
          URL.createObjectURL(file)
        ),
      }),
    }
  );

  const data = await res.json();

  if (res.ok) {
    setReviews([data, ...reviews]);
    setNewReview({ rating: 0, text: "", images: [] });
    setShowReviewForm(false);
  }
};

  // Handle image selection
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setNewReview({ ...newReview, images: files });
  };


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
          <Link to="/" className="hover:text-[#4D192B]">Home</Link> /{" "}
          <Link to={`/${product.category.toLowerCase()}`} className="hover:text-[#4D192B]">
            {product.category}
          </Link> /{" "}
          <span className="font-semibold">{product.name}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">

          {/* ================= LEFT: IMAGES ================= */}
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
                  <div onClick={() => openLightbox(i)} className="cursor-zoom-in">
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

            {/* THUMBNAILS */}
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
                    <img src={item.src} className="h-20 rounded-xl object-cover" />
                  ) : (
                    <video src={item.src} muted className="h-20 rounded-xl object-cover" />
                  )}
                </SwiperSlide>
              ))}
            </Swiper>
          </div>

          {/* ================= RIGHT: INFO ================= */}
          <div>
            <h1 className="text-3xl font-bold text-[#4D192B]">
              {product.name}
            </h1>

            {/* RATING */}
            <div className="flex gap-1 mt-2">
              {[...Array(5)].map((_, i) => (
                <FaStar
                  key={i}
                  className={i < product.rating ? "text-yellow-500" : "text-gray-300"}
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

            <p className="mt-4 text-gray-700" style={{ whiteSpace: 'pre-line' }}>
              {product.description}
            </p>

            {/* WISHLIST */}
            <button
              className="flex gap-2 mt-5 text-[#4D192B]"
              onClick={() => {
                if (!user) {
                  setLoginPrompt('wishlist');
                  return;
                }
                toggleWishlist(product);
              }}
            >
              <FiHeart className={liked ? "text-red-500" : ""} />
              {liked ? "Wishlisted" : "Add to Wishlist"}
            </button>

            {/* CART */}
            <div className="mt-6">
              {added ? (
                <Link to="/cart">
                  <button className="px-8 py-3 bg-green-600 text-white rounded-full">
                    Go to Cart
                  </button>
                </Link>
              ) : qty === 0 ? (
                <button
                  onClick={handleAddToCart}
                  className="px-8 py-3 bg-[#4D192B] text-white rounded-full"
                >
                  Add to Cart
                </button>
              ) : (
                <div className="flex gap-6 bg-[#4D192B] text-white px-6 py-3 rounded-full w-fit">
                  <button onClick={() => setQty(qty - 1)}>-</button>
                  <span>{qty}</span>
                  <button onClick={() => setQty(qty + 1)}>+</button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ================= REVIEWS SECTION ================= */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 mb-12">
        <h2 className="text-2xl font-bold text-[#4D192B] mb-6">Customer Reviews</h2>

        {/* OVERALL RATING */}
        <div className="bg-gray-50 p-6 rounded-2xl mb-8">
          <div className="flex items-center gap-4">
            <div className="text-4xl font-bold text-[#4D192B]">{overallRating}</div>
            <div>
              <div className="flex gap-1 mb-1">
                {[...Array(5)].map((_, i) => (
                  <FaStar
                    key={i}
                    className={i < Math.floor(overallRating) ? "text-yellow-500" : "text-gray-300"}
                  />
                ))}
              </div>
              <p className="text-gray-600">Based on {reviews.length} reviews</p>
            </div>
          </div>
        </div>

        {/* WRITE REVIEW BUTTON */}
        <div className="mb-8">
          <button
            onClick={() => {
              if (!user) {
                setLoginPrompt('review');
                return;
              }
              setShowReviewForm(!showReviewForm);
            }}
            className="px-6 py-3 bg-[#4D192B] text-white rounded-full font-semibold hover:bg-[#3b0b11] transition-colors"
          >
            {showReviewForm ? "Cancel Review" : "Write a Review"}
          </button>
        </div>

        {/* REVIEW FORM */}
        {showReviewForm && user && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-white border border-gray-200 p-6 rounded-2xl mb-8 shadow-lg"
          >
            <h3 className="text-lg font-semibold mb-4">Write Your Review</h3>

            {/* RATING */}
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Rating</label>
              <div className="flex gap-1">
                {[...Array(5)].map((_, i) => (
                  <FaStar
                    key={i}
                    className={`cursor-pointer text-2xl ${i < newReview.rating ? "text-yellow-500" : "text-gray-300"}`}
                    onClick={() => setNewReview({ ...newReview, rating: i + 1 })}
                  />
                ))}
              </div>
            </div>

            {/* TEXT */}
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Review</label>
              <textarea
                value={newReview.text}
                onChange={(e) => setNewReview({ ...newReview, text: e.target.value })}
                className="w-full p-3 border border-gray-300 rounded-lg resize-none"
                rows={4}
                placeholder="Share your thoughts about this product..."
              />
            </div>

            {/* IMAGES */}
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Images (optional)</label>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageChange}
                className="w-full p-2 border border-gray-300 rounded-lg"
              />
              {newReview.images.length > 0 && (
                <div className="flex gap-2 mt-2">
                  {newReview.images.map((file, i) => (
                    <img
                      key={i}
                      src={URL.createObjectURL(file)}
                      alt="Preview"
                      className="w-16 h-16 object-cover rounded-lg"
                    />
                  ))}
                </div>
              )}
            </div>

            {/* SUBMIT */}
            <button
              onClick={handleSubmitReview}
              disabled={newReview.rating === 0 || newReview.text.trim() === ""}
              className="px-6 py-2 bg-[#4D192B] text-white rounded-full font-semibold disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              Submit Review
            </button>
          </motion.div>
        )}

        {/* REVIEWS LIST */}
        <div className="space-y-6">
          {reviews.map((review) => (
            <div key={review.id} className="bg-white border border-gray-200 p-6 rounded-2xl shadow-sm">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-[#4D192B] text-white rounded-full flex items-center justify-center font-semibold">
                  {review.user.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h4 className="font-semibold">{review.userName}</h4>
                    <div className="flex gap-1">
                      {[...Array(5)].map((_, i) => (
                        <FaStar
                          key={i}
                          className={i < review.rating ? "text-yellow-500" : "text-gray-300"}
                        />
                      ))}
                    </div>
                    <span className="text-sm text-gray-500">
                      {new Date(review.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-gray-700 mb-4">{review.text}</p>
                  {review.images.length > 0 && (
                    <div className="flex gap-2">
                      {review.images.map((img, i) => (
                        <img
                          key={i}
                          src={img}
                          alt="Review"
                          className="w-20 h-20 object-cover rounded-lg cursor-pointer hover:opacity-80 transition-opacity"
                          onClick={() => openReviewLightbox(review.images, i)}
                        />
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <Footer />

      {/* LIGHTBOX */}
      <AnimatePresence>
        {lightboxOpen && (
          <motion.div
            className="fixed inset-0 bg-black/90 z-[2000] flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setLightboxOpen(false)}
          >
            <motion.div
              className="relative max-w-4xl max-h-full p-4"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* CLOSE BUTTON */}
              <button
                onClick={() => setLightboxOpen(false)}
                className="absolute top-2 right-2 text-white text-2xl bg-black/50 rounded-full w-10 h-10 flex items-center justify-center"
              >
                ×
              </button>

              {/* MEDIA */}
              {media[lightboxIndex]?.type === "image" ? (
                <img
                  src={media[lightboxIndex].src}
                  alt="Zoomed"
                  className="max-w-full max-h-full object-contain"
                />
              ) : (
                <video
                  src={media[lightboxIndex].src}
                  controls
                  className="max-w-full max-h-full object-contain"
                />
              )}

              {/* NAVIGATION */}
              {media.length > 1 && (
                <>
                  <button
                    onClick={() => setLightboxIndex((lightboxIndex - 1 + media.length) % media.length)}
                    className="absolute left-2 top-1/2 transform -translate-y-1/2 text-white text-2xl bg-black/50 rounded-full w-10 h-10 flex items-center justify-center"
                  >
                    ‹
                  </button>
                  <button
                    onClick={() => setLightboxIndex((lightboxIndex + 1) % media.length)}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 text-white text-2xl bg-black/50 rounded-full w-10 h-10 flex items-center justify-center"
                  >
                    ›
                  </button>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* REVIEW LIGHTBOX */}
      <AnimatePresence>
        {reviewLightboxOpen && (
          <motion.div
            className="fixed inset-0 bg-black/90 z-[2000] flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setReviewLightboxOpen(false)}
          >
            <motion.div
              className="relative max-w-4xl max-h-full p-4"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* CLOSE BUTTON */}
              <button
                onClick={() => setReviewLightboxOpen(false)}
                className="absolute top-2 right-2 text-white text-2xl bg-black/50 rounded-full w-10 h-10 flex items-center justify-center"
              >
                ×
              </button>

              {/* REVIEW IMAGE */}
              <img
                src={currentReviewImages[reviewLightboxIndex]}
                alt="Review Zoomed"
                className="max-w-full max-h-full object-contain"
              />

              {/* NAVIGATION */}
              {currentReviewImages.length > 1 && (
                <>
                  <button
                    onClick={() => setReviewLightboxIndex((reviewLightboxIndex - 1 + currentReviewImages.length) % currentReviewImages.length)}
                    className="absolute left-2 top-1/2 transform -translate-y-1/2 text-white text-2xl bg-black/50 rounded-full w-10 h-10 flex items-center justify-center"
                  >
                    ‹
                  </button>
                  <button
                    onClick={() => setReviewLightboxIndex((reviewLightboxIndex + 1) % currentReviewImages.length)}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 text-white text-2xl bg-black/50 rounded-full w-10 h-10 flex items-center justify-center"
                  >
                    ›
                  </button>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

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
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-lg font-semibold text-[#3b0b11] mb-2">
                Login Required
              </h3>
              <p className="text-gray-600 text-sm mb-4">
                Please log in to {loginPrompt === 'review' ? 'write a review' : `access your ${loginPrompt}`}.
              </p>
              <div className="flex gap-3">
                <Link
                  to="/login"
                  className="flex-1 bg-[#4D192B] text-white py-2 rounded-full text-center font-semibold"
                  onClick={() => setLoginPrompt(null)}
                >
                  Login
                </Link>
                <button
                  onClick={() => setLoginPrompt(null)}
                  className="flex-1 border border-gray-300 py-2 rounded-full text-gray-700"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
