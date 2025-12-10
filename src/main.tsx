// src/main.tsx - FULLY UPDATED VERSION
import "./index.css";
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { Toaster } from "react-hot-toast";

import Home from "./pages/Home";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import AllToursPage from "./pages/AllToursPage";
import TourDetailPage from "./pages/TourDetailPage";
import FavoriteToursPage from "./pages/FavoriteToursPage";
import Authenticate from "./components/auth/Authenticate";

// NEW PAGES
import GuidesListPage from "./pages/GuidesListPage";
import GuideDetailPage from "./pages/GuideDetailPage";
import BlogPage from "./pages/BlogPage";
import BlogDetailPage from "./pages/BlogDetailPage";

// Admin Components
import AdminLayout from "./components/layout/AdminLayout";
import AdminDashboard from "./pages/AdminDashboard";
import AdminToursManagement from "./pages/AdminToursManagement";
import CreateTourPage from "./pages/CreateTourPage";
import EditTourPage from "./pages/EditTourPage";
import AdminStatisticsPage from "./pages/AdminStatisticsPage";
import AdminUsersPage from "./pages/AdminUserPage";
import AdminVideoManagement from "./pages/AdminVideoManagement";
import AdminContactManagement from "./pages/AdminContactManagement";

import "./index.css";
import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";
import { useAuthStore } from "./stores/useAuthStore";
import BookingRequestPage from "./pages/BookingRequestPage";
import BookingRequestDetailPage from "./pages/BookingRequestDetailPage";

// Other pages
import BookingPage from "./pages/BookingPage";
import BookingDetailPage from "./pages/BookingDetailPage";
import RequestBookingPage from "./pages/RequestBookingPage";
import BookingForm from "./components/ui/BookingForm";
import BookingStepper from "./components/ui/BookingStepper";
import AboutPage from "./pages/AboutPage";
import UserProfilePage from "./pages/UserProfilePage";
import VideoFeedPage from "./pages/VideoFeedPage";
import GetOtpPage from "./pages/GetOtpPage";
import ConfirmOtpPage from "./pages/ConfirmOtpPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import ChangePasswordPage from "./pages/ChangePasswordPage";
import PaymentLaterStepper from "./components/ui/PaymentLaterStepper";
import ChangeTourPage from "./pages/ChangeTourPage";
import AdminStatisticsRevenuePage from "./pages/AdminStatisticsRevenuePage";
import AdminPromotionsPage from "./pages/AdminPromotionPage";
import AddPromotionsPage from "./pages/AddPromotionPage";
import ContactPage from "./pages/ContactPage";
import MyReviewsPage from "./pages/MyReviewsPage";
// import ChatBox from "./pages/ChatBox";

const queryClient = new QueryClient();

// Protected Route Component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { authenticated } = useAuthStore();
  return authenticated ? <>{children}</> : <Navigate to="/login" replace />;
};

// Admin Route Component
const AdminRoute = ({ children }: { children: React.ReactNode }) => {
  const { authenticated, token } = useAuthStore();

  const isAdmin = token
    ? (() => {
        try {
          const payload = JSON.parse(atob(token.split(".")[1]));
          return payload.scope?.includes("ROLE_ADMIN") || false;
        } catch {
          return false;
        }
      })()
    : false;

  if (!authenticated) return <Navigate to="/login" replace />;
  if (!isAdmin) return <Navigate to="/" replace />;

  return <>{children}</>;
};

const FAQPage = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50">
    <div className="text-center">
      <h2 className="text-3xl font-bold text-gray-900 mb-4">
        Câu hỏi thường gặp
      </h2>
      <p className="text-gray-600 mb-6">Trang đang được phát triển...</p>
      <a href="/" className="text-indigo-600 hover:text-indigo-800 font-medium">
        ← Quay lại trang chủ
      </a>
    </div>
  </div>
);

