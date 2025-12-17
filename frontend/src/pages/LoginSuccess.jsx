import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { FiCheckCircle } from "react-icons/fi";

export default function LoginSuccess() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const token = searchParams.get("token");

    if (!token) {
      navigate("/login");
      return;
    }

    // ✅ Save token
    localStorage.setItem("token", token);

    // ✅ Redirect after delay
    const timer = setTimeout(() => {
      navigate("/");
    }, 2500);

    return () => clearTimeout(timer);
  }, [navigate, searchParams]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-white via-[#FAF6F7] to-[#F3E9EC] px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="bg-white rounded-3xl shadow-[0_25px_70px_rgba(0,0,0,0.08)]
        border border-gray-100 p-10 text-center max-w-md w-full"
      >
        {/* ICON */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 120 }}
          className="flex justify-center mb-4"
        >
          <FiCheckCircle className="text-6xl text-green-600" />
        </motion.div>

        {/* MESSAGE */}
        <h1 className="text-2xl font-bold text-[#4D192B] mb-2">
          Registration Successful 🎉
        </h1>

        <p className="text-gray-600">
          Welcome to <span className="font-semibold">Capital Store</span>.<br />
          You’re being redirected…
        </p>

        {/* LOADING BAR */}
        <div className="mt-6 h-2 w-full bg-gray-200 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: "100%" }}
            transition={{ duration: 2.3, ease: "linear" }}
            className="h-full bg-[#4D192B]"
          />
        </div>
      </motion.div>
    </div>
  );
}
