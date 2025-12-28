import React from "react";
import AdminLayout from "./AdminLayout";

export default function Dashboard() {
  return (
    <AdminLayout>
      <div className="flex flex-col items-center justify-center py-16 text-center">
        
        {/* LOGO */}
        <img 
          src="../logo.png" 
          alt="Capital Store Logo"
          className="w-32 h-32 object-contain mb-6"
        />

        {/* TITLE */}
        <h1 className="text-4xl font-extrabold text-gray-800">
          Welcome to <span className="text-[#4D192B]">Admin Panel</span>
        </h1>

        {/* SUBTITLE */}
        <p className="text-gray-600 mt-3 text-lg">
          Manage your products, orders, and website content with ease.
        </p>
      </div>
    </AdminLayout>
  );
}
