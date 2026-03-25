function ProgressBar({ progress }) {
  return (
    <div className="w-full bg-gray-200 rounded h-3 mt-2">
      <div
        className="bg-green-500 h-3 rounded"
        style={{ width: `${progress}%` }}
      ></div>
    </div>
  );
}

export default ProgressBar;