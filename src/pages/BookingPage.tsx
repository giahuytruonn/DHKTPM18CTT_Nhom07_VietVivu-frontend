import { useState, useEffect } from "react";
import React from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Chip,
  CircularProgress,
  Button,
  Stack,
  Card,
  CardContent,
  Pagination,
} from "@mui/material";
import {
  Calendar,
  MapPin,
  Users,
  DollarSign,
  Tag,
  Clock,
  ArrowLeft,
  XCircle,
  CheckCircle,
  AlertCircle,
  RefreshCw,
} from "lucide-react";
import { getBookings } from "../services/booking.services";
import type { BookingResponse } from "../services/booking.services";

import ConfirmationModal from "../components/ui/ConfirmationModal";

const BookingPage = () => {
  const navigate = useNavigate();
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const [selectedBookingId, setSelectedBookingId] = useState<string | null>(null);
  const [selectedBooking, setSelectedBooking] = useState<BookingResponse | null>(null);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
      maximumFractionDigits: 0,
    }).format(value);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusConfig = (status: string) => {
    switch (status) {
      case "PENDING":
        return {
          label: "Chờ xác nhận",
          color: "#F59E0B",
          bgGradient: "linear-gradient(135deg, #FEF3C7 0%, #FDE68A 100%)",
          icon: <AlertCircle size={16} />,
        };
      case "CONFIRMED":
        return {
          label: "Đã xác nhận",
          color: "#10B981",
          bgGradient: "linear-gradient(135deg, #D1FAE5 0%, #A7F3D0 100%)",
          icon: <CheckCircle size={16} />,
        };
      case "CANCELLED":
      case "CONFIRMED_CANCELLATION":
        return {
          label: "Đã hủy",
          color: "#EF4444",
          bgGradient: "linear-gradient(135deg, #FEE2E2 0%, #FECACA 100%)",
          icon: <XCircle size={16} />,
        };
      case "DENIED_CANCELLATION":
        return {
          label: "Từ chối hủy",
          color: "#F59E0B",
          bgGradient: "linear-gradient(135deg, #FEF3C7 0%, #FDE68A 100%)",
          icon: <AlertCircle size={16} />,
        };
      case "COMPLETED":
        return {
          label: "Hoàn thành",
          color: "#3B82F6",
          bgGradient: "linear-gradient(135deg, #DBEAFE 0%, #BFDBFE 100%)",
          icon: <CheckCircle size={16} />,
        };
      case "PENDING_CANCELLATION":
        return {
          label: "Chờ xử lý hủy",
          color: "#F59E0B",
          bgGradient: "linear-gradient(135deg, #FEF3C7 0%, #FDE68A 100%)",
          icon: <AlertCircle size={16} />,
        };
      case "PENDING_CHANGE":
        return {
          label: "Chờ xử lý đổi",
          color: "#F59E0B",
          bgGradient: "linear-gradient(135deg, #FEF3C7 0%, #FDE68A 100%)",
          icon: <AlertCircle size={16} />,
        };
      case "CONFIRMED_CHANGE":
        return {
          label: "Đã đổi tour",
          color: "#3B82F6",
          bgGradient: "linear-gradient(135deg, #DBEAFE 0%, #BFDBFE 100%)",
          icon: <CheckCircle size={16} />,
        };
      case "DENIED_CHANGE":
        return {
          label: "Từ chối đổi",
          color: "#F59E0B",
          bgGradient: "linear-gradient(135deg, #FEF3C7 0%, #FDE68A 100%)",
          icon: <AlertCircle size={16} />,
        };
      default:
        return {
          label: status,
          color: "#6B7280",
          bgGradient: "linear-gradient(135deg, #F3F4F6 0%, #E5E7EB 100%)",
          icon: <AlertCircle size={16} />,
        };
    }
  };

  const [page, setPage] = useState(1);
  const [bookings, setBookings] = useState<BookingResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const itemsPerPage = 6;

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getBookings();
      setBookings(data);
    } catch (err) {
      console.error("Error fetching bookings:", err);
      const errorMessage =
        err instanceof Error
          ? err.message
          : (err as { response?: { data?: { message?: string } } })?.response
            ?.data?.message || "Không thể tải danh sách booking";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handlePageChange = (
    _event: React.ChangeEvent<unknown>,
    value: number
  ) => {
    setPage(value);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const paginatedBookings = bookings.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );

  const canCancel = (status: string) => {
    return (
      status === "CONFIRMED" ||
      status === "DENIED_CANCELLATION" ||
      status === "DENIED_CHANGE"
    );
  };

  const canChange = (status: string) => {
    return (
      status === "CONFIRMED" ||
      status === "DENIED_CANCELLATION" ||
      status === "DENIED_CHANGE"
    );
  };

  const shouldShowButtons = (status: string) => {
    // Hiển thị buttons nếu có thể hủy hoặc đổi
    return canCancel(status) || canChange(status);
  };

  const shouldShowStatusOnly = (status: string) => {
    // Chỉ hiển thị trạng thái nếu đang chờ xử lý hoặc đã hoàn thành
    return (
      status === "PENDING_CANCELLATION" ||
      status === "CONFIRMED_CANCELLATION" ||
      status === "CANCELLED" ||
      status === "PENDING_CHANGE" ||
      status === "CONFIRMED_CHANGE" ||
      status === "COMPLETED"
    );
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #3B82F6 0%, #2563EB 100%)",
        py: { xs: 3, md: 5 },
        px: { xs: 2, md: 3 },
      }}
    >
      <ConfirmationModal
        open={confirmModalOpen}
        onClose={() => setConfirmModalOpen(false)}
        onConfirm={() => {
          setConfirmModalOpen(false);
          const bookingToPass = selectedBooking || bookings.find(b => b.bookingId === selectedBookingId);
          if (bookingToPass) {
            navigate("/change-tour", { state: { booking: bookingToPass } });
          } else {
            console.error("Không tìm thấy thông tin booking");
          }
        }}
        title="Xác nhận đổi tour"
        content="Bạn có chắc chắn muốn đổi sang tour khác không? Hành động này sẽ chuyển bạn đến trang danh sách tour để chọn tour mới."
        confirmLabel="Đồng ý"
        cancelLabel="Hủy"
        variant="info"
      />

      <Box
        sx={{
          maxWidth: "1400px",
          mx: "auto",
        }}
      >
        {/* Header Section */}
        <Box
          sx={{
            mb: 4,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: 2,
          }}
        >
          <Box>
            <Button
              startIcon={<ArrowLeft size={20} />}
              onClick={() => navigate("/")}
              sx={{
                mb: 2,
                borderRadius: "12px",
                textTransform: "none",
                background: "rgba(255, 255, 255, 0.2)",
                backdropFilter: "blur(10px)",
                color: "white",
                "&:hover": {
                  background: "rgba(255, 255, 255, 0.3)",
                },
              }}
            >
              Quay lại
            </Button>
            <Typography
              variant="h3"
              component="h1"
              sx={{
                fontWeight: 800,
                background: "linear-gradient(135deg, #ffffff 0%, #e0e7ff 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                mb: 1,
              }}
            >
              Booking của tôi
            </Typography>
            <Typography
              variant="body1"
              sx={{ color: "rgba(255, 255, 255, 0.9)", fontSize: "1.1rem" }}
            >
              Quản lý và theo dõi các tour đã đặt của bạn
            </Typography>
          </Box>
          <Box
            sx={{
              background: "rgba(255, 255, 255, 0.15)",
              backdropFilter: "blur(10px)",
              borderRadius: "20px",
              px: 3,
              py: 2,
              border: "1px solid rgba(255, 255, 255, 0.2)",
            }}
          >
            <Typography variant="h4" sx={{ color: "white", fontWeight: 700 }}>
              {bookings.length}
            </Typography>
            <Typography sx={{ color: "rgba(255, 255, 255, 0.8)" }}>
              Tổng số booking
            </Typography>
          </Box>
        </Box>

        {/* Content */}
        {loading ? (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              minHeight: "400px",
              background: "rgba(255, 255, 255, 0.95)",
              borderRadius: "24px",
              backdropFilter: "blur(10px)",
            }}
          >
            <CircularProgress size={60} sx={{ color: "#3B82F6" }} />
          </Box>
        ) : error ? (
          <Box
            sx={{
              p: 4,
              textAlign: "center",
              background: "rgba(255, 255, 255, 0.95)",
              borderRadius: "24px",
              backdropFilter: "blur(10px)",
            }}
          >
            <Typography color="error" variant="h6">
              {error}
            </Typography>
          </Box>
        ) : bookings.length === 0 ? (
          <Box
            sx={{
              p: 6,
              textAlign: "center",
              background: "rgba(255, 255, 255, 0.95)",
              borderRadius: "24px",
              backdropFilter: "blur(10px)",
            }}
          >
            <Typography variant="h5" color="text.secondary" sx={{ mb: 2 }}>
              Bạn chưa có booking nào
            </Typography>
            <Button
              variant="contained"
              onClick={() => navigate("/tours")}
              sx={{
                borderRadius: "12px",
                textTransform: "none",
                px: 4,
                py: 1.5,
                background: "linear-gradient(135deg, #3B82F6 0%, #2563EB 100%)",
                "&:hover": {
                  background:
                    "linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%)",
                },
              }}
            >
              Khám phá tour ngay
            </Button>
          </Box>
        ) : (
          <>
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: {
                  xs: "1fr",
                  md: "repeat(2, 1fr)",
                  lg: "repeat(3, 1fr)",
                },
                gap: 3,
              }}
            >
              {paginatedBookings.map((booking) => {
                const statusConfig = getStatusConfig(booking.bookingStatus);
                return (
                  <Card
                    key={booking.bookingId}
                    sx={{
                      height: "100%",
                      borderRadius: "24px",
                      background: "rgba(255, 255, 255, 0.95)",
                      backdropFilter: "blur(10px)",
                      border: "1px solid rgba(255, 255, 255, 0.3)",
                      boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
                      transition: "all 0.3s ease",
                      "&:hover": {
                        transform: "translateY(-8px)",
                        boxShadow: "0 16px 48px rgba(59, 130, 246, 0.3)",
                      },
                      display: "flex",
                      flexDirection: "column",
                    }}
                  >
                    {/* Status Badge */}
                    <Box
                      sx={{
                        background: statusConfig.bgGradient,
                        p: 2,
                        borderRadius: "24px 24px 0 0",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                      }}
                    >
                      <Chip
                        icon={statusConfig.icon}
                        label={statusConfig.label}
                        sx={{
                          background: "rgba(255, 255, 255, 0.9)",
                          color: statusConfig.color,
                          fontWeight: 600,
                          borderRadius: "12px",
                          height: "32px",
                        }}
                      />
                      <Typography
                        variant="caption"
                        sx={{
                          color: statusConfig.color,
                          fontWeight: 600,
                          fontSize: "0.75rem",
                        }}
                      >
                        {booking.bookingId.substring(0, 8)}...
                      </Typography>
                    </Box>

                    <CardContent sx={{ flexGrow: 1, p: 3 }}>
                      {/* Tour Title */}
                      <Typography
                        variant="h6"
                        sx={{
                          fontWeight: 700,
                          mb: 2,
                          background:
                            "linear-gradient(135deg, #3B82F6 0%, #2563EB 100%)",
                          WebkitBackgroundClip: "text",
                          WebkitTextFillColor: "transparent",
                          backgroundClip: "text",
                          minHeight: "56px",
                        }}
                      >
                        {booking.tourTitle}
                      </Typography>

                      {/* Info Grid */}
                      <Stack spacing={2}>
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 1,
                          }}
                        >
                          <MapPin size={18} style={{ color: "#3B82F6" }} />
                          <Typography variant="body2" color="text.secondary">
                            {booking.tourDestination}
                          </Typography>
                        </Box>

                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 1,
                          }}
                        >
                          <Calendar size={18} style={{ color: "#3B82F6" }} />
                          <Typography variant="body2" color="text.secondary">
                            {formatDate(booking.bookingDate)}
                          </Typography>
                        </Box>

                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 1,
                          }}
                        >
                          <Users size={18} style={{ color: "#3B82F6" }} />
                          <Typography variant="body2" color="text.secondary">
                            {booking.numOfAdults} người lớn
                            {booking.numOfChildren > 0 &&
                              `, ${booking.numOfChildren} trẻ em`}
                          </Typography>
                        </Box>

                        {booking.paymentTerm && (
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 1,
                            }}
                          >
                            <Clock size={18} style={{ color: "#3B82F6" }} />
                            <Typography variant="body2" color="text.secondary">
                              Hạn thanh toán: {formatDate(booking.paymentTerm)}
                            </Typography>
                          </Box>
                        )}
                      </Stack>

                      {/* Divider */}
                      <Box
                        sx={{
                          my: 2,
                          height: "1px",
                          background:
                            "linear-gradient(90deg, transparent, #e0e7ff, transparent)",
                        }}
                      />

                      {/* Price Section */}
                      <Stack spacing={1} sx={{ mb: 2 }}>
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                          }}
                        >
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 1,
                            }}
                          >
                            <DollarSign
                              size={18}
                              style={{ color: "#10B981" }}
                            />
                            <Typography variant="body2" color="text.secondary">
                              Tổng tiền:
                            </Typography>
                          </Box>
                          <Typography
                            variant="body1"
                            sx={{ fontWeight: 700, color: "#10B981" }}
                          >
                            {formatCurrency(booking.totalPrice)}
                          </Typography>
                        </Box>

                        {booking.discountAmount > 0 && (
                          <Box
                            sx={{
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "center",
                            }}
                          >
                            <Box
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                gap: 1,
                              }}
                            >
                              <Tag size={18} style={{ color: "#F59E0B" }} />
                              <Typography
                                variant="body2"
                                color="text.secondary"
                              >
                                Giảm giá:
                              </Typography>
                            </Box>
                            <Typography
                              variant="body2"
                              sx={{ fontWeight: 600, color: "#F59E0B" }}
                            >
                              -{formatCurrency(booking.discountAmount)}
                            </Typography>
                          </Box>
                        )}

                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            pt: 1,
                            borderTop: "2px solid #e0e7ff",
                          }}
                        >
                          <Typography variant="body1" sx={{ fontWeight: 700 }}>
                            Còn lại:
                          </Typography>
                          <Typography
                            variant="h6"
                            sx={{
                              fontWeight: 800,
                              background:
                                "linear-gradient(135deg, #3B82F6 0%, #2563EB 100%)",
                              WebkitBackgroundClip: "text",
                              WebkitTextFillColor: "transparent",
                              backgroundClip: "text",
                            }}
                          >
                            {formatCurrency(booking.remainingAmount)}
                          </Typography>
                        </Box>
                      </Stack>

                      {/* Action Buttons */}
                      {shouldShowButtons(booking.bookingStatus) ? (
                        <Stack spacing={1.5}>
                          {canCancel(booking.bookingStatus) && (
                            <Button
                              fullWidth
                              variant="contained"
                              onClick={() => {
                                navigate("/request-booking", {
                                  state: {
                                    bookingId: booking.bookingId,
                                    action: "cancel",
                                    booking: booking,
                                  },
                                });
                              }}
                              sx={{
                                borderRadius: "12px",
                                textTransform: "none",
                                py: 1.5,
                                background:
                                  "linear-gradient(135deg, #EF4444 0%, #DC2626 100%)",
                                "&:hover": {
                                  background:
                                    "linear-gradient(135deg, #DC2626 0%, #B91C1C 100%)",
                                  transform: "scale(1.02)",
                                },
                                fontWeight: 600,
                                boxShadow: "0 4px 16px rgba(239, 68, 68, 0.3)",
                              }}
                              startIcon={<XCircle size={18} />}
                            >
                              Hủy tour
                            </Button>
                          )}
                          {canChange(booking.bookingStatus) && (
                            <Button
                              fullWidth
                              variant="contained"
                              onClick={() => {
                                setConfirmModalOpen(true);
                                setSelectedBookingId(booking.bookingId);
                                setSelectedBooking(booking);
                              }}
                              sx={{
                                borderRadius: "12px",
                                textTransform: "none",
                                py: 1.5,
                                background:
                                  "linear-gradient(135deg, #3B82F6 0%, #2563EB 100%)",
                                "&:hover": {
                                  background:
                                    "linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%)",
                                  transform: "scale(1.02)",
                                },
                                fontWeight: 600,
                                boxShadow: "0 4px 16px rgba(59, 130, 246, 0.3)",
                              }}
                              startIcon={<RefreshCw size={18} />}
                            >
                              Đổi tour
                            </Button>
                          )}
                        </Stack>
                      ) : shouldShowStatusOnly(booking.bookingStatus) ? (
                        <Box
                          sx={{
                            textAlign: "center",
                            py: 1.5,
                            borderRadius: "12px",
                            background: statusConfig.bgGradient,
                          }}
                        >
                          <Typography
                            variant="body2"
                            sx={{
                              color: statusConfig.color,
                              fontWeight: 600,
                            }}
                          >
                            {statusConfig.label}
                          </Typography>
                        </Box>
                      ) : null}
                    </CardContent>
                  </Card>
                );
              })}
            </Box>

            {/* Pagination */}
            {bookings.length > itemsPerPage && (
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  mt: 4,
                  background: "rgba(255, 255, 255, 0.95)",
                  borderRadius: "20px",
                  p: 2,
                  backdropFilter: "blur(10px)",
                }}
              >
                <Pagination
                  count={Math.ceil(bookings.length / itemsPerPage)}
                  page={page}
                  onChange={handlePageChange}
                  color="primary"
                  sx={{
                    "& .MuiPaginationItem-root": {
                      borderRadius: "12px",
                      fontWeight: 600,
                    },
                    "& .Mui-selected": {
                      background:
                        "linear-gradient(135deg, #3B82F6 0%, #2563EB 100%) !important",
                      color: "white",
                    },
                  }}
                />
              </Box>
            )}
          </>
        )}
      </Box>
    </Box>
  );
};

export default BookingPage;