const PrivacyPage = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50">
    <div className="text-center">
      <h2 className="text-3xl font-bold text-gray-900 mb-4">
        Chính sách bảo mật
      </h2>
      <p className="text-gray-600 mb-6">Trang đang được phát triển...</p>
      <a href="/" className="text-indigo-600 hover:text-indigo-800 font-medium">
        ← Quay lại trang chủ
      </a>
    </div>
  </div>
);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          {/* Public Routes with Header & Footer */}
          <Route
            path="/*"
            element={
              <div className="min-h-screen flex flex-col">
                <Header />
                <main className="flex-1 bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50">
                  <Routes>
                    {/* Public Routes */}
                    <Route path="/" element={<Home />} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/register" element={<RegisterPage />} />
                    <Route path="/get-otp-page" element={<GetOtpPage />} />
                    <Route path="/confirm-otp" element={<ConfirmOtpPage />} />
                    <Route
                      path="/reset-password"
                      element={<ResetPasswordPage />}
                    />
                    <Route path="/authenticate" element={<Authenticate />} />

                    <Route path="/tours" element={<AllToursPage />} />
                    <Route path="/tours/:tourId" element={<TourDetailPage />} />
                    <Route path="/change-tour" element={<ChangeTourPage />} />

                    <Route
                      path="/booking/:tourId"
                      element={<BookingStepper />}
                    />
                    <Route
                      path="/payment-later/:bookingId"
                      element={<PaymentLaterStepper />}
                    />

                    <Route path="/feed" element={<VideoFeedPage />} />
                    <Route path="/contact" element={<ContactPage />} />

                    {/* Protected User Routes */}
                    <Route
                      path="/favorite-tours"
                      element={
                        <ProtectedRoute>
                          <FavoriteToursPage />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/bookings"
                      element={
                        <ProtectedRoute>
                          <BookingPage />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/bookings/:bookingId"
                      element={
                        <ProtectedRoute>
                          <BookingDetailPage />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/request-booking"
                      element={
                        <ProtectedRoute>
                          <RequestBookingPage />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/review" // Đã đổi /review thành /my-reviews cho đúng ngữ nghĩa
                      element={
                        <ProtectedRoute>
                          <MyReviewsPage />
                        </ProtectedRoute>
                      }
                    />

                    {/* Protected User Routes */}
                    <Route
                      path="/favorite-tours"
                      element={
                        <ProtectedRoute>
                          <FavoriteToursPage />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/bookings"
                      element={
                        <ProtectedRoute>
                          <BookingPage />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/request-booking"
                      element={
                        <ProtectedRoute>
                          <RequestBookingPage />
                        </ProtectedRoute>
                      }
                    />

                    {/* Placeholder routes */}
                    <Route
                      path="/favorite-tours"
                      element={<FavoriteToursPage />}
                    />
                    <Route path="/about" element={<AboutPage />} />
                    <Route path="/blog" element={<BlogPage />} />
                    <Route path="/blog/:blogId" element={<BlogDetailPage />} />
                    <Route path="/guides" element={<GuidesListPage />} />
                    <Route
                      path="/guides/:guideId"
                      element={<GuideDetailPage />}
                    />
                    <Route path="/profile" element={<UserProfilePage />} />
                    <Route
                      path="/change-password"
                      element={<ChangePasswordPage />}
                    />
                  </Routes>
                </main>

                <Footer />
              </div>
            }
          />

          {/* Admin Routes - NO Header & Footer */}
          <Route
            path="/admin/*"
            element={
              <AdminRoute>
                <AdminLayout />
              </AdminRoute>
            }
          >
            <Route index element={<Navigate to="/admin/dashboard" replace />} />
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="tours" element={<AdminToursManagement />} />
            <Route path="promotions" element={<AdminPromotionsPage />} />
            <Route path="tours/create" element={<CreateTourPage />} />
            <Route path="promotions/create" element={<AddPromotionsPage />} />
            <Route path="tours/edit/:tourId" element={<EditTourPage />} />
            <Route path="videos" element={<AdminVideoManagement />} />
            <Route path="contacts" element={<AdminContactManagement />} />
            <Route path="users" element={<AdminUsersPage />} />

            <Route
              path="reviews"
              element={
                <div className="text-center py-12">
                  <h2 className="text-2xl font-bold">Quản Lý Đánh Giá</h2>
                  <p className="text-gray-600 mt-2">Đang phát triển...</p>
                </div>
              }
            />
            <Route path="reports/others" element={<AdminStatisticsPage />} />
            <Route
              path="reports/revenue"
              element={<AdminStatisticsRevenuePage />}
            />
            <Route path="bookings-request" element={<BookingRequestPage />} />
            <Route
              path="bookings-request/:requestId"
              element={<BookingRequestDetailPage />}
            />
          </Route>
        </Routes>
      </BrowserRouter>
      <Toaster position="top-center" />
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  </React.StrictMode>
);
