import React, { useState } from "react";
import { Mail } from "lucide-react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { forgotPassword } from "../services/user.service";

const GetOtpPage: React.FC = () => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false); // State loading
  const [error, setError] = useState(""); // State lỗi
  const navigate = useNavigate();

  // Regex validate email
  const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();

    // 1. Validation
    if (!email.trim()) {
      setError("Vui lòng nhập email đăng ký");
      return;
    }
    if (!EMAIL_REGEX.test(email)) {
      setError("Email không đúng định dạng");
      return;
    }

    setIsLoading(true);

    try {
      await forgotPassword({ email });
      toast.success("Đã gửi mã OTP đến email của bạn!");
      navigate("/confirm-otp", { state: { email } });
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Không tìm thấy email này");
    } finally {
      setIsLoading(false);
    }
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    // Xóa lỗi khi người dùng bắt đầu nhập lại
    if (error) setError("");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 to-blue-50">
      <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md border border-indigo-50">
        <h1 className="text-3xl font-bold text-center mb-2 bg-gradient-to-r from-indigo-600 to-blue-600 bg-clip-text text-transparent">
          Quên mật khẩu
        </h1>
        <p className="text-center text-gray-500 mb-8 text-sm">
          Nhập email của bạn để nhận mã xác thực
        </p>

        <form onSubmit={submit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Email đăng ký <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="email"
                placeholder="name@example.com"
                className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition-all ${
                  error ? "border-red-500 bg-red-50" : "border-gray-300"
                }`}
                value={email}
                onChange={handleEmailChange}
                disabled={isLoading}
              />
            </div>
            {error && <p className="text-red-500 text-xs mt-1 ml-1">{error}</p>}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-lg font-semibold cursor-pointer transition-all disabled:opacity-70 disabled:cursor-not-allowed flex justify-center items-center gap-2"
          >
            {isLoading ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Đang gửi...</span>
              </>
            ) : (
              "Gửi mã OTP"
            )}
          </button>

          <div className="text-center mt-4">
             <button 
                type="button"
                onClick={() => navigate("/login")}
                className="text-sm text-indigo-600 hover:underline font-medium"
             >
                Quay lại đăng nhập
             </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default GetOtpPage;