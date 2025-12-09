import React from "react";
import { FiTruck, FiCreditCard, FiZap } from "react-icons/fi";

const WINE = "#4D192B";

export default function PromoTicker() {
  const items = [
    {
      icon: <FiTruck className="text-lg sm:text-xl animate-pulse-slow" />,
      text: "Free Shipping All Over India",
    },
    {
      icon: <FiCreditCard className="text-lg sm:text-xl animate-pulse-slow" />,
      text: "Cash on Delivery Available",
    },
    {
      icon: <FiZap className="text-lg sm:text-xl animate-pulse-slow" />,
      text: "New Arrivals Live Now — Shop Trending Styles!",
    },
  ];

  return (
    <div style={{ backgroundColor: WINE }} className="w-full">
      <div className="mt-2 max-w-7xl mx-auto overflow-hidden relative border-y border-white/20 shadow-[0_4px_20px_rgba(0,0,0,0.15)]">
        {/* Soft Glow */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-20 pointer-events-none" />

        {/* Shine */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent w-[150px] sm:w-[180px] animate-swipe-down opacity-30 pointer-events-none" />

        {/* Track */}
        <div className="flex whitespace-nowrap text-white text-sm sm:text-[15px] font-semibold tracking-wide">
          <div className="animate-ticker flex items-center gap-10 sm:gap-20 py-2 sm:py-3 px-4 sm:px-6 hover:[animation-play-state:paused] cursor-default">
            {items.map((item, i) => (
              <span key={i} className="flex items-center gap-1 sm:gap-2">
                {item.icon}
                <span>{item.text}</span>
              </span>
            ))}
          </div>
          <div className="animate-ticker flex items-center gap-10 sm:gap-20 py-2 sm:py-3 px-4 sm:px-6 hover:[animation-play-state:paused] cursor-default">
            {items.map((item, i) => (
              <span key={i} className="flex items-center gap-1 sm:gap-2">
                {item.icon}
                <span>{item.text}</span>
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
