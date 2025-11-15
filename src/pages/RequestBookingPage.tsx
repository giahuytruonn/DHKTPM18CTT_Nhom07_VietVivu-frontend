import { useState } from "react";
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
} from "@mui/material";
import {
  ArrowLeft,
  Send,
  XCircle,
  MapPin,
  Calendar,
  Tag,
  CheckCircle2,
} from "lucide-react";
import type { BookingResponse } from "../services/booking.services";
import { cancelBooking } from "../services/bookingRequest.services";

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
          background: "linear-gradient(135deg, #3B82F6 0%, #2563EB 100%)",
          py: 5,
          px: { xs: 2, md: 3 },
        }}
      >
        <Box sx={{ maxWidth: "800px", mx: "auto" }}>
          <Card
            sx={{
              borderRadius: "24px",
              background: "rgba(255, 255, 255, 0.95)",
              backdropFilter: "blur(10px)",
              border: "1px solid rgba(255, 255, 255, 0.3)",
              boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
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
        background: "linear-gradient(135deg, #3B82F6 0%, #2563EB 100%)",
        py: { xs: 3, md: 5 },
        px: { xs: 2, md: 3 },
      }}
    >
      <Box sx={{ maxWidth: "900px", mx: "auto" }}>
        {/* Header */}
        <Box sx={{ mb: 4 }}>
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
              background: "linear-gradient(135deg, #ffffff 0%, #e0e7ff 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              mb: 1,
            }}
          >
            Yêu cầu hủy tour
          </Typography>
          <Typography
            variant="body1"
            sx={{ color: "rgba(255, 255, 255, 0.9)", fontSize: "1.1rem" }}
          >
            Vui lòng điền thông tin để chúng tôi có thể xử lý yêu cầu của bạn
          </Typography>
        </Box>

        {/* Booking Info Card */}
        {state.booking && (
          <Card
            sx={{
              mb: 3,
              borderRadius: "24px",
              background: "rgba(255, 255, 255, 0.95)",
              backdropFilter: "blur(10px)",
              border: "1px solid rgba(255, 255, 255, 0.3)",
              boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
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
                    <Typography variant="body1" sx={{ fontWeight: 700 }}>
                      {state.booking.bookingStatus}
                    </Typography>
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
              background: "rgba(255, 255, 255, 0.95)",
              backdropFilter: "blur(10px)",
              border: "1px solid rgba(255, 255, 255, 0.3)",
              boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
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
              background: "rgba(255, 255, 255, 0.95)",
              backdropFilter: "blur(10px)",
              border: "1px solid rgba(255, 255, 255, 0.3)",
              boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
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
