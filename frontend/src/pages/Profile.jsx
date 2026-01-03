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
                {user.authProvider === "google" ? "Google Account" : ""}
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
              className="mt-6 w-full flex items-center justify-center gap-2 py-3 rounded-xl cursor-pointer
              bg-[#4D192B] text-white hover:bg-[#3A1322] transition"
            >
              <FiLogOut /> Logout
            </button>
          </div>

          {/* RIGHT CONTENT */}
          <div className="md:col-span-2 bg-white rounded-3xl shadow-xl p-6 ">
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
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(user.name);
  const [loading, setLoading] = useState(false);

  const saveProfile = async () => {
    if (!name.trim()) return;

    setLoading(true);
    const res = await fetch(
      "https://capital-store-backend.vercel.app/api/auth/update-profile",
      {
        method: "PUT",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
      }
    );

    const data = await res.json();
    setLoading(false);

    if (res.ok) {
      setEditing(false);
      window.location.reload(); // simple + reliable
    } else {
      alert(data.message);
    }
  };

  return (
    <div>
      <h3 className="text-lg font-bold text-[#4D192B] mb-6">
        Profile Information
      </h3>

      <div className="space-y-5 text-sm">
        {/* NAME */}
        <div className="flex items-center gap-3">
          <span className="text-[#4D192B]">
            <FiUser />
          </span>

          {editing ? (
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="border rounded-lg px-3 py-2 text-sm w-full max-w-xs"
              placeholder="Enter full name"
            />
          ) : (
            <span className="font-medium">{user.name}</span>
          )}
        </div>

        {/* EMAIL */}
        <InfoRow icon={<FiMail />} label="Email" value={user.email} />

        {/* PHONE */}
        {user.phone && (
          <InfoRow icon={<FiPhone />} label="Phone" value={user.phone} />
        )}

        {/* ACTION */}
        <button
          onClick={editing ? saveProfile : () => setEditing(true)}
          disabled={loading}
          className="text-sm font-medium text-[#4D192B] hover:underline mt-2 cursor-pointer"
        >
          {editing ? "Save Changes" : "Edit Profile"}
        </button>
      </div>
    </div>
  );
}

