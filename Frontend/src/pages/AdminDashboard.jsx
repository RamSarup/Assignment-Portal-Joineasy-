import { useState } from "react";
import ProgressBar from "../components/ProgressBar";

function AdminDashboard({ assignments, setAssignments }) {
  const [title, setTitle] = useState("");
  const [link, setLink] = useState("");

  const handleAdd = () => {
    if (!title || !link) return;

    const newAssignment = {
      id: Date.now(),
      title,
      link,
      submitted: false,
    };

    setAssignments([...assignments, newAssignment]);
    setTitle("");
    setLink("");
  };

  const total = assignments.length;
  const submitted = assignments.filter((a) => a.submitted).length;
  const progress = total === 0 ? 0 : (submitted / total) * 100;

  return (
    <div className="bg-white shadow-lg rounded-xl p-4">
      <h2 className="text-xl font-semibold mb-4">
        Admin Dashboard
      </h2>

      {/* Form */}
      <div className="mb-4 flex flex-col gap-2">
        <input
          type="text"
          placeholder="Assignment Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="border p-2 rounded"
        />

        <input
          type="text"
          placeholder="Drive Link"
          value={link}
          onChange={(e) => setLink(e.target.value)}
          className="border p-2 rounded"
        />

        <button
          onClick={handleAdd}
          className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
        >
          Add Assignment
        </button>
      </div>

      {/* Progress */}
      <div className="mb-4">
        <p className="font-medium">
          Progress: {submitted}/{total} submitted
        </p>
        <ProgressBar progress={progress} />
      </div>

      {/* List */}
      {assignments.map((a) => (
        <div key={a.id} className="border p-2 rounded mb-2">
          <p>{a.title}</p>
        </div>
      ))}
    </div>
  );
}

export default AdminDashboard;