import { useState } from "react";
import axios from "axios";

function AdminLogin({ onClose, onSuccess, onLoginSuccess }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const getApiUrl = () =>
    import.meta.env.VITE_API_URL || "https://djsce-resources.onrender.com";

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!username.trim() || !password) {
      setError("Please enter both username and password");
      return;
    }

    setError("");
    setLoading(true);

    try {
      const cleanUsername = username.trim();

      const response = await axios.post(
        `${getApiUrl()}/auth/login`,
        {
          username: cleanUsername,
          password,
        },
        {
          withCredentials: true,
        }
      );

      const userData = response?.data?.user;
      const userToken = response?.data?.token;

      if (userData && userData.role === "admin") {
        if (userToken) {
          localStorage.setItem("adminToken", userToken);
          localStorage.setItem("adminUser", JSON.stringify(userData));
          axios.defaults.headers.common["Authorization"] = `Bearer ${userToken}`;
        }

        // Call success callbacks
        if (onSuccess) {
          onSuccess(userData, userToken);
        }
        if (onLoginSuccess) {
          onLoginSuccess(userData, userToken);
        }

        if (onClose) {
          onClose();
        }
      } else {
        setError("Admin access required");
      }
    } catch (err) {
      console.error("Login error:", err);
      setError(
        err.response?.data?.error || "Login failed. Please check your credentials."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl border border-line animate-[fadeIn_0.3s_ease-in-out]">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-line">
          <div>
            <h2 className="text-xl font-bold text-ink font-['Sora']">
              Admin Login
            </h2>
            <p className="text-xs text-ink-dim mt-1">
              Resource moderation &amp; file verification
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-bg text-ink-dim hover:text-ink transition-colors cursor-pointer"
            title="Close"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-ink mb-1.5">
              Username
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="w-full px-4 py-3 border border-line rounded-xl text-sm text-ink focus:outline-none focus:border-violet bg-white"
              placeholder="Admin username"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-ink mb-1.5">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-3 border border-line rounded-xl text-sm text-ink focus:outline-none focus:border-violet bg-white"
              placeholder="••••••••"
            />
          </div>

          {error && (
            <div className="p-3.5 rounded-xl bg-rose-50 text-rose-800 border border-rose-200 text-xs font-semibold flex items-center gap-2">
              <svg className="w-4 h-4 flex-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
              <span>{error}</span>
            </div>
          )}

          <div className="flex gap-3 pt-3">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="flex-1 py-3.5 px-5 rounded-xl border border-line text-sm font-semibold text-ink hover:bg-bg transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-3.5 px-5 rounded-xl bg-gradient-to-r from-violet via-blue to-cyan text-white text-sm font-semibold hover:brightness-105 active:scale-95 transition-all shadow-md cursor-pointer disabled:opacity-50"
            >
              {loading ? "Signing in..." : "Login"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AdminLogin;
