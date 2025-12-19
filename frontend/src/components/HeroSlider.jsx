import React, { useState, useEffect, useRef, useCallback } from "react";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

export default function HeroSlider() {
  const [heroSlides, setHeroSlides] = useState([]);
  const [index, setIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const intervalRef = useRef(null);

  const AUTO_TIME = 5000;

  /* ✅ FETCH SLIDES */
  useEffect(() => {
    fetch("https://capital-store-backend.vercel.app/api/hero-slides")
      .then((res) => res.json())
      .then((data) => {
        setHeroSlides(data);
        setIndex(0); // reset index
      });
  }, []);

  /* ✅ SAFE NEXT */
  const goNext = useCallback(() => {
    if (heroSlides.length === 0) return;
    setIndex((prev) => (prev + 1) % heroSlides.length);
    setProgress(0);
  }, [heroSlides.length]);

  const goPrev = () => {
    if (heroSlides.length === 0) return;
    setIndex((prev) =>
      prev === 0 ? heroSlides.length - 1 : prev - 1
    );
    setProgress(0);
  };

  /* ✅ RESPONSIVE */
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  /* ✅ AUTOPLAY (ONLY IF SLIDES EXIST) */
  useEffect(() => {
    if (heroSlides.length === 0) return;

    intervalRef.current = setInterval(() => {
      setProgress((p) => {
        if (p >= 100) {
          goNext();
          return 0;
        }
        return p + 2;
      });
    }, AUTO_TIME / 50);

    return () => clearInterval(intervalRef.current);
  }, [goNext, heroSlides.length]);

  /* PARALLAX */
  const handleMouseMove = (e) => {
    if (isMobile) return;
    setPos({
      x: (e.clientX - window.innerWidth / 2) / 60,
      y: (e.clientY - window.innerHeight / 2) / 60,
    });
  };

  /* TOUCH */
  const touchStartX = useRef(0);
  const handleTouchStart = (e) =>
    (touchStartX.current = e.touches[0].clientX);
  const handleTouchEnd = (e) => {
    const diff = e.changedTouches[0].clientX - touchStartX.current;
    if (diff > 60) goPrev();
    if (diff < -60) goNext();
  };

  if (heroSlides.length === 0) return null; // optional loader

  return (
    <section
      id="slider"
      className="relative w-full overflow-hidden select-none"
      onMouseMove={handleMouseMove}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* SLIDES */}
      <div className="relative w-full h-[38vh] sm:h-[55vh] md:h-[80vh] lg:h-[90vh] overflow-hidden">
        {heroSlides.map((slide, i) => (
          <div
            key={slide._id || i}
            className={`absolute inset-0 bg-cover bg-center transition-all duration-[1200ms]
              ${index === i ? "opacity-100" : "opacity-0"}
            `}
            style={{
              backgroundImage: `url(${slide.imageUrl})`, // ✅ FIXED
              transform: isMobile
                ? "scale(1.02)"
                : `translate(${pos.x}px, ${pos.y}px) scale(1.05)`,
              filter: index === i ? "brightness(100%)" : "brightness(70%)",
            }}
          />
        ))}
      </div>

      {/* OVERLAY */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/40 pointer-events-none" />

      {/* PROGRESS */}
      <div className="absolute bottom-4 sm:bottom-7 left-0 w-full px-6 sm:px-12 flex gap-2">
        {heroSlides.map((_, i) => (
          <div
            key={i}
            onClick={() => {
              setIndex(i);
              setProgress(0);
            }}
            className="h-[4px] bg-white/40 rounded-full cursor-pointer flex-1 overflow-hidden"
          >
            <div
              className="h-full bg-white transition-all"
              style={{ width: index === i ? `${progress}%` : "0%" }}
            />
          </div>
        ))}
      </div>

      {/* ARROWS */}
      {!isMobile && (
        <>
          <button
            onClick={goPrev}
            className="absolute top-1/2 left-6 -translate-y-1/2 bg-black/30 p-3 rounded-full text-white"
          >
            <FiChevronLeft size={26} />
          </button>

          <button
            onClick={goNext}
            className="absolute top-1/2 right-6 -translate-y-1/2 bg-black/30 p-3 rounded-full text-white"
          >
            <FiChevronRight size={26} />
          </button>
        </>
      )}
    </section>
  );
}
