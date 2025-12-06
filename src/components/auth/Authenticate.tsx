import React, { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../../stores/useAuthStore";
import { loginWithGoogle } from "../../services/auth.service";
import { useQueryClient } from "@tanstack/react-query";

const Authenticate: React.FC = () => {
  const navigate = useNavigate();
  const setAuth = useAuthStore((s) => s.setAuth);
  const handled = useRef(false);
  const queryClient = useQueryClient();

  useEffect(() => {
    if (handled.current) return;
    handled.current = true;

    const authCodeRegex = /code=([^&]+)/;
    const isMatch = window.location.href.match(authCodeRegex);

    if (isMatch) {
      const authCode = isMatch[1];

      (async () => {
        try {
          const res = await loginWithGoogle(authCode);
          if (res && res.authenticated && res.token) {
            setAuth(res.token, true);
            queryClient.clear();

            // CẬP NHẬT: Check role và redirect
            try {
              const payload = JSON.parse(atob(res.token.split('.')[1]));
              const isAdmin = payload.scope?.includes('ROLE_ADMIN');

              if (isAdmin) {
                navigate("/admin/dashboard", { replace: true });
              } else {
                navigate("/", { replace: true });
              }
            } catch {
              navigate("/", { replace: true });
            }
          } else {
            navigate("/login", { replace: true });
          }
        } catch {
          navigate("/login", { replace: true });
        }
      })();
    } else {
      navigate("/login", { replace: true });
    }
  }, [navigate, setAuth, queryClient]);

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-50">
      <div className="bg-white p-8 rounded-xl shadow-md text-center">
        <h2 className="text-2xl font-semibold mb-4">Đang xác thực Google...</h2>
        <p className="text-gray-600">Vui lòng chờ trong giây lát...</p>
      </div>
    </div>
  );
};

export default Authenticate;