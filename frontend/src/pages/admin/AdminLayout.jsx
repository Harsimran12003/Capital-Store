import AdminSidebar from "../../components/AdminSidebar";

export default function AdminLayout({ children }) {
  return (
    <div className="min-h-screen ">
      {/* FIXED SIDEBAR */}
      <AdminSidebar />

      {/* PAGE CONTENT */}
      <main
        className="
          pt-20 md:pt-0
          md:ml-72
          p-6
          transition-all mt-6
        "
      >
        {children}
      </main>
    </div>
  );
}
