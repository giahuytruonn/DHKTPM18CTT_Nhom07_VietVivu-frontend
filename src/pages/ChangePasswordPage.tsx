import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { Lock } from "lucide-react"; // Import icon
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

    let isValid = true;

    if (!oldPassword) {
      newErrors.oldPassword = "Vui lòng nhập mật khẩu hiện tại";
      isValid = false;
    }

    if (!newPassword) {
      newErrors.newPassword = "Vui lòng nhập mật khẩu mới";
      isValid = false;
    } else if (newPassword.length < 8) {
      newErrors.newPassword = "Mật khẩu phải có ít nhất 8 ký tự";
      isValid = false;
    }

    if (!confirmNewPassword) {
      newErrors.confirmNewPassword = "Vui lòng nhập lại mật khẩu";
      isValid = false;
    } else if (newPassword !== confirmNewPassword) {
      newErrors.confirmNewPassword = "Mật khẩu không khớp";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleChangePassword = async () => {
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

      await api.post("/users/change-password", payload);
      
      toast.success("Đổi mật khẩu thành công. Vui lòng đăng nhập lại.");
      logout();
      navigate("/login", { replace: true });
    } catch (error: any) {
      const srvMsg = error?.response?.data?.message;
      toast.error(srvMsg || "Lỗi khi đổi mật khẩu. Vui lòng kiểm tra lại.");
    } finally {
      setLoading(false);
    }
  };

  // Helper để clear lỗi khi user nhập
  const handleInputChange = (
    setter: React.Dispatch<React.SetStateAction<string>>,
    field: keyof typeof errors,
    value: string
  ) => {
    setter(value);
    if (errors[field]) {
      setErrors({ ...errors, [field]: "" });
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-indigo-50 to-blue-50 p-4">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md border border-indigo-50">
        <h2 className="text-3xl font-bold text-center mb-6 bg-gradient-to-r from-indigo-600 to-blue-600 bg-clip-text text-transparent">
          Đổi mật khẩu
        </h2>

        <div className="flex flex-col gap-5">
          {/* Mật khẩu cũ */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Mật khẩu hiện tại <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="password"
                placeholder="Nhập mật khẩu hiện tại"
                className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition-all ${
                  errors.oldPassword
                    ? "border-red-500 bg-red-50"
                    : "border-gray-300"
                }`}
                value={oldPassword}
                onChange={(e) =>
                  handleInputChange(setOldPassword, "oldPassword", e.target.value)
                }
                disabled={loading}
              />
            </div>
            {errors.oldPassword && (
              <p className="text-red-500 text-xs mt-1 ml-1">
                {errors.oldPassword}
              </p>
            )}
          </div>

          {/* Mật khẩu mới */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Mật khẩu mới <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="password"
                placeholder="Nhập mật khẩu mới"
                className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition-all ${
                  errors.newPassword
                    ? "border-red-500 bg-red-50"
                    : "border-gray-300"
                }`}
                value={newPassword}
                onChange={(e) =>
                  handleInputChange(setNewPassword, "newPassword", e.target.value)
                }
                disabled={loading}
              />
            </div>
            {errors.newPassword && (
              <p className="text-red-500 text-xs mt-1 ml-1">
                {errors.newPassword}
              </p>
            )}
          </div>

          {/* Xác nhận mật khẩu mới */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Nhập lại mật khẩu mới <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="password"
                placeholder="Xác nhận mật khẩu"
                className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition-all ${
                  errors.confirmNewPassword
                    ? "border-red-500 bg-red-50"
                    : "border-gray-300"
                }`}
                value={confirmNewPassword}
                onChange={(e) =>
                  handleInputChange(
                    setConfirmNewPassword,
                    "confirmNewPassword",
                    e.target.value
                  )
                }
                disabled={loading}
              />
            </div>
            {errors.confirmNewPassword && (
              <p className="text-red-500 text-xs mt-1 ml-1">
                {errors.confirmNewPassword}
              </p>
            )}
          </div>

          <button
            disabled={loading}
            onClick={handleChangePassword}
            className="w-full py-3 rounded-xl text-white font-semibold shadow-md bg-gradient-to-r from-purple-500 to-indigo-600 hover:shadow-lg hover:-translate-y-0.5 transition-all disabled:opacity-70 disabled:cursor-not-allowed flex justify-center items-center gap-2"
          >
            {loading ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Đang xử lý...</span>
              </>
            ) : (
              "Xác nhận đổi mật khẩu"
            )}
          </button>
        </div>

        <div className="flex justify-center mt-6">
          <button
            className="text-indigo-600 hover:text-indigo-800 text-sm font-semibold hover:underline"
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