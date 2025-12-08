import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function IntroScreen() {
  const [showIntro, setShowIntro] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const introShown = sessionStorage.getItem("intro_shown");
    if (!introShown) {
      setShowIntro(true);
      sessionStorage.setItem("intro_shown", "true");
    }
    const mq = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mq ? mq.matches : false);
    const onChange = () => setReducedMotion(mq.matches);
    if (mq && mq.addEventListener) mq.addEventListener("change", onChange);
    return () => mq && mq.removeEventListener && mq.removeEventListener("change", onChange);
  }, []);

  useEffect(() => {
    if (!showIntro || reducedMotion) return;
    const timer = setTimeout(() => setShowIntro(false), 2400);
    return () => clearTimeout(timer);
  }, [showIntro, reducedMotion]);

  const sparkles = React.useMemo(
    () =>
      Array.from({ length: 10 }).map(() => ({
        left: 6 + Math.random() * 88 + "%",
        top: 8 + Math.random() * 80 + "%",
        delay: Math.random() * 0.9,
        size: 3 + Math.floor(Math.random() * 8),
        hue: 30 + Math.floor(Math.random() * 40),
        duration: 0.9 + Math.random() * 0.9,
      })),
    []
  );

  const letters = "CAPITAL STORE".split("");

  const letterVariants = {
    hidden: { y: 10, opacity: 0, rotate: -6 },
    visible: (i) => ({
      y: 0,
      opacity: 1,
      rotate: 0,
      transition: { delay: 0.18 + i * 0.04, duration: 0.42, ease: "easeOut" },
    }),
  };

  return (
    <AnimatePresence>
      {showIntro && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 3 } }}
          className="fixed inset-0 z-[9999] flex items-center justify-center overflow-hidden"
          style={{
            background:
              "radial-gradient(900px 400px at 10% 12%, rgba(77,25,43,0.08), transparent 6%), radial-gradient(700px 300px at 90% 92%, rgba(60,20,30,0.06), transparent 6%), linear-gradient(180deg, #fffaf8 0%, #fff5ef 100%)",
          }}
          aria-hidden
        >
          {/* subtle particle background */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none" aria-hidden>
            <defs>
              <radialGradient id="g1" cx="50%" cy="30%">
                <stop offset="0%" stopColor="#fff7ed" stopOpacity="0.9" />
                <stop offset="100%" stopColor="#fff" stopOpacity="0" />
              </radialGradient>
            </defs>
            <rect width="100%" height="100%" fill="url(#g1)" />
          </svg>

          {/* central card */}
          <motion.div
            className="relative z-20 flex flex-col items-center justify-center px-8 py-10 rounded-3xl shadow-[0_30px_80px_rgba(20,10,10,0.14)]"
            initial={reducedMotion ? {} : { scale: 0.9, y: 14, opacity: 0 }}
            animate={reducedMotion ? {} : { scale: 1, y: 0, opacity: 1 }}
            exit={reducedMotion ? {} : { scale: 0.94, opacity: 0 }}
            transition={{ type: "spring", stiffness: 260, damping: 28 }}
            style={{
              background: "linear-gradient(180deg, rgba(255,255,255,0.98), rgba(255,250,246,0.95))",
              border: "1px solid rgba(212,185,140,0.12)",
            }}
          >
            {/* elegant top ribbon */}
            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="absolute -top-6 left-1/2 -translate-x-1/2 w-48 h-10 rounded-full"
              style={{
                background: "linear-gradient(90deg,#f5e7c9,#fff2df 40%, #f7e9cc)",
                boxShadow: "0 8px 24px rgba(212,185,140,0.08)",
                border: "1px solid rgba(212,185,140,0.08)",
              }}
            />

            {/* logo tile */}
            <motion.div
              className="relative z-30 rounded-xl flex items-center justify-center"
              initial={{ scale: 0.6, rotate: -8, opacity: 0 }}
              animate={{ scale: 1, rotate: 0, opacity: 1 }}
              transition={{ duration: 0.7, ease: "easeOut" }}
              style={{
                width: 150,
                height: 150,
                borderRadius: 18,
                background:
                  "linear-gradient(180deg, rgba(255,255,255,0.7), rgba(255,250,246,0.7))",
                border: "1px solid rgba(212,185,140,0.14)",
                boxShadow: "0 20px 40px rgba(18,6,6,0.12)",
              }}
            >
              <img src="/logo.png" alt="CapitalStore" className="w-28 h-28 object-contain" />
            </motion.div>

            {/* animated logotype */}
            <div className="relative z-30 mt-6 text-center">
              <div className="flex items-center justify-center gap-2">
                {letters.map((ch, i) => (
                  <motion.span
                    key={i}
                    custom={i}
                    variants={letterVariants}
                    initial="hidden"
                    animate="visible"
                    className="text-2xl tracking-widest font-extrabold"
                    style={{
                      background: "linear-gradient(90deg,#3b0b11,#8a3a2b)",
                      WebkitBackgroundClip: "text",
                      backgroundClip: "text",
                      color: "transparent",
                    }}
                  >
                    {ch}
                  </motion.span>
                ))}
              </div>
              <motion.p
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.45, duration: 0.45 }}
                className="mt-2 text-sm text-gray-600"
              >
                Luxury pieces, curated for you
              </motion.p>
            </div>

            {/* shimmer bar */}
            <motion.div
              aria-hidden
              initial={{ x: "-110%" }}
              animate={{ x: "110%" }}
              transition={{ delay: 0.6, duration: 1.2, repeat: Infinity, ease: "linear" }}
              style={{
                height: 12,
                width: "60%",
                borderRadius: 9999,
                background:
                  "linear-gradient(90deg, rgba(255,255,255,0), rgba(255,255,255,0.6), rgba(255,255,255,0))",
                mixBlendMode: "overlay",
              }}
              className="absolute bottom-8 left-1/2 -translate-x-1/2 opacity-80 pointer-events-none"
            />

            
          </motion.div>

          {/* floating sparkles / confetti */}
          <div className="absolute inset-0 z-10 pointer-events-none">
            {!reducedMotion &&
              sparkles.map((s, i) => (
                <motion.span
                  key={i}
                  initial={{ opacity: 0, y: 8, scale: 0.6 }}
                  animate={{ opacity: [0.9, 0], y: -28 - Math.random() * 40, scale: 0.5 }}
                  transition={{ delay: s.delay, duration: s.duration, ease: "easeOut" }}
                  style={{
                    position: "absolute",
                    left: s.left,
                    top: s.top,
                    width: s.size,
                    height: s.size,
                    borderRadius: 9999,
                    background: `hsl(${s.hue}deg 78% 56%)`,
                    boxShadow: `0 8px 22px rgba(0,0,0,0.08)`,
                    transformOrigin: "center",
                  }}
                />
              ))}
          </div>

          {/* subtle bottom gloss */}
          <div
            className="absolute inset-x-0 bottom-0 h-24 pointer-events-none"
            style={{
              background: "linear-gradient(180deg, rgba(255,255,255,0), rgba(255,244,236,0.6))",
            }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
