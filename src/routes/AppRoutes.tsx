// src/routes/AppRoutes.tsx
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import Home from "../pages/Home";
import Authenticate from "../components/auth/Authenticate";
import Login from "../pages/LoginPage";
import { useAuthStore } from "../stores/useAuthStore";

const AppRoutes = () => {
  const authenticated = useAuthStore((s) => s.authenticated);

  return (
    <Router>
      <Routes>
        <Route path="/login" element={authenticated ? <Navigate to="/" replace /> : <Login />} />
        <Route path="/authenticate" element={<Authenticate />} />
        <Route
          path="/"
          element={authenticated ? <Home /> : <Navigate to="/login" replace />}
        />
      </Routes>
    </Router>
  );
};

export default AppRoutes;
