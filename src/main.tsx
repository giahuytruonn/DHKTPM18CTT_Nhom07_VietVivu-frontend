// src/main.tsx - UPDATED VERSION
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

// Admin Components
import AdminLayout from "./components/layout/AdminLayout";
import AdminDashboard from "./pages/AdminDashboard";
import AdminToursManagement from "./pages/AdminToursManagement";
import AdminToursPage from "./pages/AdminTourPage";
import CreateTourPage from "./pages/CreateTourPage";
import EditTourPage from "./pages/EditTourPage";

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
  
  const isAdmin = token ? (() => {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.scope?.includes('ROLE_ADMIN') || false;
    } catch {
      return false;
    }
  })() : false;

  if (!authenticated) return <Navigate to="/login" replace />;
  if (!isAdmin) return <Navigate to="/" replace />;
  
  return <>{children}</>;
};

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
                  <Route path="/tours" element={<AllToursPage />} />
                  <Route path="/tours/:tourId" element={<TourDetailPage />} />
                  
                  {/* Protected User Routes */}
                  <Route
                    path="/favorite-tours"
                    element={
                      <ProtectedRoute>
                        <FavoriteToursPage />
                      </ProtectedRoute>
                    }
                  />
                  
                  {/* Placeholder routes */}
                  <Route
                    path="/about"
                    element={
                      <div className="min-h-screen flex items-center justify-center">
                        <div className="text-center">
                          <h2 className="text-2xl font-bold mb-4">Về chúng tôi</h2>
                          <p className="text-gray-600">Đang phát triển...</p>
                        </div>
                      </div>
                    }
                  />
                  <Route
                    path="/blog"
                    element={
                      <div className="min-h-screen flex items-center justify-center">
                        <div className="text-center">
                          <h2 className="text-2xl font-bold mb-4">Blog</h2>
                          <p className="text-gray-600">Đang phát triển...</p>
                        </div>
                      </div>
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
            <Route
              path="users"
              element={
                <div className="text-center py-12">
                  <h2 className="text-2xl font-bold">Quản Lý Người Dùng</h2>
                  <p className="text-gray-600 mt-2">Đang phát triển...</p>
                </div>
              }
            />
            <Route
              path="reviews"
              element={
                <div className="text-center py-12">
                  <h2 className="text-2xl font-bold">Quản Lý Đánh Giá</h2>
                  <p className="text-gray-600 mt-2">Đang phát triển...</p>
                </div>
              }
            />
            <Route
              path="reports"
              element={
                <div className="text-center py-12">
                  <h2 className="text-2xl font-bold">Báo Cáo</h2>
                  <p className="text-gray-600 mt-2">Đang phát triển...</p>
                </div>
              }
            />
          </Route>
        </Routes>
      </BrowserRouter>
      <Toaster position="top-center" />
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  </React.StrictMode>
);