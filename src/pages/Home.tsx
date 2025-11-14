import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../stores/useAuthStore";
import { logout as logoutApi } from "../services/auth.service";
import { createPassword } from "../services/user.servie";
import type { PasswordCreationRequest } from "../types/user";
import { useUser } from "../hooks/useUser";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import ChatBox from "../components/ChatBox";

const Home: React.FC = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { token, logout } = useAuthStore();
  const [password, setPassword] =
    useState<PasswordCreationRequest["password"]>("");

  const { user, isLoading, isError, refetch } = useUser();

  const createPasswordMutation = useMutation({
    mutationFn: (data: PasswordCreationRequest) => createPassword(data),
    onSuccess: () => {
      toast.success("Tạo mật khẩu thành công!");
      queryClient.invalidateQueries({ queryKey: ["userProfile"] });
      setPassword("");
    },
    onError: () => {
      toast.error("Tạo mật khẩu thất bại!");
    },
  });

  const logoutMutation = useMutation({
    mutationFn: async () => {
      const currentToken = token || localStorage.getItem("token");
      if (currentToken) {
        await logoutApi(currentToken);
      }
    },
    onSuccess: () => {
      toast.info("Đăng xuất thành công!");
    },
    onError: () => {
      toast.error("Lỗi khi đăng xuất!");
    },
    onSettled: () => {
      logout();
      localStorage.clear();
      queryClient.clear();
      navigate("/login", { replace: true });
    },
  });

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gray-50">
        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-gray-600">Đang tải thông tin người dùng...</p>
      </div>
    );
  }

  if (isError || !user) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-red-50">
        <p className="text-red-600 text-lg mb-4">
          Lỗi tải thông tin người dùng!
        </p>
        <button
          onClick={() => refetch()}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
        >
          Thử lại
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-50">
      <h1 className="text-3xl font-bold mb-6">Trang chủ</h1>

      <ChatBox/>
      {/* ✅ Nút chuyển sang Stepper booking */}
      <button
        onClick={() => navigate("/book-tour")}
        className="bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600 transition mb-6"
      >
        🧳 Đặt tour ngay
      </button>

      {user.noPassword ? (
        <div className="flex flex-col items-center mb-6">
          <input
            type="password"
            placeholder="Nhập mật khẩu mới"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border border-gray-300 rounded-lg px-4 py-2 mb-4 focus:ring focus:ring-blue-300 outline-none"
          />
          <button
            onClick={() => {
              if (!password.trim()) {
                toast.warning("Vui lòng nhập mật khẩu!");
                return;
              }
              createPasswordMutation.mutate({ password });
            }}
            disabled={createPasswordMutation.isPending}
            className={`${
              createPasswordMutation.isPending
                ? "bg-blue-300"
                : "bg-blue-500 hover:bg-blue-600"
            } text-white px-4 py-2 rounded-lg transition`}
          >
            {createPasswordMutation.isPending ? "Đang tạo..." : "Tạo mật khẩu"}
          </button>
        </div>
      ) : (
        <p className="text-gray-700 mb-6">
          Chào mừng, <span className="font-semibold">{user.name}</span>!
        </p>
      )}

      <button
        onClick={() => logoutMutation.mutate()}
        disabled={logoutMutation.isPending}
        className={`${
          logoutMutation.isPending
            ? "bg-red-300"
            : "bg-red-500 hover:bg-red-600"
        } text-white px-4 py-2 rounded-lg transition`}
      >
        {logoutMutation.isPending ? "Đang đăng xuất..." : "Đăng xuất"}
      </button>
    </div>
  );
};

export default Home;
