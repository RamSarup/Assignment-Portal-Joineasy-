import { useState } from "react";
import ConfirmationModal from "../components/ConfirmationModal";
import toast from "react-hot-toast";

function StudentDashboard({ assignments, setAssignments }) {
  const [selectedId, setSelectedId] = useState(null);

  const confirmSubmit = () => {
    const updated = assignments.map((a) =>
      a.id === selectedId ? { ...a, submitted: true } : a
    );
    setAssignments(updated);
    setSelectedId(null);
    toast.success("Assignment submitted!");
  };

  return (
    <div className="bg-white shadow-lg rounded-xl p-4">
      <h2 className="text-xl font-semibold mb-4">
        Your Assignments
      </h2>

      {assignments.length === 0 && (
        <p className="text-gray-500 text-center">
          No assignments yet
        </p>
      )}

      {assignments.map((a) => (
        <div
          key={a.id}
          className="bg-white shadow-md rounded-lg p-4 mb-3 flex justify-between items-center"
        >
          <div>
            <p className="font-medium">{a.title}</p>

            <a
              href={a.link}
              target="_blank"
              className="text-blue-500 text-sm underline"
            >
              Open Submission Link
            </a>

            <p className="text-sm text-gray-500">
              {a.submitted ? "✅ Submitted" : "❌ Not Submitted"}
            </p>
          </div>

          {!a.submitted && (
            <button
              onClick={() => setSelectedId(a.id)}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
            >
              Submit
            </button>
          )}
        </div>
      ))}

      {selectedId && (
        <ConfirmationModal
          onConfirm={confirmSubmit}
          onCancel={() => setSelectedId(null)}
        />
      )}
    </div>
  );
}

export default StudentDashboard;