import React, { useEffect, useState } from "react";
import { useAuthStore } from "../stores/useAuthStore";
import { logout as logoutWeb } from "../services/auth.service";
import { getUserProfile, createPassword } from "../services/user.servie";
import type { PasswordCreationRequest, UserResponse } from "../types/user";
import { useNavigate } from "react-router-dom";

const Home: React.FC = () => {
  const navigate = useNavigate();
  const { token, logout } = useAuthStore();
  const [userDetails, setUserDetails] = useState<UserResponse | null>(null);
  const [password, setPassword] =
    useState<PasswordCreationRequest["password"]>("");
  const [loading, setLoading] = useState(true);
  const [creatingPassword, setCreatingPassword] = useState(false);

  const performLogout = async () => {
    const currentToken = token;

    try {
      if (currentToken) {
        await logoutWeb(currentToken);
      } else {
      }
    } catch (err) {
      console.error("❌ Logout API error:", err);
    } finally {
      logout();
      localStorage.removeItem("token");
      localStorage.removeItem("auth-store");
      navigate("/login", { replace: true });
    }
  };

  const fetchUserDetails = async () => {
    try {
      setLoading(true);
      const res = await getUserProfile();
      setUserDetails(res);
    } catch (error) {
      console.error("Error fetching user profile:", error);
      performLogout();
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePassword = async () => {
    if (!password.trim()) {
      alert("Vui lòng nhập mật khẩu!");
      return;
    }

    try {
      setCreatingPassword(true);
      const res = await createPassword({ password });
      if (res) {
        alert("Tạo mật khẩu thành công!");
        await fetchUserDetails();
      }
    } catch (error) {
      console.error("Error creating password:", error);
      alert("Tạo mật khẩu thất bại!");
    } finally {
      setCreatingPassword(false);
    }
  };

  useEffect(() => {
    fetchUserDetails();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gray-50">
        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-gray-600">Đang tải thông tin người dùng...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-50">
      <h1 className="text-3xl font-bold mb-6">Trang chủ</h1>

      {userDetails?.noPassword ? (
        <div className="flex flex-col items-center mb-6">
          <input
            type="password"
            placeholder="Nhập mật khẩu mới"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border border-gray-300 rounded-lg px-4 py-2 mb-4 focus:ring focus:ring-blue-300 outline-none"
          />
          <button
            onClick={handleCreatePassword}
            disabled={creatingPassword}
            className={`${
              creatingPassword ? "bg-blue-300" : "bg-blue-500 hover:bg-blue-600"
            } text-white px-4 py-2 rounded-lg transition`}
          >
            {creatingPassword ? "Đang tạo..." : "Tạo mật khẩu"}
          </button>
        </div>
      ) : (
        <p className="text-gray-700 mb-6">
          Chào mừng, <span className="font-semibold">{userDetails?.name}</span>!
        </p>
      )}

      <button
        onClick={performLogout}
        className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
      >
        Đăng xuất
      </button>
    </div>
  );
};

export default Home;
