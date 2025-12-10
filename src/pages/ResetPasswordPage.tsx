import React, { useState } from "react";
import { Lock } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import PasswordStrengthBar from "../components/ui/PasswordChangeBar";
import api from "../services/api";
import type { ResetPasswordRequest } from "../types/user";

const ResetPasswordPage: React.FC = () => {
  const [pass, setPass] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);

  const location = useLocation();
  const { email, resetToken } =
    (location.state as { email?: string; resetToken?: string }) || {};
  const navigate = useNavigate();

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (pass !== confirm) {
      toast.error("Mật khẩu không trùng khớp");
      return;
    }

    if (!email || !resetToken) {
      toast.error("Yêu cầu không hợp lệ. Vui lòng thử lại.");
      return;
    }

    setLoading(true);
    const payload: ResetPasswordRequest = {
      email,
      newPassword: pass,
      resetToken,
    };

    try {
      await api.post("/users/reset-password", payload);
      toast.success("Đặt mật khẩu thành công");
      navigate("/login");
    } catch (err: any) {
      toast.error(err?.response?.data?.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 to-blue-50">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
        <h2 className="text-3xl font-bold text-center mb-6 bg-gradient-to-r from-indigo-600 to-blue-600 bg-clip-text text-transparent">
          Đặt mật khẩu mới
        </h2>

        <form onSubmit={submit} className="space-y-4">
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="password"
              placeholder="Mật khẩu"
              className="w-full pl-10 pr-4 py-3 border rounded-lg"
              value={pass}
              onChange={(e) => setPass(e.target.value)}
            />
          </div>

          <PasswordStrengthBar password={pass} />

          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="password"
              placeholder="Nhập lại mật khẩu"
              className="w-full pl-10 pr-4 py-3 border rounded-lg"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 disabled:opacity-50"
          >
            {loading ? "Đang xử lý..." : "Đổi mật khẩu"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPasswordPage;
