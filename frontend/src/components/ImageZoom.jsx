import React, { useState, useRef } from "react";

export default function ImageZoom({ src }) {
  const [zoom, setZoom] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const imgRef = useRef(null);

  const handleMouseMove = (e) => {
    const { left, top, width, height } = imgRef.current.getBoundingClientRect();
    const x = (e.clientX - left) / width;
    const y = (e.clientY - top) / height;

    setPosition({ x, y });
  };

  return (
    <div
      className="relative w-full h-[500px] overflow-hidden rounded-2xl shadow-xl"
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setZoom(true)}
      onMouseLeave={() => setZoom(false)}
    >
      {/* Normal Image */}
      <img
        ref={imgRef}
        src={src}
        alt="zoom"
        className="w-full h-full object-cover rounded-2xl"
      />

      {/* Zoomed Lens */}
      {zoom && (
        <div
          className="absolute pointer-events-none"
          style={{
            top: `${position.y * 100}%`,
            left: `${position.x * 100}%`,
            transform: "translate(-50%, -50%)",
            width: "170px",
            height: "170px",
            borderRadius: "50%",
            border: "2px solid white",
            backgroundImage: `url(${src})`,
            backgroundRepeat: "no-repeat",
            backgroundSize: "200% 200%",
            backgroundPosition: `${position.x * 100}% ${position.y * 100}%`,
            boxShadow: "0 0 25px rgba(0,0,0,0.5)",
          }}
        ></div>
      )}
    </div>
  );
}
