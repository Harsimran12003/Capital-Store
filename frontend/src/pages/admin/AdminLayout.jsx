import React, { useEffect, useState } from "react";
import AdminSidebar from "../../components/AdminSidebar";

export default function AdminLayout({ children }) {
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
  const saved = localStorage.getItem("adminSidebarCollapse");
  setCollapsed(saved === "true");

  const handleSidebarChange = (e) => {
    setCollapsed(e.detail);
  };

  window.addEventListener("sidebar-collapse-change", handleSidebarChange);

  return () => {
    window.removeEventListener("sidebar-collapse-change", handleSidebarChange);
  };
}, []);


  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <AdminSidebar />

      {/* MAIN CONTENT */}
      <main
        className={`
          transition-all duration-300
          pt-20 md:pt-0
          p-6 mt-6
          ${collapsed ? "md:ml-20" : "md:ml-72"}
        `}
      >
        {children}
      </main>
    </div>
  );
}
