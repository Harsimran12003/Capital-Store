import { useEffect, useState, Fragment } from "react";
import AdminLayout from "./AdminLayout";
import { motion, AnimatePresence } from "framer-motion";
import { FiBox, FiUser, FiMapPin, FiPhone, FiTruck, FiCheck, FiTrash2, FiSave, FiChevronDown, FiCreditCard, FiSearch, FiChevronUp } from "react-icons/fi";

const StatusBadge = ({ status }) => {
  const colors = {
    pending: "bg-gray-100 text-gray-600 border-gray-200",
    placed: "bg-yellow-50 text-yellow-700 border-yellow-200",
    dispatched: "bg-blue-50 text-blue-700 border-blue-200",
    in_transit: "bg-purple-50 text-purple-700 border-purple-200",
    delivered: "bg-green-50 text-green-700 border-green-200",
  };
  const color = colors[status] || colors.pending;
  return (
    <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border ${color}`}>
      {status.replace("_", " ")}
    </span>
  );
};

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState("");
  const [editMap, setEditMap] = useState({});
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedId, setExpandedId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch("https://capital-store-backend.vercel.app/api/admin/orders", {
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        if (!Array.isArray(data)) {
          setError(data.message || "Failed to load orders");
          setIsLoading(false);
          return;
        }

        setOrders(data);

        const map = {};
        data.forEach((o) => {
          map[o._id] = {
            orderStatus: o.orderStatus,
            courierName: o.courierName || "",
          };
        });
        setEditMap(map);
        setIsLoading(false);
      })
      .catch(() => {
        setError("Server error");
        setIsLoading(false);
      });
  }, []);

  const updateStatus = async (id) => {
    const payload = editMap[id];

    try {
      const res = await fetch(
        `https://capital-store-backend.vercel.app/api/admin/orders/${id}/status`,
        {
          method: "PUT",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        },
      );

      const updated = await res.json();

      setOrders((prev) =>
        prev.map((o) => (o._id === updated._id ? updated : o)),
      );

      setEditMap((m) => ({
        ...m,
        [id]: {
          orderStatus: updated.orderStatus,
          courierName: updated.courierName || "",
        },
      }));
    } catch {
      alert("Failed to update order");
    }
  };

  const deleteOrder = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this order?",
    );

    if (!confirmDelete) return;

    try {
      const res = await fetch(
        `https://capital-store-backend.vercel.app/api/admin/orders/${id}`,
        {
          method: "DELETE",
          credentials: "include",
        },
      );

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Failed to delete order");
        return;
      }

      setOrders((prev) => prev.filter((o) => o._id !== id));

      setEditMap((prev) => {
        const copy = { ...prev };
        delete copy[id];
        return copy;
      });
    } catch {
      alert("Server error while deleting order");
    }
  };

  const filteredOrders = orders.filter((order) => {
    const search = searchQuery.toLowerCase();
    const matchId = order._id.toLowerCase().includes(search);
    const matchName = order.user?.name?.toLowerCase().includes(search);
    const matchItems = order.items?.some(item => item.name.toLowerCase().includes(search));
    return matchId || matchName || matchItems;
  });

  const toggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <AdminLayout>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-6">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Order Management</h1>
          <p className="text-gray-500 mt-1 font-medium">Review and update customer orders.</p>
        </div>
        
        {/* Search Bar */}
        <div className="relative w-full md:w-96 group">
          <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#4D192B] transition-colors" />
          <input
            type="text"
            placeholder="Search by ID, Name, or Item..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-11 pr-4 py-3.5 bg-white shadow-sm border border-gray-200 rounded-2xl focus:ring-2 focus:ring-[#4D192B]/20 focus:border-[#4D192B] outline-none font-medium transition-all"
          />
        </div>
      </div>

      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-xl mb-6 font-medium border border-red-100 flex items-center gap-3">
           <FiCheck className="hidden" /> {/* Placeholder */}
           {error}
        </div>
      )}

      {isLoading ? (
        <div className="bg-white p-10 rounded-[2rem] shadow-sm border border-gray-100 text-center flex flex-col items-center justify-center min-h-[300px]">
           <div className="w-12 h-12 border-4 border-[#4D192B]/20 border-t-[#4D192B] rounded-full animate-spin mb-4"></div>
           <h3 className="text-xl font-bold text-gray-800">Loading Orders...</h3>
           <p className="text-gray-500 mt-2">Please wait while we fetch the latest data.</p>
        </div>
      ) : orders.length === 0 && !error ? (
        <div className="bg-white p-10 rounded-[2rem] shadow-sm border border-gray-100 text-center">
           <FiBox className="text-5xl text-gray-300 mx-auto mb-4" />
           <h3 className="text-xl font-bold text-gray-800">No Orders Found</h3>
           <p className="text-gray-500 mt-2">There are currently no orders in the system.</p>
        </div>
      ) : filteredOrders.length === 0 ? (
        <div className="bg-white p-10 rounded-[2rem] shadow-sm border border-gray-100 text-center">
           <FiSearch className="text-5xl text-gray-300 mx-auto mb-4" />
           <h3 className="text-xl font-bold text-gray-800">No matching orders</h3>
           <p className="text-gray-500 mt-2">Try adjusting your search query.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredOrders.map((order) => {
            const isExpanded = expandedId === order._id;
            return (
            <motion.div
              key={order._id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`bg-white rounded-2xl shadow-sm border transition-all duration-300 overflow-hidden ${isExpanded ? 'border-[#4D192B]/30 shadow-md ring-4 ring-[#4D192B]/5' : 'border-gray-100 hover:border-gray-200 hover:shadow-md'}`}
            >
              {/* Accordion Header (Always Visible) */}
              <div 
                onClick={() => toggleExpand(order._id)}
                className="px-6 py-5 cursor-pointer flex flex-col lg:flex-row lg:items-center justify-between gap-4 select-none"
              >
                <div className="flex flex-col lg:flex-row lg:items-center gap-4 lg:gap-8 flex-1">
                  <div>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Order ID</p>
                    <h3 className="font-mono text-gray-900 font-bold bg-gray-50 px-2 py-1 rounded-md border border-gray-200 inline-block">{order._id}</h3>
                  </div>
                  
                  <div>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Customer</p>
                    <div className="flex items-center gap-2">
                      <div className="h-6 w-6 rounded-full bg-[#4D192B]/10 text-[#4D192B] flex items-center justify-center font-bold text-xs">
                        {order.user?.name?.charAt(0)?.toUpperCase() || "U"}
                      </div>
                      <p className="font-bold text-gray-800">{order.user?.name || "Guest"}</p>
                    </div>
                  </div>

                  <div>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Date</p>
                    <p className="font-semibold text-gray-700">{new Date(order.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between lg:justify-end gap-4">
                  <div className="flex items-center gap-3">
                    <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-gray-50 border border-gray-200 text-xs font-bold uppercase tracking-wider text-gray-600">
                       <FiCreditCard className="text-gray-400" /> {order.paymentMethod}
                    </span>
                    <StatusBadge status={order.orderStatus} />
                  </div>
                  <div className={`p-2 rounded-full transition-colors ${isExpanded ? 'bg-[#4D192B]/10 text-[#4D192B]' : 'bg-gray-100 text-gray-400 hover:bg-gray-200'}`}>
                    {isExpanded ? <FiChevronUp /> : <FiChevronDown />}
                  </div>
                </div>
              </div>

              {/* Accordion Body (Expanded Details) */}
              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                  >
                    <div className="px-6 pb-6 pt-2 border-t border-gray-100/50 bg-gray-50/30">
                      {/* Middle Grid: Customer, Address, Items */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8 mt-6">
                        {/* Customer & Address */}
                        <div className="md:col-span-1 space-y-6">
                          <div>
                            <h4 className="font-bold text-xs uppercase tracking-widest text-gray-400 mb-3 flex items-center gap-2">
                              <FiUser /> Contact Info
                            </h4>
                            <p className="text-sm text-gray-500 font-medium mt-0.5">{order.user?.email}</p>
                            <p className="text-sm text-gray-600 font-bold flex items-center gap-1.5 mt-2 bg-white w-fit px-3 py-1.5 rounded-lg border border-gray-200 shadow-sm">
                              <FiPhone className="text-[#4D192B]"/> {order.address?.phone || "N/A"}
                            </p>
                          </div>
                          <div>
                            <h4 className="font-bold text-xs uppercase tracking-widest text-gray-400 mb-3 flex items-center gap-2">
                              <FiMapPin /> Delivery Address
                            </h4>
                            <div className="text-sm text-gray-700 font-medium leading-relaxed bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                              {order.address?.addressLine}<br />
                              {order.address?.city}, {order.address?.state}<br />
                              {order.address?.pincode}
                            </div>
                          </div>
                        </div>

                        {/* Items */}
                        <div className="md:col-span-2">
                          <h4 className="font-bold text-xs uppercase tracking-widest text-gray-400 mb-3 flex items-center gap-2">
                            <FiBox /> Order Items
                          </h4>
                          <div className="bg-white rounded-xl p-3 border border-gray-200 shadow-sm space-y-2">
                            {order.items.map((item, i) => (
                              <div key={i} className="flex justify-between items-center bg-gray-50 p-3 rounded-lg border border-gray-100">
                                <div className="flex items-center gap-4">
                                  <div className="h-10 w-10 bg-[#4D192B]/5 border border-[#4D192B]/10 rounded-lg flex items-center justify-center text-[#4D192B] overflow-hidden">
                                    {item.image ? (
                                      <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
                                    ) : (
                                      <FiBox className="text-lg" />
                                    )}
                                  </div>
                                  <div>
                                    <p className="font-bold text-gray-800 text-sm">{item.name}</p>
                                    <div className="flex items-center gap-2 mt-1">
                                       <p className="text-xs font-semibold text-gray-500 bg-white border border-gray-200 px-2 py-0.5 rounded shadow-sm">Size: <span className="text-gray-800">{item.size || "N/A"}</span></p>
                                    </div>
                                  </div>
                                </div>
                                <div className="text-right">
                                  <p className="font-bold text-gray-800 text-lg">x{item.qty}</p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>

                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Bottom Row: Actions (Always Visible) */}
              <div className="bg-gray-50/50 px-6 py-4 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex-1 flex flex-col sm:flex-row items-center gap-4 w-full">
                  <div className="relative w-full sm:w-56 group">
                    <select
                      value={editMap[order._id]?.orderStatus}
                      onChange={(e) =>
                        setEditMap((m) => ({
                          ...m,
                          [order._id]: { ...m[order._id], orderStatus: e.target.value },
                        }))
                      }
                      className="w-full appearance-none pl-4 pr-10 py-2.5 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#4D192B]/20 focus:border-[#4D192B] focus:bg-white outline-none font-semibold text-sm text-gray-700 transition-all shadow-sm"
                    >
                      <option value="placed">Placed</option>
                      <option value="dispatched">Dispatched</option>
                      <option value="in_transit">In Transit</option>
                      <option value="delivered">Delivered</option>
                    </select>
                    <FiChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none group-focus-within:text-[#4D192B] transition-colors" />
                  </div>

                  <div className="relative w-full sm:w-72 group">
                    <FiTruck className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#4D192B] transition-colors" />
                    <input
                      type="text"
                      placeholder="Courier name / Tracking Info"
                      value={editMap[order._id]?.courierName}
                      onChange={(e) =>
                        setEditMap((m) => ({
                          ...m,
                          [order._id]: { ...m[order._id], courierName: e.target.value },
                        }))
                      }
                      className="w-full pl-9 pr-4 py-2.5 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#4D192B]/20 focus:border-[#4D192B] focus:bg-white outline-none font-medium text-sm transition-all shadow-sm"
                    />
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => updateStatus(order._id)}
                    className="w-full sm:w-auto px-5 py-2.5 bg-gradient-to-r from-green-500 to-green-600 text-white font-bold rounded-lg shadow-sm hover:shadow-md transition-all flex items-center justify-center gap-2 text-sm"
                  >
                    <FiSave className="text-base" /> Save
                  </motion.button>
                </div>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => deleteOrder(order._id)}
                  className="w-full sm:w-auto px-4 py-2.5 bg-white text-red-600 font-bold rounded-lg hover:bg-red-50 border border-gray-200 hover:border-red-100 transition-colors flex items-center justify-center gap-2 text-sm shrink-0 shadow-sm"
                >
                  <FiTrash2 />
                </motion.button>
              </div>
            </motion.div>
          )})}
        </div>
      )}
    </AdminLayout>
  );
}
