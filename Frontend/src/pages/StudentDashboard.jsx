import { useState } from "react";
import ConfirmationModal from "../components/ConfirmationModal";

function StudentDashboard({ assignments, setAssignments }) {
  const [selectedId, setSelectedId] = useState(null);

  const handleSubmitClick = (id) => {
    setSelectedId(id);
  };

  const confirmSubmit = () => {
    const updated = assignments.map((a) =>
      a.id === selectedId ? { ...a, submitted: true } : a
    );
    setAssignments(updated);
    setSelectedId(null);
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-4">
      <h2 className="text-xl font-semibold mb-4">
        Your Assignments
      </h2>

      {assignments.map((a) => (
        <div
          key={a.id}
          className="border p-3 rounded mb-3 flex justify-between items-center"
        >
          <div>
            <p className="font-medium">{a.title}</p>
            <p className="text-sm text-gray-500">
              {a.submitted ? "✅ Submitted" : "❌ Not Submitted"}
            </p>
          </div>

          {!a.submitted && (
            <button
              onClick={() => handleSubmitClick(a.id)}
              className="bg-blue-500 text-white px-3 py-1 rounded"
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