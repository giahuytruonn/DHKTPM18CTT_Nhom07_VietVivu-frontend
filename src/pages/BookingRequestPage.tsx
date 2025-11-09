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
} from "@mui/material";
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case "PENDING_CANCELLATION":
        return "warning";
      case "PENDING_CHANGE":
        return "info";
      default:
        return "default";
    }
  };

  const getRequestTypeLabel = (type: string) => {
    return type === "CANCEL" ? "Hủy tour" : "Đổi tour";
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
    <Box sx={{ width: "100%", padding: 3 }}>
      <Typography variant="h4" component="h1" gutterBottom sx={{ mb: 3 }}>
        Danh sách Booking Requests đang chờ xử lý
      </Typography>

      {loading ? (
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
      ) : error ? (
        <Box sx={{ p: 3, textAlign: "center" }}>
          <Alert severity="error">{error}</Alert>
        </Box>
      ) : requests.length === 0 ? (
        <Box sx={{ p: 3, textAlign: "center" }}>
          <Typography variant="h6" color="text.secondary">
            Không có booking request nào đang chờ xử lý
          </Typography>
        </Box>
      ) : (
        <Paper sx={{ width: "100%", overflow: "hidden" }}>
          <TableContainer>
            <Table stickyHeader aria-label="sticky table">
              <TableHead>
                <TableRow>
                  <TableCell
                    sx={{ fontWeight: "bold", backgroundColor: "#f5f5f5" }}
                  >
                    Mã Request
                  </TableCell>
                  <TableCell
                    sx={{ fontWeight: "bold", backgroundColor: "#f5f5f5" }}
                  >
                    Loại yêu cầu
                  </TableCell>
                  <TableCell
                    sx={{ fontWeight: "bold", backgroundColor: "#f5f5f5" }}
                  >
                    Mã Booking
                  </TableCell>
                  <TableCell
                    sx={{ fontWeight: "bold", backgroundColor: "#f5f5f5" }}
                  >
                    Lý do
                  </TableCell>
                  <TableCell
                    sx={{ fontWeight: "bold", backgroundColor: "#f5f5f5" }}
                  >
                    Trạng thái
                  </TableCell>
                  <TableCell
                    sx={{ fontWeight: "bold", backgroundColor: "#f5f5f5" }}
                  >
                    Ngày tạo
                  </TableCell>
                  <TableCell
                    sx={{ fontWeight: "bold", backgroundColor: "#f5f5f5" }}
                  >
                    Thao tác
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {requests.map((row) => (
                  <TableRow hover key={row.requestId}>
                    <TableCell>{row.requestId.substring(0, 8)}...</TableCell>
                    <TableCell>
                      <Chip
                        label={getRequestTypeLabel(row.requestType)}
                        color={
                          row.requestType === "CANCEL" ? "error" : "primary"
                        }
                        size="small"
                      />
                    </TableCell>
                    <TableCell>{row.bookingId.substring(0, 8)}...</TableCell>
                    <TableCell
                      sx={{
                        maxWidth: 300,
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {row.reason}
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={row.status}
                        color={
                          getStatusColor(row.status) as
                            | "warning"
                            | "info"
                            | "default"
                        }
                        size="small"
                      />
                    </TableCell>
                    <TableCell>{formatDate(row.createdAt)}</TableCell>
                    <TableCell>
                      <Button
                        variant="outlined"
                        size="small"
                        onClick={() => {
                          navigate(`/bookings-request/${row.requestId}`);
                        }}
                      >
                        Xem chi tiết
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      )}
    </Box>
  );
};

export default BookingRequestPage;
