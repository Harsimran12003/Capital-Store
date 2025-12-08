import React, { useState, useEffect, useRef, useCallback } from "react";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

const heroSlides = [
  { id: 1, img: "slider1.webp" },
  { id: 2, img: "slider2.webp" },
  { id: 3, img: "slider3.webp" },
  { id: 4, img: "slider4.jpg" },
  { id: 5, img: "slider5.jpg" },
  { id: 6, img: "slider6.webp" },
];

export default function HeroSlider() {
  const [index, setIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const intervalRef = useRef(null);

  const AUTO_TIME = 5000;

  const goNext = useCallback(() => {
    setIndex((prev) => (prev + 1) % heroSlides.length);
    setProgress(0);
  }, []);

  const goPrev = () => {
    setIndex((prev) => (prev === 0 ? heroSlides.length - 1 : prev - 1));
    setProgress(0);
  };

  // Responsive check
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Autoplay
  useEffect(() => {
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
  }, [goNext]);

  // Parallax (desktop only)
  const handleMouseMove = (e) => {
    if (isMobile) return;
    const { innerWidth, innerHeight } = window;
    const x = (e.clientX - innerWidth / 2) / 35;
    const y = (e.clientY - innerHeight / 2) / 35;
    setPos({ x, y });
  };

  // Mobile touch swipe
  const touchStartX = useRef(0);

  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
  };
  const handleTouchEnd = (e) => {
    const diff = e.changedTouches[0].clientX - touchStartX.current;
    if (diff > 60) goPrev();
    if (diff < -60) goNext();
  };

  return (
    <section
      id="slider"
      className="relative w-full overflow-hidden select-none"
      onMouseMove={handleMouseMove}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* SLIDES */}
      <div className="relative w-full h-[36vh] sm:h-[50vh] md:h-[85vh] lg:h-[90vh] overflow-hidden">
        {heroSlides.map((slide, i) => (
          <div
            key={slide.id}
            className={`absolute inset-0 bg-cover bg-center 
              transition-all duration-[1200ms] ease-[cubic-bezier(0.4,0,0.2,1)]
              ${index === i ? "opacity-100 scale-105" : "opacity-0 scale-100"}
            `}
            style={{
              backgroundImage: `url(${slide.img})`,
              transform: isMobile
                ? "scale(1.05)"
                : `translate(${pos.x}px, ${pos.y}px) scale(1.08)`,
              filter: index === i ? "brightness(100%)" : "brightness(60%)",
            }}
          />
        ))}
      </div>

      {/* GRADIENT OVERLAY */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/40 pointer-events-none" />

      {/* PROGRESS INDICATORS */}
      <div className="absolute bottom-5 sm:bottom-7 md:bottom-10 left-0 w-full px-10 sm:px-20 flex gap-3">
        {heroSlides.map((_, i) => (
          <div
            key={i}
            onClick={() => {
              setIndex(i);
              setProgress(0);
            }}
            className="h-[4px] bg-white/40 rounded-full cursor-pointer flex-1 overflow-hidden 
                       hover:bg-white/60 transition"
          >
            <div
              className="h-full bg-white transition-all duration-75"
              style={{ width: index === i ? `${progress}%` : 0 }}
            ></div>
          </div>
        ))}
      </div>

      {/* ARROWS — hidden on small screens */}
      {!isMobile && (
        <>
          <button
            onClick={goPrev}
            className="absolute top-1/2 left-6 -translate-y-1/2 bg-black/30 
                       backdrop-blur-sm p-3 rounded-full hover:bg-black/60
                       transition text-white"
          >
            <FiChevronLeft size={26} />
          </button>

          <button
            onClick={goNext}
            className="absolute top-1/2 right-6 -translate-y-1/2 bg-black/30 
                       backdrop-blur-sm p-3 rounded-full hover:bg-black/60
                       transition text-white"
          >
            <FiChevronRight size={26} />
          </button>
        </>
      )}
    </section>
  );
}
