import React from "react";
import LoginForm from "../components/auth/LoginForm";
import { OAuthConfig } from "../config/OAuthConfig";

const LoginPage: React.FC = () => {
  const handleGoogleLogin = () => {
    const callbackUrl = OAuthConfig.redirectUri;
    const authUrl = OAuthConfig.authUri;
    const googleClientId = OAuthConfig.clientId;

    const targetUrl = `${authUrl}?redirect_uri=${encodeURIComponent(
      callbackUrl
    )}&response_type=code&client_id=${googleClientId}&scope=openid%20email%20profile`;

    console.log("Google OAuth URL:", targetUrl);
    window.location.href = targetUrl;
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-50">
      <div className="bg-white p-8 rounded-2xl shadow-md w-96">
        <h2 className="text-2xl font-semibold text-center mb-6">Đăng nhập</h2>
        <LoginForm />
        <button
          onClick={handleGoogleLogin}
          className="mt-6 w-full bg-red-500 text-white p-2 rounded hover:bg-red-600"
        >
          Đăng nhập với Google
        </button>
        <h2 className="text-center m-2 text-blue-500">Bạn chưa có tài khoản? <button>Tạo ngay!</button> </h2>
      </div>
    </div>
  );
};

export default LoginPage;
