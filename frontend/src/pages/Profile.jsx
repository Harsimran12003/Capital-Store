import { useState, useEffect } from "react";
import {
  FiMail,
  FiPhone,
  FiLogOut,
  FiUser,
  FiMapPin,
  FiShoppingBag,
  FiX,
  FiTrash2,
  FiCheckCircle,
} from "react-icons/fi";
import { motion } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import InitialsBadge from "../components/InitialsBadge";

const STEPS = ["placed", "dispatched", "in_transit", "delivered"];

export default function Profile() {
  const { user, setUser, logout } = useAuth();
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
            {tab === "addresses" && <Addresses user={user} setUser={setUser} />}
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

  if (loading) {
     return (
        <div className="flex justify-center py-12">
           <div className="w-8 h-8 border-4 border-[#4D192B] border-t-transparent rounded-full animate-spin"></div>
        </div>
     );
  }

  if (!orders.length) {
     return (
       <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-12">
        <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400">
          <FiShoppingBag size={40} />
        </div>
        <h3 className="text-xl font-bold text-gray-800">No Orders Yet</h3>
        <p className="text-gray-500 mt-2">Looks like you haven't placed an order yet.</p>
      </motion.div>
     );
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div>
        <h3 className="text-2xl font-bold text-[#4D192B]">Order History</h3>
        <p className="text-sm text-gray-500 mt-1">Track and view details of your past orders.</p>
      </div>

      <div className="space-y-4">
        {orders.map((o) => (
          <div
            key={o._id}
            onClick={() => setSelectedOrder(o)}
            className="border rounded-2xl p-5 cursor-pointer hover:shadow-lg transition-all bg-white flex flex-col md:flex-row gap-4 justify-between items-start md:items-center"
          >
            <div className="flex items-center gap-4">
              {o.items?.[0]?.image ? (
                <img src={o.items[0].image} alt="product" className="w-16 h-16 object-cover rounded-xl border bg-gray-50" />
              ) : (
                <div className="w-16 h-16 rounded-xl border bg-gray-50 flex items-center justify-center">
                  <FiShoppingBag className="text-gray-400 text-2xl" />
                </div>
              )}
              <div>
                <p className="font-bold text-gray-800">Order #{o._id.slice(-6).toUpperCase()}</p>
                <p className="text-sm text-gray-500">
                  {new Date(o.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })}
                </p>
                <p className="text-xs font-semibold text-gray-400 mt-1">{o.items?.length || 0} ITEMS</p>
              </div>
            </div>
            <div className="text-right w-full md:w-auto flex flex-row md:flex-col justify-between items-center md:items-end">
              <p className="font-black text-xl text-[#4D192B]">₹{o.pricing.total}</p>
              <span className={`text-xs px-3 py-1 mt-0 md:mt-2 rounded-full font-bold ${
                 o.orderStatus === 'delivered' ? 'bg-green-100 text-green-700' :
                 o.orderStatus === 'pending' ? 'bg-orange-100 text-orange-700' :
                 'bg-[#4D192B]/10 text-[#4D192B]'
              }`}>
                {o.orderStatus.replace("_", " ").toUpperCase()}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* MODAL */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            className="bg-white w-full max-w-2xl rounded-[2rem] p-6 md:p-8 relative max-h-[90vh] overflow-y-auto"
          >
            <button
              onClick={() => setSelectedOrder(null)}
              className="absolute top-4 right-4 bg-gray-100 hover:bg-gray-200 p-2.5 rounded-full transition"
            >
              <FiX className="text-gray-700" />
            </button>

            <div className="mb-8">
               <h3 className="text-2xl font-black text-gray-800">
                 Order #{selectedOrder._id.slice(-6).toUpperCase()}
               </h3>
               <p className="text-sm text-gray-500 font-medium">Placed on {new Date(selectedOrder.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</p>
            </div>

            {/* STEPPER */}
            <div className="mb-10 relative px-2 hidden sm:block">
              <div className="flex justify-between">
                {STEPS.map((step, i) => {
                  const active = STEPS.indexOf(selectedOrder.orderStatus) >= i;
                  return (
                    <div key={step} className="flex-1 text-center z-10 relative">
                      <div
                        className={`mx-auto w-8 h-8 rounded-full flex items-center justify-center border-4 border-white shadow-sm transition-colors ${
                          active ? "bg-[#4D192B] text-white" : "bg-gray-200 text-gray-400"
                        }`}
                      >
                         {active && <div className="w-2.5 h-2.5 bg-white rounded-full"></div>}
                      </div>
                      <p className={`mt-3 text-xs font-bold tracking-wide ${active ? "text-[#4D192B]" : "text-gray-400"}`}>
                        {step.replace("_", " ").toUpperCase()}
                      </p>
                    </div>
                  );
                })}
              </div>
              <div className="absolute left-0 right-0 top-4 h-1 bg-gray-100 -z-10">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.max(0, (STEPS.indexOf(selectedOrder.orderStatus) / (STEPS.length - 1)) * 100)}%` }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="h-1 bg-[#4D192B]"
                />
              </div>
            </div>

            {/* ITEMS */}
            <div className="mt-8 bg-gray-50/50 p-5 rounded-2xl border border-gray-100">
              <h4 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                 <FiShoppingBag className="text-[#4D192B]" /> Items Ordered
              </h4>
              <div className="space-y-3">
                {selectedOrder.items.map((i, idx) => (
                  <div key={idx} className="flex items-center gap-4 p-3 bg-white shadow-sm rounded-xl border border-gray-100">
                    {i.image ? (
                       <img src={i.image} className="w-14 h-14 object-cover rounded-lg border bg-gray-50" />
                    ) : (
                       <div className="w-14 h-14 rounded-lg border bg-gray-100 flex items-center justify-center">
                          <FiShoppingBag className="text-gray-400" />
                       </div>
                    )}
                    <div className="flex-1">
                      <p className="font-bold text-gray-800 line-clamp-1">{i.name}</p>
                      <p className="text-xs text-gray-500 font-medium">Size: {i.size} | Qty: {i.qty}</p>
                    </div>
                    <p className="font-black text-[#4D192B]">₹{i.price * i.qty}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-6 pt-6 border-t border-gray-200 flex flex-col sm:flex-row justify-between gap-4">
              <div className="text-sm text-gray-600 bg-gray-50 p-4 rounded-xl flex-1">
                <p className="flex justify-between mb-2">
                   <span className="font-medium text-gray-500">Payment Method</span>
                   <span className="font-bold text-gray-800 uppercase">{selectedOrder.paymentMethod}</span>
                </p>
                {selectedOrder.courierName && (
                  <p className="flex justify-between">
                     <span className="font-medium text-gray-500">Courier</span>
                     <span className="font-bold text-gray-800">{selectedOrder.courierName}</span>
                  </p>
                )}
              </div>
              <div className="text-right flex-1 bg-[#4D192B]/5 p-4 rounded-xl flex flex-col justify-center items-end border border-[#4D192B]/10">
                <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Total Amount</p>
                <p className="text-3xl font-black text-[#4D192B]">₹{selectedOrder.pricing.total}</p>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </motion.div>
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
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="space-y-6"
    >
      <div>
        <h3 className="text-2xl font-bold text-[#4D192B]">Personal Information</h3>
        <p className="text-sm text-gray-500 mt-1">Manage your basic profile details.</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Card 1 */}
        <div className="bg-gradient-to-br from-white to-gray-50 border border-gray-100 rounded-2xl p-5 flex flex-col items-start gap-3 hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
          <div className="w-12 h-12 rounded-xl bg-[#4D192B]/5 flex items-center justify-center text-[#4D192B] shadow-sm border border-[#4D192B]/10">
            <FiUser size={20} />
          </div>
          <div>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Full Name</p>
            <p className="font-extrabold text-gray-800 text-[15px]">{user.name}</p>
          </div>
        </div>

        {/* Card 2 */}
        <div className="bg-gradient-to-br from-white to-gray-50 border border-gray-100 rounded-2xl p-5 flex flex-col items-start gap-3 hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
          <div className="w-12 h-12 rounded-xl bg-[#4D192B]/5 flex items-center justify-center text-[#4D192B] shadow-sm border border-[#4D192B]/10">
            <FiMail size={20} />
          </div>
          <div className="overflow-hidden w-full">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Email Address</p>
            <p className="font-extrabold text-gray-800 text-[15px] truncate" title={user.email}>{user.email}</p>
          </div>
        </div>

        {/* Card 3 */}
        {user.phone && (
          <div className="bg-gradient-to-br from-white to-gray-50 border border-gray-100 rounded-2xl p-5 flex flex-col items-start gap-3 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 md:col-span-2">
            <div className="w-12 h-12 rounded-xl bg-[#4D192B]/5 flex items-center justify-center text-[#4D192B] shadow-sm border border-[#4D192B]/10">
              <FiPhone size={20} />
            </div>
            <div>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Phone Number</p>
              <p className="font-extrabold text-gray-800 text-[15px]">{user.phone}</p>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}

function Addresses({ user, setUser }) {
  const handleDelete = async (index) => {
    try {
      const res = await fetch(`https://capital-store-backend.vercel.app/api/auth/address/${index}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (res.ok) {
        const data = await res.json();
        setUser({ ...user, addresses: data.addresses });
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleSetDefault = async (index) => {
    try {
      const res = await fetch("https://capital-store-backend.vercel.app/api/auth/select-address", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ index }),
        credentials: "include",
      });
      if (res.ok) {
        setUser({ ...user, selectedAddress: index });
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (!user?.addresses || user.addresses.length === 0) {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-12">
        <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400">
          <FiMapPin size={40} />
        </div>
        <h3 className="text-xl font-bold text-gray-800">No Addresses Found</h3>
        <p className="text-gray-500 mt-2">You haven't saved any addresses yet.</p>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="space-y-6"
    >
      <div>
        <h3 className="text-2xl font-bold text-[#4D192B]">Saved Addresses</h3>
        <p className="text-sm text-gray-500 mt-1">Manage where your orders are delivered.</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {user.addresses.map((address, index) => (
          <div key={index} className="bg-white border border-gray-200 rounded-2xl p-5 hover:border-[#4D192B] hover:shadow-lg transition relative group flex flex-col justify-between">
            <div>
              {user.selectedAddress === index && (
                 <div className="absolute top-0 right-0 bg-[#4D192B] text-white text-[10px] font-bold px-3 py-1 rounded-bl-2xl rounded-tr-2xl">
                   DEFAULT
                 </div>
              )}
              
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-rose-50 text-[#4D192B] p-2 rounded-lg">
                   <FiMapPin size={20} />
                </div>
                <span className="font-bold text-gray-800 text-lg capitalize">
                  {address.label || "Address"}
                </span>
              </div>
              
              <div className="text-gray-600 text-sm space-y-1">
                <p className="font-medium">{address.addressLine}</p>
                <p>{address.city}, {address.state} - <span className="font-bold">{address.pincode}</span></p>
              </div>
            </div>
            
            <div className="mt-4 pt-4 border-t flex items-center justify-between text-gray-500 text-sm">
              <div className="flex items-center gap-2">
                <FiPhone /> 
                <span>{address.phone}</span>
              </div>
              <div className="flex items-center gap-3">
                {user.selectedAddress !== index && (
                  <button onClick={() => handleSetDefault(index)} className="text-[#4D192B] hover:text-[#4D192B]/80 font-bold text-xs flex items-center gap-1 transition">
                    <FiCheckCircle size={14} /> Set Default
                  </button>
                )}
                <button onClick={() => handleDelete(index)} className="text-red-500 hover:text-red-600 font-bold text-xs flex items-center gap-1 transition">
                  <FiTrash2 size={14} /> Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
