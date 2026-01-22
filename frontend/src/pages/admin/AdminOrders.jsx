import { useEffect, useState } from "react";
import AdminLayout from "./AdminLayout";

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    fetch("https://capital-store-backend.vercel.app/api/admin/orders", {
      credentials: "include",
    })
      .then(res => res.json())
      .then(setOrders);
  }, []);

  const updateStatus = async (id, status) => {
    const res = await fetch(
      `https://capital-store-backend.vercel.app/api/admin/orders/${id}/status`,
      {
        method: "PUT",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      }
    );

    const updated = await res.json();
    setOrders(o => o.map(ord => ord._id === updated._id ? updated : ord));
  };

  return (
    <AdminLayout>
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
          {orders.map(o => (
            <tr key={o._id}>
              <td>{o._id}</td>
              <td>{o.user?.name}<br />{o.user?.email}</td>
              <td>{o.paymentMethod}</td>
              <td>{o.orderStatus}</td>
              <td>
                <select
                  value={o.orderStatus}
                  onChange={e => updateStatus(o._id, e.target.value)}
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
