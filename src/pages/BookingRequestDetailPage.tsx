import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Paper,
  Button,
  Stack,
  CircularProgress,
  Alert,
  Divider,
  Chip,
} from "@mui/material";
import {
  getBookingRequestById,
  updateBookingRequestStatus,
  type BookingRequestResponse,
} from "../services/bookingRequest.services";

const BookingRequestDetailPage = () => {
  const { requestId } = useParams<{ requestId: string }>();
  const navigate = useNavigate();
  const [request, setRequest] = useState<BookingRequestResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  const fetchData = async () => {
    if (!requestId) {
      setError("Không tìm thấy request ID");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const data = await getBookingRequestById(requestId);
      setRequest(data);
    } catch (err) {
      console.error("Error fetching booking request:", err);
      const errorMessage =
        err instanceof Error
          ? err.message
          : (err as { response?: { data?: { message?: string } } })?.response
              ?.data?.message || "Không thể tải thông tin booking request";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [requestId]);

  const handleAccept = async () => {
    if (!requestId || !request) return;

    try {
      setActionLoading(true);
      setError(null);

      // Xác định status để accept dựa vào requestType
      const acceptStatus =
        request.requestType === "CANCEL"
          ? "CONFIRMED_CANCELLATION"
          : "CONFIRMED_CHANGE";

      await updateBookingRequestStatus(requestId, acceptStatus);

      // Refresh data
      await fetchData();

      alert("Đã chấp nhận yêu cầu thành công!");
    } catch (err) {
      console.error("Error accepting request:", err);
      const errorMessage =
        err instanceof Error
          ? err.message
          : (err as { response?: { data?: { message?: string } } })?.response
              ?.data?.message || "Không thể chấp nhận yêu cầu";
      setError(errorMessage);
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeny = async () => {
    if (!requestId || !request) return;

    if (!confirm("Bạn có chắc chắn muốn từ chối yêu cầu này không?")) {
      return;
    }

    try {
      setActionLoading(true);
      setError(null);

      // Xác định status để deny dựa vào requestType
      const denyStatus =
        request.requestType === "CANCEL"
          ? "DENIED_CANCELLATION"
          : "DENIED_CHANGE";

      await updateBookingRequestStatus(requestId, denyStatus);

      // Refresh data
      await fetchData();

      alert("Đã từ chối yêu cầu thành công!");
    } catch (err) {
      console.error("Error denying request:", err);
      const errorMessage =
        err instanceof Error
          ? err.message
          : (err as { response?: { data?: { message?: string } } })?.response
              ?.data?.message || "Không thể từ chối yêu cầu";
      setError(errorMessage);
    } finally {
      setActionLoading(false);
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return date.toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "400px",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error && !request) {
    return (
      <Box sx={{ padding: 3 }}>
        <Alert severity="error">{error}</Alert>
        <Button
          variant="contained"
          onClick={() => navigate("/bookings-request")}
          sx={{ mt: 2 }}
        >
          Quay lại danh sách
        </Button>
      </Box>
    );
  }

  if (!request) {
    return (
      <Box sx={{ padding: 3 }}>
        <Alert severity="error">Không tìm thấy booking request</Alert>
        <Button
          variant="contained"
          onClick={() => navigate("/bookings-request")}
          sx={{ mt: 2 }}
        >
          Quay lại danh sách
        </Button>
      </Box>
    );
  }

  const canAcceptDeny =
    (request.status === "PENDING_CANCELLATION" ||
      request.status === "PENDING_CHANGE") &&
    (request.requestType === "CANCEL" || request.requestType === "CHANGE");

  return (
    <Box sx={{ padding: 3, maxWidth: 1000, margin: "0 auto" }}>
      <Typography variant="h4" component="h1" gutterBottom sx={{ mb: 3 }}>
        Chi tiết Booking Request
      </Typography>
      <Button
        variant="outlined"
        size="small"
        onClick={() => {
          navigate(`/`);
        }}
      >
        Go back
      </Button>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Paper sx={{ p: 3 }}>
        <Stack spacing={3}>
          <Box>
            <Typography variant="h6" gutterBottom>
              Thông tin Request
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <Stack spacing={1}>
              <Typography>
                <strong>Mã Request:</strong> {request.requestId}
              </Typography>
              <Typography>
                <strong>Loại yêu cầu:</strong>{" "}
                <Chip
                  label={
                    request.requestType === "CANCEL" ? "Hủy tour" : "Đổi tour"
                  }
                  color={request.requestType === "CANCEL" ? "error" : "primary"}
                  size="small"
                />
              </Typography>
              <Typography>
                <strong>Trạng thái:</strong>{" "}
                <Chip
                  label={request.status}
                  color={
                    request.status === "PENDING_CANCELLATION"
                      ? "warning"
                      : request.status === "PENDING_CHANGE"
                      ? "info"
                      : "default"
                  }
                  size="small"
                />
              </Typography>
              <Typography>
                <strong>Lý do:</strong> {request.reason}
              </Typography>
              <Typography>
                <strong>Ngày tạo:</strong> {formatDate(request.createdAt)}
              </Typography>
              {request.reviewedAt && (
                <Typography>
                  <strong>Ngày xử lý:</strong> {formatDate(request.reviewedAt)}
                </Typography>
              )}
            </Stack>
          </Box>

          <Box>
            <Typography variant="h6" gutterBottom>
              Thông tin Booking
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <Stack spacing={1}>
              <Typography>
                <strong>Mã Booking:</strong> {request.bookingId}
              </Typography>
              <Typography>
                <strong>Tour cũ:</strong> {request.oldTourId}
              </Typography>
              {request.newTourId && (
                <Typography>
                  <strong>Tour mới:</strong> {request.newTourId}
                </Typography>
              )}
              <Typography>
                <strong>User ID:</strong> {request.userId}
              </Typography>
            </Stack>
          </Box>

          {canAcceptDeny && (
            <Box>
              <Typography variant="h6" gutterBottom>
                Thao tác
              </Typography>
              <Divider sx={{ mb: 2 }} />
              <Stack direction="row" spacing={2}>
                <Button
                  variant="contained"
                  color="success"
                  onClick={handleAccept}
                  disabled={actionLoading}
                  startIcon={
                    actionLoading ? <CircularProgress size={20} /> : null
                  }
                >
                  Chấp nhận
                </Button>
                <Button
                  variant="contained"
                  color="error"
                  onClick={handleDeny}
                  disabled={actionLoading}
                  startIcon={
                    actionLoading ? <CircularProgress size={20} /> : null
                  }
                >
                  Từ chối
                </Button>
                <Button
                  variant="outlined"
                  onClick={() => navigate("/bookings-request")}
                  disabled={actionLoading}
                >
                  Quay lại
                </Button>
              </Stack>
            </Box>
          )}

          {!canAcceptDeny && (
            <Box>
              <Alert severity="info">
                Request này không thể chấp nhận hoặc từ chối. Trạng thái hiện
                tại: {request.status}
              </Alert>
              <Button
                variant="outlined"
                onClick={() => navigate("/bookings-request")}
                sx={{ mt: 2 }}
              >
                Quay lại danh sách
              </Button>
            </Box>
          )}
        </Stack>
      </Paper>
    </Box>
  );
};

export default BookingRequestDetailPage;