/* ---------- ORDERS ---------- */
function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useState(() => {
    fetch("https://capital-store-backend.vercel.app/api/orders/my", {
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        setOrders(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) return <p className="text-gray-500">Loading orders…</p>;

  if (orders.length === 0)
    return (
      <div>
        <h3 className="text-lg font-bold text-[#4D192B] mb-4">My Orders</h3>
        <p className="text-sm text-gray-400">
          You haven’t placed any orders yet.
        </p>
      </div>
    );

  return (
    <div>
      <h3 className="text-lg font-bold text-[#4D192B] mb-4">My Orders</h3>

      <div className="space-y-5">
        {orders.map((o) => (
          <div key={o._id} className="border rounded-xl p-4 shadow-sm">
            {/* HEADER */}
            <div className="flex justify-between">
              <div>
                <p className="font-semibold">Order #{o._id.slice(-6)}</p>

                <p className="text-xs text-gray-500">
                  {new Date(o.createdAt).toLocaleDateString()}
                </p>
              </div>

              <span
                className={`text-sm font-semibold px-3 py-1 rounded-full
                  ${
                    o.orderStatus === "delivered"
                      ? "bg-green-100 text-green-700"
                      : o.orderStatus === "shipped"
                      ? "bg-blue-100 text-blue-700"
                      : "bg-orange-100 text-orange-700"
                  }
                `}
              >
                {o.orderStatus.toUpperCase()}
              </span>
            </div>

            {/* ITEMS */}
            <div className="mt-3 text-sm text-gray-700">
              {o.items.map((i) => (
                <p key={i._id}>
                  • {i.name} ({i.size}) × {i.qty}
                </p>
              ))}
            </div>

            {/* TOTAL */}
            <p className="mt-2 font-bold">Total: ₹{o.pricing.total}</p>

            {/* TRACKING */}
            {o.shipment?.awb ? (
              <div className="mt-3 flex items-center justify-between">
                <p className="text-sm">
                  📦 AWB: <b>{o.shipment.awb}</b>
                </p>

                <Link
                  to={`/track/${o._id}`}
                  className="text-sm bg-[#4D192B] text-white px-4 py-2 rounded-xl cursor-pointer"
                >
                  Track Shipment
                </Link>
              </div>
            ) : (
              <p className="text-sm text-orange-500 mt-2">
                ⏳ Shipment being created…
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ---------- ADDRESSES  ---------- */
function Addresses() {
  const { user } = useAuth();
  const [addresses, setAddresses] = useState(user.addresses || []);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    label: "",
    addressLine: "",
    city: "",
    state: "",
    pincode: "",
    phone: "",
  });
  if (!/^\d{10}$/.test(form.phone)) {
    alert("Enter a valid 10 digit phone number");
    return;
  }

  const addAddress = async () => {
    if (!form.label || !form.addressLine) return;

    const res = await fetch(
      "https://capital-store-backend.vercel.app/api/auth/address",
      {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      }
    );

    const data = await res.json();
    if (res.ok) {
      setAddresses(data.addresses);
      setForm({
        label: "",
        addressLine: "",
        city: "",
        state: "",
        pincode: "",
        phone: "",
      });
      setShowForm(false);
    } else {
      alert(data.message);
    }
  };

  const deleteAddress = async (index) => {
    if (!window.confirm("Delete this address?")) return;

    const res = await fetch(
      `https://capital-store-backend.vercel.app/api/auth/address/${index}`,
      {
        method: "DELETE",
        credentials: "include",
      }
    );

    const data = await res.json();
    if (res.ok) setAddresses(data.addresses);
  };

  return (
    <div>
      <h3 className="text-lg font-bold text-[#4D192B] mb-6">Saved Addresses</h3>

      {/* ADDRESS LIST */}
      <div className="space-y-4">
        {addresses.length === 0 && (
          <p className="text-sm text-gray-400">No saved addresses yet.</p>
        )}

        {addresses.map((a, i) => (
          <div
            key={i}
            className="border rounded-xl p-4 flex justify-between items-start"
          >
            <div>
              <p className="font-medium">{a.label}</p>
              <p className="text-sm text-gray-500 mt-1">
                {a.addressLine}, {a.city}, {a.state} - {a.pincode}
              </p>
            </div>

            <button
              onClick={() => deleteAddress(i)}
              className="text-xs text-red-500 hover:underline"
            >
              Delete
            </button>
          </div>
        ))}
      </div>

      {/* ADD NEW ADDRESS */}
      <button
        onClick={() => setShowForm(!showForm)}
        className="mt-6 text-sm text-[#4D192B] font-medium hover:underline"
      >
        + Add New Address
      </button>

      {showForm && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-6 bg-gray-50 border border-gray-200 rounded-2xl p-5"
        >
          <h4 className="text-sm font-semibold text-[#4D192B] mb-4">
            Add New Address
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* LABEL */}
            <div>
              <label className="text-xs text-gray-600 mb-1 block">
                Address Label
              </label>
              <input
                placeholder="Home / Office"
                className="w-full border rounded-lg px-3 py-2 text-sm
                     focus:outline-none focus:ring-2 focus:ring-[#4D192B]/30"
                value={form.label}
                onChange={(e) => setForm({ ...form, label: e.target.value })}
              />
            </div>

            {/* PINCODE */}
            <div>
              <label className="text-xs text-gray-600 mb-1 block">
                Pincode
              </label>
              <input
                placeholder="6-digit pincode"
                className="w-full border rounded-lg px-3 py-2 text-sm
                     focus:outline-none focus:ring-2 focus:ring-[#4D192B]/30"
                value={form.pincode}
                onChange={(e) => setForm({ ...form, pincode: e.target.value })}
              />
            </div>

            {/* PHONE */}
            <div>
              <label className="text-xs text-gray-600 mb-1 block">
                Phone Number
              </label>
              <input
                placeholder="10 digit phone"
                className="w-full border rounded-lg px-3 py-2 text-sm
               focus:outline-none focus:ring-2 focus:ring-[#4D192B]/30"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
              />
            </div>

            {/* ADDRESS LINE */}
            <div className="sm:col-span-2">
              <label className="text-xs text-gray-600 mb-1 block">
                Address Line
              </label>
              <input
                placeholder="House no, street, area"
                className="w-full border rounded-lg px-3 py-2 text-sm
                     focus:outline-none focus:ring-2 focus:ring-[#4D192B]/30"
                value={form.addressLine}
                onChange={(e) =>
                  setForm({ ...form, addressLine: e.target.value })
                }
              />
            </div>

            {/* CITY */}
            <div>
              <label className="text-xs text-gray-600 mb-1 block">City</label>
              <input
                placeholder="City"
                className="w-full border rounded-lg px-3 py-2 text-sm
                     focus:outline-none focus:ring-2 focus:ring-[#4D192B]/30"
                value={form.city}
                onChange={(e) => setForm({ ...form, city: e.target.value })}
              />
            </div>

            {/* STATE */}
            <div>
              <label className="text-xs text-gray-600 mb-1 block">State</label>
              <input
                placeholder="State"
                className="w-full border rounded-lg px-3 py-2 text-sm
                     focus:outline-none focus:ring-2 focus:ring-[#4D192B]/30"
                value={form.state}
                onChange={(e) => setForm({ ...form, state: e.target.value })}
              />
            </div>
          </div>

          {/* ACTION BUTTONS */}
          <div className="flex gap-3 mt-6">
            <button
              onClick={addAddress}
              className="flex-1 bg-[#4D192B] text-white py-2 rounded-xl
                   text-sm font-medium hover:bg-[#3A1322] transition"
            >
              Save Address
            </button>

            <button
              onClick={() => setShowForm(false)}
              className="flex-1 border border-gray-300 py-2 rounded-xl
                   text-sm text-gray-600 hover:bg-gray-100 transition"
            >
              Cancel
            </button>
          </div>
        </motion.div>
      )}
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
