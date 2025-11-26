import React from "react";
import { FiTruck, FiCreditCard, FiZap } from "react-icons/fi";

const WINE = "#6D0A1E";

export default function PromoTicker() {
  const content = (
    <>
      <span className="flex items-center gap-2">
        <FiTruck className="text-xl" />
        Free Shipping all over India 
      </span>

      <span className="flex items-center gap-2">
        <FiCreditCard className="text-xl" />
        Cash on Delivery Available
      </span>

      <span className="flex items-center gap-2">
        <FiZap className="text-xl" />
        New Arrivals Live Now — Shop Trending Styles!
      </span>
    </>
  );

  return (
    <div
      className="w-full overflow-hidden border-y border-white/30"
      style={{ backgroundColor: WINE }}
    >
      <div className="flex whitespace-nowrap text-white text-[15px] font-semibold tracking-wide">
        <div className="animate-marquee flex items-center gap-16 py-3 px-6">
          {content}
        </div>

        {/* Duplicate content for seamless scroll */}
        <div className="animate-marquee flex items-center gap-16 py-3 px-6">
          {content}
        </div>
      </div>
    </div>
  );
}
