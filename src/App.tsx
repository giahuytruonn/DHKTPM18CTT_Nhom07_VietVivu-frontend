// src/App.tsx
import React, { useEffect } from "react";
import AppRoutes from "./routes/AppRoutes";
import { Toaster } from "react-hot-toast";
import { useAuthStore } from "./stores/useAuthStore";

const App: React.FC = () => {
  const checkToken = useAuthStore((state) => state.checkToken);

  useEffect(() => {
    checkToken();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <AppRoutes />
      <Toaster position="top-right" />
    </div>
  );
};

export default App;
