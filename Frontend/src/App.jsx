import { useState, useEffect } from "react";
import StudentDashboard from "./pages/StudentDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import LoginPage from "./pages/LoginPage";

function App() {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("user");
    return saved ? JSON.parse(saved) : null;
  });

  // All courses created by any professor — shared across all users
  const [courses, setCourses] = useState(() => {
    const saved = localStorage.getItem("courses");
    return saved ? JSON.parse(saved) : [];
  });

  const [assignments, setAssignments] = useState(() => {
    const saved = localStorage.getItem("assignments");
    return saved ? JSON.parse(saved) : [];
  });

  const [groups, setGroups] = useState(() => {
    const saved = localStorage.getItem("groups");
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem("courses", JSON.stringify(courses));
  }, [courses]);

  useEffect(() => {
    localStorage.setItem("assignments", JSON.stringify(assignments));
  }, [assignments]);

  useEffect(() => {
    localStorage.setItem("groups", JSON.stringify(groups));
  }, [groups]);

  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
  };

  if (!user) return <LoginPage setUser={setUser} />;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <header className="bg-white shadow-md px-6 py-4 flex justify-between items-center sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <span className="text-2xl">📚</span>
          <h1 className="text-xl font-bold text-blue-700 tracking-tight">Assignment Portal</h1>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 bg-blue-50 px-3 py-1.5 rounded-full">
            <span className="text-blue-600">👤</span>
            <span className="text-blue-700 font-semibold text-sm">{user.username}</span>
            <span className="text-xs text-blue-400">
              ({user.role === "admin" ? "Professor" : "Student"})
            </span>
          </div>
          <button
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
          >
            Logout
          </button>
        </div>
      </header>

      <main className="max-w-4xl mx-auto p-6">
        {user.role === "student" ? (
          <StudentDashboard
            assignments={assignments}
            setAssignments={setAssignments}
            courses={courses}
            setCourses={setCourses}
            groups={groups}
            setGroups={setGroups}
            user={user}
          />
        ) : (
          <AdminDashboard
            assignments={assignments}
            setAssignments={setAssignments}
            courses={courses}
            setCourses={setCourses}
            user={user}
          />
        )}
      </main>
    </div>
  );
}

export default App;