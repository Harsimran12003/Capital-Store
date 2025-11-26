import React, { useState, useEffect, useRef, useCallback } from "react";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

const heroSlides = [
  {
    id: 1,
    title: "Summer Collection 2025",
    subtitle: "Cool & Breezy Fabrics",
    tag: "NEW DROP",
    img: "/assets/banner1.jpg",
  },
  {
    id: 2,
    title: "Wedding & Festive",
    subtitle: "Handcrafted glamour for big moments",
    tag: "WEDDING EDIT",
    img: "/assets/banner2.jpg",
  },
  {
    id: 3,
    title: "New Arrivals",
    subtitle: "Fresh fashion every week",
    tag: "TRENDING",
    img: "/assets/banner3.jpg",
  },
  {
    id: 4,
    title: "Designer Lehengas",
    subtitle: "Luxury with elegance",
    tag: "EXCLUSIVE",
    img: "/assets/banner4.jpg",
  },
  {
    id: 5,
    title: "Traditional Sarees",
    subtitle: "Timeless beauty that lasts forever",
    tag: "ETHNIC",
    img: "/assets/banner5.jpg",
  },
  {
    id: 6,
    title: "Party Wear Gowns",
    subtitle: "Celebrate in glamour",
    tag: "PARTY",
    img: "/assets/banner6.jpg",
  },
];

export default function HeroSlider() {
  const [index, setIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [pos, setPos] = useState({ x: 0, y: 0 });
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

  // Autoplay progress bar
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

  // Mouse Parallax Movement
  const handleMouseMove = (e) => {
    const { innerWidth, innerHeight } = window;
    const x = (e.clientX - innerWidth / 2) / 40;
    const y = (e.clientY - innerHeight / 2) / 40;
    setPos({ x, y });
  };

  return (
    <section
      className="relative w-full mt-[90px] overflow-hidden select-none"
      onMouseMove={handleMouseMove}
    >
      {/* BACKGROUND IMAGE LAYER (slow parallax) */}
      <div className="relative w-full h-[80vh] md:h-[90vh] overflow-hidden">
        {heroSlides.map((slide, i) => (
          <div
            key={slide.id}
            className={`absolute inset-0 bg-cover bg-center transition-opacity duration-[1200ms] ${
              index === i ? "opacity-100" : "opacity-0"
            }`}
            style={{
              backgroundImage: `url(${slide.img})`,
              transform: `translate(${pos.x / 6}px, ${pos.y / 6}px)`
            }}
          />
        ))}
      </div>

      {/* GRADIENT OVERLAY (mid-layer parallax) */}
      <div
        className="absolute inset-0 bg-gradient-to-r from-black/70 to-transparent"
        style={{
          transform: `translate(${pos.x / 12}px, ${pos.y / 12}px)`
        }}
      />

      {/* TEXT + CTA FOREGROUND (strong parallax) */}
      <div
        className="absolute inset-0 flex flex-col justify-center px-10 md:px-24 text-white"
        style={{
          transform: `translate(${pos.x / 4}px, ${pos.y / 4}px)`
        }}
      >
        <span className="px-4 py-1 bg-white/20 text-xs md:text-sm font-semibold rounded-full w-fit backdrop-blur-sm">
          {heroSlides[index].tag}
        </span>

        <h1 className="text-4xl md:text-6xl font-bold leading-tight mt-4">
          {heroSlides[index].title}
        </h1>

        <p className="text-lg md:text-2xl mt-4 opacity-90">
          {heroSlides[index].subtitle}
        </p>

        <button className="mt-6 bg-white text-black font-semibold px-8 py-3 rounded-full shadow-lg hover:scale-110 transition-all">
          Shop Now
        </button>
      </div>

      {/* PROGRESS BAR (Nykaa style) */}
      <div className="absolute bottom-4 left-0 w-full px-20 flex gap-3">
        {heroSlides.map((_, i) => (
          <div
            key={i}
            className="h-[3px] bg-white/40 rounded-lg cursor-pointer flex-1 overflow-hidden"
            onClick={() => {
              setIndex(i);
              setProgress(0);
            }}
          >
            <div
              className="h-full bg-white transition-all duration-75"
              style={{ width: index === i ? `${progress}%` : 0 }}
            />
          </div>
        ))}
      </div>

      {/* ARROWS */}
      <button
        onClick={goPrev}
        className="absolute top-1/2 left-6 -translate-y-1/2 bg-white/60 p-3 rounded-full hover:bg-white"
      >
        <FiChevronLeft size={28} />
      </button>
      <button
        onClick={goNext}
        className="absolute top-1/2 right-6 -translate-y-1/2 bg-white/60 p-3 rounded-full hover:bg-white"
      >
        <FiChevronRight size={28} />
      </button>
    </section>
  );
}
