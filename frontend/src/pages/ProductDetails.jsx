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
  const [newReview, setNewReview] = useState({ rating: 0, text: "", images: [] });
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

  const isUnstitched =
    product?.category?.toLowerCase() === "unstitched";

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
          reviews.reduce((sum, r) => sum + r.rating, 0) /
          reviews.length
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
                    i < product.rating
                      ? "text-yellow-500"
                      : "text-gray-300"
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
                        className={`px-4 py-2 rounded-full border font-semibold text-sm ${
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
              className="flex gap-2 mt-5 text-[#4D192B]"
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
                  <button className="px-8 py-3 bg-green-600 text-white rounded-full">
                    Go to Cart
                  </button>
                </Link>
              ) : (
                <button
                  onClick={handleAddToCart}
                  disabled={!isUnstitched && !selectedSize}
                  className={`px-8 py-3 rounded-full text-white ${
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

      <Footer />
    </>
  );
}
