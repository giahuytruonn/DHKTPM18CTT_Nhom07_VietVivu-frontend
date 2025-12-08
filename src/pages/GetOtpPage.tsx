import React, { useState } from "react";
import { Mail } from "lucide-react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { forgotPassword } from "../services/user.service";

const GetOtpPage: React.FC = () => {
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await forgotPassword({ email });
      toast.success("Đã gửi OTP");
      navigate("/confirm-otp", { state: { email } });
    } catch {
      toast.error("Không gửi được OTP");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 to-blue-50">
      <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md">
        <h1 className="text-3xl font-bold text-center mb-6 bg-gradient-to-r from-indigo-600 to-blue-600 bg-clip-text text-transparent">
          Quên mật khẩu
        </h1>

        <form onSubmit={submit} className="space-y-4">
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="email"
              required
              placeholder="Email đăng ký"
              className="w-full pl-10 pr-4 py-3 border rounded-lg"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <button
            type="submit"
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-lg font-semibold cursor-pointer transition-colors"
          >
            Gửi OTP
          </button>
        </form>
      </div>
    </div>
  );
};

export default GetOtpPage;
