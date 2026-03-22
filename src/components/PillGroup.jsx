export function PillGroup({ label, options }) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-[0.95rem] text-[#8f8f8f] lg:text-[1rem]">{label}</span>
      <div className="flex items-center gap-1.5">
        {options.map((option) => (
          <button
            key={option.id}
            type="button"
            onClick={option.onClick}
            className={`rounded-lg border px-2 py-0.5 text-[0.85rem] cursor-pointer transition duration-150 lg:text-[0.9rem] ${
              option.active
                ? "border-[#3b82f6] text-[#5ba1ff] shadow-[inset_0_0_0_1px_rgba(59,130,246,0.6)]"
                : "border-white/35 text-white hover:border-[#3b82f6]  hover:text-[#5ba1ff]"
            }`}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
}
