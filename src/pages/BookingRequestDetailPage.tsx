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
  Card,
  CardContent,
  Grid,
  IconButton,
} from "@mui/material";
import {
  ArrowLeft,
  CheckCircle2,
  XCircle,
  Clock,
  AlertCircle,
  Calendar,
  User,
  FileText,
  Package,
  RefreshCw,
} from "lucide-react";
import {
  getBookingRequestById,
  updateBookingRequestStatus,
  type BookingRequestResponse,
} from "../services/bookingRequest.services";
import toast from "react-hot-toast";

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

      const acceptStatus =
        request.requestType === "CANCEL"
          ? "CONFIRMED_CANCELLATION"
          : "CONFIRMED_CHANGE";

      await updateBookingRequestStatus(requestId, acceptStatus);
      await fetchData();

      toast.success("Đã chấp nhận yêu cầu thành công!");
    } catch (err) {
      console.error("Error accepting request:", err);
      const errorMessage =
        err instanceof Error
          ? err.message
          : (err as { response?: { data?: { message?: string } } })?.response
              ?.data?.message || "Không thể chấp nhận yêu cầu";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeny = async () => {
    if (!requestId || !request) return;

    if (!window.confirm("Bạn có chắc chắn muốn từ chối yêu cầu này không?")) {
      return;
    }

    try {
      setActionLoading(true);
      setError(null);

      const denyStatus =
        request.requestType === "CANCEL"
          ? "DENIED_CANCELLATION"
          : "DENIED_CHANGE";

      await updateBookingRequestStatus(requestId, denyStatus);
      await fetchData();

      toast.success("Đã từ chối yêu cầu thành công!");
    } catch (err) {
      console.error("Error denying request:", err);
      const errorMessage =
        err instanceof Error
          ? err.message
          : (err as { response?: { data?: { message?: string } } })?.response
              ?.data?.message || "Không thể từ chối yêu cầu";
      setError(errorMessage);
      toast.error(errorMessage);
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

  const getStatusConfig = (status: string) => {
    switch (status) {
      case "PENDING_CANCELLATION":
        return {
          color: "warning" as const,
          icon: Clock,
          bgColor: "#FFF3CD",
          textColor: "#856404",
          label: "Đang chờ xử lý hủy",
        };
      case "PENDING_CHANGE":
        return {
          color: "info" as const,
          icon: AlertCircle,
          bgColor: "#D1ECF1",
          textColor: "#0C5460",
          label: "Đang chờ xử lý đổi",
        };
      case "CONFIRMED_CANCELLATION":
      case "CONFIRMED_CHANGE":
        return {
          color: "success" as const,
          icon: CheckCircle2,
          bgColor: "#D4EDDA",
          textColor: "#155724",
          label: "Đã chấp nhận",
        };
      case "DENIED_CANCELLATION":
      case "DENIED_CHANGE":
        return {
          color: "error" as const,
          icon: XCircle,
          bgColor: "#F8D7DA",
          textColor: "#721C24",
          label: "Đã từ chối",
        };
      default:
        return {
          color: "default" as const,
          icon: AlertCircle,
          bgColor: "#E2E3E5",
          textColor: "#383D41",
          label: status,
        };
    }
  };

  const getRequestTypeConfig = (type: string) => {
    return type === "CANCEL"
      ? {
          label: "Hủy tour",
          color: "error" as const,
          bgColor: "#F8D7DA",
          textColor: "#721C24",
          icon: XCircle,
        }
      : {
          label: "Đổi tour",
          color: "primary" as const,
          bgColor: "#D1ECF1",
          textColor: "#0C5460",
          icon: RefreshCw,
        };
  };

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "400px",
          gap: 2,
        }}
      >
        <CircularProgress
          sx={{
            color: "#667eea",
          }}
          size={60}
        />
        <Typography variant="body1" color="text.secondary">
          Đang tải thông tin...
        </Typography>
      </Box>
    );
  }

  if (error && !request) {
    return (
      <Box sx={{ padding: 3 }}>
        <Card
          sx={{
            p: 4,
            textAlign: "center",
            background: "linear-gradient(135deg, #ff6b6b 0%, #ee5a6f 100%)",
            color: "white",
          }}
        >
          <XCircle size={48} style={{ margin: "0 auto 16px" }} />
          <Alert
            severity="error"
            sx={{ mb: 2, bgcolor: "rgba(255,255,255,0.2)" }}
          >
            {error}
          </Alert>
          <Button
            variant="contained"
            startIcon={<ArrowLeft size={18} />}
            onClick={() => navigate("/admin/bookings-request")}
            sx={{
              bgcolor: "white",
              color: "#ff6b6b",
              "&:hover": {
                bgcolor: "rgba(255,255,255,0.9)",
              },
            }}
          >
            Quay lại danh sách
          </Button>
        </Card>
      </Box>
    );
  }

  if (!request) {
    return (
      <Box sx={{ padding: 3 }}>
        <Card
          sx={{
            p: 4,
            textAlign: "center",
            background: "linear-gradient(135deg, #ff6b6b 0%, #ee5a6f 100%)",
            color: "white",
          }}
        >
          <AlertCircle size={48} style={{ margin: "0 auto 16px" }} />
          <Alert
            severity="error"
            sx={{ mb: 2, bgcolor: "rgba(255,255,255,0.2)" }}
          >
            Không tìm thấy booking request
          </Alert>
          <Button
            variant="contained"
            startIcon={<ArrowLeft size={18} />}
            onClick={() => navigate("/admin/bookings-request")}
            sx={{
              bgcolor: "white",
              color: "#ff6b6b",
              "&:hover": {
                bgcolor: "rgba(255,255,255,0.9)",
              },
            }}
          >
            Quay lại danh sách
          </Button>
        </Card>
      </Box>
    );
  }

  const canAcceptDeny =
    (request.status === "PENDING_CANCELLATION" ||
      request.status === "PENDING_CHANGE") &&
    (request.requestType === "CANCEL" || request.requestType === "CHANGE");

  const statusConfig = getStatusConfig(request.status);
  const typeConfig = getRequestTypeConfig(request.requestType);
  const StatusIcon = statusConfig.icon;
  const TypeIcon = typeConfig.icon;

  return (
    <Box sx={{ width: "100%", maxWidth: 1200, margin: "0 auto" }}>
      {/* Header */}
      <Box
        sx={{
          mb: 4,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 2,
        }}
      >
        <Box>
          <Typography
            variant="h4"
            component="h1"
            sx={{
              fontWeight: 700,
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              mb: 1,
            }}
          >
            Chi tiết Booking Request
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Thông tin chi tiết và xử lý yêu cầu
          </Typography>
        </Box>
        <Button
          variant="outlined"
          startIcon={<ArrowLeft size={18} />}
          onClick={() => navigate("/admin/bookings-request")}
          sx={{
            borderColor: "#667eea",
            color: "#667eea",
            "&:hover": {
              borderColor: "#764ba2",
              backgroundColor: "rgba(102, 126, 234, 0.04)",
            },
          }}
        >
          Quay lại
        </Button>
      </Box>

      {error && (
        <Alert
          severity="error"
          sx={{ mb: 3 }}
          action={
            <IconButton
              aria-label="close"
              color="inherit"
              size="small"
              onClick={() => setError(null)}
            >
              <XCircle size={18} />
            </IconButton>
          }
        >
          {error}
        </Alert>
      )}

      {/* Status Banner */}
      <Card
        sx={{
          mb: 3,
          background: `linear-gradient(135deg, ${statusConfig.bgColor} 0%, ${statusConfig.bgColor}cc 50%, ${statusConfig.bgColor} 100%)`,
          border: `2px solid ${statusConfig.textColor}40`,
          borderRadius: 3,
          boxShadow: `0 4px 20px ${statusConfig.textColor}20`,
        }}
      >
        <CardContent>
          <Stack direction="row" spacing={2} alignItems="center">
            <StatusIcon size={32} style={{ color: statusConfig.textColor }} />
            <Box sx={{ flex: 1 }}>
              <Typography
                variant="h6"
                sx={{ fontWeight: 700, color: statusConfig.textColor }}
              >
                {statusConfig.label}
              </Typography>
              <Typography
                variant="body2"
                sx={{ color: statusConfig.textColor, opacity: 0.8 }}
              >
                Request ID: {request.requestId}
              </Typography>
            </Box>
            <Chip
              icon={<TypeIcon size={16} />}
              label={typeConfig.label}
              color={typeConfig.color}
              sx={{
                fontWeight: 600,
                backgroundColor: typeConfig.bgColor,
                color: typeConfig.textColor,
              }}
            />
          </Stack>
        </CardContent>
      </Card>

      <Grid container spacing={3}>
        {/* Request Info */}
        <Grid item xs={12} md={6}>
          <Card
            sx={{
              height: "100%",
              boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
              borderRadius: 2,
            }}
          >
            <CardContent>
              <Stack
                direction="row"
                spacing={1}
                alignItems="center"
                sx={{ mb: 2 }}
              >
                <FileText size={20} style={{ color: "#667eea" }} />
                <Typography variant="h6" sx={{ fontWeight: 700 }}>
                  Thông tin Request
                </Typography>
              </Stack>
              <Divider sx={{ mb: 3 }} />
              <Stack spacing={2.5}>
                <Box>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{ fontWeight: 600 }}
                  >
                    Mã Request
                  </Typography>
                  <Typography
                    variant="body1"
                    sx={{
                      fontFamily: "monospace",
                      fontWeight: 600,
                      color: "#667eea",
                      mt: 0.5,
                    }}
                  >
                    {request.requestId}
                  </Typography>
                </Box>
                <Box>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{ fontWeight: 600 }}
                  >
                    Loại yêu cầu
                  </Typography>
                  <Box sx={{ mt: 0.5 }}>
                    <Chip
                      icon={<TypeIcon size={16} />}
                      label={typeConfig.label}
                      color={typeConfig.color}
                      sx={{
                        fontWeight: 600,
                        backgroundColor: typeConfig.bgColor,
                        color: typeConfig.textColor,
                      }}
                    />
                  </Box>
                </Box>
                <Box>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{ fontWeight: 600 }}
                  >
                    Trạng thái
                  </Typography>
                  <Box sx={{ mt: 0.5 }}>
                    <Chip
                      icon={<StatusIcon size={16} />}
                      label={statusConfig.label}
                      color={statusConfig.color}
                      sx={{
                        fontWeight: 600,
                        backgroundColor: statusConfig.bgColor,
                        color: statusConfig.textColor,
                      }}
                    />
                  </Box>
                </Box>
                <Box>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{ fontWeight: 600 }}
                  >
                    Lý do
                  </Typography>
                  <Paper
                    sx={{
                      p: 2,
                      mt: 0.5,
                      backgroundColor: "rgba(102, 126, 234, 0.04)",
                      borderLeft: "3px solid #667eea",
                    }}
                  >
                    <Typography variant="body2">{request.reason}</Typography>
                  </Paper>
                </Box>
                <Box>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <Calendar size={16} style={{ color: "#667eea" }} />
                    <Box>
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        sx={{ fontWeight: 600 }}
                      >
                        Ngày tạo
                      </Typography>
                      <Typography variant="body2" sx={{ fontWeight: 500 }}>
                        {formatDate(request.createdAt)}
                      </Typography>
                    </Box>
                  </Stack>
                </Box>
                {request.reviewedAt && (
                  <Box>
                    <Stack direction="row" spacing={1} alignItems="center">
                      <CheckCircle2 size={16} style={{ color: "#667eea" }} />
                      <Box>
                        <Typography
                          variant="caption"
                          color="text.secondary"
                          sx={{ fontWeight: 600 }}
                        >
                          Ngày xử lý
                        </Typography>
                        <Typography variant="body2" sx={{ fontWeight: 500 }}>
                          {formatDate(request.reviewedAt)}
                        </Typography>
                      </Box>
                    </Stack>
                  </Box>
                )}
              </Stack>
            </CardContent>
          </Card>
        </Grid>

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
              <Stack
                direction="row"
                spacing={1}
                alignItems="center"
                sx={{ mb: 2 }}
              >
                <Package size={20} style={{ color: "#667eea" }} />
                <Typography variant="h6" sx={{ fontWeight: 700 }}>
                  Thông tin Booking
                </Typography>
              </Stack>
              <Divider sx={{ mb: 3 }} />
              <Stack spacing={2.5}>
                <Box>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{ fontWeight: 600 }}
                  >
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
                    {request.bookingId}
                  </Typography>
                </Box>
                <Box>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{ fontWeight: 600 }}
                  >
                    Tour cũ
                  </Typography>
                  <Typography
                    variant="body1"
                    sx={{
                      fontFamily: "monospace",
                      fontWeight: 500,
                      mt: 0.5,
                    }}
                  >
                    {request.oldTourId}
                  </Typography>
                </Box>
                {request.newTourId && (
                  <Box>
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      sx={{ fontWeight: 600 }}
                    >
                      Tour mới
                    </Typography>
                    <Typography
                      variant="body1"
                      sx={{
                        fontFamily: "monospace",
                        fontWeight: 500,
                        color: "#667eea",
                        mt: 0.5,
                      }}
                    >
                      {request.newTourId}
                    </Typography>
                  </Box>
                )}
                <Box>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <User size={16} style={{ color: "#667eea" }} />
                    <Box>
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        sx={{ fontWeight: 600 }}
                      >
                        User ID
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{
                          fontFamily: "monospace",
                          fontWeight: 500,
                        }}
                      >
                        {request.userId}
                      </Typography>
                    </Box>
                  </Stack>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        {/* Actions */}
        {canAcceptDeny && (
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
                  <Button
                    variant="contained"
                    color="success"
                    size="large"
                    startIcon={
                      actionLoading ? (
                        <CircularProgress size={20} color="inherit" />
                      ) : (
                        <CheckCircle2 size={20} />
                      )
                    }
                    onClick={handleAccept}
                    disabled={actionLoading}
                    sx={{
                      background:
                        "linear-gradient(135deg, #11998e 0%, #38ef7d 100%)",
                      "&:hover": {
                        background:
                          "linear-gradient(135deg, #38ef7d 0%, #11998e 100%)",
                        transform: "translateY(-2px)",
                        boxShadow: "0 4px 12px rgba(17, 153, 142, 0.4)",
                      },
                      transition: "all 0.2s ease",
                      fontWeight: 600,
                    }}
                  >
                    Chấp nhận
                  </Button>
                  <Button
                    variant="contained"
                    color="error"
                    size="large"
                    startIcon={
                      actionLoading ? (
                        <CircularProgress size={20} color="inherit" />
                      ) : (
                        <XCircle size={20} />
                      )
                    }
                    onClick={handleDeny}
                    disabled={actionLoading}
                    sx={{
                      background:
                        "linear-gradient(135deg, #eb3349 0%, #f45c43 100%)",
                      "&:hover": {
                        background:
                          "linear-gradient(135deg, #f45c43 0%, #eb3349 100%)",
                        transform: "translateY(-2px)",
                        boxShadow: "0 4px 12px rgba(235, 51, 73, 0.4)",
                      },
                      transition: "all 0.2s ease",
                      fontWeight: 600,
                    }}
                  >
                    Từ chối
                  </Button>
                  <Button
                    variant="outlined"
                    size="large"
                    startIcon={<ArrowLeft size={20} />}
                    onClick={() => navigate("/admin/bookings-request")}
                    disabled={actionLoading}
                    sx={{
                      borderColor: "#667eea",
                      color: "#667eea",
                      "&:hover": {
                        borderColor: "#764ba2",
                        backgroundColor: "rgba(102, 126, 234, 0.04)",
                      },
                      fontWeight: 600,
                    }}
                  >
                    Quay lại danh sách
                  </Button>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        )}

        {!canAcceptDeny && (
          <Grid item xs={12}>
            <Alert
              severity="info"
              icon={<AlertCircle size={24} />}
              sx={{
                borderRadius: 2,
                "& .MuiAlert-message": {
                  width: "100%",
                },
              }}
            >
              <Typography variant="body1" sx={{ fontWeight: 600, mb: 0.5 }}>
                Request này không thể chấp nhận hoặc từ chối
              </Typography>
              <Typography variant="body2">
                Trạng thái hiện tại: <strong>{statusConfig.label}</strong>
              </Typography>
            </Alert>
          </Grid>
        )}
      </Grid>
    </Box>
  );
};

export default BookingRequestDetailPage;
