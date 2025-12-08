import React from "react";
import { Link, useLocation } from "react-router-dom";

export default function Breadcrumb() {
  const location = useLocation();

  // Example: "/readymade/cotton"
  const pathParts = location.pathname.split("/").filter(Boolean);

  // Convert "cotton-wear" → "Cotton Wear"
  const format = (str) =>
    str
      .split("-")
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(" ");

  return (
    <div className="text-sm text-gray-500 mb-4 flex items-center gap-1 flex-wrap">
      <Link to="/" className="hover:underline">Home</Link>

      {pathParts.length > 0 &&
        pathParts.map((part, index) => {
          const fullPath = "/" + pathParts.slice(0, index + 1).join("/");

          return (
            <span key={index} className="flex items-center gap-1">
              <span>/</span>
              <Link
                to={fullPath}
                className={`hover:underline ${
                  index === pathParts.length - 1
                    ? "font-semibold text-gray-700"
                    : ""
                }`}
              >
                {format(part)}
              </Link>
            </span>
          );
        })}
    </div>
  );
}
