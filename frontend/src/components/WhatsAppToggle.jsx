import React, { useState } from "react";

const WINE = "#7B1F2E";

export default function WhatsAppToggle() {
  const [open, setOpen] = useState(false);

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {open && (
        <div className="mb-3 p-3 w-64 bg-white border rounded-xl shadow-lg">
          <h4 className="font-semibold text-sm">Chat with us</h4>
          <p className="text-xs text-gray-500 mt-1">Hello 👋 How can we help you?</p>

          <a
            href="https://wa.me/919999999999"
            target="_blank"
            rel="noreferrer"
            className="block text-center mt-3 px-3 py-2 rounded font-semibold text-white"
            style={{ background: WINE }}
          >
            Open WhatsApp
          </a>
        </div>
      )}

      <button
        onClick={() => setOpen(!open)}
        className="p-4 rounded-full shadow-lg text-white"
        style={{ background: WINE }}
      >
        💬
      </button>
    </div>
  );
}
