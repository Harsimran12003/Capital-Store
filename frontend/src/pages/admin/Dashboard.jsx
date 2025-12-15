import React from "react";
import AdminLayout from "./AdminLayout";

export default function Dashboard() {
  return (
    <AdminLayout>
      {/* HEADER */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">
          Admin Dashboard
        </h1>
        <p className="text-gray-500 mt-1">
          Welcome back, manage your store efficiently
        </p>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
       
      </div>

      {/* RECENT ACTIVITY */}
      <div className="mt-10 bg-white rounded-2xl shadow p-6">
        <h2 className="text-xl font-semibold mb-4">
          Recent Activity
        </h2>

        <ul className="space-y-3 text-gray-600 text-sm">
          <li>✔ New product added</li>
          <li>✔ Order #1023 placed</li>
          <li>✔ Slider image updated</li>
        </ul>
      </div>
    </AdminLayout>
  );
}

