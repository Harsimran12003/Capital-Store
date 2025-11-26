import React from "react";

export default function VideoSection() {
  return (
    <section className="max-w-7xl mx-auto px-4 mt-14">
      <div className="border rounded-2xl overflow-hidden p-6 flex gap-6">

        <div className="w-1/2">
          <h3 className="text-2xl font-semibold" style={{ color: "#7B1F2E" }}>About Capital Store</h3>
          <p className="mt-2 text-gray-600">
            Short brand story text here — premium fabric, expert tailoring & elegant designs.
          </p>
        </div>

        <div className="w-1/2">
          <iframe
            className="w-full h-60 rounded-lg"
            src="https://www.youtube.com/embed/dQw4w9WgXcQ"
            title="brand video"
            allowFullScreen
          />
        </div>

      </div>
    </section>
  );
}
