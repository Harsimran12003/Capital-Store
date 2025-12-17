import { useState } from "react";
import {
  FiMail,
  FiPhone,
  FiLogOut,
  FiUser,
  FiMapPin,
  FiShoppingBag,
} from "react-icons/fi";
import { motion } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import InitialsBadge from "../components/InitialsBadge";

const BRAND = "#4D192B";

export default function Profile() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState("profile");

  if (!user) return null;

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-gradient-to-br from-[#FAF6F7] to-white px-4 pt-28 pb-16">
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          {/* LEFT PROFILE CARD */}
          <div className="bg-white rounded-3xl shadow-xl p-6">
            <div className="flex flex-col items-center">
              <InitialsBadge name={user.name} size={80} />
              <h2 className="mt-4 text-xl font-bold text-[#4D192B]">
                {user.name}
              </h2>
              <p className="text-sm text-gray-500">{user.email}</p>

              <span className="mt-2 text-xs bg-[#4D192B]/10 text-[#4D192B] px-3 py-1 rounded-full">
                {user.authProvider === "google"
                  ? "Google Account"
                  : ""}
              </span>
            </div>

            {/* TABS */}
            <div className="mt-6 space-y-2">
              <TabButton
                active={tab === "profile"}
                icon={<FiUser />}
                label="Profile Info"
                onClick={() => setTab("profile")}
              />
              <TabButton
                active={tab === "orders"}
                icon={<FiShoppingBag />}
                label="My Orders"
                onClick={() => setTab("orders")}
              />
              <TabButton
                active={tab === "addresses"}
                icon={<FiMapPin />}
                label="Saved Addresses"
                onClick={() => setTab("addresses")}
              />
            </div>

            <button
              onClick={handleLogout}
              className="mt-6 w-full flex items-center justify-center gap-2 py-3 rounded-xl
              bg-[#4D192B] text-white hover:bg-[#3A1322] transition"
            >
              <FiLogOut /> Logout
            </button>
          </div>

          {/* RIGHT CONTENT */}
          <div className="md:col-span-2 bg-white rounded-3xl shadow-xl p-6">
            {tab === "profile" && <ProfileInfo user={user} />}
            {tab === "orders" && <Orders />}
            {tab === "addresses" && <Addresses />}
          </div>
        </motion.div>
      </div>

      <Footer />
    </>
  );
}

/* ---------- TAB BUTTON ---------- */
function TabButton({ active, icon, label, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition
        ${
          active
            ? "bg-[#4D192B] text-white"
            : "bg-gray-50 hover:bg-gray-100 text-gray-700"
        }
      `}
    >
      {icon} {label}
    </button>
  );
}

/* ---------- PROFILE INFO ---------- */
function ProfileInfo({ user }) {
  return (
    <div>
      <h3 className="text-lg font-bold text-[#4D192B] mb-4">
        Profile Information
      </h3>

      <div className="space-y-4 text-sm">
        <InfoRow icon={<FiUser />} label="Full Name" value={user.name} />
        <InfoRow icon={<FiMail />} label="Email" value={user.email} />
        {user.phone && (
          <InfoRow icon={<FiPhone />} label="Phone" value={user.phone} />
        )}
      </div>
    </div>
  );
}

/* ---------- ORDERS (Mock UI) ---------- */
function Orders() {
  return (
    <div>
      <h3 className="text-lg font-bold text-[#4D192B] mb-4">My Orders</h3>

      <div className="space-y-4">
        {[1, 2].map((id) => (
          <div
            key={id}
            className="border rounded-xl p-4 flex justify-between items-center"
          >
            <div>
              <p className="font-medium">Order #{id}234</p>
              <p className="text-sm text-gray-500">
                Status: <span className="text-green-600">Delivered</span>
              </p>
            </div>
            <span className="text-sm font-semibold">₹2,499</span>
          </div>
        ))}

        <p className="text-sm text-gray-400">
          (Replace with real orders API later)
        </p>
      </div>
    </div>
  );
}

/* ---------- ADDRESSES (Mock UI) ---------- */
function Addresses() {
  return (
    <div>
      <h3 className="text-lg font-bold text-[#4D192B] mb-4">
        Saved Addresses
      </h3>

      <div className="space-y-4">
        <div className="border rounded-xl p-4">
          <p className="font-medium">Home</p>
          <p className="text-sm text-gray-500">
            221B Baker Street, New Delhi, India
          </p>
        </div>

        <button className="text-sm text-[#4D192B] font-medium hover:underline">
          + Add New Address
        </button>
      </div>
    </div>
  );
}

/* ---------- INFO ROW ---------- */
function InfoRow({ icon, label, value }) {
  return (
    <div className="flex items-center gap-3">
      <span className="text-[#4D192B]">{icon}</span>
      <span className="text-gray-600">{label}:</span>
      <span className="font-medium">{value}</span>
    </div>
  );
}
