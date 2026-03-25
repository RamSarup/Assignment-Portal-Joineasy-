import { useState } from "react";

function AdminDashboard() {
  const [title, setTitle] = useState("");
  const [link, setLink] = useState("");
  const [assignments, setAssignments] = useState([]);

  const handleAdd = () => {
    if (!title || !link) return;

    const newAssignment = {
      id: Date.now(),
      title,
      link,
    };

    setAssignments([...assignments, newAssignment]);
    setTitle("");
    setLink("");
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-4">
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
          className="bg-green-500 text-white px-4 py-2 rounded"
        >
          Add Assignment
        </button>
      </div>

      {/* List */}
      <div>
        {assignments.map((a) => (
          <div
            key={a.id}
            className="border p-3 rounded mb-2"
          >
            <p className="font-medium">{a.title}</p>
            <a
              href={a.link}
              target="_blank"
              className="text-blue-500 text-sm"
            >
              View Submission Link
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AdminDashboard;