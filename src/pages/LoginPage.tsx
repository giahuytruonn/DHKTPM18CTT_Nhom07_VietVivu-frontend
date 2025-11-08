import { Link } from "react-router-dom";
import LoginForm from "../components/auth/LoginForm";
import { OAuthConfig } from "../config/OAuthConfig";

export default function LoginPage() {
  const handleGoogle = () => {
    const url = `${OAuthConfig.authUri}?redirect_uri=${encodeURIComponent(
      OAuthConfig.redirectUri
    )}&response_type=code&client_id=${OAuthConfig.clientId}&scope=openid%20email%20profile`;
    window.location.href = url;
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <div className="bg-white p-8 rounded-2xl shadow-md w-96">
        <h2 className="text-2xl font-semibold text-center mb-6">Đăng nhập</h2>
        <LoginForm />
        <button
          onClick={handleGoogle}
          className="mt-6 w-full bg-red-500 text-white p-2 rounded hover:bg-red-600"
        >
          Đăng nhập với Google
        </button>
        <p className="text-center mt-4 text-sm">
          Chưa có tài khoản? <Link to="/register" className="text-indigo-600">Đăng ký</Link>
        </p>
      </div>
    </div>
  );
}