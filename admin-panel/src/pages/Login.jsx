import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const API = "https://asan-driverapp.onrender.com";

  const handleLogin = async () => {
    try {
      // ✅ validation
      if (!username || !password) {
        alert("Please enter username and password");
        return;
      }

      setLoading(true);

      const res = await axios.post(`${API}/api/admin/login`, {
        username,
        password
      });

      // ✅ safe response handling
      if (!res?.data) {
        throw new Error("Invalid server response");
      }

      // ✅ OPTIONAL (keep only if backend uses auth)
      if (res.data.token) {
        localStorage.setItem("adminToken", res.data.token);
      }

      if (res.data.role) {
        localStorage.setItem("adminRole", res.data.role);
      }

      // ✅ navigate
      navigate("/dashboard");

    } catch (error) {
      console.error("Login error:", error);

      const message =
        error?.response?.data?.message ||
        "Login failed. Please try again";

      alert(message);

    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white shadow-2xl rounded-3xl px-10 py-12 border border-gray-200">

        {/* Title */}
        <div className="text-center space-y-2 mb-10">
          <h1 className="text-3xl font-bold text-yellow-500">
            ASAN ADMIN
          </h1>
          <p className="text-sm text-gray-500">
            Secure Administrator Access
          </p>
        </div>

        {/* Form */}
        <div className="space-y-6">

          {/* Username */}
          <div className="relative">
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder=" "
              className="peer w-full border border-gray-300 rounded-xl px-4 pt-6 pb-2 focus:outline-none focus:ring-2 focus:ring-yellow-400"
            />
            <label className="absolute left-4 top-2 text-sm text-gray-500
              peer-placeholder-shown:top-4 peer-placeholder-shown:text-base
              peer-focus:top-2 peer-focus:text-sm peer-focus:text-yellow-500">
              Username
            </label>
          </div>

          {/* Password */}
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder=" "
              className="peer w-full border border-gray-300 rounded-xl px-4 pt-6 pb-2 pr-12 focus:outline-none focus:ring-2 focus:ring-yellow-400"
            />
            <label className="absolute left-4 top-2 text-sm text-gray-500
              peer-placeholder-shown:top-4 peer-placeholder-shown:text-base
              peer-focus:top-2 peer-focus:text-sm peer-focus:text-yellow-500">
              Password
            </label>

            <div
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 cursor-pointer"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </div>
          </div>

          {/* Button */}
          <button
            onClick={handleLogin}
            disabled={loading}
            className={`w-full py-3 rounded-xl font-semibold text-white ${
              loading
                ? "bg-yellow-300 cursor-not-allowed"
                : "bg-yellow-500 hover:bg-yellow-600"
            }`}
          >
            {loading ? "Signing in..." : "Login"}
          </button>

        </div>

        {/* Footer */}
        <div className="text-center mt-10 text-xs text-gray-400">
          © {new Date().getFullYear()} ASAN Transport System
        </div>

      </div>
    </div>
  );
}

export default Login;