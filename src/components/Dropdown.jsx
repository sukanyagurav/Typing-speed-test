import { AnimatePresence, motion } from "framer-motion";

export function Dropdown({ label, selected, isOpen, onToggle, options }) {
  return (
    <div className="relative">
      <button
        type="button"
        className="inline-flex w-full items-center justify-between gap-2 rounded-xl border border-white/35 px-4 py-2 text-[0.95rem] text-white transition duration-150 hover:border-[#5ba1ff] hover:bg-[#1a2a42] focus-visible:border-[#5ba1ff] focus-visible:bg-[#1a2a42] focus-visible:outline-none sm:text-[1rem]"
        onClick={onToggle}
      >
        <span className="text-[#8f8f8f] sm:hidden">{label}: </span>
        <span>{selected}</span>
        <img src="/assets/images/icon-down-arrow.svg" alt="" className="h-2 w-3" />
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            className="absolute z-20 mt-2 w-full overflow-hidden rounded-xl border border-white/10 bg-[#282828] shadow-2xl"
          >
            {options.map((option, index) => (
              <button
                key={option.id}
                type="button"
                onClick={() => {
                  option.onSelect();
                  setTimeout(() => {
                    window.dispatchEvent(new Event("click"));
                  }, 0);
                }}
                className={`flex w-full items-center gap-3 px-4 py-2 text-left text-[0.95rem] text-white transition duration-150 hover:bg-[#1a2a42] focus-visible:bg-[#1a2a42] focus-visible:outline-none sm:text-[1rem] ${
                  index !== options.length - 1 ? "border-b border-white/10" : ""
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 rounded-full border ${
                    option.active ? "border-[#3b82f6] bg-[#3b82f6]" : "border-white/70"
                  }`}
                />
                {option.label}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
