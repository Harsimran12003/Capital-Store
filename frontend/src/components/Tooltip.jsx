export default function Tooltip({ text, children }) {
  return (
    <div className="relative group flex items-center">
      {children}

      {/* Tooltip bubble */}
      <div
        className="
          pointer-events-none
          absolute
          top-full
          left-1/2
          -translate-x-1/2
          mt-2
          whitespace-nowrap
          rounded-md
          bg-black
          px-2.5
          py-1
          text-xs
          text-white
          shadow-lg
          opacity-0
          scale-95
          transition-all
          duration-200
          group-hover:opacity-100
          group-hover:scale-100
        "
      >
        {text}
      </div>
    </div>
  );
}
