import { motion, AnimatePresence } from "framer-motion";
import { FiCheckCircle, FiAlertCircle } from "react-icons/fi";

export default function AuthMessage({ type, message }) {
  if (!message) return null;

  const isError = type === "error";

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        className={`flex items-center gap-3 p-4 rounded-xl text-sm font-medium mb-4
          ${isError
            ? "bg-red-50 text-red-700 border border-red-200 mt-3"
            : "bg-green-50 text-green-700 border border-green-200"}
        `}
      >
        {isError ? (
          <FiAlertCircle className="text-lg" />
        ) : (
          <FiCheckCircle className="text-lg" />
        )}
        <span>{message}</span>
      </motion.div>
    </AnimatePresence>
  );
}
