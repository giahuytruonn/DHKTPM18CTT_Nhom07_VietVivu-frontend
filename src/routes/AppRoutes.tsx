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

// 🧭 Booking Flow (Stepper UI)
import BookingStepper from "../components/ui/BookingStepper";
import BookingRequestPage from "../pages/BookingRequestPage";
import BookingRequestDetailPage from "../pages/BookingRequestDetailPage";

const AppRoutes = () => {
  const authenticated = useAuthStore((s) => s.authenticated);

  return (
    <Router>
      <Routes>
        {/* 🧑‍💻 Đăng nhập / xác thực */}
        <Route
          path="/login"
          element={authenticated ? <Navigate to="/" replace /> : <Login />}
        />
        <Route path="/authenticate" element={<Authenticate />} />

        {/* 🧭 Quy trình đặt tour (3 bước: booking → payment → invoice) */}
        <Route path="/book-tour" element={<BookingStepper />} />

        {/* 💳 Thanh toán */}
        <Route path="/payment" element={<Payment />} />
        <Route path="/payment-success" element={<PaymentSuccess />} />
        <Route path="/payment-cancel" element={<PaymentCancel />} />

        {/* 🏠 Trang chủ */}
        <Route
          path="/"
          element={authenticated ? <Home /> : <Navigate to="/login" replace />}
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

        {/* ❓ Fallback route */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
};

export default AppRoutes;
