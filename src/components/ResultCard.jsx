export function ResultCard({ label, value, color, secondaryColor }) {
  const [leftValue, rightValue] = String(value).split("/");
  return (
    <article className="min-w-0 rounded-xl border border-white/12 p-4 text-left">
      <p className="text-[0.95rem] text-[#8f8f8f]">{label}:</p>
      {!secondaryColor ? (
        <p className={`mt-1 text-[1.9rem] font-bold ${color}`}>{value}</p>
      ) : (
        <p className="mt-1 text-[1.9rem] font-bold">
          <span className={color}>{leftValue}</span>/<span className={secondaryColor}>{rightValue}</span>
        </p>
      )}
    </article>
  );
}
