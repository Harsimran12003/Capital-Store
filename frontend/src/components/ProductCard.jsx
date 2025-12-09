import React, { useState } from "react";
import { motion } from "framer-motion";
import { FiHeart, FiShoppingCart } from "react-icons/fi";

export default function ProductCard({ p }) {
  const [liked, setLiked] = useState(false);
  const [explode, setExplode] = useState(false);
  const [qty, setQty] = useState(0);
  const [flip, setFlip] = useState(false);

  const confetti = Array.from({ length: 10 });

  const handleMove = (e) => {
    if (window.innerWidth < 600) return; 
    const card = e.currentTarget;
    const r = card.getBoundingClientRect();
    const dx = e.clientX - (r.left + r.width / 2);
    const dy = e.clientY - (r.top + r.height / 2);
    card.style.transform = `rotateX(${dy / 25}deg) rotateY(${dx / 25}deg) scale(1.02)`;
  };

  const resetTilt = (e) => {
    e.currentTarget.style.transform = "rotateX(0deg) rotateY(0deg) scale(1)";
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="w-full"
    >
      <motion.div
        className="
          relative rounded-xl bg-white shadow-md overflow-hidden group cursor-pointer
          transition-all duration-500 flex flex-col
          h-auto
        "
        style={{ transformStyle: "preserve-3d" }}
        onMouseMove={handleMove}
        onMouseLeave={resetTilt}
        whileHover={{
          y: -4,
          boxShadow: "0 12px 28px rgba(0,0,0,0.12)",
        }}
      >
        {/* IMAGE — smaller + responsive */}
        <div className="relative w-full h-52 aspect-[3/5] sm:aspect-[2/3] overflow-hidden rounded-xl">
          <motion.img
            src={p.img}
            alt={p.name}
            className="w-full h-52 object-cover"
            whileHover={{ scale: 1.06 }}
            transition={{ duration: 1 }}
          />

          {/* HEART BUTTON */}
          <motion.button
            onClick={() => {
              setLiked((prev) => !prev);
              setExplode(true);
              setTimeout(() => setExplode(false), 600);
            }}
            whileTap={{ scale: 0.8 }}
            className="
              absolute top-2 right-2 z-20
              bg-white/70 backdrop-blur-xl p-1.5 rounded-full shadow-md
              border border-white/40
              hover:scale-110 cursor-pointer
            "
          >
            <FiHeart
              size={16}
              className={liked ? "text-red-600" : "text-gray-700"}
            />
          </motion.button>

          {/* CONFETTI */}
          {explode && (
            <div className="absolute inset-0 pointer-events-none z-20">
              {confetti.map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 1, scale: 1 }}
                  animate={{
                    x: (Math.random() - 0.5) * 90,
                    y: (Math.random() - 0.5) * 90,
                    opacity: 0,
                    scale: 0,
                  }}
                  transition={{ duration: 0.75 }}
                  className="absolute left-1/2 top-1/2 w-1.5 h-1.5 rounded-full"
                  style={{
                    backgroundColor: `hsl(${Math.random() * 360}, 80%, 60%)`,
                  }}
                />
              ))}
            </div>
          )}
        </div>

        {/* CONTENT — reduced spacing */}
        <div className="p-2 sm:p-2.5 flex flex-col justify-between min-h-[90px] sm:min-h-[110px]">

          <h4 className="font-semibold md:text-[15px] text-[11px] sm:text-xs text-gray-900">
            {p.name}
          </h4>

          <p className="md:text-[12px] text-[9px] sm:text-[10px] text-gray-500 mt-0.5 line-clamp-1">
            {p.desc}
          </p>

          {/* PRICE + ADD */}
          <div className="mt-2 flex justify-between items-center">

            {/* PRICE */}
            <div>
              <motion.div
                className="font-bold text-[10px] sm:text-xs text-gray-900"
                animate={flip ? { rotateX: [0, 90, 0] } : {}}
              >
                ₹{p.price}
              </motion.div>

              <motion.div
                className="line-through text-[8px] sm:text-[9px] text-gray-400"
                animate={flip ? { rotateX: [0, 90, 0] } : {}}
              >
                ₹{p.mrp}
              </motion.div>

              <div className="text-[8px] sm:text-[9px] text-green-600 font-semibold">
                {p.off}% off
              </div>
            </div>

            {/* CART BUTTONS */}
            {qty === 0 ? (
              <motion.button
                onClick={() => setQty(1)}
                whileTap={{ scale: 0.9 }}
                className="
                  md:px-5 md:py-2 md:text-[13px] px-2 py-0.5 sm:px-2.5 sm:py-1
                  bg-black text-white rounded-full shadow  
                  text-[9px] sm:text-[10px] flex items-center gap-1 cursor-pointer
                "
              >
                <FiShoppingCart size={11} />
                Add
              </motion.button>
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="
                  md:px-5 md:py-2 md:text-[13px] flex items-center gap-1  
                  bg-black text-white px-2 py-0.5 sm:px-2.5 sm:py-1
                  rounded-full shadow text-[9px] sm:text-[10px]
                "
              >
                <motion.button
                  onClick={() => setQty(qty - 1)}
                  whileTap={{ scale: 0.8 }}
                  className="text-sm leading-none cursor-pointer"
                >
                  –
                </motion.button>

                <motion.span
                  key={qty}
                  initial={{ rotateX: 90, opacity: 0 }}
                  animate={{ rotateX: 0, opacity: 1 }}
                  className="font-semibold w-3 text-center "
                >
                  {qty}
                </motion.span>

                <motion.button
                  onClick={() => setQty(qty + 1)}
                  whileTap={{ scale: 0.8 }}
                  className="text-sm leading-none cursor-pointer"
                >
                  +
                </motion.button>
              </motion.div>
            )}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
