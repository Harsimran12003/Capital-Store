import React, { useState } from "react";
import { motion } from "framer-motion";
import { FiHeart, FiShoppingCart } from "react-icons/fi";

export default function ProductCard({ p }) {
  const [liked, setLiked] = useState(false);
  const [explode, setExplode] = useState(false);
  const [qty, setQty] = useState(0);
  const [flip, setFlip] = useState(false);

  const confetti = Array.from({ length: 12 });

  const handleMove = (e) => {
    const card = e.currentTarget;
    const r = card.getBoundingClientRect();
    const dx = e.clientX - (r.left + r.width / 2);
    const dy = e.clientY - (r.top + r.height / 2);
    card.style.transform = `rotateX(${dy / 20}deg) rotateY(${dx / 20}deg) scale(1.03)`;
  };

  const resetTilt = (e) => {
    e.currentTarget.style.transform =
      "rotateX(0deg) rotateY(0deg) scale(1)";
  };

  const handleAddToCart = () => {
    setQty(1);
    setFlip(true);
    setTimeout(() => setFlip(false), 250);
  };

  const handleInc = () => {
    setQty((prev) => prev + 1);
    setFlip(true);
    setTimeout(() => setFlip(false), 250);
  };

  const handleDec = () => {
    setQty((prev) => {
      if (prev <= 1) return 0;
      return prev - 1;
    });
    setFlip(true);
    setTimeout(() => setFlip(false), 250);
  };

  return (
  <motion.div
    initial={{ opacity: 0, y: 40 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6, ease: "easeOut" }}
    viewport={{ once: true }}
  >
    <motion.div
      className="relative rounded-3xl bg-white shadow-xl overflow-hidden group cursor-pointer
                 transition-all duration-500"
      style={{
        transformStyle: "preserve-3d",
      }}
      onMouseMove={handleMove}
      onMouseLeave={resetTilt}
      whileHover={{
  y: -6,
  boxShadow: "0 18px 35px rgba(0,0,0,0.15)",
  transition: { duration: 0.35 }
}}

    >

      {/* Soft White Glow (subtle premium) */}
<div
  className="
    absolute inset-0 rounded-3xl 
    opacity-0 group-hover:opacity-100 
    blur-3xl pointer-events-none
    transition-all duration-700
  "
  style={{
    background:
      "radial-gradient(circle at 50% 20%, rgba(255,255,255,0.45), rgba(255,255,255,0.12), rgba(255,255,255,0))"
  }}
/>


      {/* Soft Glass Reflection */}
<div
  className="
    absolute top-0 left-0 w-full h-1/3
    bg-gradient-to-b from-white/40 to-transparent
    opacity-40 group-hover:opacity-70 
    transition-all duration-700
    pointer-events-none
  "
/>
{/* Gold-ish border flash */}
<div
  className="
    absolute inset-0 rounded-3xl border 
    border-transparent group-hover:border-[#d4b98c]/60 
    transition-all duration-500 pointer-events-none
  "
/>



      {/* PRODUCT IMAGE */}
      <div className="relative h-56 overflow-hidden rounded-3xl">
        <motion.img
          src={p.img}
          alt={p.name}
          className="w-full h-full object-cover rounded-3xl"
          whileHover={{ scale: 1.12 }}
          transition={{ duration: 1.1 }}
        />

        {/* Clean Shine Sweep */}
<motion.div
  animate={{ x: ["-150%", "160%"] }}
  transition={{ duration: 1.9, repeat: Infinity }}
  className="absolute top-0 left-0 h-full w-[35%] 
             bg-gradient-to-r from-transparent via-white/35 to-transparent
             skew-x-12 blur-sm"
/>


        {/* ❤️ Heart Button */}
        <motion.button
          onClick={() => {
            setLiked(true);
            setExplode(true);
            setTimeout(() => setExplode(false), 700);
            setTimeout(() => setLiked(false), 1200);
          }}
          whileTap={{ scale: 0.75 }}
          className="
            absolute top-3 right-3 z-20
            bg-white/70 backdrop-blur-xl p-2 rounded-full shadow-lg
            border border-white/50
            transition-all duration-300
            hover:scale-110 hover:bg-white
          "
        >
          <FiHeart
            size={20}
            className={liked ? "text-red-600" : "text-gray-700"}
          />
        </motion.button>

        {/* Confetti */}
        {explode && (
          <div className="absolute inset-0 pointer-events-none z-30">
            {confetti.map((_, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 1, scale: 1 }}
                animate={{
                  x: (Math.random() - 0.5) * 150,
                  y: (Math.random() - 0.5) * 150,
                  opacity: 0,
                  scale: 0,
                }}
                transition={{ duration: 0.9 }}
                className="absolute left-1/2 top-1/2 w-2 h-2 rounded-full"
                style={{
                  backgroundColor: `hsl(${Math.random() * 360}, 80%, 60%)`,
                }}
              />
            ))}
          </div>
        )}
      </div>

      {/* CONTENT */}
      <div className="p-4">
        <h4 className="font-bold text-sm tracking-wide text-gray-900">
          {p.name}
        </h4>
        <p className="text-xs text-gray-500 mt-1">{p.desc}</p>

        <div className="mt-4 flex justify-between items-center">
          {/* PRICE */}
          <div>
            <motion.div
              className="font-bold text-sm text-gray-900"
              animate={flip ? { rotateX: [0, 90, 0] } : {}}
              transition={{ duration: 0.25 }}
            >
              ₹{p.price}
            </motion.div>

            <motion.div
              className="line-through text-xs text-gray-400"
              animate={
                flip
                  ? { opacity: [1, 0.3, 1], rotateX: [0, 90, 0] }
                  : {}
              }
              transition={{ duration: 0.25 }}
            >
              ₹{p.mrp}
            </motion.div>

            <div className="text-xs text-green-600 font-semibold">
              {p.off}% off
            </div>
          </div>

          {/* 🛒 ADD TO CART / QUANTITY */}
          {qty === 0 ? (
            <motion.button
              onClick={handleAddToCart}
              whileTap={{ scale: 0.9 }}
              className="
                px-4 py-2 bg-black text-white rounded-full shadow-md text-xs flex items-center gap-2
                hover:bg-gray-900
                transition-all duration-300
              "
            >
              <FiShoppingCart size={16} />
              <span>Add to Cart</span>
            </motion.button>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.25 }}
              className="flex items-center gap-2 bg-black text-white px-3 py-2 rounded-full shadow-md text-xs"
            >
              <motion.button
                whileTap={{ scale: 0.8 }}
                onClick={handleDec}
                className="text-lg leading-none px-1"
              >
                –
              </motion.button>

              <motion.span
                key={qty}
                initial={{ rotateX: 90, opacity: 0 }}
                animate={{ rotateX: 0, opacity: 1 }}
                transition={{ duration: 0.2 }}
                className="text-sm font-semibold w-4 text-center"
              >
                {qty}
              </motion.span>

              <motion.button
                whileTap={{ scale: 0.8 }}
                onClick={handleInc}
                className="text-lg leading-none px-1"
              >
                +
              </motion.button>
            </motion.div>
          )}
        </div>
      </div>

      {/* Glow overlay — non-blocking */}
      <motion.div className="absolute inset-0 rounded-3xl bg-white/5 blur-xl opacity-0 group-hover:opacity-100 pointer-events-none" />
    </motion.div>
  </motion.div>
);

}
