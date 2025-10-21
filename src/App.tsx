// src/App.tsx
import React from "react";
import AppRoutes from "./routes/AppRoutes";
import { Toaster } from "react-hot-toast"; 

const App: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <AppRoutes />
      <Toaster position="top-right" />
    </div>
  );
};

export default App;
