import { useState } from "react";
import ProgressBar from "../components/ProgressBar";

function AdminDashboard({ assignments, setAssignments }) {
  const [title, setTitle] = useState("");
  const total = assignments.length;
  const submitted = assignments.filter((a) => a.submitted).length;
  const progress = total === 0 ? 0 : (submitted / total) * 100;

  const handleAdd = () => {
    if (!title) return;

    const newAssignment = {
      id: Date.now(),
      title,
      submitted: false,
    };

    setAssignments([...assignments, newAssignment]);
    setTitle("");
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-4">
      <h2 className="text-xl font-semibold mb-4">Admin Dashboard</h2>

      <div className="mb-4 flex gap-2">
        <div className="mb-4">
          <p className="font-medium">
            Progress: {submitted}/{total} submitted
          </p>
          <ProgressBar progress={progress} />
        </div>
        <input
          type="text"
          placeholder="Assignment Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="border p-2 rounded flex-1"
        />

        <button
          onClick={handleAdd}
          className="bg-green-500 text-white px-4 py-2 rounded"
        >
          Add
        </button>
      </div>

      <div>
        {assignments.map((a) => (
          <div key={a.id} className="border p-2 rounded mb-2">
            {a.title}
          </div>
        ))}
      </div>
    </div>
  );
}

export default AdminDashboard;
