import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  CircularProgress,
  Button,
  Alert,
  Card,
  CardContent,
  Stack,
  Tooltip,
} from "@mui/material";
import {
  ArrowLeft,
  RefreshCw,
  Eye,
  AlertCircle,
  CheckCircle2,
  Clock,
} from "lucide-react";
import {
  getPendingRequests,
  type BookingRequestResponse,
} from "../services/bookingRequest.services";

const BookingRequestPage = () => {
  const navigate = useNavigate();
  const [requests, setRequests] = useState<BookingRequestResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getPendingRequests();
      setRequests(data);
    } catch (err) {
      console.error("Error fetching booking requests:", err);
      const errorMessage =
        err instanceof Error
          ? err.message
          : (err as { response?: { data?: { message?: string } } })?.response
            ?.data?.message || "Không thể tải danh sách booking requests";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const getStatusConfig = (status: string) => {
    switch (status) {
      case "PENDING_CANCELLATION":
        return {
          color: "warning" as const,
          icon: Clock,
          bgColor: "#FFF3CD",
          textColor: "#856404",
        };
      case "PENDING_CHANGE":
        return {
          color: "info" as const,
          icon: AlertCircle,
          bgColor: "#D1ECF1",
          textColor: "#0C5460",
        };
      default:
        return {
          color: "default" as const,
          icon: CheckCircle2,
          bgColor: "#E2E3E5",
          textColor: "#383D41",
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
      }
      : {
        label: "Đổi tour",
        color: "primary" as const,
        bgColor: "#D1ECF1",
        textColor: "#0C5460",
      };
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

  return (
    <Box sx={{ width: "100%", minHeight: "100%" }}>
      {/* Header Section */}
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
            Quản lý Booking Requests
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Danh sách các yêu cầu hủy/đổi tour đang chờ xử lý
          </Typography>
        </Box>
        <Stack direction="row" spacing={2}>
          <Button
            variant="outlined"
            startIcon={<ArrowLeft size={18} />}
            onClick={() => navigate("/admin/dashboard")}
            sx={{
              borderColor: "#667eea",
              color: "#667eea",
              "&:hover": {
                borderColor: "#764ba2",
                backgroundColor: "rgba(102, 126, 234, 0.04)",
              },
            }}
          >
            Dashboard
          </Button>
          <Button
            variant="contained"
            startIcon={<RefreshCw size={18} />}
            onClick={fetchData}
            disabled={loading}
            sx={{
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              "&:hover": {
                background: "linear-gradient(135deg, #764ba2 0%, #667eea 100%)",
              },
            }}
          >
            Làm mới
          </Button>
        </Stack>
      </Box>

      {/* Stats Cards */}
      {!loading && !error && requests.length > 0 && (
        <Box sx={{ mb: 3, display: "flex", gap: 2, flexWrap: "wrap" }}>
          <Card
            sx={{
              flex: 1,
              minWidth: 200,
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              color: "white",
              boxShadow: "0 4px 20px rgba(102, 126, 234, 0.3)",
            }}
          >
            <CardContent>
              <Typography variant="h4" sx={{ fontWeight: 700 }}>
                {requests.length}
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.9 }}>
                Tổng số requests
              </Typography>
            </CardContent>
          </Card>
          <Card
            sx={{
              flex: 1,
              minWidth: 200,
              background: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
              color: "white",
              boxShadow: "0 4px 20px rgba(245, 87, 108, 0.3)",
            }}
          >
            <CardContent>
              <Typography variant="h4" sx={{ fontWeight: 700 }}>
                {requests.filter((r) => r.requestType === "CANCEL").length}
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.9 }}>
                Yêu cầu hủy tour
              </Typography>
            </CardContent>
          </Card>
          <Card
            sx={{
              flex: 1,
              minWidth: 200,
              background: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
              color: "white",
              boxShadow: "0 4px 20px rgba(79, 172, 254, 0.3)",
            }}
          >
            <CardContent>
              <Typography variant="h4" sx={{ fontWeight: 700 }}>
                {requests.filter((r) => r.requestType === "CHANGE").length}
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.9 }}>
                Yêu cầu đổi tour
              </Typography>
            </CardContent>
          </Card>
        </Box>
      )}

      {/* Loading State */}
      {loading && (
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
            Đang tải dữ liệu...
          </Typography>
        </Box>
      )}

      {/* Error State */}
      {!loading && error && (
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
            {error}
          </Alert>
          <Button
            variant="contained"
            onClick={fetchData}
            sx={{
              bgcolor: "white",
              color: "#ff6b6b",
              "&:hover": {
                bgcolor: "rgba(255,255,255,0.9)",
              },
            }}
          >
            Thử lại
          </Button>
        </Card>
      )}

      {/* Empty State */}
      {!loading && !error && requests.length === 0 && (
        <Card
          sx={{
            p: 6,
            textAlign: "center",
            background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
          }}
        >
          <CheckCircle2
            size={64}
            style={{ margin: "0 auto 16px", color: "#667eea" }}
          />
          <Typography variant="h5" sx={{ mb: 1, fontWeight: 600 }}>
            Không có booking request nào
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Hiện tại không có yêu cầu nào đang chờ xử lý
          </Typography>
        </Card>
      )}

      {/* Table */}
      {!loading && !error && requests.length > 0 && (
        <Paper
          sx={{
            width: "100%",
            overflow: "hidden",
            borderRadius: 2,
            boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
          }}
        >
          <TableContainer>
            <Table stickyHeader aria-label="sticky table">
              <TableHead>
                <TableRow>
                  <TableCell
                    sx={{
                      fontWeight: 700,
                      backgroundColor: "#f5f7fa",
                      color: "#374151",
                      fontSize: "0.875rem",
                      borderBottom: "2px solid #e5e7eb",
                    }}
                  >
                    Mã Request
                  </TableCell>
                  <TableCell
                    sx={{
                      fontWeight: 700,
                      backgroundColor: "#f5f7fa",
                      color: "#374151",
                      fontSize: "0.875rem",
                      borderBottom: "2px solid #e5e7eb",
                    }}
                  >
                    Loại yêu cầu
                  </TableCell>
                  <TableCell
                    sx={{
                      fontWeight: 700,
                      backgroundColor: "#f5f7fa",
                      color: "#374151",
                      fontSize: "0.875rem",
                      borderBottom: "2px solid #e5e7eb",
                    }}
                  >
                    Mã Booking
                  </TableCell>
                  <TableCell
                    sx={{
                      fontWeight: 700,
                      backgroundColor: "#f5f7fa",
                      color: "#374151",
                      fontSize: "0.875rem",
                      borderBottom: "2px solid #e5e7eb",
                    }}
                  >
                    Lý do
                  </TableCell>
                  <TableCell
                    sx={{
                      fontWeight: 700,
                      backgroundColor: "#f5f7fa",
                      color: "#374151",
                      fontSize: "0.875rem",
                      borderBottom: "2px solid #e5e7eb",
                    }}
                  >
                    Trạng thái
                  </TableCell>
                  <TableCell
                    sx={{
                      fontWeight: 700,
                      backgroundColor: "#f5f7fa",
                      color: "#374151",
                      fontSize: "0.875rem",
                      borderBottom: "2px solid #e5e7eb",
                    }}
                  >
                    Ngày tạo
                  </TableCell>
                  <TableCell
                    sx={{
                      fontWeight: 700,
                      backgroundColor: "#f5f7fa",
                      color: "#374151",
                      fontSize: "0.875rem",
                      borderBottom: "2px solid #e5e7eb",
                    }}
                  >
                    Thao tác
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {requests.map((row) => {
                  const statusConfig = getStatusConfig(row.status);
                  const typeConfig = getRequestTypeConfig(row.requestType);
                  const StatusIcon = statusConfig.icon;

                  return (
                    <TableRow
                      hover
                      key={row.requestId}
                      sx={{
                        "&:nth-of-type(even)": {
                          backgroundColor: "rgba(102, 126, 234, 0.02)",
                        },
                        "&:hover": {
                          backgroundColor: "rgba(102, 126, 234, 0.05)",
                          transform: "scale(1.001)",
                          transition: "all 0.2s ease",
                        },
                        transition: "all 0.2s ease",
                      }}
                    >
                      <TableCell>
                        <Typography
                          variant="body2"
                          sx={{
                            fontFamily: "monospace",
                            fontWeight: 600,
                            color: "#667eea",
                          }}
                        >
                          {row.requestId.substring(0, 8)}...
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={typeConfig.label}
                          color={typeConfig.color}
                          size="small"
                          sx={{
                            fontWeight: 600,
                            backgroundColor: typeConfig.bgColor,
                            color: typeConfig.textColor,
                          }}
                        />
                      </TableCell>
                      <TableCell>
                        <Typography
                          variant="body2"
                          sx={{
                            fontFamily: "monospace",
                            color: "#764ba2",
                          }}
                        >
                          {row.bookingId.substring(0, 8)}...
                        </Typography>
                      </TableCell>
                      <TableCell
                        sx={{
                          maxWidth: 300,
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        <Tooltip title={row.reason} arrow>
                          <Typography variant="body2">{row.reason}</Typography>
                        </Tooltip>
                      </TableCell>
                      <TableCell>
                        <Chip
                          icon={<StatusIcon size={14} />}
                          label={row.status}
                          color={statusConfig.color}
                          size="small"
                          sx={{
                            fontWeight: 600,
                            backgroundColor: statusConfig.bgColor,
                            color: statusConfig.textColor,
                          }}
                        />
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" color="text.secondary">
                          {formatDate(row.createdAt)}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="contained"
                          size="small"
                          startIcon={<Eye size={16} />}
                          onClick={() => {
                            navigate(
                              `/admin/bookings-request/${row.requestId}`
                            );
                          }}
                          sx={{
                            background:
                              "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                            "&:hover": {
                              background:
                                "linear-gradient(135deg, #764ba2 0%, #667eea 100%)",
                              transform: "translateY(-2px)",
                              boxShadow: "0 4px 12px rgba(102, 126, 234, 0.4)",
                            },
                            transition: "all 0.2s ease",
                          }}
                        >
                          Chi tiết
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      )}
    </Box>
  );
};

export default BookingRequestPage;
