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

  const updateStatus = async (id, status, courierName) => {
    const res = await fetch(
      `https://capital-store-backend.vercel.app/api/admin/orders/${id}/status`,
      {
        method: "PUT",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status, courierName }),
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
            <>
              {/* MAIN ROW */}
              <tr key={order._id} className="border-b bg-gray-50">
                <td className="px-4 py-2 font-mono text-xs">{order._id}</td>

                <td className="px-4 py-2">
                  <div className="font-semibold">{order.user?.name}</div>
                  <div className="text-xs text-gray-500">
                    {order.user?.email}
                  </div>
                </td>

                <td className="px-4 py-2 capitalize">{order.paymentMethod}</td>

                <td className="px-4 py-2">
                  <span className="px-3 py-1 rounded-full text-xs bg-blue-100">
                    {order.orderStatus}
                  </span>
                </td>

                <td className="px-4 py-2 space-y-2">
                  <select
                    value={order.orderStatus}
                    onChange={(e) =>
                      updateStatus(order._id, e.target.value, order.courierName)
                    }
                    className="border rounded px-2 py-1 w-full"
                  >
                    <option value="placed">Placed</option>
                    <option value="dispatched">Dispatched</option>
                    <option value="in_transit">In Transit</option>
                    <option value="delivered">Delivered</option>
                  </select>

                  <input
                    type="text"
                    placeholder="Courier name"
                    value={order.courierName || ""}
                    onChange={(e) =>
                      updateStatus(order._id, order.orderStatus, e.target.value)
                    }
                    className="border rounded px-2 py-1 w-full text-sm"
                  />
                </td>
              </tr>

              {/* DETAILS ROW */}
              <tr className="border-b">
                <td colSpan="5" className="px-6 py-4 text-sm bg-white">
                  {/* ITEMS */}
                  <div className="mb-3">
                    <h4 className="font-semibold mb-1">Items</h4>
                    {order.items.map((item, i) => (
                      <div key={i} className="text-gray-700">
                        • {item.name} | Size: {item.size} | Qty: {item.qty}
                      </div>
                    ))}
                  </div>

                  {/* ADDRESS */}
                  <div>
                    <h4 className="font-semibold mb-1">Delivery Address</h4>
                    <p className="text-gray-700">
                      {order.address?.addressLine}, {order.address?.city},{" "}
                      {order.address?.state} – {order.address?.pincode}
                      <br />
                      📞 {order.address?.phone}
                    </p>
                  </div>
                </td>
              </tr>
            </>
          ))}
        </tbody>
      </table>
    </AdminLayout>
  );
}
