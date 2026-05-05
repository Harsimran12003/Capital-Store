import React, { useState } from "react";
import AdminLayout from "./AdminLayout";
import { motion } from "framer-motion";
import { FiLock, FiEye, FiEyeOff, FiShield, FiSave } from "react-icons/fi";

export default function ChangeCredentials() {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleUpdate = async () => {
    if (!oldPassword || !newPassword) {
      alert("Both current and new passwords are required");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch(
        "https://capital-store-backend.vercel.app/api/admin/update-credentials",
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({
            oldPassword,
            newPassword,
          }),
        }
      );

      const data = await res.json();
      alert(data.message);

      if (res.ok) {
        setOldPassword("");
        setNewPassword("");
      }

    } catch (err) {
      alert("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Admin Credentials</h1>
          <p className="text-gray-500 mt-1 font-medium">Update your administrative password securely.</p>
        </div>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 p-8 md:p-10 max-w-2xl"
      >
        <div className="flex items-center gap-4 mb-8 pb-6 border-b border-gray-100">
          <div className="h-14 w-14 bg-[#4D192B]/5 border border-[#4D192B]/10 rounded-2xl flex items-center justify-center text-[#4D192B]">
             <FiShield className="text-2xl" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-800">Security Settings</h2>
            <p className="text-sm text-gray-500 font-medium">Please enter your current password to set a new one.</p>
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">
              Current Password
            </label>
            <div className="relative group">
              <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#4D192B] transition-colors" />
              <input
                type={showOldPassword ? "text" : "password"}
                className="w-full pl-11 pr-12 py-3.5 bg-gray-50/50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-[#4D192B]/20 focus:border-[#4D192B] transition-all outline-none font-medium"
                placeholder="Enter current password"
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
              />
              <button
                type="button"
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                onClick={() => setShowOldPassword(!showOldPassword)}
              >
                {showOldPassword ? <FiEyeOff /> : <FiEye />}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">
              New Password
            </label>
            <div className="relative group">
              <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#4D192B] transition-colors" />
              <input
                type={showNewPassword ? "text" : "password"}
                className="w-full pl-11 pr-12 py-3.5 bg-gray-50/50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-[#4D192B]/20 focus:border-[#4D192B] transition-all outline-none font-medium"
                placeholder="Enter new password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
              <button
                type="button"
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                onClick={() => setShowNewPassword(!showNewPassword)}
              >
                {showNewPassword ? <FiEyeOff /> : <FiEye />}
              </button>
            </div>
          </div>

          <div className="pt-4 mt-2 border-t border-gray-100">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleUpdate}
              disabled={loading}
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-gradient-to-r from-[#4D192B] to-[#71233F] text-white font-bold shadow-[0_8px_20px_rgba(77,25,43,0.25)] hover:shadow-[0_10px_25px_rgba(77,25,43,0.35)] transition-all flex items-center justify-center gap-2 tracking-wide disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Updating...
                </>
              ) : (
                <>
                  <FiSave className="text-lg" /> Update Password
                </>
              )}
            </motion.button>
          </div>
        </div>
      </motion.div>
    </AdminLayout>
  );
}
