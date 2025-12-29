import React, { useState } from "react";
import AdminLayout from "./AdminLayout";

export default function ChangeCredentials() {
  const [email, setEmail] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleUpdate = async () => {
    try {
      setLoading(true);

      const res = await fetch(
        "https://capital-store-backend.vercel.app/api/admin/update-credentials",
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({
            email,
            oldPassword,
            newPassword,
          }),
        }
      );

      const data = await res.json();

      alert(data.message);
    } catch (err) {
      alert("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout>
      <div className="bg-white rounded-2xl shadow p-8 max-w-2xl mx-auto mt-10">
        <h2 className="text-2xl font-bold mb-2">Admin Credentials</h2>
        <p className="text-gray-500 mb-6">
          Update your admin email or password securely
        </p>

        <div className="space-y-5">
          <div>
            <label className="font-medium text-gray-700">New Email</label>
            <input
              type="email"
              className="w-full border rounded-xl px-4 py-3 mt-2"
              placeholder="Enter new email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <label className="font-medium text-gray-700">
              Current Password
            </label>
            <input
              type="password"
              className="w-full border rounded-xl px-4 py-3 mt-2"
              placeholder="Enter current password"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
            />
          </div>

          <div>
            <label className="font-medium text-gray-700">
              New Password
            </label>
            <input
              type="password"
              className="w-full border rounded-xl px-4 py-3 mt-2"
              placeholder="Enter new password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
          </div>

          <button
            onClick={handleUpdate}
            disabled={loading}
            className="px-6 py-3 rounded-xl bg-[#4D192B] text-white hover:bg-[#3b1020] transition"
          >
            {loading ? "Updating..." : "Update Credentials"}
          </button>
        </div>
      </div>
    </AdminLayout>
  );
}
