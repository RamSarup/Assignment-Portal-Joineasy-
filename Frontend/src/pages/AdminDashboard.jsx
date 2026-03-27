import { useState } from "react";
import ProgressBar from "../components/ProgressBar";

function AdminDashboard({ assignments, setAssignments, user }) {
  const [title, setTitle] = useState("");
  const [link, setLink] = useState("");

  const handleAdd = () => {
    if (!title || !link) return;

    const newAssignment = {
      id: Date.now(),
      title,
      link,
      submittedBy: [],
    };

    setAssignments([...assignments, newAssignment]);
    setTitle("");
    setLink("");
  };

  const total = assignments.length;
  const submitted = assignments.reduce(
    (sum, a) => sum + (a.submittedBy?.length || 0),
    0
  );

  return (
    <div className="bg-white shadow-lg rounded-xl p-4">
      
      {/* 🔥 Admin Name Top Right */}
      <div className="flex justify-between mb-4">
        <h2 className="text-xl font-semibold">Admin Dashboard</h2>
        <p className="font-medium text-green-600">
          👤 {user.username}
        </p>
      </div>

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
          Total Submissions: {submitted}
        </p>
        <ProgressBar progress={total === 0 ? 0 : (submitted / (total * 5)) * 100} />
      </div>

      {/* List */}
      {assignments.map((a) => (
        <div key={a.id} className="border p-3 rounded mb-3">
          <p className="font-semibold">{a.title}</p>

          <p className="text-sm text-gray-500">
            Submitted by:
          </p>

          {a.submittedBy?.length > 0 ? (
            <ul className="text-sm text-blue-600">
              {a.submittedBy.map((name, index) => (
                <li key={index}>• {name}</li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-red-500">
              No submissions yet
            </p>
          )}
        </div>
      ))}
    </div>
  );
}

export default AdminDashboard;