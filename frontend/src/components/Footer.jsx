import React from "react";
const WINE = "#7B1F2E";

export default function Footer() {
  return (
    <footer className="bg-white border-t mt-16">
      <div className="max-w-7xl mx-auto px-4 py-10">
        <div className="flex justify-between">

          <div>
            <h4 className="text-lg font-bold" style={{ color: WINE }}>Capital Store</h4>
            <p className="text-sm text-gray-600 mt-2">
              Quality fabrics & tailored perfection — delivered across India.
            </p>
          </div>

          <div className="text-sm text-gray-600">
            <p>Email: contact@capitalstore.in</p>
            <p>Phone: +91 99999 99999</p>
          </div>

        </div>

        <div className="text-center mt-6 text-xs text-gray-400">
          © {new Date().getFullYear()} Capital Store — All Rights Reserved.
        </div>
      </div>
    </footer>
  );
}
