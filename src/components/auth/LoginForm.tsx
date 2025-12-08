import React, { useState } from "react";
import { login } from "../../services/auth.service";
import { useAuthStore } from "../../stores/useAuthStore";
import { useNavigate } from "react-router-dom";

const LoginForm: React.FC = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const setAuth = useAuthStore((s) => s.setAuth);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await login({ username, password });
      if (res.authenticated) {
        setAuth(res.token, true);

        // CẬP NHẬT: Check role và redirect
        try {
          const payload = JSON.parse(atob(res.token.split('.')[1]));
          const isAdmin = payload.scope?.includes('ROLE_ADMIN');

          if (isAdmin) {
            navigate("/admin/dashboard", { replace: true });
          } else {
            navigate("/", { replace: true });
          }
        } catch {
          navigate("/", { replace: true });
        }
      } else {
        alert("Sai tài khoản hoặc mật khẩu");
      }
    } catch (err) {
      console.error(err);
      alert("Đăng nhập thất bại");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input
        className="w-full border p-2 rounded"
        placeholder="Tên đăng nhập"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <input
        className="w-full border p-2 rounded"
        type="password"
        placeholder="Mật khẩu"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button
        type="submit"
        className="w-full bg-indigo-600 text-white p-2 rounded hover:bg-indigo-700"
      >
        Đăng nhập
      </button>
    </form>
  );
};

export default LoginForm;