import { useState, useEffect } from "react";
import React from "react";
import { useNavigate } from "react-router-dom";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import {
  Box,
  Typography,
  Chip,
  CircularProgress,
  Button,
  Stack,
} from "@mui/material";
import { getBookings } from "../services/booking.services";
import type { BookingResponse } from "../services/booking.services";

const BookingPage = () => {
  const navigate = useNavigate();

  interface Column {
    id: keyof BookingResponse | "actions";
    label: string;
    minWidth?: number;
    align?: "right" | "left" | "center";
    format?: (
      value: string | number | null,
      row?: BookingResponse
    ) => string | React.ReactNode;
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case "PENDING":
        return "warning";
      case "CONFIRMED":
        return "success";
      case "CANCELLED":
        return "error";
      case "COMPLETED":
        return "info";
      case "PENDING_CANCELLATION":
        return "warning";
      case "CONFIRMED_CANCELLATION":
        return "error";
      case "PENDING_CHANGE":
        return "warning";
      case "CONFIRMED_CHANGE":
        return "info";
      default:
        return "default";
    }
  };

  const columns: readonly Column[] = [
    {
      id: "bookingId",
      label: "Mã Booking",
      minWidth: 150,
      format: (value: string | number | null) =>
        value ? String(value).substring(0, 8) + "..." : "-",
    },
    {
      id: "tourTitle",
      label: "Tour",
      minWidth: 200,
    },
    {
      id: "tourDestination",
      label: "Điểm đến",
      minWidth: 120,
    },
    {
      id: "bookingDate",
      label: "Ngày đặt",
      minWidth: 150,
      format: (value: string | number | null) =>
        value ? formatDate(String(value)) : "-",
    },
    {
      id: "numOfAdults",
      label: "Người lớn",
      minWidth: 100,
      align: "center",
    },
    {
      id: "numOfChildren",
      label: "Trẻ em",
      minWidth: 100,
      align: "center",
    },
    {
      id: "totalPrice",
      label: "Tổng tiền",
      minWidth: 150,
      align: "right",
      format: (value: string | number | null) =>
        value ? formatCurrency(Number(value)) : "-",
    },
    {
      id: "discountAmount",
      label: "Giảm giá",
      minWidth: 120,
      align: "right",
      format: (value: string | number | null) =>
        value ? formatCurrency(Number(value)) : "-",
    },
    {
      id: "remainingAmount",
      label: "Còn lại",
      minWidth: 150,
      align: "right",
      format: (value: string | number | null) =>
        value ? formatCurrency(Number(value)) : "-",
    },
    {
      id: "bookingStatus",
      label: "Trạng thái",
      minWidth: 150,
      align: "center",
      format: (value: string | number | null) => (
        <Chip
          label={String(value)}
          color={
            getStatusColor(String(value)) as
              | "warning"
              | "success"
              | "error"
              | "info"
              | "default"
          }
          size="small"
        />
      ),
    },
    {
      id: "paymentTerm",
      label: "Hạn thanh toán",
      minWidth: 150,
      format: (value: string | number | null) =>
        value ? formatDate(String(value)) : "-",
    },
    {
      id: "actions",
      label: "Thao tác",
      minWidth: 200,
      align: "center",
      format: (_value: string | number | null, row?: BookingResponse) => {
        if (!row) return "-";

        const status = row.bookingStatus;

        // Không hiển thị button cho các status đã hủy hoặc đang chờ xử lý hủy
        if (
          status === "PENDING_CANCELLATION" ||
          status === "CONFIRMED_CANCELLATION" ||
          status === "CANCELLED"
        ) {
          if (status === "PENDING_CANCELLATION") {
            return (
              <Typography variant="body2" color="text.secondary">
                Đang chờ xử lý hủy
              </Typography>
            );
          }
          if (status === "CONFIRMED_CANCELLATION" || status === "CANCELLED") {
            return (
              <Typography variant="body2" color="error">
                Đã hủy
              </Typography>
            );
          }
        }

        // Không hiển thị button cho các status đang chờ xử lý đổi tour
        if (status === "PENDING_CHANGE") {
          return (
            <Typography variant="body2" color="text.secondary">
              Đang chờ xử lý đổi tour
            </Typography>
          );
        }

        // Không hiển thị button cho tour đã hoàn thành
        if (status === "COMPLETED") {
          return (
            <Typography variant="body2" color="info.main">
              Đã hoàn thành
            </Typography>
          );
        }

        // Chỉ hiển thị button cho các status có thể hủy: PENDING, CONFIRMED
        return (
          <Stack direction="row" spacing={1} justifyContent="center">
            <Button
              variant="outlined"
              color="error"
              size="small"
              onClick={() => {
                navigate("/bookings-request-cancel", {
                  state: {
                    bookingId: row.bookingId,
                    action: "CANCEL",
                    booking: row,
                  },
                });
              }}
            >
              Hủy tour
            </Button>
          </Stack>
        );
      },
    },
  ];

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [bookings, setBookings] = useState<BookingResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

  const handleChangePage = (_event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  return (
    <Box sx={{ width: "100%", padding: 3 }}>
      <Typography variant="h4" component="h1" gutterBottom sx={{ mb: 3 }}>
        Danh sách Booking của tôi
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
          <Typography color="error">{error}</Typography>
        </Box>
      ) : bookings.length === 0 ? (
        <Box sx={{ p: 3, textAlign: "center" }}>
          <Typography variant="h6" color="text.secondary">
            Bạn chưa có booking nào
          </Typography>
        </Box>
      ) : (
        <Paper sx={{ width: "100%", overflow: "hidden" }}>
          <TableContainer sx={{ maxHeight: 640 }}>
            <Table stickyHeader aria-label="sticky table">
              <TableHead>
                <TableRow>
                  {columns.map((column) => (
                    <TableCell
                      key={column.id}
                      align={column.align}
                      style={{ minWidth: column.minWidth }}
                      sx={{ fontWeight: "bold", backgroundColor: "#f5f5f5" }}
                    >
                      {column.label}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {bookings
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row) => {
                    return (
                      <TableRow
                        hover
                        role="checkbox"
                        tabIndex={-1}
                        key={row.bookingId}
                      >
                        {columns.map((column) => {
                          if (column.id === "actions") {
                            return (
                              <TableCell key={column.id} align={column.align}>
                                {column.format ? column.format(null, row) : "-"}
                              </TableCell>
                            );
                          }
                          const value = row[column.id as keyof BookingResponse];
                          return (
                            <TableCell key={column.id} align={column.align}>
                              {column.format
                                ? column.format(value, row)
                                : value !== null && value !== undefined
                                ? String(value)
                                : "-"}
                            </TableCell>
                          );
                        })}
                      </TableRow>
                    );
                  })}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[10, 25, 100]}
            component="div"
            count={bookings.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            labelRowsPerPage="Số dòng mỗi trang:"
            labelDisplayedRows={({ from, to, count }) =>
              `${from}–${to} trong ${count !== -1 ? count : `nhiều hơn ${to}`}`
            }
          />
        </Paper>
      )}
    </Box>
  );
};

export default BookingPage;
