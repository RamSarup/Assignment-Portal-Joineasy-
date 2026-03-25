import { useState } from "react";
import { useEffect } from "react";
import StudentDashboard from "./pages/StudentDashboard";
import AdminDashboard from "./pages/AdminDashboard";

function App() {
  const [role, setRole] = useState("student");

  const [assignments, setAssignments] = useState(() => {
    const saved = localStorage.getItem("assignments");
    return saved
      ? JSON.parse(saved)
      : [{ id: 1, title: "DBMS Assignment", submitted: false }];
  });

  useEffect(() => {
    localStorage.setItem("assignments", JSON.stringify(assignments));
  }, [assignments]);

  return (
    <div className="min-h-screen bg-blue-100 flex flex-col items-center p-4">
      <h1 className="text-2xl font-bold mb-4">Assignment Dashboard</h1>

      <div className="flex gap-4 mb-6">
        <button
          onClick={() => setRole("student")}
          className={`px-4 py-2 rounded ${
            role === "student" ? "bg-blue-600 text-white" : "bg-gray-300"
          }`}
        >
          Student
        </button>

        <button
          onClick={() => setRole("admin")}
          className={`px-4 py-2 rounded ${
            role === "admin" ? "bg-green-600 text-white" : "bg-gray-300"
          }`}
        >
          Admin
        </button>
      </div>

      <div className="w-full max-w-2xl">
        {role === "student" ? (
          <StudentDashboard
            assignments={assignments}
            setAssignments={setAssignments}
          />
        ) : (
          <AdminDashboard
            assignments={assignments}
            setAssignments={setAssignments}
          />
        )}
      </div>
    </div>
  );
}

export default App;
