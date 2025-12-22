import React, { useRef } from "react";
import ProductCard from "./ProductCard2";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";

const WINE = "#4D192B";

export default function BestsellerGrid({ items = [] }) {
  if (!items.length) return null;

  // Duplicate if few products (loop safety)
  const slides =
    items.length < 6 ? [...items, ...items, ...items] : items;

  const swiperRef = useRef(null);

  return (
    <section className="relative max-w-7xl mx-auto px-4 mt-24 mb-28">
      {/* HEADING */}
      <div className="text-center mb-12">
        <h3
          className="text-4xl md:text-5xl font-bold tracking-wide"
          style={{ color: WINE }}
        >
          Our Bestsellers
        </h3>
        <div className="mt-3 h-[2px] w-20 mx-auto bg-[#4D192B]/40 rounded-full" />
      </div>

      {/* PREMIUM AUTO CAROUSEL */}
      <Swiper
        modules={[Autoplay]}
        loop
        centeredSlides={false}
        spaceBetween={32}
        slidesPerView={1.4}
        speed={14000} 
        autoplay={{
          delay: 0,
          disableOnInteraction: false,
          pauseOnMouseEnter: true,
        }}
        allowTouchMove={true}
        breakpoints={{
          640: { slidesPerView: 2.2 },
          768: { slidesPerView: 3 },
          1024: { slidesPerView: 4 },
        }}
        className="!overflow-visible"
        onSwiper={(swiper) => (swiperRef.current = swiper)}
      >
        {slides.map((p, i) => (
          <SwiperSlide key={`${p._id}-${i}`}>
            <div className="max-w-[280px] mx-auto">
              <div className="rounded-2xl shadow-[0_22px_55px_-18px_rgba(0,0,0,0.28)] transition-shadow duration-700 hover:shadow-[0_28px_70px_-20px_rgba(0,0,0,0.35)]">
                <ProductCard product={p} />
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
}
