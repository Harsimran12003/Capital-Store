import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useParams } from "react-router-dom";

export default function TrackOrder() {
  const { id } = useParams();
  const [tracking, setTracking] = useState(null);

  useEffect(() => {
    fetch(`https://capital-store-backend.vercel.app/api/shiprocket/track/${id}`, {
      credentials: "include"
    })
      .then(res => res.json())
      .then(data => setTracking(data));
  }, [id]);

  if (!tracking)
    return (
      <div className="min-h-screen flex justify-center items-center">
        Loading…
      </div>
    );

  return (
    <>
      <Navbar />

      <div className="max-w-4xl mx-auto px-6 py-16 mt-6">
        <h1 className="text-3xl font-bold text-[#4D192B] mb-4">
          Shipment Tracking
        </h1>

        <div className="bg-white shadow-2xl rounded-2xl p-6">
          <h3 className="text-xl font-semibold">
            AWB: {tracking?.tracking_data?.shipment_track?.awb_code}
          </h3>

          <h3 className="mt-2 font-semibold text-green-700">
            Current Status:
          </h3>
          <p className="text-lg">
            {tracking?.tracking_data?.shipment_status}
          </p>

          <div className="mt-4">
            <h3 className="font-semibold">Timeline</h3>

            {tracking?.tracking_data?.shipment_track_activities?.map(
              (log, i) => (
                <div key={i} className="border-l pl-3 mt-2">
                  <p className="font-semibold">{log.location}</p>
                  <p>{log.activity}</p>
                  <p className="text-sm text-gray-500">{log.date}</p>
                </div>
              )
            )}
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}
