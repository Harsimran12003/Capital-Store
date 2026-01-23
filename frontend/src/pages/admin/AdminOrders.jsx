import { useEffect, useState, Fragment } from "react";
import AdminLayout from "./AdminLayout";

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState("");
  const [editMap, setEditMap] = useState({});

  useEffect(() => {
    fetch("https://capital-store-backend.vercel.app/api/admin/orders", {
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        if (!Array.isArray(data)) {
          setError(data.message || "Failed to load orders");
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
      })
      .catch(() => setError("Server error"));
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
        }
      );

      const updated = await res.json();

      // update table data
      setOrders((prev) =>
        prev.map((o) => (o._id === updated._id ? updated : o))
      );

      // sync edit state
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

  return (
    <AdminLayout>
      {error && <p className="text-red-600 mb-4">{error}</p>}

      <h1 className="text-2xl font-bold mb-6">Orders</h1>

      <table className="w-full bg-white shadow rounded">
        <thead>
          <tr className="bg-gray-100 text-left">
            <th className="px-4 py-3">Order ID</th>
            <th className="px-4 py-3">Customer</th>
            <th className="px-4 py-3">Payment</th>
            <th className="px-4 py-3">Status</th>
            <th className="px-4 py-3">Update</th>
          </tr>
        </thead>

        <tbody>
          {orders.map((order) => (
            <Fragment key={order._id}>
              {/* MAIN ROW */}
              <tr className="border-b bg-gray-50">
                <td className="px-4 py-2 font-mono text-xs">
                  {order._id}
                </td>

                <td className="px-4 py-2">
                  <div className="font-semibold">
                    {order.user?.name || "User"}
                  </div>
                  <div className="text-xs text-gray-500">
                    {order.user?.email}
                  </div>
                </td>

                <td className="px-4 py-2 capitalize">
                  {order.paymentMethod}
                </td>

                <td className="px-4 py-2">
                  <span className="px-3 py-1 rounded-full text-xs bg-blue-100">
                    {order.orderStatus}
                  </span>
                </td>

                <td className="px-4 py-2 space-y-2">
                  <select
                    value={editMap[order._id]?.orderStatus}
                    onChange={(e) =>
                      setEditMap((m) => ({
                        ...m,
                        [order._id]: {
                          ...m[order._id],
                          orderStatus: e.target.value,
                        },
                      }))
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
                    value={editMap[order._id]?.courierName}
                    onChange={(e) =>
                      setEditMap((m) => ({
                        ...m,
                        [order._id]: {
                          ...m[order._id],
                          courierName: e.target.value,
                        },
                      }))
                    }
                    className="border rounded px-2 py-1 w-full text-sm"
                  />

                  <button
                    onClick={() => updateStatus(order._id)}
                    className="w-full bg-green-600 text-white text-xs py-1.5 rounded hover:bg-green-700 transition"
                  >
                    Save
                  </button>
                </td>
              </tr>

              {/* DETAILS ROW */}
              <tr className="border-b">
                <td colSpan="5" className="px-6 py-4 text-sm bg-white">
                  <div className="mb-3">
                    <h4 className="font-semibold mb-1">Items</h4>
                    {order.items.map((item, i) => (
                      <div key={i} className="text-gray-700">
                        • {item.name} | Size: {item.size} | Qty: {item.qty}
                      </div>
                    ))}
                  </div>

                  <div>
                    <h4 className="font-semibold mb-1">Delivery Address</h4>
                    <p className="text-gray-700">
                      {order.address?.addressLine},{" "}
                      {order.address?.city},{" "}
                      {order.address?.state} –{" "}
                      {order.address?.pincode}
                      <br />
                      📞 {order.address?.phone}
                    </p>
                  </div>
                </td>
              </tr>
            </Fragment>
          ))}
        </tbody>
      </table>
    </AdminLayout>
  );
}
