import React, { useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { useAuthStore } from "../stores/useAuthStore";
import api from "../services/api";
import type { ChangePasswordRequest } from "../types/user";

const ChangePasswordPage: React.FC = () => {
  const navigate = useNavigate();
  const { logout } = useAuthStore();

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [loading, setLoading] = useState(false);

  // Error states
  const [errors, setErrors] = useState({
    oldPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  });

  // Validation helper
  const validatePasswords = () => {
    const newErrors = {
      oldPassword: "",
      newPassword: "",
      confirmNewPassword: "",
    };

    if (!oldPassword) {
      newErrors.oldPassword = "Vui lòng nhập mật khẩu hiện tại";
    }

    if (!newPassword) {
      newErrors.newPassword = "Vui lòng nhập mật khẩu mới";
    } else if (newPassword.length < 8) {
      newErrors.newPassword = "Mật khẩu phải có ít nhất 8 ký tự";
    }

    if (!confirmNewPassword) {
      newErrors.confirmNewPassword = "Vui lòng nhập lại mật khẩu";
    } else if (newPassword !== confirmNewPassword) {
      newErrors.confirmNewPassword = "Mật khẩu không khớp";
    }

    setErrors(newErrors);
    return (
      !newErrors.oldPassword &&
      !newErrors.newPassword &&
      !newErrors.confirmNewPassword
    );
  };

  const handleChangePassword = useCallback(async () => {
    // Validate inputs first
    if (!validatePasswords()) {
      return;
    }

    setLoading(true);
    try {
      const payload: ChangePasswordRequest = {
        oldPassword,
        newPassword,
      };

      await api
        .post("/users/change-password", payload)
        .then(() => {
          toast.success("Đổi mật khẩu thành công. Vui lòng đăng nhập lại.");
        })
        .catch((error) => {
          const srvMsg = error?.response?.data?.message;
          toast.error(srvMsg || "Lỗi khi đổi mật khẩu. Vui lòng thử lại.");
        });
      logout();
      navigate("/login", { replace: true });
    } catch (err: any) {
      const srvMsg = err?.response?.data?.message;
      toast.error(srvMsg || "Lỗi khi đổi mật khẩu. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  }, [oldPassword, newPassword, navigate, logout]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-indigo-50 to-blue-50 p-4">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md">
        <h2 className="text-3xl font-bold text-center mb-6 bg-gradient-to-r from-indigo-600 to-blue-600 bg-clip-text text-transparent">
          Đổi mật khẩu
        </h2>

        <div className="flex flex-col gap-4">
          <div>
            <input
              type="password"
              placeholder="Mật khẩu hiện tại"
              className={`w-full border p-2 rounded ${
                errors.oldPassword
                  ? "border-red-500 focus:ring-red-500"
                  : "border-gray-300"
              }`}
              value={oldPassword}
              onChange={(e) => {
                setOldPassword(e.target.value);
                if (errors.oldPassword)
                  setErrors({ ...errors, oldPassword: "" });
              }}
            />
            {errors.oldPassword && (
              <p className="text-red-500 text-sm mt-1">{errors.oldPassword}</p>
            )}
          </div>

          <div>
            <input
              type="password"
              placeholder="Mật khẩu mới"
              className={`w-full border p-2 rounded ${
                errors.newPassword
                  ? "border-red-500 focus:ring-red-500"
                  : "border-gray-300"
              }`}
              value={newPassword}
              onChange={(e) => {
                setNewPassword(e.target.value);
                if (errors.newPassword)
                  setErrors({ ...errors, newPassword: "" });
              }}
            />
            {errors.newPassword && (
              <p className="text-red-500 text-sm mt-1">{errors.newPassword}</p>
            )}
          </div>

          <div>
            <input
              type="password"
              placeholder="Nhập lại mật khẩu mới"
              className={`w-full border p-2 rounded ${
                errors.confirmNewPassword
                  ? "border-red-500 focus:ring-red-500"
                  : "border-gray-300"
              }`}
              value={confirmNewPassword}
              onChange={(e) => {
                setConfirmNewPassword(e.target.value);
                if (errors.confirmNewPassword)
                  setErrors({ ...errors, confirmNewPassword: "" });
              }}
            />
            {errors.confirmNewPassword && (
              <p className="text-red-500 text-sm mt-1">
                {errors.confirmNewPassword}
              </p>
            )}
          </div>

          <button
            disabled={loading}
            onClick={() => handleChangePassword()}
            className={`w-full py-3 rounded-xl text-white font-semibold shadow-md bg-gradient-to-r from-purple-500 to-indigo-600 hover:opacity-90 transition-all cursor-pointer ${
              loading ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {loading ? "Đang xử lý..." : "Xác nhận đổi mật khẩu"}
          </button>
        </div>

        <div className="flex justify-end mt-4">
          <button
            className="text-indigo-600 hover:text-indigo-800 font-semibold"
            onClick={() => navigate("/get-otp-page")}
          >
            Quên mật khẩu?
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChangePasswordPage;
