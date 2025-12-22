import React, { useRef } from "react";
import ProductCard from "./ProductCard2";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";

const WINE = "#4D192B";

export default function BestsellerGrid({ items = [] }) {
  if (!items.length) return null;

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
          Bestsellers
        </h3>
        <div className="mt-3 h-[2px] w-20 mx-auto bg-[#4D192B]/40 rounded-full" />
      </div>

      {/* LUXURY CAROUSEL */}
      <Swiper
        modules={[Autoplay]}
        loop
        centeredSlides
        spaceBetween={32}
        slidesPerView={1.4}
        speed={12000}              // 🐢 slower & cinematic
        autoplay={{
          delay: 0,
          disableOnInteraction: false,
          pauseOnMouseEnter: true,
        }}
        allowTouchMove={false}
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
            {({ isActive }) => (
              <div
                className={`
                  max-w-[280px] mx-auto
                  transition-all duration-[1200ms] ease-out
                  ${
                    isActive
                      ? "scale-[1.06] -translate-y-2"
                      : "scale-95 opacity-80"
                  }
                `}
              >
                {/* CARD SHELL */}
                <div
                  className={`
                    relative rounded-2xl
                    ${
                      isActive
                        ? "shadow-[0_35px_80px_-20px_rgba(77,25,43,0.45)]"
                        : "shadow-[0_18px_40px_-18px_rgba(0,0,0,0.25)]"
                    }
                    transition-shadow duration-700
                  `}
                >
                  {/* GLASS REFLECTION */}
                  {isActive && (
                    <div className="pointer-events-none absolute inset-0 rounded-2xl overflow-hidden">
                      <div className="absolute -top-1/2 left-0 w-full h-full bg-gradient-to-b from-white/25 via-transparent to-transparent rotate-[-8deg]" />
                    </div>
                  )}

                  <ProductCard product={p} />
                </div>
              </div>
            )}
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
}
