import React, { useState, useEffect } from "react";
import OtpInput from "../components/ui/OtpInput";
import toast from "react-hot-toast";
import { useLocation, useNavigate } from "react-router-dom";
import api from "../services/api";
import { forgotPassword } from "../services/user.service";
import type { ApiResponse } from "../types/apiresponse";
import type { VerifyOtpResponse } from "../types/user";

const ConfirmOtpPage: React.FC = () => {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [countdown, setCountdown] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const [isSending, setIsSending] = useState(false);

  const location = useLocation();
  const email = (location.state as { email?: string })?.email;
  const navigate = useNavigate();

  useEffect(() => {
    if (countdown <= 0) {
      setCanResend(true);
      return;
    }
    const timer = setTimeout(() => setCountdown((c) => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [countdown]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const otpCode = otp.join("");

    try {
      const res = await api.post<ApiResponse<VerifyOtpResponse>>(
        "/users/verify-otp",
        {
          email,
          otp: otpCode,
        }
      );
      const resetToken = res.data.result.resetToken;
      toast.success("OTP hợp lệ");
      navigate("/reset-password", { state: { email, resetToken } });
    } catch (err: any) {
      toast.error(err?.response?.data?.message);
    }
  };

  const resendOtp = async () => {
    if (!canResend || !email || isSending) return;
    try {
      setIsSending(true);
      await forgotPassword({ email });
      toast.success("Đã gửi lại OTP. Kiểm tra email.");
      setCountdown(60);
      setCanResend(false);
      // optional: persist last sent time for UX
      localStorage.setItem(`otp_last_sent_${email}`, Date.now().toString());
    } catch (err: any) {
      toast.error(err?.response?.data?.message);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 to-blue-50">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
        <h2 className="text-3xl font-bold text-center mb-6 bg-gradient-to-r from-indigo-600 to-blue-600 bg-clip-text text-transparent">
          Nhập mã OTP
        </h2>

        <form
          onSubmit={submit}
          className="space-y-6 justify-center items-center"
        >
          <OtpInput value={otp} onChange={setOtp} />

          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700"
          >
            Xác nhận
          </button>

          <p className="text-center text-sm text-gray-600">
            {canResend ? (
              <button
                onClick={resendOtp}
                className={`text-indigo-600 underline cursor-pointer transition-colors hover:text-indigo-800 ${
                  isSending ? "opacity-60 pointer-events-none" : ""
                }`}
                disabled={isSending}
              >
                {isSending ? "Đang gửi..." : "Gửi lại OTP"}
              </button>
            ) : (
              `Gửi lại sau ${countdown}s`
            )}
          </p>
        </form>
      </div>
    </div>
  );
};

export default ConfirmOtpPage;
