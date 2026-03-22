export function TopStat({ label, value, valueColor, showDivider = false }) {
  return (
    <div
      className={`flex items-end justify-center gap-1.5 pr-2 text-[0.9rem] sm:justify-start sm:gap-2 sm:pr-3 sm:text-[0.95rem] md:pr-4 md:text-[1rem] ${
        showDivider ? "border-r border-white/15" : ""
      }`}
    >
      <p className="text-[#8f8f8f]">{label}:</p>
      <p className={`text-[1.95rem] font-bold leading-none sm:text-[1.9rem] md:text-[2.05rem] ${valueColor}`}>{value}</p>
    </div>
  );
}
