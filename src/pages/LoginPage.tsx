import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import LoginForm from "../components/auth/LoginForm";
import { OAuthConfig } from "../config/OAuthConfig";
import { useAuthStore } from "../stores/useAuthStore";

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { authenticated, token } = useAuthStore();

  // Redirect nếu đã đăng nhập
  useEffect(() => {
    if (authenticated && token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        const isAdmin = payload.scope?.includes('ROLE_ADMIN');
        
        // Redirect admin to dashboard, user to home
        if (isAdmin) {
          navigate("/admin/dashboard", { replace: true });
        } else {
          navigate("/", { replace: true });
        }
      } catch {
        navigate("/", { replace: true });
      }
    }
  }, [authenticated, token, navigate]);

  const handleGoogleLogin = () => {
    const callbackUrl = OAuthConfig.redirectUri;
    const authUrl = OAuthConfig.authUri;
    const googleClientId = OAuthConfig.clientId;

    const targetUrl = `${authUrl}?redirect_uri=${encodeURIComponent(
      callbackUrl
    )}&response_type=code&client_id=${googleClientId}&scope=openid%20email%20profile`;

    window.location.href = targetUrl;
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-indigo-50 to-blue-50">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-96">
        <h2 className="text-3xl font-bold text-center mb-6 bg-gradient-to-r from-indigo-600 to-blue-600 bg-clip-text text-transparent">
          Đăng nhập
        </h2>
        <LoginForm />
        <button
          onClick={handleGoogleLogin}
          className="mt-6 w-full bg-white border-2 border-gray-200 text-gray-700 p-3 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center gap-3 font-semibold"
        >
          <img
            src="https://www.google.com/favicon.ico"
            alt="Google"
            className="w-5 h-5"
          />
          Đăng nhập với Google
        </button>
        <p className="text-center mt-6 text-gray-600">
          Bạn chưa có tài khoản?{" "}
          <a href="/register" className="text-indigo-600 font-semibold hover:text-indigo-800">
            Tạo ngay!
          </a>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;