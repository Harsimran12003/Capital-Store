import React, { useState } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import {
  FiUser,
  FiMail,
  FiPhone,
  FiLock,
  FiEye,
  FiEyeOff,
} from "react-icons/fi";
import { FcGoogle } from "react-icons/fc";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function Register() {
  const navigate = useNavigate();

  //  STATES
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);
  const [loading, setLoading] = useState(false);

  // REGISTER HANDLER
  const handleRegister = async () => {
    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch("https://capital-store-backend.vercel.app/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include", 
        body: JSON.stringify({ name, email, phone, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        // ❌ User already exists
        alert(data.message);
        if (!res.ok) {
      if (res.status === 400) {
        alert("Account already exists. Please login.");
        navigate("/login");
      }
      return;
    }
        return;
      }

      // ✅ SUCCESS
      alert("Registration successful! Please login.");
      navigate("/login");

    } catch (err) {
      alert("Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-white via-[#FAF6F7] to-[#F3E9EC] px-4 pb-10">
        <Navbar />

        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-md bg-white rounded-3xl shadow-xl  p-8 md:mt-32"
        >
          <h1 className="text-3xl font-bold text-[#4D192B] text-center">
            Create Account
          </h1>

          {/* GOOGLE REGISTER */}
          <button
            onClick={() =>
              (window.location.href =
                  "https://capital-store-backend.vercel.app/api/auth/google")
            }
            className="w-full flex items-center justify-center gap-3 py-3 rounded-xl
            border border-gray-200 bg-white hover:bg-gray-50 transition font-medium mt-6 mb-4"
          >
            <FcGoogle className="text-xl" />
            Continue with Google
          </button>

          <div className="flex items-center gap-3 my-6">
            <div className="flex-1 h-px bg-gray-200" />
            <span className="text-xs text-gray-400">OR</span>
            <div className="flex-1 h-px bg-gray-200" />
          </div>

          {/* FORM */}
          <div className="space-y-4">
            <InputField icon={<FiUser />} placeholder="Full Name" value={name} onChange={setName} />
            <InputField icon={<FiMail />} placeholder="Email" value={email} onChange={setEmail} />
            <InputField icon={<FiPhone />} placeholder="Phone" value={phone} onChange={setPhone} />

            <PasswordField
              placeholder="Password"
              show={showPass}
              toggle={() => setShowPass(!showPass)}
              value={password}
              onChange={setPassword}
            />

            <PasswordField
              placeholder="Confirm Password"
              show={showConfirmPass}
              toggle={() => setShowConfirmPass(!showConfirmPass)}
              value={confirmPassword}
              onChange={setConfirmPassword}
            />

            <button
              onClick={handleRegister}
              disabled={loading}
              className="w-full py-3 bg-[#4D192B] text-white rounded-xl hover:bg-[#3A1322]"
            >
              {loading ? "Creating account..." : "Create Account"}
            </button>
          </div>

          <p className="text-center text-sm mt-6">
            Already have an account?{" "}
            <Link to="/login" className="text-[#4D192B] font-medium">
              Login
            </Link>
          </p>
        </motion.div>
      </div>
      <Footer />
    </>
  );
}

/* INPUT COMPONENT */
function InputField({ icon, placeholder, value, onChange }) {
  return (
    <div className="relative">
      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#4D192B]">
        {icon}
      </span>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="input-premium"
      />
    </div>
  );
}

function PasswordField({ placeholder, show, toggle, value, onChange }) {
  return (
    <div className="relative">
      <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-[#4D192B]" />
      <input
        type={show ? "text" : "password"}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="input-premium pr-12"
      />
      <button
        type="button"
        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500"
        onClick={toggle}
      >
        {show ? <FiEyeOff /> : <FiEye />}
      </button>
    </div>
  );
}
