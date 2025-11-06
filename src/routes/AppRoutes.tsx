import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import Home from "../pages/Home";
import Authenticate from "../components/auth/Authenticate";
import Login from "../pages/LoginPage";
import { useAuthStore } from "../stores/useAuthStore";
import Payment from "../pages/Payment";
import PaymentSuccess from "../pages/PaymentSuccess";   
import PaymentCancel from "../pages/PaymentCancel";     

const AppRoutes = () => {
  const authenticated = useAuthStore((s) => s.authenticated);

  return (
    <Router>
      <Routes>
        <Route
          path="/login"
          element={authenticated ? <Navigate to="/" replace /> : <Login />}
        />
        <Route path="/authenticate" element={<Authenticate />} />
        <Route path="/payment" element={<Payment />} />
        <Route path="/payment-success" element={<PaymentSuccess />} />   {/* ✅ */}
        <Route path="/payment-cancel" element={<PaymentCancel />} />     {/* ✅ */}
        <Route
          path="/"
          element={authenticated ? <Home /> : <Navigate to="/login" replace />}
        />
      </Routes>
    </Router>
  );
};

export default AppRoutes;
