import { motion } from "framer-motion";
import { getInitials } from "../utils/getInitials";

const BRAND = "#4D192B";

export default function InitialsBadge({ name, size = 36 }) {
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      className="flex items-center justify-center rounded-full font-semibold
      text-white select-none shadow-sm"
      style={{
        width: size,
        height: size,
        backgroundColor: BRAND,
        fontSize: size * 0.4,
      }}
      aria-label={`Account ${name}`}
    >
      {getInitials(name)}
    </motion.div>
  );
}
