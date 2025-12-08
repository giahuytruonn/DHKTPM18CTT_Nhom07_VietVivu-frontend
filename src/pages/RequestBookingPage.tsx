import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  TextField,
  Button,
  Alert,
  CircularProgress,
  Stack,
  Card,
  CardContent,
  Chip,
} from "@mui/material";
import {
  ArrowLeft,
  Send,
  XCircle,
  MapPin,
  Calendar,
  Tag,
  CheckCircle2,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import type { BookingResponse } from "../services/booking.services";
import { cancelBooking } from "../services/bookingRequest.services";
import { getTourById } from "../services/tour.service";
import type { TourResponse } from "../types/tour";
import CancellationPolicyNotice from "../components/ui/CancellationPolicyNotice";
import { formatDateYMD } from "../utils/date";

const getStatusConfig = (status: string) => {
  switch (status) {
    case "PENDING":
      return {
        label: "Chưa thanh toán",
        color: "#F59E0B",
        bgGradient: "linear-gradient(135deg, #FEF3C7 0%, #FDE68A 100%)",
        icon: <AlertCircle size={16} />,
      };
    case "CONFIRMED":
      return {
        label: "Đã thanh toán",
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

const formatDateTime = (dateString?: string | null) =>
  formatDateYMD(dateString, { includeTime: true });

const RequestBookingPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as {
    bookingId?: string;
    action?: "change" | "cancel";
    booking?: BookingResponse;
  } | null;

  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [tourDetail, setTourDetail] = useState<TourResponse | null>(null);
  const [policyLoading, setPolicyLoading] = useState(false);
  const statusConfig = state?.booking
    ? getStatusConfig(state.booking.bookingStatus)
    : null;

  useEffect(() => {
    const fetchTourDetail = async () => {
      if (!state?.booking?.tourId) {
        return;
      }
      try {
        setPolicyLoading(true);
        const detail = await getTourById(state.booking.tourId);
        setTourDetail(detail);
      } catch (fetchError) {
        console.error("Không thể tải thông tin tour để tính chính sách hoàn phí", fetchError);
      } finally {
        setPolicyLoading(false);
      }
    };

    fetchTourDetail();
  }, [state?.booking?.tourId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!state?.bookingId) {
      setError("Không tìm thấy thông tin booking");
      return;
    }

    if (!reason.trim()) {
      setError("Vui lòng nhập lý do");
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const result = await cancelBooking(state.bookingId, reason.trim());
      setSuccess(true);
      console.log("Booking request created:", result);

      // Tự động chuyển về trang bookings sau 2 giây
      setTimeout(() => {
        navigate("/bookings");
      }, 2000);
    } catch (err) {
      console.error("Error creating booking request:", err);
      const errorMessage =
        err instanceof Error
          ? err.message
          : (err as { response?: { data?: { message?: string } } })?.response
              ?.data?.message || "Không thể tạo booking request";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  if (!state?.bookingId) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          background:
            "linear-gradient(180deg, #f5f7ff 0%, #fef2ff 45%, #fef9f5 100%)",
          py: 5,
          px: { xs: 2, md: 3 },
        }}
      >
        <Box sx={{ maxWidth: "800px", mx: "auto" }}>
          <Card
            sx={{
              borderRadius: "24px",
              background: "linear-gradient(145deg, #ffffff 0%, #f8fbff 100%)",
              backdropFilter: "blur(12px)",
              border: "1px solid rgba(226, 232, 240, 0.8)",
              boxShadow: "0 25px 60px rgba(15, 23, 42, 0.12)",
            }}
          >
            <CardContent sx={{ p: 4 }}>
              <Alert
                severity="error"
                icon={<XCircle size={24} />}
                sx={{
                  borderRadius: "16px",
                  mb: 3,
                  background:
                    "linear-gradient(135deg, #FEE2E2 0%, #FECACA 100%)",
                  border: "1px solid #FCA5A5",
                }}
              >
                Không tìm thấy thông tin booking
              </Alert>
              <Button
                variant="contained"
                onClick={() => navigate("/bookings")}
                startIcon={<ArrowLeft size={20} />}
                sx={{
                  borderRadius: "12px",
                  textTransform: "none",
                  px: 4,
                  py: 1.5,
                  background:
                    "linear-gradient(135deg, #3B82F6 0%, #2563EB 100%)",
                  "&:hover": {
                    background:
                      "linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%)",
                  },
                }}
              >
                Quay lại danh sách booking
              </Button>
            </CardContent>
          </Card>
        </Box>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background:
          "linear-gradient(180deg, #f5f7ff 0%, #fef2ff 45%, #fef9f5 100%)",
        py: { xs: 3, md: 5 },
        px: { xs: 2, md: 3 },
      }}
    >
      <Box sx={{ maxWidth: "900px", mx: "auto" }}>
        {/* Hero Section */}
        <Box
          sx={{
            mb: 5,
            borderRadius: "32px",
            background:
              "linear-gradient(120deg, #1d4ed8 0%, #2563eb 45%, #7c3aed 100%)",
            px: { xs: 3, md: 5 },
            py: { xs: 4, md: 5 },
            color: "white",
            boxShadow: "0 35px 65px rgba(30, 64, 175, 0.35)",
            position: "relative",
            overflow: "hidden",
          }}
        >
          <Box
            sx={{
              position: "absolute",
              inset: 0,
              background:
                "radial-gradient(circle at top left, rgba(255,255,255,0.35), transparent 50%)",
              opacity: 0.8,
            }}
          />
          <Box
            sx={{
              position: "absolute",
              inset: 0,
              background:
                "radial-gradient(circle at bottom right, rgba(255,255,255,0.2), transparent 55%)",
              opacity: 0.6,
            }}
          />
          <Stack
            direction={{ xs: "column", md: "row" }}
            alignItems={{ xs: "flex-start", md: "center" }}
            justifyContent="space-between"
            spacing={4}
            sx={{ position: "relative", zIndex: 1 }}
          >
            <Box>
              <Button
                startIcon={<ArrowLeft size={20} />}
                onClick={() => navigate("/bookings")}
                sx={{
                  mb: 3,
                  borderRadius: "14px",
                  textTransform: "none",
                  background: "rgba(15, 23, 42, 0.25)",
                  color: "white",
                  px: 3,
                  "&:hover": {
                    background: "rgba(15, 23, 42, 0.4)",
                  },
                }}
              >
                Quay lại
              </Button>
              {statusConfig && (
                <Chip
                  icon={statusConfig.icon}
                  label={statusConfig.label}
                  sx={{
                    background: statusConfig.bgGradient,
                    color: statusConfig.color,
                    fontWeight: 600,
                    mb: 2,
                    borderRadius: "12px",
                    "& .MuiChip-icon": { color: statusConfig.color },
                  }}
                />
              )}
              <Typography
                variant="h3"
                component="h1"
                sx={{
                  fontWeight: 800,
                  mb: 1,
                  fontSize: { xs: "2rem", md: "2.75rem" },
                }}
              >
                Yêu cầu hủy tour
              </Typography>
              <Typography
                variant="body1"
                sx={{ color: "rgba(255, 255, 255, 0.9)", fontSize: "1.05rem" }}
              >
                Vui lòng chia sẻ lý do để chúng tôi hỗ trợ bạn tốt nhất
              </Typography>
            </Box>
            {state.booking && (
              <Box
                sx={{
                  px: { xs: 3, md: 4 },
                  py: { xs: 3, md: 4 },
                  borderRadius: "24px",
                  background: "rgba(15, 23, 42, 0.35)",
                  border: "1px solid rgba(255, 255, 255, 0.25)",
                  color: "white",
                  minWidth: { md: 300 },
                  backdropFilter: "blur(6px)",
                }}
              >
                <Typography
                  variant="overline"
                  sx={{
                    letterSpacing: "0.2em",
                    color: "rgba(255, 255, 255, 0.75)",
                  }}
                >
                  Mã booking
                </Typography>
                <Typography
                  variant="h4"
                  sx={{
                    fontWeight: 800,
                    mt: 1,
                    fontSize: { xs: "1.9rem", md: "2.2rem" },
                  }}
                >
                  {state.booking.bookingId.substring(0, 8)}...
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ color: "rgba(255, 255, 255, 0.9)", mt: 1 }}
                >
                  {state.booking.tourTitle}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ color: "rgba(255, 255, 255, 0.7)", mt: 0.5 }}
                >
                  Đặt lúc: {formatDateTime(state.booking.bookingDate)}
                </Typography>
              </Box>
            )}
          </Stack>
        </Box>

        {state.booking && (
          <Box sx={{ mb: 4 }}>
            <CancellationPolicyNotice
              totalPrice={state.booking.totalPrice}
              startDate={tourDetail?.startDate ?? null}
              loading={policyLoading}
              variant="cancel"
            />
          </Box>
        )}

        {/* Booking Info Card */}
        {state.booking && (
          <Card
            sx={{
              mb: 3,
              borderRadius: "24px",
              background: "linear-gradient(145deg, #ffffff 0%, #f8fbff 100%)",
              backdropFilter: "blur(12px)",
              border: "1px solid rgba(226, 232, 240, 0.8)",
              boxShadow: "0 25px 60px rgba(15, 23, 42, 0.08)",
              overflow: "hidden",
            }}
          >
            <Box
              sx={{
                background: "linear-gradient(135deg, #3B82F6 0%, #2563EB 100%)",
                p: 3,
                color: "white",
              }}
            >
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 700,
                  mb: 2,
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                }}
              >
                <Tag size={20} />
                Thông tin booking
              </Typography>
            </Box>
            <CardContent sx={{ p: 3 }}>
              <Stack spacing={2}>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 2,
                    flexWrap: "wrap",
                    p: 2,
                    borderRadius: "12px",
                    background:
                      "linear-gradient(135deg, #F0F9FF 0%, #E0F2FE 100%)",
                  }}
                >
                  <Box
                    sx={{
                      width: 40,
                      height: 40,
                      borderRadius: "10px",
                      background:
                        "linear-gradient(135deg, #3B82F6 0%, #2563EB 100%)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "white",
                    }}
                  >
                    <Tag size={20} />
                  </Box>
                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      Mã booking
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: 700 }}>
                      {state.booking.bookingId}
                    </Typography>
                  </Box>
                </Box>

                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 2,
                    p: 2,
                    borderRadius: "12px",
                    background:
                      "linear-gradient(135deg, #F0F9FF 0%, #E0F2FE 100%)",
                  }}
                >
                  <Box
                    sx={{
                      width: 40,
                      height: 40,
                      borderRadius: "10px",
                      background:
                        "linear-gradient(135deg, #3B82F6 0%, #2563EB 100%)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "white",
                    }}
                  >
                    <MapPin size={20} />
                  </Box>
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="caption" color="text.secondary">
                      Tour
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: 700 }}>
                      {state.booking.tourTitle}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {state.booking.tourDestination}
                    </Typography>
                  </Box>
                </Box>

                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 2,
                    p: 2,
                    borderRadius: "12px",
                    background:
                      "linear-gradient(135deg, #F0F9FF 0%, #E0F2FE 100%)",
                  }}
                >
                  <Box
                    sx={{
                      width: 40,
                      height: 40,
                      borderRadius: "10px",
                      background:
                        "linear-gradient(135deg, #3B82F6 0%, #2563EB 100%)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "white",
                    }}
                  >
                    <Calendar size={20} />
                  </Box>
                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      Trạng thái
                    </Typography>
                    {statusConfig ? (
                      <Chip
                        icon={statusConfig.icon}
                        label={statusConfig.label}
                        sx={{
                          background: statusConfig.bgGradient,
                          color: statusConfig.color,
                          fontWeight: 600,
                          borderRadius: "10px",
                          "& .MuiChip-icon": { color: statusConfig.color },
                        }}
                      />
                    ) : (
                      <Typography variant="body1" sx={{ fontWeight: 700 }}>
                        {state.booking.bookingStatus}
                      </Typography>
                    )}
                  </Box>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        )}

        {/* Success Message */}
        {success ? (
          <Card
            sx={{
              borderRadius: "24px",
              background: "linear-gradient(145deg, #ffffff 0%, #f8fbff 100%)",
              backdropFilter: "blur(12px)",
              border: "1px solid rgba(226, 232, 240, 0.8)",
              boxShadow: "0 25px 60px rgba(15, 23, 42, 0.08)",
            }}
          >
            <CardContent sx={{ p: 4, textAlign: "center" }}>
              <Box
                sx={{
                  width: 80,
                  height: 80,
                  borderRadius: "50%",
                  background:
                    "linear-gradient(135deg, #10B981 0%, #059669 100%)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  mx: "auto",
                  mb: 3,
                  boxShadow: "0 8px 24px rgba(16, 185, 129, 0.3)",
                }}
              >
                <CheckCircle2 size={40} color="white" />
              </Box>
              <Typography variant="h5" sx={{ fontWeight: 700, mb: 2 }}>
                Yêu cầu đã được gửi thành công!
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                Đang chuyển về trang bookings...
              </Typography>
              <CircularProgress size={40} sx={{ color: "#10B981" }} />
            </CardContent>
          </Card>
        ) : (
          /* Form Card */
          <Card
            sx={{
              borderRadius: "24px",
              background: "linear-gradient(145deg, #ffffff 0%, #f8fbff 100%)",
              backdropFilter: "blur(12px)",
              border: "1px solid rgba(226, 232, 240, 0.8)",
              boxShadow: "0 25px 60px rgba(15, 23, 42, 0.08)",
            }}
          >
            <Box
              sx={{
                background: "linear-gradient(135deg, #3B82F6 0%, #2563EB 100%)",
                p: 3,
                color: "white",
              }}
            >
              <Typography variant="h6" sx={{ fontWeight: 700 }}>
                Lý do hủy/đổi tour
              </Typography>
            </Box>
            <CardContent sx={{ p: 4 }}>
              <form onSubmit={handleSubmit}>
                <Stack spacing={3}>
                  <TextField
                    label="Lý do hủy/đổi tour"
                    multiline
                    rows={6}
                    fullWidth
                    required
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    placeholder="Vui lòng nhập lý do chi tiết bạn muốn hủy hoặc đổi tour..."
                    error={!!error && !reason.trim()}
                    helperText={
                      error && !reason.trim()
                        ? error
                        : "Vui lòng nhập lý do chi tiết để chúng tôi có thể xử lý yêu cầu của bạn một cách tốt nhất"
                    }
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: "16px",
                        "& fieldset": {
                          borderWidth: 2,
                        },
                        "&:hover fieldset": {
                          borderColor: "#3B82F6",
                        },
                        "&.Mui-focused fieldset": {
                          borderColor: "#3B82F6",
                          borderWidth: 2,
                        },
                      },
                    }}
                  />

                  {error && reason.trim() && (
                    <Alert
                      severity="error"
                      icon={<XCircle size={20} />}
                      sx={{
                        borderRadius: "16px",
                        background:
                          "linear-gradient(135deg, #FEE2E2 0%, #FECACA 100%)",
                        border: "1px solid #FCA5A5",
                      }}
                    >
                      {error}
                    </Alert>
                  )}

                  <Stack
                    direction={{ xs: "column", sm: "row" }}
                    spacing={2}
                    justifyContent="flex-end"
                    sx={{ pt: 2 }}
                  >
                    <Button
                      variant="outlined"
                      onClick={() => navigate("/bookings")}
                      disabled={loading}
                      startIcon={<ArrowLeft size={20} />}
                      sx={{
                        borderRadius: "12px",
                        textTransform: "none",
                        px: 4,
                        py: 1.5,
                        borderWidth: 2,
                        borderColor: "#3B82F6",
                        color: "#3B82F6",
                        fontWeight: 600,
                        "&:hover": {
                          borderWidth: 2,
                          borderColor: "#2563EB",
                          background: "rgba(59, 130, 246, 0.1)",
                        },
                      }}
                    >
                      Hủy
                    </Button>
                    <Button
                      type="submit"
                      variant="contained"
                      disabled={loading || !reason.trim()}
                      startIcon={
                        loading ? (
                          <CircularProgress size={20} color="inherit" />
                        ) : (
                          <Send size={20} />
                        )
                      }
                      sx={{
                        borderRadius: "12px",
                        textTransform: "none",
                        px: 4,
                        py: 1.5,
                        background:
                          "linear-gradient(135deg, #3B82F6 0%, #2563EB 100%)",
                        fontWeight: 600,
                        boxShadow: "0 4px 16px rgba(59, 130, 246, 0.3)",
                        "&:hover": {
                          background:
                            "linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%)",
                          transform: "scale(1.02)",
                          boxShadow: "0 6px 20px rgba(59, 130, 246, 0.4)",
                        },
                        "&:disabled": {
                          background: "#E5E7EB",
                          color: "#9CA3AF",
                        },
                      }}
                    >
                      {loading ? "Đang gửi..." : "Gửi yêu cầu"}
                    </Button>
                  </Stack>
                </Stack>
              </form>
            </CardContent>
          </Card>
        )}
      </Box>
    </Box>
  );
};

export default RequestBookingPage;
