import { useEffect, useState } from "react";
import AdminLayout from "./AdminLayout";

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("https://capital-store-backend.vercel.app/api/admin/orders", {
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setOrders(data);
        } else {
          setError(data.message || "Failed to load orders");
        }
      })
      .catch(() => setError("Server error"));
  }, []);

  const updateStatus = async (id, status) => {
    const res = await fetch(
      `https://capital-store-backend.vercel.app/api/admin/orders/${id}/status`,
      {
        method: "PUT",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      },
    );

    const updated = await res.json();
    setOrders((o) => o.map((ord) => (ord._id === updated._id ? updated : ord)));
  };

  return (
    <AdminLayout>
      {error && <p className="text-red-600">{error}</p>}

      <h1 className="text-2xl font-bold mb-6">Orders</h1>

      <table className="w-full bg-white shadow rounded">
        <thead>
          <tr>
            <th>Order ID</th>
            <th>Customer</th>
            <th>Payment</th>
            <th>Status</th>
            <th>Update</th>
          </tr>
        </thead>

        <tbody>
          {orders.map((order) => (
            <tr key={order._id} className="border-b">
              <td className="px-4 py-2 font-mono text-sm">{order._id}</td>

              <td className="px-4 py-2">
                <div className="font-semibold">
                  {order.user?.name || "Guest"}
                </div>
                <div className="text-xs text-gray-500">{order.user?.email}</div>
              </td>

              <td className="px-4 py-2 capitalize">{order.paymentMethod}</td>

              <td className="px-4 py-2">
                <span className="px-3 py-1 rounded-full text-xs bg-blue-100">
                  {order.orderStatus}
                </span>
              </td>

              <td className="px-4 py-2">
                <select
                  value={order.orderStatus}
                  onChange={(e) => updateStatus(order._id, e.target.value)}
                  className="border rounded px-2 py-1"
                >
                  <option value="placed">Placed</option>
                  <option value="dispatched">Dispatched</option>
                  <option value="in_transit">In Transit</option>
                  <option value="delivered">Delivered</option>
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </AdminLayout>
  );
}
