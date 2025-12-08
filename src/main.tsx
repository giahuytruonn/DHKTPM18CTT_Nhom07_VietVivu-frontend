// src/main.tsx - FULLY UPDATED VERSION
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
import BookingRequestPage from "./pages/BookingRequestPage";
import BookingRequestDetailPage from "./pages/BookingRequestDetailPage";

// Other pages
import BookingPage from "./pages/BookingPage";
import BookingStepper from "./components/ui/BookingStepper";
import AboutPage from "./pages/AboutPage";
import UserProfilePage from "./pages/UserProfilePage";
import ExplorePage from "./pages/ExplorePage";
import VideoFeedPage from "./pages/VideoFeedPage";

import "./index.css";
import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";
import { useAuthStore } from "./stores/useAuthStore";

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

// Placeholder pages for missing routes
const ContactPage = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50">
    <div className="text-center">
      <h2 className="text-3xl font-bold text-gray-900 mb-4">Liên hệ với chúng tôi</h2>
      <p className="text-gray-600 mb-6">Trang đang được phát triển...</p>
      <a href="/" className="text-indigo-600 hover:text-indigo-800 font-medium">← Quay lại trang chủ</a>
    </div>
  </div>
);

const FAQPage = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50">
    <div className="text-center">
      <h2 className="text-3xl font-bold text-gray-900 mb-4">Câu hỏi thường gặp</h2>
      <p className="text-gray-600 mb-6">Trang đang được phát triển...</p>
      <a href="/" className="text-indigo-600 hover:text-indigo-800 font-medium">← Quay lại trang chủ</a>
    </div>
  </div>
);

const PrivacyPage = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50">
    <div className="text-center">
      <h2 className="text-3xl font-bold text-gray-900 mb-4">Chính sách bảo mật</h2>
      <p className="text-gray-600 mb-6">Trang đang được phát triển...</p>
      <a href="/" className="text-indigo-600 hover:text-indigo-800 font-medium">← Quay lại trang chủ</a>
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
              <>
                <Header />
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/register" element={<RegisterPage />} />
                  <Route path="/authenticate" element={<Authenticate />} />

                  {/* Tours */}
                  <Route path="/tours" element={<AllToursPage />} />
                  <Route path="/tours/:tourId" element={<TourDetailPage />} />

                  {/* Guides - NEW ROUTES */}
                  <Route path="/guides" element={<GuidesListPage />} />
                  <Route path="/guides/:guideId" element={<GuideDetailPage />} />

                  {/* Blog - NEW ROUTES */}
                  <Route path="/blog" element={<BlogPage />} />
                  <Route path="/blog/:blogId" element={<BlogDetailPage />} />

                  {/* Other public pages */}
                  <Route path="/about" element={<AboutPage />} />
                  <Route path="/contact" element={<ContactPage />} />
                  <Route path="/faq" element={<FAQPage />} />
                  <Route path="/privacy" element={<PrivacyPage />} />

                  {/* Video & Explore */}
                  <Route path="/feed" element={<VideoFeedPage />} />
                  <Route path="/upload" element={<ExplorePage />} />

                  {/* Booking */}
                  <Route path="/booking/:tourId" element={<BookingStepper />} />

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
                    path="/profile"
                    element={
                      <ProtectedRoute>
                        <UserProfilePage />
                      </ProtectedRoute>
                    }
                  />
                </Routes>
                <Footer />
              </>
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
            <Route path="tours/create" element={<CreateTourPage />} />
            <Route path="tours/edit/:tourId" element={<EditTourPage />} />
            <Route path="users" element={<AdminUsersPage />} />
            <Route path="reviews" element={
              <div className="text-center py-12">
                <h2 className="text-2xl font-bold">Quản lý Đánh giá</h2>
                <p className="text-gray-600 mt-2">Đang phát triển...</p>
              </div>
            } />
            <Route path="reports" element={<AdminStatisticsPage />} />
            <Route path="bookings-request" element={<BookingRequestPage />} />
            <Route path="bookings-request/:requestId" element={<BookingRequestDetailPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
      <Toaster position="top-center" />
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  </React.StrictMode>
);