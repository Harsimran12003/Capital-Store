import { useState, useEffect } from "react";
import {
  FiMail,
  FiPhone,
  FiLogOut,
  FiUser,
  FiMapPin,
  FiShoppingBag,
  FiX,
} from "react-icons/fi";
import { motion } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import InitialsBadge from "../components/InitialsBadge";

const STEPS = ["placed", "dispatched", "in_transit", "delivered"];

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
          {/* LEFT CARD */}
          <div className="bg-white rounded-3xl shadow-xl p-6">
            <div className="flex flex-col items-center">
              <InitialsBadge name={user.name} size={80} />
              <h2 className="mt-4 text-xl font-bold text-[#4D192B]">
                {user.name}
              </h2>
              <p className="text-sm text-gray-500">{user.email}</p>
            </div>

            <div className="mt-6 space-y-2">
              <TabButton active={tab === "profile"} icon={<FiUser />} label="Profile Info" onClick={() => setTab("profile")} />
              <TabButton active={tab === "orders"} icon={<FiShoppingBag />} label="My Orders" onClick={() => setTab("orders")} />
              <TabButton active={tab === "addresses"} icon={<FiMapPin />} label="Saved Addresses" onClick={() => setTab("addresses")} />
            </div>

            <button
              onClick={handleLogout}
              className="mt-6 w-full py-3 rounded-xl bg-[#4D192B] text-white"
            >
              <FiLogOut className="inline mr-2" /> Logout
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

/* ---------------- ORDERS ---------------- */

function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    fetch("https://capital-store-backend.vercel.app/api/orders/my", {
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        setOrders(data || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) return <p className="text-gray-500">Loading orders…</p>;
  if (!orders.length) return <p className="text-gray-400">No orders yet.</p>;

  return (
    <>
      <div className="space-y-4">
        {orders.map((o) => (
          <div
            key={o._id}
            onClick={() => setSelectedOrder(o)}
            className="border rounded-xl p-4 cursor-pointer hover:shadow-md transition"
          >
            <div className="flex justify-between">
              <div>
                <p className="font-semibold">Order #{o._id.slice(-6)}</p>
                <p className="text-xs text-gray-500">
                  {new Date(o.createdAt).toLocaleDateString()}
                </p>
              </div>
              <span className="text-xs px-3 py-1 rounded-full bg-[#4D192B]/10 text-[#4D192B]">
                {o.orderStatus.replace("_", " ").toUpperCase()}
              </span>
            </div>
            <p className="mt-2 font-bold">₹{o.pricing.total}</p>
          </div>
        ))}
      </div>

      {/* MODAL */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white w-[95%] max-w-2xl rounded-3xl p-6 relative"
          >
            <button
              onClick={() => setSelectedOrder(null)}
              className="absolute top-4 right-4 bg-gray-100 p-2 rounded-full"
            >
              <FiX />
            </button>

            <h3 className="text-xl font-bold mb-6">
              Order #{selectedOrder._id.slice(-6)}
            </h3>

            {/* STEPPER */}
            <div className="mb-8 relative">
              <div className="flex justify-between">
                {STEPS.map((step, i) => {
                  const active =
                    STEPS.indexOf(selectedOrder.orderStatus) >= i;
                  return (
                    <div key={step} className="flex-1 text-center z-10">
                      <div
                        className={`mx-auto w-4 h-4 rounded-full ${
                          active ? "bg-[#4D192B]" : "bg-gray-300"
                        }`}
                      />
                      <p className={`mt-2 text-xs ${active ? "text-[#4D192B]" : "text-gray-400"}`}>
                        {step.replace("_", " ").toUpperCase()}
                      </p>
                    </div>
                  );
                })}
              </div>
              <div className="absolute left-0 right-0 top-2 h-0.5 bg-gray-200">
                <div
                  className="h-0.5 bg-[#4D192B]"
                  style={{
                    width: `${
                      (STEPS.indexOf(selectedOrder.orderStatus) /
                        (STEPS.length - 1)) *
                      100
                    }%`,
                  }}
                />
              </div>
            </div>

            {/* ITEMS */}
            <div className="text-sm">
              {selectedOrder.items.map((i, idx) => (
                <p key={idx}>
                  • {i.name} ({i.size}) × {i.qty}
                </p>
              ))}
            </div>

            <p className="mt-4 font-bold">
              Total Paid: ₹{selectedOrder.pricing.total}
            </p>

            {selectedOrder.courierName && (
              <p className="mt-2 text-sm">
                🚚 Courier: <b>{selectedOrder.courierName}</b>
              </p>
            )}
          </motion.div>
        </div>
      )}
    </>
  );
}

/* ---------------- SMALL COMPONENTS ---------------- */

function TabButton({ active, icon, label, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl ${
        active ? "bg-[#4D192B] text-white" : "bg-gray-50"
      }`}
    >
      {icon} {label}
    </button>
  );
}

function ProfileInfo({ user }) {
  return <p className="text-gray-600">Profile info unchanged</p>;
}

function Addresses() {
  return <p className="text-gray-600">Addresses unchanged</p>;
}
