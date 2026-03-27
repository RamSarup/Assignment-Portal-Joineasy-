import { useState } from "react";

function LoginPage({ setUser }) {
  const [role, setRole] = useState("student");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    // simple dummy auth
    if (username && password) {
      const user = { role, username };
      localStorage.setItem("user", JSON.stringify(user));
      setUser(user);
    } else {
      alert("Enter username & password");
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-blue-100">
      <h1 className="text-3xl font-bold mb-6">Login</h1>

      <input
        type="text"
        placeholder="Username"
        className="mb-3 p-2 border rounded w-64"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />

      <input
        type="password"
        placeholder="Password"
        className="mb-3 p-2 border rounded w-64"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <select
        className="mb-4 p-2 border rounded w-64"
        value={role}
        onChange={(e) => setRole(e.target.value)}
      >
        <option value="student">Student</option>
        <option value="admin">Admin</option>
      </select>

      <button
        onClick={handleLogin}
        className="bg-blue-600 text-white px-4 py-2 rounded w-64"
      >
        Login
      </button>
    </div>
  );
}

export default LoginPage;