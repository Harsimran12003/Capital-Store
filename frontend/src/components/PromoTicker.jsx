import React from "react";
import { FiTruck, FiCreditCard, FiZap } from "react-icons/fi";

const WINE = "#4D192B";

export default function PromoTicker() {
  const items = [
    {
      icon: <FiTruck className="text-xl animate-pulse-slow" />,
      text: "Free Shipping All Over India",
    },
    {
      icon: <FiCreditCard className="text-xl animate-pulse-slow" />,
      text: "Cash on Delivery Available",
    },
    {
      icon: <FiZap className="text-xl animate-pulse-slow" />,
      text: "New Arrivals Live Now — Shop Trending Styles!",
    },
  ];

  return (
    <div
      className="w-full overflow-hidden relative border-y border-white/20 shadow-[0_4px_20px_rgba(0,0,0,0.15)]"
      style={{ backgroundColor: WINE }}
    >
      {/* Soft Background Glow */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-20 pointer-events-none"></div>

      {/* Shine Swipe Animation */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent w-[180px] animate-swipe-down opacity-30 pointer-events-none"></div>

      {/* Scrolling Track */}
      <div className="flex whitespace-nowrap text-white text-[15px] font-semibold tracking-wide">
        
        {/* Group 1 */}
        <div className="animate-ticker flex items-center gap-20 py-3 px-6 hover:[animation-play-state:paused] cursor-default">
          {items.map((item, i) => (
            <span key={i} className="flex items-center gap-2">
              {item.icon} {item.text}
            </span>
          ))}
        </div>

        {/* Group 2 — seamless loop */}
        <div className="animate-ticker flex items-center gap-20 py-3 px-6 hover:[animation-play-state:paused] cursor-default">
          {items.map((item, i) => (
            <span key={i} className="flex items-center gap-2">
              {item.icon} {item.text}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
