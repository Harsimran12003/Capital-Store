import { useState, useEffect } from "react";
import axios from "axios";
import { FiLock, FiMail, FiArrowRight, FiEye, FiEyeOff } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [err, setErr] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setErr("");
    setIsLoading(true);

    try {
      await axios.post(
        "https://capital-store-backend.vercel.app/api/admin/login",
        { email, password },
        { withCredentials: true }
      );
      navigate("/admin/dashboard");
    } catch (error) {
      setErr(error.response?.data?.message || "Login Failed. Please try again.");
      setIsLoading(false);
    }
  };

  useEffect(() => {
    axios
      .get("/api/admin/check", { withCredentials: true })
      .catch(() => navigate("/admin-login"));
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#2D0F19] via-[#4D192B] to-[#1a080e] p-4 relative overflow-hidden font-sans">
      {/* Background Glowing Orbs */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-rose-500/20 rounded-full blur-3xl pointer-events-none mix-blend-screen"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-purple-500/20 rounded-full blur-3xl pointer-events-none mix-blend-screen"></div>

      <motion.div 
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        className="bg-white p-10 rounded-[2rem] shadow-2xl shadow-black/40 border border-white/20 w-full max-w-md text-center relative z-10"
      >
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="mb-6 relative"
        >
           <img 
            src="/logo.png" 
            className="h-20 mx-auto object-contain rounded-xl shadow-sm" 
            alt="Capital Store Logo"
          />
        </motion.div>

        <div className="mb-8">
          <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight mb-2">
            Capital Store
          </h2>
          <p className="text-sm text-gray-500 font-medium">
            Secure Admin Authentication
          </p>
        </div>

        {err && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="bg-red-50 border border-red-100 text-red-600 text-sm py-3 px-4 rounded-xl mb-6 flex items-center justify-center font-medium shadow-sm"
          >
            {err}
          </motion.div>
        )}

        <form className="space-y-5" onSubmit={handleLogin}>
          <div className="group relative flex items-center border border-gray-200 rounded-xl px-4 py-2 bg-gray-50 focus-within:bg-white focus-within:border-[#4D192B] focus-within:ring-4 focus-within:ring-[#4D192B]/10 transition-all duration-300">
            <FiMail className="text-gray-400 group-focus-within:text-[#4D192B] transition-colors duration-300 text-xl" />
            <input
              type="email"
              placeholder="Admin Email"
              className="w-full px-3 py-2.5 outline-none bg-transparent text-gray-800 placeholder-gray-400 font-medium"
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="group relative flex items-center border border-gray-200 rounded-xl px-4 py-2 bg-gray-50 focus-within:bg-white focus-within:border-[#4D192B] focus-within:ring-4 focus-within:ring-[#4D192B]/10 transition-all duration-300">
            <FiLock className="text-gray-400 group-focus-within:text-[#4D192B] transition-colors duration-300 text-xl" />
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              className="w-full px-3 py-2.5 outline-none bg-transparent text-gray-800 placeholder-gray-400 font-medium pr-10"
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 text-gray-400 hover:text-[#4D192B] transition-colors focus:outline-none"
            >
              {showPassword ? <FiEyeOff className="text-xl" /> : <FiEye className="text-xl" />}
            </button>
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={isLoading}
            className="w-full mt-8 py-4 rounded-xl bg-gradient-to-r from-[#4D192B] to-[#71233F] text-white font-semibold tracking-wide flex items-center justify-center gap-2 shadow-lg shadow-[#4D192B]/30 hover:shadow-xl hover:shadow-[#4D192B]/40 transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isLoading ? (
               <div className="flex items-center gap-2">
                 <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                 Authenticating...
               </div>
            ) : (
              <>
                Login to Dashboard <FiArrowRight className="text-lg" />
              </>
            )}
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
}
