import { useState, useEffect } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import {
  Box,
  Typography,
  Chip,
  CircularProgress,
  Button,
  Stack,
  Card,
  CardContent,
  Grid,
  Divider,
  Paper,
  Alert,
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
  Package,
  FileText,
  User,
} from "lucide-react";
import { getBookings } from "../services/booking.services";
import type { BookingResponse } from "../services/booking.services";
import ConfirmationModal from "../components/ui/ConfirmationModal";

const BookingDetailPage = () => {
  const navigate = useNavigate();
  const { bookingId } = useParams<{ bookingId: string }>();
  const location = useLocation();
  const [booking, setBooking] = useState<BookingResponse | null>(
    location.state?.booking || null
  );
  const [loading, setLoading] = useState(!location.state?.booking);
  const [error, setError] = useState<string | null>(null);
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);

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
          bgColor: "#FEF3C7",
          textColor: "#92400E",
          icon: <AlertCircle size={20} />,
        };
      case "CONFIRMED":
        return {
          label: "Đã xác nhận",
          color: "#10B981",
          bgColor: "#D1FAE5",
          textColor: "#065F46",
          icon: <CheckCircle size={20} />,
        };
      case "CANCELLED":
      case "CONFIRMED_CANCELLATION":
        return {
          label: "Đã hủy",
          color: "#EF4444",
          bgColor: "#FEE2E2",
          textColor: "#991B1B",
          icon: <XCircle size={20} />,
        };
      case "DENIED_CANCELLATION":
        return {
          label: "Từ chối hủy",
          color: "#F59E0B",
          bgColor: "#FEF3C7",
          textColor: "#92400E",
          icon: <AlertCircle size={20} />,
        };
      case "COMPLETED":
        return {
          label: "Hoàn thành",
          color: "#3B82F6",
          bgColor: "#DBEAFE",
          textColor: "#1E40AF",
          icon: <CheckCircle size={20} />,
        };
      case "PENDING_CANCELLATION":
        return {
          label: "Chờ xử lý hủy",
          color: "#F59E0B",
          bgColor: "#FEF3C7",
          textColor: "#92400E",
          icon: <AlertCircle size={20} />,
        };
      case "PENDING_CHANGE":
        return {
          label: "Chờ xử lý đổi",
          color: "#F59E0B",
          bgColor: "#FEF3C7",
          textColor: "#92400E",
          icon: <AlertCircle size={20} />,
        };
      case "CONFIRMED_CHANGE":
        return {
          label: "Đã đổi tour",
          color: "#3B82F6",
          bgColor: "#DBEAFE",
          textColor: "#1E40AF",
          icon: <CheckCircle size={20} />,
        };
      case "DENIED_CHANGE":
        return {
          label: "Từ chối đổi",
          color: "#F59E0B",
          bgColor: "#FEF3C7",
          textColor: "#92400E",
          icon: <AlertCircle size={20} />,
        };
      default:
        return {
          label: status,
          color: "#6B7280",
          bgColor: "#F3F4F6",
          textColor: "#374151",
          icon: <AlertCircle size={20} />,
        };
    }
  };

  useEffect(() => {
    const fetchBooking = async () => {
      if (!bookingId) {
        setError("Không tìm thấy mã booking");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const bookings = await getBookings();
        const foundBooking = bookings.find((b) => b.bookingId === bookingId);
        if (foundBooking) {
          setBooking(foundBooking);
        } else {
          setError("Không tìm thấy booking");
        }
      } catch (err) {
        console.error("Error fetching booking:", err);
        const errorMessage =
          err instanceof Error
            ? err.message
            : (err as { response?: { data?: { message?: string } } })?.response
              ?.data?.message || "Không thể tải thông tin booking";
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    if (!booking) {
      fetchBooking();
    }
  }, [bookingId, booking]);

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

  if (loading) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          background: "linear-gradient(135deg, #3B82F6 0%, #2563EB 100%)",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <CircularProgress size={60} sx={{ color: "white" }} />
      </Box>
    );
  }

  if (error || !booking) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          background: "linear-gradient(135deg, #3B82F6 0%, #2563EB 100%)",
          py: { xs: 3, md: 5 },
          px: { xs: 2, md: 3 },
        }}
      >
        <Box
          sx={{
            maxWidth: "1200px",
            mx: "auto",
            textAlign: "center",
            background: "rgba(255, 255, 255, 0.95)",
            borderRadius: "24px",
            p: 4,
          }}
        >
          <AlertCircle size={48} style={{ margin: "0 auto 16px", color: "#EF4444" }} />
          <Alert severity="error" sx={{ mb: 2 }}>
            {error || "Không tìm thấy booking"}
          </Alert>
          <Button
            variant="contained"
            onClick={() => navigate("/bookings")}
            startIcon={<ArrowLeft size={20} />}
            sx={{
              borderRadius: "12px",
              textTransform: "none",
            }}
          >
            Quay lại danh sách
          </Button>
        </Box>
      </Box>
    );
  }

  const statusConfig = getStatusConfig(booking.bookingStatus);

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
          navigate("/change-tour", { state: { booking } });
        }}
        title="Xác nhận đổi tour"
        content="Bạn có chắc chắn muốn đổi sang tour khác không? Hành động này sẽ chuyển bạn đến trang danh sách tour để chọn tour mới."
        confirmLabel="Đồng ý"
        cancelLabel="Hủy"
        variant="info"
      />

      <Box
        sx={{
          maxWidth: "1200px",
          mx: "auto",
        }}
      >
        {/* Header */}
        <Box sx={{ mb: 3 }}>
          <Button
            startIcon={<ArrowLeft size={20} />}
            onClick={() => navigate("/bookings")}
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
              color: "white",
              mb: 1,
            }}
          >
            Chi tiết Booking
          </Typography>
        </Box>

        {/* Status Banner */}
        <Card
          sx={{
            mb: 3,
            background: `linear-gradient(135deg, ${statusConfig.bgColor} 0%, ${statusConfig.bgColor}cc 50%, ${statusConfig.bgColor} 100%)`,
            border: `2px solid ${statusConfig.color}40`,
            borderRadius: 3,
            boxShadow: `0 4px 20px ${statusConfig.color}20`,
          }}
        >
          <CardContent>
            <Stack direction="row" spacing={2} alignItems="center">
              {statusConfig.icon}
              <Box sx={{ flex: 1 }}>
                <Typography variant="h6" sx={{ fontWeight: 700, color: statusConfig.textColor }}>
                  {statusConfig.label}
                </Typography>
                <Typography variant="body2" sx={{ color: statusConfig.textColor, opacity: 0.8 }}>
                  Booking ID: {booking.bookingId}
                </Typography>
              </Box>
            </Stack>
          </CardContent>
        </Card>

        <Grid container spacing={3}>
          {/* Booking Info */}
          <Grid item xs={12} md={6}>
            <Card
              sx={{
                height: "100%",
                boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
                borderRadius: 2,
              }}
            >
              <CardContent>
                <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2 }}>
                  <FileText size={20} style={{ color: "#667eea" }} />
                  <Typography variant="h6" sx={{ fontWeight: 700 }}>
                    Thông tin Booking
                  </Typography>
                </Stack>
                <Divider sx={{ mb: 3 }} />
                <Stack spacing={2.5}>
                  <Box>
                    <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
                      Mã Booking
                    </Typography>
                    <Typography
                      variant="body1"
                      sx={{
                        fontFamily: "monospace",
                        fontWeight: 600,
                        color: "#764ba2",
                        mt: 0.5,
                      }}
                    >
                      {booking.bookingId}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
                      Tên tour
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: 600, mt: 0.5 }}>
                      {booking.tourTitle}
                    </Typography>
                  </Box>
                  <Box>
                    <Stack direction="row" spacing={1} alignItems="center">
                      <MapPin size={16} style={{ color: "#667eea" }} />
                      <Box>
                        <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
                          Địa điểm
                        </Typography>
                        <Typography variant="body2" sx={{ fontWeight: 500 }}>
                          {booking.tourDestination}
                        </Typography>
                      </Box>
                    </Stack>
                  </Box>
                  <Box>
                    <Stack direction="row" spacing={1} alignItems="center">
                      <Calendar size={16} style={{ color: "#667eea" }} />
                      <Box>
                        <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
                          Ngày đặt
                        </Typography>
                        <Typography variant="body2" sx={{ fontWeight: 500 }}>
                          {formatDate(booking.bookingDate)}
                        </Typography>
                      </Box>
                    </Stack>
                  </Box>
                  {booking.paymentTerm && (
                    <Box>
                      <Stack direction="row" spacing={1} alignItems="center">
                        <Clock size={16} style={{ color: "#667eea" }} />
                        <Box>
                          <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
                            Hạn thanh toán
                          </Typography>
                          <Typography variant="body2" sx={{ fontWeight: 500 }}>
                            {formatDate(booking.paymentTerm)}
                          </Typography>
                        </Box>
                      </Stack>
                    </Box>
                  )}
                </Stack>
              </CardContent>
            </Card>
          </Grid>

          {/* Tour & Payment Info */}
          <Grid item xs={12} md={6}>
            <Card
              sx={{
                height: "100%",
                boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
                borderRadius: 2,
              }}
            >
              <CardContent>
                <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2 }}>
                  <Package size={20} style={{ color: "#667eea" }} />
                  <Typography variant="h6" sx={{ fontWeight: 700 }}>
                    Thông tin Tour & Thanh toán
                  </Typography>
                </Stack>
                <Divider sx={{ mb: 3 }} />
                <Stack spacing={2.5}>
                  <Box>
                    <Stack direction="row" spacing={1} alignItems="center">
                      <Users size={16} style={{ color: "#667eea" }} />
                      <Box>
                        <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
                          Số người
                        </Typography>
                        <Typography variant="body2" sx={{ fontWeight: 500 }}>
                          {booking.numOfAdults} người lớn
                          {booking.numOfChildren > 0 && `, ${booking.numOfChildren} trẻ em`}
                        </Typography>
                      </Box>
                    </Stack>
                  </Box>
                  <Box>
                    <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
                      Tổng tiền
                    </Typography>
                    <Typography variant="h6" sx={{ fontWeight: 700, color: "#10B981", mt: 0.5 }}>
                      {formatCurrency(booking.totalPrice)}
                    </Typography>
                  </Box>
                  {booking.discountAmount > 0 && (
                    <Box>
                      <Stack direction="row" spacing={1} alignItems="center">
                        <Tag size={16} style={{ color: "#F59E0B" }} />
                        <Box sx={{ flex: 1 }}>
                          <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
                            Giảm giá
                          </Typography>
                          <Typography variant="body2" sx={{ fontWeight: 600, color: "#F59E0B" }}>
                            -{formatCurrency(booking.discountAmount)}
                          </Typography>
                        </Box>
                      </Stack>
                    </Box>
                  )}
                  <Divider />
                  <Box>
                    <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
                      Còn lại
                    </Typography>
                    <Typography variant="h5" sx={{ fontWeight: 800, color: "#3B82F6", mt: 0.5 }}>
                      {formatCurrency(booking.remainingAmount)}
                    </Typography>
                  </Box>
                  {booking.promotionCode && (
                    <Box>
                      <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
                        Mã khuyến mãi
                      </Typography>
                      <Chip
                        label={booking.promotionCode}
                        sx={{
                          mt: 0.5,
                          backgroundColor: "#FEF3C7",
                          color: "#92400E",
                          fontWeight: 600,
                        }}
                      />
                    </Box>
                  )}
                </Stack>
              </CardContent>
            </Card>
          </Grid>

          {/* Additional Info */}
          {(booking.note || booking.name || booking.email || booking.phone) && (
            <Grid item xs={12}>
              <Card
                sx={{
                  boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
                  borderRadius: 2,
                }}
              >
                <CardContent>
                  <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2 }}>
                    <User size={20} style={{ color: "#667eea" }} />
                    <Typography variant="h6" sx={{ fontWeight: 700 }}>
                      Thông tin bổ sung
                    </Typography>
                  </Stack>
                  <Divider sx={{ mb: 3 }} />
                  <Stack spacing={2}>
                    {booking.name && (
                      <Box>
                        <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
                          Tên người đặt
                        </Typography>
                        <Typography variant="body2" sx={{ fontWeight: 500, mt: 0.5 }}>
                          {booking.name}
                        </Typography>
                      </Box>
                    )}
                    {booking.email && (
                      <Box>
                        <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
                          Email
                        </Typography>
                        <Typography variant="body2" sx={{ fontWeight: 500, mt: 0.5 }}>
                          {booking.email}
                        </Typography>
                      </Box>
                    )}
                    {booking.phone && (
                      <Box>
                        <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
                          Số điện thoại
                        </Typography>
                        <Typography variant="body2" sx={{ fontWeight: 500, mt: 0.5 }}>
                          {booking.phone}
                        </Typography>
                      </Box>
                    )}
                    {booking.note && (
                      <Box>
                        <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
                          Ghi chú
                        </Typography>
                        <Paper
                          sx={{
                            p: 2,
                            mt: 0.5,
                            backgroundColor: "#F9FAFB",
                            borderRadius: 1,
                          }}
                        >
                          <Typography variant="body2">{booking.note}</Typography>
                        </Paper>
                      </Box>
                    )}
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
          )}

          {/* Actions */}
          {(canCancel(booking.bookingStatus) || canChange(booking.bookingStatus)) && (
            <Grid item xs={12}>
              <Card
                sx={{
                  boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
                  borderRadius: 3,
                  backgroundColor: "#ffffff",
                  border: "1px solid #e5e7eb",
                }}
              >
                <CardContent>
                  <Typography variant="h6" sx={{ fontWeight: 700, mb: 3 }}>
                    Thao tác
                  </Typography>
                  <Divider sx={{ mb: 3 }} />
                  <Stack direction="row" spacing={2} flexWrap="wrap">
                    {canCancel(booking.bookingStatus) && (
                      <Button
                        variant="contained"
                        color="error"
                        size="large"
                        startIcon={<XCircle size={20} />}
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
                          px: 4,
                          py: 1.5,
                          background: "linear-gradient(135deg, #EF4444 0%, #DC2626 100%)",
                          "&:hover": {
                            background: "linear-gradient(135deg, #DC2626 0%, #B91C1C 100%)",
                            transform: "translateY(-2px)",
                            boxShadow: "0 4px 12px rgba(239, 68, 68, 0.4)",
                          },
                          transition: "all 0.2s ease",
                          fontWeight: 600,
                        }}
                      >
                        Hủy tour
                      </Button>
                    )}
                    {canChange(booking.bookingStatus) && (
                      <Button
                        variant="contained"
                        color="primary"
                        size="large"
                        startIcon={<RefreshCw size={20} />}
                        onClick={() => {
                          setConfirmModalOpen(true);
                        }}
                        sx={{
                          borderRadius: "12px",
                          textTransform: "none",
                          px: 4,
                          py: 1.5,
                          background: "linear-gradient(135deg, #3B82F6 0%, #2563EB 100%)",
                          "&:hover": {
                            background: "linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%)",
                            transform: "translateY(-2px)",
                            boxShadow: "0 4px 12px rgba(59, 130, 246, 0.4)",
                          },
                          transition: "all 0.2s ease",
                          fontWeight: 600,
                        }}
                      >
                        Đổi tour
                      </Button>
                    )}
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
          )}
        </Grid>
      </Box>
    </Box>
  );
};

export default BookingDetailPage;

