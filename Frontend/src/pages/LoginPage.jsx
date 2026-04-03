import { useState } from "react";

function LoginPage({ setUser }) {
  const [role, setRole] = useState("student");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const newErrors = {};
    if (!username.trim()) {
      newErrors.username = "Username is required";
    } else if (username.trim().length < 3) {
      newErrors.username = "Username must be at least 3 characters";
    }
    if (!password) {
      newErrors.password = "Password is required";
    } else if (password.length < 4) {
      newErrors.password = "Password must be at least 4 characters";
    }
    return newErrors;
  };

  const handleLogin = () => {
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    // Simulating JWT auth flow with slight delay
    setTimeout(() => {
      const user = { role, username: username.trim() };
      localStorage.setItem("user", JSON.stringify(user));
      setUser(user);
      setLoading(false);
    }, 600);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleLogin();
  };

  const clearError = (field) => {
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-br from-blue-100 via-indigo-50 to-blue-200">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-6">
          <div className="text-5xl mb-3">📚</div>
          <h1 className="text-2xl font-bold text-blue-700">Assignment Portal</h1>
          <p className="text-gray-400 text-sm mt-1">Sign in to your account</p>
        </div>

        {/* Role Toggle */}
        <div className="flex rounded-lg overflow-hidden border border-gray-200 mb-5">
          <button
            onClick={() => setRole("student")}
            className={`flex-1 py-2.5 text-sm font-semibold transition-colors ${
              role === "student"
                ? "bg-blue-600 text-white"
                : "bg-white text-gray-500 hover:bg-gray-50"
            }`}
          >
            🎓 Student
          </button>
          <button
            onClick={() => setRole("admin")}
            className={`flex-1 py-2.5 text-sm font-semibold transition-colors ${
              role === "admin"
                ? "bg-blue-600 text-white"
                : "bg-white text-gray-500 hover:bg-gray-50"
            }`}
          >
            👨‍🏫 Professor
          </button>
        </div>

        {/* Username */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
          <input
            type="text"
            placeholder="Enter your username"
            className={`w-full p-3 border rounded-lg text-sm transition-colors focus:outline-none focus:ring-2 ${
              errors.username
                ? "border-red-400 focus:ring-red-300"
                : "border-gray-300 focus:ring-blue-400"
            }`}
            value={username}
            onChange={(e) => { setUsername(e.target.value); clearError("username"); }}
            onKeyDown={handleKeyDown}
          />
          {errors.username && (
            <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
              ⚠️ {errors.username}
            </p>
          )}
        </div>

        {/* Password */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
          <input
            type="password"
            placeholder="Enter your password"
            className={`w-full p-3 border rounded-lg text-sm transition-colors focus:outline-none focus:ring-2 ${
              errors.password
                ? "border-red-400 focus:ring-red-300"
                : "border-gray-300 focus:ring-blue-400"
            }`}
            value={password}
            onChange={(e) => { setPassword(e.target.value); clearError("password"); }}
            onKeyDown={handleKeyDown}
          />
          {errors.password && (
            <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
              ⚠️ {errors.password}
            </p>
          )}
        </div>

        {/* Submit */}
        <button
          onClick={handleLogin}
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed text-white py-3 rounded-lg font-semibold text-sm transition-colors"
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
              Signing in...
            </span>
          ) : (
            "Login"
          )}
        </button>

        <p className="text-center text-xs text-gray-400 mt-4">
          Demo: any username (3+ chars) + password (4+ chars)
        </p>
      </div>
    </div>
  );
}

export default LoginPage;
