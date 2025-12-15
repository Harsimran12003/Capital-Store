import React, { useState } from "react";
import { motion } from "framer-motion";
import { FiMail, FiLock, FiEye, FiEyeOff } from "react-icons/fi";
import { FcGoogle } from "react-icons/fc";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function Login() {
  const [showPass, setShowPass] = useState(false);

  return (
    <>
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-white via-[#FAF6F7] to-[#F3E9EC] px-4 pb-10">
      <Navbar />
      {/* CARD */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="w-full max-w-md bg-white rounded-3xl
        shadow-[0_25px_70px_rgba(0,0,0,0.08)]
        border border-gray-100 p-8 md:mt-32"
      >
        
        {/* HEADER */}
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-[#4D192B] tracking-wide">
            Welcome Back
          </h1>
          <p className="text-sm text-gray-500 mt-2">
            Login to your Capital Store account
          </p>
        </div>

        {/* GOOGLE LOGIN */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
          type="button"
          className="w-full flex items-center justify-center gap-3 py-3 rounded-xl
          border border-gray-200 bg-white hover:bg-gray-50 transition font-medium"
        >
          <FcGoogle className="text-xl" />
          Continue with Google
        </motion.button>

        {/* DIVIDER */}
        <div className="flex items-center gap-3 my-6">
          <div className="flex-1 h-px bg-gray-200" />
          <span className="text-xs text-gray-400 uppercase tracking-wider">
            or
          </span>
          <div className="flex-1 h-px bg-gray-200" />
        </div>

        {/* FORM */}
        <motion.form
          initial="hidden"
          animate="visible"
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: { staggerChildren: 0.08 },
            },
          }}
          className="space-y-5"
        >
          {/* EMAIL */}
          <AnimatedInput>
            <InputField
              icon={<FiMail />}
              placeholder="Email Address"
              type="email"
            />
          </AnimatedInput>

          {/* PASSWORD */}
          <AnimatedInput>
            <div className="relative">
              <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-[#4D192B]" />
              <input
                type={showPass ? "text" : "password"}
                placeholder="Password"
                className="input-premium pr-12"
              />
              <button
                type="button"
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500"
                onClick={() => setShowPass(!showPass)}
              >
                {showPass ? <FiEyeOff /> : <FiEye />}
              </button>
            </div>
          </AnimatedInput>

          {/* FORGOT PASSWORD */}
          <div className="text-right">
            <span className="text-sm text-[#4D192B] cursor-pointer hover:underline">
              Forgot password?
            </span>
          </div>

          {/* SUBMIT */}
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            type="button"
            className="w-full mt-2 py-3 rounded-xl
            bg-[#4D192B] text-white font-semibold tracking-wide
            hover:bg-[#3A1322] transition"
            onClick={() => alert("Logged in (frontend only)")}
          >
            Login
          </motion.button>
        </motion.form>

        {/* FOOTER */}
        <p className="text-center text-sm text-gray-500 mt-6">
          Don’t have an account?{" "}
          <Link to="/register" className="text-[#4D192B] font-medium hover:underline">
            Create Account
          </Link>
        </p>
      </motion.div>
      
    </div>
    <Footer />
    </>
  );
}

/* INPUT COMPONENT */
function InputField({ icon, placeholder, type }) {
  return (
    <div className="relative">
      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#4D192B]">
        {icon}
      </span>
      <input type={type} placeholder={placeholder} className="input-premium" />
    </div>
  );
}

/* ANIMATION WRAPPER */
function AnimatedInput({ children }) {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 12 },
        visible: { opacity: 1, y: 0 },
      }}
    >
      {children}
    </motion.div>
  );
}
