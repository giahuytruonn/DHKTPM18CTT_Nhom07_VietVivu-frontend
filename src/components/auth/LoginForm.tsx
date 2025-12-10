import React, { useState } from "react";
import { login } from "../../services/auth.service";
import { useAuthStore } from "../../stores/useAuthStore";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const LoginForm: React.FC = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false); // Thêm state loading
  
  const setAuth = useAuthStore((s) => s.setAuth);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // 1. Validation trước khi gọi API
    if (!username.trim() || !password.trim()) {
        toast.error("Vui lòng nhập đầy đủ Tên đăng nhập và Mật khẩu!");
        return;
    }

    setLoading(true); // Bắt đầu loading

    try {
      const res = await login({ username, password });
      
      if (res.authenticated) {
        setAuth(res.token, true);
        toast.success("Đăng nhập thành công!");

        // Check role và redirect
        try {
          const payload = JSON.parse(atob(res.token.split(".")[1]));
          const isAdmin = payload.scope?.includes("ROLE_ADMIN");

          if (isAdmin) {
            navigate("/admin/dashboard", { replace: true });
          } else {
            navigate("/", { replace: true });
          }
        } catch {
          navigate("/", { replace: true });
        }
      } else {
        toast.error("Sai tài khoản hoặc mật khẩu");
      }
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Đăng nhập thất bại");
    } finally {
        setLoading(false); // Kết thúc loading dù thành công hay thất bại
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Field Tên đăng nhập */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
            Tên đăng nhập <span className="text-red-500">*</span>
        </label>
        <input
            className="w-full border border-gray-300 p-2.5 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
            placeholder="Nhập tên đăng nhập"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            disabled={loading}
        />
      </div>

      {/* Field Mật khẩu */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
            Mật khẩu <span className="text-red-500">*</span>
        </label>
        <input
            className="w-full border border-gray-300 p-2.5 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
            type="password"
            placeholder="Nhập mật khẩu"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={loading}
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-indigo-600 text-white p-2.5 rounded-lg hover:bg-indigo-700 font-semibold transition-colors disabled:bg-indigo-400 disabled:cursor-not-allowed flex justify-center items-center"
      >
        {loading ? (
            <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Đang xử lý...
            </>
        ) : (
            "Đăng nhập"
        )}
      </button>
    </form>
  );
};

export default LoginForm;