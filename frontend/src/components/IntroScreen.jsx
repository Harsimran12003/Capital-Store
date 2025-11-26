import React, { useEffect, useState } from "react";

export default function IntroScreen() {
  const [hide, setHide] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setHide(true), 2200);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div
      className={`
        fixed inset-0 z-[9999] 
        flex items-center justify-center
        transition-opacity duration-700
        overflow-hidden
        bg-[#3A0F1F]
        ${hide ? "opacity-0 pointer-events-none" : "opacity-100"}
      `}
    >
      {/* Radial Glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle,rgba(255,255,255,0.12)_0%,rgba(0,0,0,0)_70%)]"></div>

      {/* Gold Particles */}
      <div className="absolute inset-0 pointer-events-none animate-slowFloat opacity-30">
        <img src="/particles-gold.png" className="w-full h-full object-cover mix-blend-screen" />
      </div>

      {/* Film Grain */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.14]">
        <div className="w-full h-full grain"></div>
      </div>

      {/* Logo Wrapper */}
      <div className="relative">
        {/* Main Logo */}
        <img
          src="/logo.png"
          alt="logo"
          className="
            h-[150px] w-auto 
            opacity-0 
            animate-introLogoLux
            drop-shadow-[0_8px_20px_rgba(255,255,255,0.25)]
          "
        />

        {/* Shine Effect */}
        <div className="absolute inset-0 intro-shine-lux"></div>
      </div>
    </div>
  );
}
