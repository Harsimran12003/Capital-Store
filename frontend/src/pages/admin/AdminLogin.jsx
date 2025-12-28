import { useState , useEffect } from "react";
import axios from "axios";
import { FiLock, FiMail } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setErr("");

    try {
      await axios.post(
        "https://capital-store-backend.vercel.app/api/admin/login",
        { email, password },
        { withCredentials: true }
      );

      navigate("/admin/dashboard");
    } catch (error) {
      setErr(error.response?.data?.message || "Login Failed");
    }
  };
  useEffect(() => {
  axios.get("/api/admin/check", { withCredentials: true })
  .catch(() => navigate("/admin-login"));
}, []);


  return (
    <div className="min-h-screen flex items-center justify-center bg-[#4D192B]">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md text-center">
        <img src="/logo.png" className="h-16 mx-auto mb-3" />

        <h2 className="text-2xl font-bold text-gray-800">
          Capital Store Admin
        </h2>
        <p className="text-gray-500 mb-6">
          Secure admin access login
        </p>

        {err && (
          <p className="bg-red-100 text-red-600 py-2 rounded-lg mb-3">
            {err}
          </p>
        )}

        <form className="space-y-4" onSubmit={handleLogin}>
          <div className="flex items-center border rounded-lg px-3">
            <FiMail className="text-gray-500" />
            <input
              type="email"
              placeholder="Admin Email"
              className="w-full px-2 py-3 outline-none"
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="flex items-center border rounded-lg px-3">
            <FiLock className="text-gray-500" />
            <input
              type="password"
              placeholder="Password"
              className="w-full px-2 py-3 outline-none"
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-lg bg-[#4D192B] text-white font-semibold tracking-wide hover:opacity-90"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
}
