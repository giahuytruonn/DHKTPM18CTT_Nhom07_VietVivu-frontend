// 🏠 Pages
// src/routes/AppRoutes.tsx
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import Home from "../pages/Home";
import Login from "../pages/LoginPage";
import Authenticate from "../components/auth/Authenticate";
import { useAuthStore } from "../stores/useAuthStore";
import BookingPage from "../pages/BookingPage";
import RequestBookingPage from "../pages/RequestBookingPage";

// 💳 Payment Flow
import Payment from "../pages/Payment";
import PaymentSuccess from "../pages/PaymentSuccess";
import PaymentCancel from "../pages/PaymentCancel";
import BookingStepper from "../components/ui/BookingStepper";
import AdminDashboard from "../pages/AdminDashboard";
import BookingRequestPage from "../pages/BookingRequestPage";
import BookingRequestDetailPage from "../pages/BookingRequestDetailPage";

const AppRoutes = () => {
  const { authenticated, isAdmin } = useAuthStore();

  return (
    <Router>
      <Routes>
        {/* Đăng nhập */}
        <Route
          path="/login"
          element={
            authenticated ? (
              isAdmin() ? (
                <Navigate to="/admin" replace />
              ) : (
                <Navigate to="/" replace />
              )
            ) : (
              <Login />
            )
          }
        />

        {/* Auth callback */}
        <Route path="/authenticate" element={<Authenticate />} />

        {/* Admin Dashboard */}
        <Route
          path="/admin"
          element={
            authenticated && isAdmin() ? (
              <AdminDashboard />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        {/* Quy trình đặt tour */}
        <Route path="/book-tour" element={<BookingStepper />} />

        {/* Thanh toán */}
        <Route path="/payment" element={<Payment />} />
        <Route path="/payment-success" element={<PaymentSuccess />} />
        <Route path="/payment-cancel" element={<PaymentCancel />} />

        {/* Trang chủ */}
        <Route
          path="/"
          element={
            authenticated ? (
              isAdmin() ? (
                <Navigate to="/admin" replace />
              ) : (
                <Home />
              )
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
        <Route
          path="/bookings"
          element={
            authenticated ? <BookingPage /> : <Navigate to="/login" replace />
          }
        />
        <Route
          path="/bookings-request"
          element={
            authenticated ? (
              <BookingRequestPage />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
        <Route
          path="/bookings-request/:requestId"
          element={
            authenticated ? (
              <BookingRequestDetailPage />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
        <Route
          path="/bookings-request-cancel"
          element={
            authenticated ? (
              <RequestBookingPage />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
};

export default AppRoutes;
