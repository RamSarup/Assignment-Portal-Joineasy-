import { useState, useEffect } from "react";
import StudentDashboard from "./pages/StudentDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import LoginPage from "./pages/LoginPage";

function App() {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("user");
    return saved ? JSON.parse(saved) : null;
  });

  const [assignments, setAssignments] = useState(() => {
    const saved = localStorage.getItem("assignments");
    return saved
      ? JSON.parse(saved)
      : [
          {
            id: 1,
            title: "DBMS Assignment",
            link: "https://drive.google.com/",
            submitted: false,
          },
        ];
  });

  useEffect(() => {
    localStorage.setItem("assignments", JSON.stringify(assignments));
  }, [assignments]);

  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
  };

  // 🔐 If not logged in → show login page
  if (!user) {
    return <LoginPage setUser={setUser} />;
  }

  return (
    <div className="min-h-screen bg-blue-100 p-4">
      <div className="flex justify-between mb-4">
        <h1 className="text-2xl font-bold">
          Assignment Dashboard
        </h1>

        <button
          onClick={handleLogout}
          className="bg-red-500 text-white px-4 py-2 rounded"
        >
          Logout
        </button>
      </div>

      <div className="max-w-2xl mx-auto">
        {user.role === "student" ? (
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