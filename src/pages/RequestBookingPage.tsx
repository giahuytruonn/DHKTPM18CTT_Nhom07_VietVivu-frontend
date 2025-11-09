import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Alert,
  CircularProgress,
  Stack,
} from "@mui/material";
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
      <Box sx={{ padding: 3 }}>
        <Alert severity="error">Không tìm thấy thông tin booking</Alert>
        <Button
          variant="contained"
          onClick={() => navigate("/bookings")}
          sx={{ mt: 2 }}
        >
          Quay lại danh sách booking
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ padding: 3, maxWidth: 800, margin: "0 auto" }}>
      <Typography variant="h4" component="h1" gutterBottom sx={{ mb: 3 }}>
        Yêu cầu hủy tour
      </Typography>

      {state.booking && (
        <Paper sx={{ p: 2, mb: 3 }}>
          <Typography variant="h6" gutterBottom>
            Thông tin booking
          </Typography>
          <Typography>
            <strong>Mã booking:</strong> {state.booking.bookingId}
          </Typography>
          <Typography>
            <strong>Tour:</strong> {state.booking.tourTitle}
          </Typography>
          <Typography>
            <strong>Điểm đến:</strong> {state.booking.tourDestination}
          </Typography>
          <Typography>
            <strong>Trạng thái:</strong> {state.booking.bookingStatus}
          </Typography>
        </Paper>
      )}

      {success ? (
        <Alert severity="success" sx={{ mb: 2 }}>
          Yêu cầu đã được gửi thành công! Đang chuyển về trang bookings...
        </Alert>
      ) : (
        <Paper sx={{ p: 3 }}>
          <form onSubmit={handleSubmit}>
            <Stack spacing={3}>
              <TextField
                label="Lý do hủy/đổi tour"
                multiline
                rows={4}
                fullWidth
                required
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Vui lòng nhập lý do bạn muốn hủy hoặc đổi tour..."
                error={!!error && !reason.trim()}
                helperText={
                  error && !reason.trim()
                    ? error
                    : "Vui lòng nhập lý do chi tiết để chúng tôi có thể xử lý yêu cầu của bạn"
                }
              />

              {error && reason.trim() && (
                <Alert severity="error">{error}</Alert>
              )}

              <Stack direction="row" spacing={2} justifyContent="flex-end">
                <Button
                  variant="outlined"
                  onClick={() => navigate("/bookings")}
                  disabled={loading}
                >
                  Hủy
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  disabled={loading || !reason.trim()}
                  startIcon={loading ? <CircularProgress size={20} /> : null}
                >
                  {loading ? "Đang gửi..." : "Gửi yêu cầu"}
                </Button>
              </Stack>
            </Stack>
          </form>
        </Paper>
      )}
    </Box>
  );
};

export default RequestBookingPage;
