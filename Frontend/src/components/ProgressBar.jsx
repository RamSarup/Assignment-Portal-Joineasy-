function ProgressBar({ progress }) {
  const clamped = Math.min(100, Math.max(0, progress));

  const getColor = () => {
    if (clamped < 30) return "bg-red-400";
    if (clamped < 70) return "bg-amber-400";
    return "bg-green-500";
  };

  return (
    <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
      <div
        className={`${getColor()} h-2.5 rounded-full transition-all duration-500`}
        style={{ width: `${clamped}%` }}
      />
    </div>
  );
}

export default ProgressBar;
