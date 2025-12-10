import React, { useEffect, useMemo, useState } from "react";
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
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Tooltip,
  Avatar,
  Dialog,
  DialogContent,
  Divider,
  LinearProgress,
  Alert,
} from "@mui/material";
import {
  Calendar,
  MapPin,
  Users,
  Tag,
  ArrowLeft,
  XCircle,
  CheckCircle,
  AlertCircle,
  RefreshCw,
  Eye,
  X,
  Sparkles,
  CreditCard,
  MessageSquare,
} from "lucide-react";
import { getBookings } from "../services/booking.services";
import type { BookingResponse } from "../services/booking.services";
import { getTourById } from "../services/tour.service";
import type { TourResponse } from "../types/tour";
import { formatDateYMD } from "../utils/date";

import ConfirmationModal from "../components/ui/ConfirmationModal";
import ReviewModal from "../components/review/ReviewModal";

const BookingPage = () => {
  const navigate = useNavigate();
  const detailFont = "'Inter', 'Segoe UI', Tahoma, sans-serif";
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const [selectedBookingId, setSelectedBookingId] = useState<string | null>(
    null
  );
  const [selectedBooking, setSelectedBooking] =
    useState<BookingResponse | null>(null);
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [detailBooking, setDetailBooking] = useState<BookingResponse | null>(
    null
  );
  const [tourDetail, setTourDetail] = useState<TourResponse | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [detailError, setDetailError] = useState<string | null>(null);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
      maximumFractionDigits: 0,
    }).format(value);
  };

  const formatDate = (dateString?: string | null, includeTime = true) =>
    formatDateYMD(dateString, { includeTime });

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

  const [page, setPage] = useState(1);
  const [bookings, setBookings] = useState<BookingResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const itemsPerPage = 6;
  const bookingStats = useMemo(() => {
    const confirmed = bookings.filter(
      (booking) => booking.bookingStatus === "CONFIRMED"
    ).length;
    const pending = bookings.filter(
      (booking) => booking.bookingStatus === "PENDING"
    ).length;
    const cancelled = bookings.filter((booking) =>
      ["CANCELLED", "CONFIRMED_CANCELLATION", "DENIED_CANCELLATION"].includes(
        booking.bookingStatus
      )
    ).length;
    const totalAmount = bookings.reduce(
      (sum, booking) => sum + booking.remainingAmount,
      0
    );

    return {
      confirmed,
      pending,
      cancelled,
      totalAmount,
    };
  }, [bookings]);

  const formattedTotalAmount = formatCurrency(bookingStats.totalAmount);
  const heroCaption =
    bookingStats.totalAmount > 0
      ? "Bao gồm tất cả booking"
      : "Chưa có booking nào - đặt tour để bắt đầu hành trình mới";

  const overviewCards = [
    {
      label: "Tổng booking",
      value: bookings.length.toString(),
      helper: bookings.length > 0 ? "Tour đã đặt" : "Bạn chưa có tour nào",
      icon: <Tag size={18} />,
      avatarBg: "rgba(37, 99, 235, 0.12)",
      avatarColor: "#1D4ED8",
      gradient: "linear-gradient(135deg, #ecf2ff 0%, #f9fbff 100%)",
    },
    {
      label: "Đã thanh toán",
      value: bookingStats.confirmed.toString(),
      helper: "Sẵn sàng khởi hành",
      icon: <CheckCircle size={18} />,
      avatarBg: "rgba(16, 185, 129, 0.12)",
      avatarColor: "#059669",
      gradient: "linear-gradient(135deg, #ecfff8 0%, #f4fffb 100%)",
    },
    {
      label: "Chưa thanh toán",
      value: bookingStats.pending.toString(),
      helper: "Cần bạn xử lý",
      icon: <AlertCircle size={18} />,
      avatarBg: "rgba(245, 158, 11, 0.12)",
      avatarColor: "#D97706",
      gradient: "linear-gradient(135deg, #fffaf0 0%, #fffaf5 100%)",
    },
    {
      label: "Đã hủy",
      value: bookingStats.cancelled.toString(),
      helper: "Không còn hiệu lực",
      icon: <XCircle size={18} />,
      avatarBg: "rgba(248, 113, 113, 0.12)",
      avatarColor: "#DC2626",
      gradient: "linear-gradient(135deg, #fff3f3 0%, #fff7f7 100%)",
    },
  ];
  const tableHeadCellSx = {
    fontWeight: 700,
    backgroundColor: "transparent",
    color: "#0F172A",
    fontSize: "0.85rem",
    borderBottom: "2px solid rgba(226, 232, 240, 0.7)",
    letterSpacing: "0.08em",
    textTransform: "uppercase",
    py: 1.5,
    px: 2,
  };
  const tableBodyCellSx = {
    borderBottom: "1px solid rgba(226, 232, 240, 0.6)",
    py: 1.25,
    px: 2,
    fontSize: "0.95rem",
  };

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

  const priceInfo = useMemo(() => {
    if (!detailBooking) return null;
    const adults = detailBooking.totalPriceAdults ?? 0;
    const children = detailBooking.totalPriceChildren ?? 0;
    const subtotal = adults + children;
    const discount = detailBooking.discountAmount ?? 0;
    const computedTotal = Math.max(0, subtotal - discount);

    const isBackendSubtotal =
      discount > 0 && detailBooking.totalPrice === subtotal;
    const isRemainingSubtotal =
      discount > 0 && detailBooking.remainingAmount === subtotal;

    return {
      subtotal,
      discount,
      computedTotal,
      displayTotal: isBackendSubtotal
        ? computedTotal
        : detailBooking.totalPrice,
      displayRemaining: isRemainingSubtotal
        ? computedTotal
        : detailBooking.remainingAmount,
    };
  }, [detailBooking]);

  const detailHeroImage =
    tourDetail?.imageUrls?.[0] ||
    detailBooking?.imageUrl ||
    "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1600&q=80";
  const activeDetailStatusConfig = detailBooking
    ? getStatusConfig(detailBooking.bookingStatus)
    : null;

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

  const handleViewDetails = async (booking: BookingResponse) => {
    setDetailBooking(booking);
    setDetailModalOpen(true);
    setDetailError(null);
    setTourDetail(null);
    try {
      setDetailLoading(true);
      const tour = await getTourById(booking.tourId);
      setTourDetail(tour);
    } catch (err) {
      console.error("Error fetching tour detail:", err);
      const message =
        err instanceof Error
          ? err.message
          : (
              err as {
                response?: { data?: { message?: string } };
              }
            )?.response?.data?.message || "Không thể tải thông tin tour";
      setDetailError(message);
    } finally {
      setDetailLoading(false);
    }
  };

  const handleCloseDetailModal = () => {
    setDetailModalOpen(false);
    setDetailBooking(null);
    setTourDetail(null);
    setDetailError(null);
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background:
          "linear-gradient(180deg, #f5f7ff 0%, #fef2ff 45%, #fef9f5 100%)",
        py: { xs: 4, md: 6 },
        px: { xs: 2, md: 4 },
        position: "relative",
      }}
    >
      <ConfirmationModal
        open={confirmModalOpen}
        onClose={() => setConfirmModalOpen(false)}
        onConfirm={() => {
          setConfirmModalOpen(false);
          const bookingToPass =
            selectedBooking ||
            bookings.find((b) => b.bookingId === selectedBookingId);
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
                onClick={() => navigate("/")}
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
              <Chip
                icon={<Sparkles size={14} />}
                label="Trải nghiệm đặt tour tinh gọn"
                sx={{
                  backgroundColor: "rgba(255, 255, 255, 0.2)",
                  color: "white",
                  fontWeight: 600,
                  mb: 2,
                  "& .MuiChip-icon": {
                    color: "inherit",
                  },
                }}
              />
              <Typography
                variant="h3"
                component="h1"
                sx={{
                  fontWeight: 800,
                  mb: 1,
                  display: "flex",
                  flexWrap: "wrap",
                  gap: 1,
                  alignItems: "baseline",
                  fontSize: { xs: "2rem", md: "2.75rem" },
                  fontFamily:
                    '"Be Vietnam Pro", "Inter", "Roboto", "Helvetica", sans-serif',
                }}
              >
                Booking của tôi
              </Typography>
              <Typography
                variant="body1"
                sx={{ color: "rgba(255, 255, 255, 0.9)", fontSize: "1.05rem" }}
              >
                Quản lý và theo dõi các tour đã đặt với giao diện tinh gọn hơn
              </Typography>
            </Box>
            <Paper
              elevation={0}
              sx={{
                px: { xs: 3, md: 4 },
                py: { xs: 3, md: 4 },
                borderRadius: "24px",
                background: "rgba(15, 23, 42, 0.35)",
                border: "1px solid rgba(255, 255, 255, 0.25)",
                color: "white",
                minWidth: { md: 320 },
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
                Giá trị booking
              </Typography>
              <Typography
                variant="h3"
                sx={{
                  fontWeight: 800,
                  mt: 1,
                  fontSize: { xs: "2.1rem", md: "2.5rem" },
                }}
              >
                {formattedTotalAmount}
              </Typography>
              <Typography
                variant="body2"
                sx={{ color: "rgba(255, 255, 255, 0.85)", mt: 1.5 }}
              >
                {heroCaption}
              </Typography>
            </Paper>
          </Stack>
        </Box>

        {/* Overview Cards */}
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              sm: "repeat(2, minmax(0, 1fr))",
              md: "repeat(4, minmax(0, 1fr))",
            },
            gap: 2,
            mb: 5,
          }}
        >
          {overviewCards.map((card) => (
            <Card
              key={card.label}
              elevation={0}
              sx={{
                height: "100%",
                borderRadius: "22px",
                background: card.gradient,
                border: "1px solid rgba(15, 23, 42, 0.05)",
                boxShadow: "0 18px 40px rgba(15, 23, 42, 0.07)",
              }}
            >
              <CardContent
                sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}
              >
                <Avatar
                  sx={{
                    backgroundColor: card.avatarBg,
                    color: card.avatarColor,
                    mb: 1.5,
                    width: 48,
                    height: 48,
                  }}
                >
                  {card.icon}
                </Avatar>
                <Typography
                  variant="body2"
                  sx={{ color: "#6B7280", fontWeight: 600 }}
                >
                  {card.label}
                </Typography>
                <Typography
                  variant="h4"
                  sx={{
                    color: "#0F172A",
                    fontWeight: 800,
                    fontSize: { xs: "1.9rem", md: "2.1rem" },
                  }}
                >
                  {card.value}
                </Typography>
                <Typography variant="body2" sx={{ color: "#94A3B8" }}>
                  {card.helper}
                </Typography>
              </CardContent>
            </Card>
          ))}
        </Box>

        {/* Content */}
        {loading ? (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              minHeight: "400px",
              background: "linear-gradient(145deg, #ffffff 0%, #f5f7ff 100%)",
              borderRadius: "28px",
              border: "1px solid rgba(148, 163, 184, 0.15)",
              boxShadow: "0 25px 60px rgba(15, 23, 42, 0.08)",
            }}
          >
            <CircularProgress size={60} sx={{ color: "#3B82F6" }} />
          </Box>
        ) : error ? (
          <Box
            sx={{
              p: 4,
              textAlign: "center",
              background: "linear-gradient(145deg, #ffffff 0%, #f5f7ff 100%)",
              borderRadius: "28px",
              border: "1px solid rgba(148, 163, 184, 0.15)",
              boxShadow: "0 25px 60px rgba(15, 23, 42, 0.08)",
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
              background: "linear-gradient(145deg, #ffffff 0%, #f5f7ff 100%)",
              borderRadius: "28px",
              border: "1px solid rgba(148, 163, 184, 0.15)",
              boxShadow: "0 25px 60px rgba(15, 23, 42, 0.08)",
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
            <Card
              sx={{
                background: "linear-gradient(145deg, #ffffff 0%, #f8fbff 100%)",
                borderRadius: "28px",
                boxShadow: "0 30px 70px rgba(15, 23, 42, 0.08)",
                border: "1px solid rgba(226, 232, 240, 0.8)",
                overflow: "hidden",
              }}
            >
              <TableContainer
                sx={{
                  "&::-webkit-scrollbar": {
                    height: 8,
                    width: 8,
                  },
                  "&::-webkit-scrollbar-thumb": {
                    borderRadius: "999px",
                    backgroundColor: "rgba(148, 163, 184, 0.6)",
                  },
                }}
              >
                <Table>
                  <TableHead
                    sx={{
                      backgroundColor: "rgba(226, 232, 240, 0.4)",
                      backdropFilter: "blur(6px)",
                    }}
                  >
                    <TableRow>
                      <TableCell sx={tableHeadCellSx}>Tour</TableCell>
                      <TableCell sx={tableHeadCellSx}>Địa điểm</TableCell>
                      <TableCell sx={tableHeadCellSx}>Ngày đặt</TableCell>
                      <TableCell sx={tableHeadCellSx}>Số người</TableCell>
                      <TableCell sx={tableHeadCellSx}>Tổng tiền</TableCell>
                      <TableCell sx={tableHeadCellSx}>Trạng thái</TableCell>
                      <TableCell
                        sx={{ ...tableHeadCellSx, textAlign: "center" }}
                      >
                        Thao tác
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {paginatedBookings.map((booking) => {
                      const statusConfig = getStatusConfig(
                        booking.bookingStatus
                      );
                      return (
                        <TableRow
                          key={booking.bookingId}
                          sx={{
                            "&:hover": {
                              backgroundColor: "rgba(37, 99, 235, 0.05)",
                              boxShadow:
                                "inset 0 0 0 1px rgba(37, 99, 235, 0.08)",
                            },
                            "&:last-of-type td": {
                              borderBottom: "none",
                            },
                            "& td": {
                              fontSize: "0.95rem",
                            },
                            minHeight: 68,
                            transition: "all 0.25s ease",
                          }}
                        >
                          <TableCell sx={tableBodyCellSx}>
                            <Typography
                              variant="body2"
                              sx={{
                                fontWeight: 600,
                                color: "#1F2937",
                                maxWidth: "200px",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                whiteSpace: "nowrap",
                              }}
                            >
                              {booking.tourTitle}
                            </Typography>
                          </TableCell>
                          <TableCell sx={tableBodyCellSx}>
                            <Box
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                gap: 0.5,
                              }}
                            >
                              <MapPin size={16} style={{ color: "#6B7280" }} />
                              <Typography
                                variant="body2"
                                color="text.secondary"
                              >
                                {booking.tourDestination}
                              </Typography>
                            </Box>
                          </TableCell>
                          <TableCell sx={tableBodyCellSx}>
                            <Box
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                gap: 0.5,
                              }}
                            >
                              <Calendar
                                size={16}
                                style={{ color: "#6B7280" }}
                              />
                              <Typography
                                variant="body2"
                                color="text.secondary"
                              >
                                {formatDate(booking.bookingDate)}
                              </Typography>
                            </Box>
                          </TableCell>
                          <TableCell sx={tableBodyCellSx}>
                            <Box
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                gap: 0.5,
                              }}
                            >
                              <Users size={16} style={{ color: "#6B7280" }} />
                              <Typography
                                variant="body2"
                                color="text.secondary"
                              >
                                {booking.numOfAdults} người lớn
                                {booking.numOfChildren > 0 &&
                                  `, ${booking.numOfChildren} trẻ em`}
                              </Typography>
                            </Box>
                          </TableCell>
                          <TableCell sx={tableBodyCellSx}>
                            <Typography
                              variant="body2"
                              sx={{ fontWeight: 700, color: "#10B981" }}
                            >
                              {formatCurrency(booking.remainingAmount)}
                            </Typography>
                          </TableCell>
                          <TableCell sx={tableBodyCellSx}>
                            <Chip
                              icon={statusConfig.icon}
                              label={statusConfig.label}
                              sx={{
                                background: statusConfig.bgGradient,
                                color: statusConfig.color,
                                fontWeight: 600,
                                borderRadius: "8px",
                                height: "28px",
                                fontSize: "0.75rem",
                                boxShadow: "0 6px 14px rgba(15, 23, 42, 0.08)",
                              }}
                            />
                          </TableCell>
                          <TableCell
                            sx={{ ...tableBodyCellSx, textAlign: "center" }}
                          >
                            <Stack
                              direction="row"
                              spacing={1}
                              justifyContent="center"
                            >
                              {booking.bookingStatus === "PENDING" && (
                                <Tooltip title="Thanh toán">
                                  <IconButton
                                    size="small"
                                    onClick={() => {
                                      navigate(
                                        `/payment-later/${booking.bookingId}`
                                      );
                                    }}
                                    sx={{
                                      color: "#0EA5E9",
                                      "&:hover": {
                                        backgroundColor:
                                          "rgba(14, 165, 233, 0.12)",
                                      },
                                    }}
                                  >
                                    <CreditCard size={18} />
                                  </IconButton>
                                </Tooltip>
                              )}
                              <Tooltip title="Xem chi tiết">
                                <IconButton
                                  size="small"
                                  onClick={() => handleViewDetails(booking)}
                                  sx={{
                                    color: "#3B82F6",
                                    "&:hover": {
                                      backgroundColor:
                                        "rgba(59, 130, 246, 0.1)",
                                    },
                                  }}
                                >
                                  <Eye size={18} />
                                </IconButton>
                              </Tooltip>
                              {canCancel(booking.bookingStatus) && (
                                <Tooltip title="Hủy tour">
                                  <IconButton
                                    size="small"
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
                                      color: "#EF4444",
                                      "&:hover": {
                                        backgroundColor:
                                          "rgba(239, 68, 68, 0.1)",
                                      },
                                    }}
                                  >
                                    <XCircle size={18} />
                                  </IconButton>
                                </Tooltip>
                              )}
                              {canChange(booking.bookingStatus) && (
                                <Tooltip title="Đổi tour">
                                  <IconButton
                                    size="small"
                                    onClick={() => {
                                      setConfirmModalOpen(true);
                                      setSelectedBookingId(booking.bookingId);
                                      setSelectedBooking(booking);
                                    }}
                                    sx={{
                                      color: "#3B82F6",
                                      "&:hover": {
                                        backgroundColor:
                                          "rgba(59, 130, 246, 0.1)",
                                      },
                                    }}
                                  >
                                    <RefreshCw size={18} />
                                  </IconButton>
                                </Tooltip>
                              )}
                            </Stack>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </TableContainer>
            </Card>

            {/* Pagination */}
            {bookings.length > itemsPerPage && (
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  mt: 4,
                  background:
                    "linear-gradient(145deg, #ffffff 0%, #f5f7ff 100%)",
                  borderRadius: "20px",
                  p: 2,
                  border: "1px solid rgba(226, 232, 240, 0.8)",
                  boxShadow: "0 18px 35px rgba(15, 23, 42, 0.08)",
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
      <Dialog
        open={detailModalOpen}
        onClose={handleCloseDetailModal}
        fullWidth
        maxWidth="md"
        PaperProps={{
          sx: {
            borderRadius: "28px",
            background: "linear-gradient(180deg, #f9fbff 0%, #ffffff 100%)",
            boxShadow: "0 35px 80px rgba(15, 23, 42, 0.25)",
            overflow: "hidden",
          },
        }}
      >
        {detailBooking && (
          <DialogContent sx={{ p: 0, fontFamily: detailFont }}>
            <Box>
              <Box
                sx={{
                  position: "relative",
                  height: { xs: 220, md: 260 },
                  backgroundImage: `url(${detailHeroImage})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              >
                <Box
                  sx={{
                    position: "absolute",
                    inset: 0,
                    background:
                      "linear-gradient(135deg, rgba(15,23,42,0.8) 0%, rgba(15,23,42,0.35) 70%)",
                  }}
                />
                <IconButton
                  onClick={handleCloseDetailModal}
                  sx={{
                    position: "absolute",
                    top: 16,
                    right: 16,
                    color: "white",
                    backgroundColor: "rgba(255,255,255,0.15)",
                    "&:hover": {
                      backgroundColor: "rgba(255,255,255,0.25)",
                    },
                  }}
                >
                  <X size={18} />
                </IconButton>
                <Box
                  sx={{
                    position: "absolute",
                    inset: 0,
                    color: "white",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "flex-end",
                    p: { xs: 3, md: 4 },
                    gap: 1,
                  }}
                >
                  {activeDetailStatusConfig && (
                    <Chip
                      icon={activeDetailStatusConfig.icon}
                      label={activeDetailStatusConfig.label}
                      sx={{
                        alignSelf: "flex-start",
                        background: activeDetailStatusConfig.bgGradient,
                        color: activeDetailStatusConfig.color,
                        fontWeight: 600,
                        borderRadius: "10px",
                        mb: 1,
                        boxShadow: "0 10px 25px rgba(15,23,42,0.35)",
                        border: "1px solid rgba(255,255,255,0.2)",
                        "& .MuiChip-icon": {
                          color: activeDetailStatusConfig.color,
                        },
                      }}
                    />
                  )}
                  <Typography
                    variant="h4"
                    sx={{
                      fontWeight: 800,
                      textShadow: "0 10px 35px rgba(0,0,0,0.45)",
                    }}
                  >
                    {tourDetail?.title || detailBooking.tourTitle}
                  </Typography>
                  <Stack direction="row" spacing={2} flexWrap="wrap">
                    <Stack direction="row" spacing={0.5} alignItems="center">
                      <MapPin size={16} />
                      <Typography variant="body2">
                        {tourDetail?.destination ||
                          detailBooking.tourDestination}
                      </Typography>
                    </Stack>
                    <Stack direction="row" spacing={0.5} alignItems="center">
                      <Calendar size={16} />
                      <Typography variant="body2">
                        {tourDetail?.duration || detailBooking.tourDuration}
                      </Typography>
                    </Stack>
                  </Stack>
                </Box>
              </Box>
              {detailLoading && (
                <LinearProgress
                  sx={{
                    height: 4,
                    borderRadius: "999px",
                    backgroundColor: "rgba(226, 232, 240, 0.6)",
                    "& .MuiLinearProgress-bar": {
                      background:
                        "linear-gradient(135deg, #3B82F6 0%, #7C3AED 100%)",
                    },
                  }}
                />
              )}
              <Box
                sx={{
                  p: { xs: 3, md: 4 },
                  display: "flex",
                  flexDirection: "column",
                  gap: 3,
                }}
              >
                {detailError && (
                  <Alert severity="error" sx={{ borderRadius: "12px" }}>
                    {detailError}
                  </Alert>
                )}
                <Stack
                  direction={{ xs: "column", md: "row" }}
                  spacing={3}
                  alignItems={{ md: "center" }}
                  justifyContent="space-between"
                >
                  <Box>
                    <Typography
                      variant="h6"
                      sx={{ fontWeight: 700, color: "#0F172A" }}
                    >
                      Chi tiết booking
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Mã: {detailBooking.bookingId}
                    </Typography>
                  </Box>
                  <Stack direction="row" spacing={2}>
                    <Box>
                      <Typography
                        variant="overline"
                        sx={{ color: "#94A3B8", letterSpacing: "0.1em" }}
                      >
                        Tổng thanh toán
                      </Typography>
                      <Typography
                        variant="h5"
                        sx={{ fontWeight: 800, color: "#10B981" }}
                      >
                        {formatCurrency(
                          priceInfo?.displayTotal ?? detailBooking.totalPrice
                        )}
                      </Typography>
                    </Box>
                    <Divider orientation="vertical" flexItem />
                    <Box>
                      <Typography
                        variant="overline"
                        sx={{ color: "#94A3B8", letterSpacing: "0.1em" }}
                      >
                        Còn lại
                      </Typography>
                      <Typography
                        variant="h6"
                        sx={{ fontWeight: 700, color: "#2563EB" }}
                      >
                        {formatCurrency(
                          priceInfo?.displayRemaining ??
                            detailBooking.remainingAmount
                        )}
                      </Typography>
                    </Box>
                  </Stack>
                </Stack>
                <Box
                  sx={{
                    display: "grid",
                    gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
                    gap: 3,
                  }}
                >
                  <Box
                    sx={{
                      border: "1px solid rgba(226, 232, 240, 0.8)",
                      borderRadius: "20px",
                      background: "linear-gradient(180deg, #f9fbff, #fefefe)",
                      p: 3,
                      display: "flex",
                      flexDirection: "column",
                      gap: 1.5,
                    }}
                  >
                    <Typography
                      variant="subtitle1"
                      sx={{ fontWeight: 700, color: "#0F172A" }}
                    >
                      Thông tin tour
                    </Typography>
                    <Stack spacing={1.2}>
                      <Stack direction="row" spacing={1} alignItems="center">
                        <MapPin size={16} color="#64748B" />
                        <Typography variant="body2" color="text.secondary">
                          {tourDetail?.destination ||
                            detailBooking.tourDestination}
                        </Typography>
                      </Stack>
                      {tourDetail?.duration || detailBooking.tourDuration ? (
                        <Stack direction="row" spacing={1} alignItems="center">
                          <Calendar size={16} color="#64748B" />
                          <Typography variant="body2" color="text.secondary">
                            {tourDetail?.duration || detailBooking.tourDuration}
                          </Typography>
                        </Stack>
                      ) : null}
                      {tourDetail?.startDate && (
                        <Stack direction="row" spacing={1} alignItems="center">
                          <Calendar size={16} color="#64748B" />
                          <Typography variant="body2" color="text.secondary">
                            Bắt đầu: {formatDate(tourDetail.startDate, false)}
                          </Typography>
                        </Stack>
                      )}
                      {tourDetail?.endDate && (
                        <Stack direction="row" spacing={1} alignItems="center">
                          <Calendar size={16} color="#64748B" />
                          <Typography variant="body2" color="text.secondary">
                            Kết thúc: {formatDate(tourDetail.endDate, false)}
                          </Typography>
                        </Stack>
                      )}
                    </Stack>
                    {tourDetail?.itinerary &&
                      tourDetail.itinerary.length > 0 && (
                        <Box sx={{ mt: 1 }}>
                          <Typography
                            variant="body2"
                            sx={{ fontWeight: 600, color: "#1F2937", mb: 0.5 }}
                          >
                            Lịch trình nổi bật
                          </Typography>
                          <Box
                            component="ul"
                            sx={{
                              m: 0,
                              pl: 3,
                              color: "#64748B",
                              fontSize: "0.9rem",
                            }}
                          >
                            {tourDetail.itinerary
                              .slice(0, 4)
                              .map((item, index) => (
                                <Box
                                  component="li"
                                  key={index}
                                  sx={{ mb: 0.5 }}
                                >
                                  {item}
                                </Box>
                              ))}
                            {tourDetail.itinerary.length > 4 && (
                              <Box
                                component="li"
                                sx={{ listStyle: "none", color: "#94A3B8" }}
                              >
                                +{tourDetail.itinerary.length - 4} hoạt động
                                khác
                              </Box>
                            )}
                          </Box>
                        </Box>
                      )}
                  </Box>
                  <Box
                    sx={{
                      border: "1px solid rgba(226, 232, 240, 0.8)",
                      borderRadius: "20px",
                      background: "linear-gradient(180deg, #fefaff, #ffffff)",
                      p: 3,
                      display: "flex",
                      flexDirection: "column",
                      gap: 1.5,
                    }}
                  >
                    <Typography
                      variant="subtitle1"
                      sx={{ fontWeight: 700, color: "#0F172A" }}
                    >
                      Thông tin đặt chỗ
                    </Typography>
                    <Stack spacing={1.2}>
                      <Stack direction="row" spacing={1} alignItems="center">
                        <Calendar size={16} color="#64748B" />
                        <Typography variant="body2" color="text.secondary">
                          Đặt lúc: {formatDate(detailBooking.bookingDate)}
                        </Typography>
                      </Stack>
                      <Stack direction="row" spacing={1} alignItems="center">
                        <Users size={16} color="#64748B" />
                        <Typography variant="body2" color="text.secondary">
                          {detailBooking.numOfAdults} người lớn
                          {detailBooking.numOfChildren > 0 &&
                            `, ${detailBooking.numOfChildren} trẻ em`}
                        </Typography>
                      </Stack>
                      <Typography variant="body2" color="text.secondary">
                        Người đặt: {detailBooking.name}
                      </Typography>
                      {detailBooking.phone && (
                        <Typography variant="body2" color="text.secondary">
                          Điện thoại: {detailBooking.phone}
                        </Typography>
                      )}
                      {detailBooking.email && (
                        <Typography variant="body2" color="text.secondary">
                          Email: {detailBooking.email}
                        </Typography>
                      )}
                      {detailBooking.note && (
                        <Typography variant="body2" color="text.secondary">
                          Ghi chú: {detailBooking.note}
                        </Typography>
                      )}
                    </Stack>
                    <Divider sx={{ my: 1.5 }} />
                    <Box
                      sx={{
                        display: "grid",
                        gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
                        gap: 1.5,
                      }}
                    >
                      <Box>
                        <Typography variant="caption" color="text.secondary">
                          Tiền người lớn
                        </Typography>
                        <Typography sx={{ fontWeight: 600, color: "#0F172A" }}>
                          {formatCurrency(detailBooking.totalPriceAdults)}
                        </Typography>
                      </Box>
                      <Box>
                        <Typography variant="caption" color="text.secondary">
                          Tiền trẻ em
                        </Typography>
                        <Typography sx={{ fontWeight: 600, color: "#0F172A" }}>
                          {formatCurrency(detailBooking.totalPriceChildren)}
                        </Typography>
                      </Box>
                      <Box>
                        <Typography variant="caption" color="text.secondary">
                          Ưu đãi
                        </Typography>
                        <Typography sx={{ fontWeight: 600, color: "#EF4444" }}>
                          -{formatCurrency(detailBooking.discountAmount)}
                        </Typography>
                      </Box>
                      <Box>
                        <Typography variant="caption" color="text.secondary">
                          Thời hạn thanh toán
                        </Typography>
                        <Typography sx={{ fontWeight: 600, color: "#2563EB" }}>
                          {detailBooking.paymentTerm}
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                  {/* --- BẮT ĐẦU PHẦN NÚT ĐÁNH GIÁ (CHÈN VÀO ĐÂY) --- */}
                  {detailBooking.bookingStatus === "COMPLETED" && (
                    <Box
                      sx={{
                        mt: 3,
                        pt: 3,
                        borderTop: "1px solid rgba(226, 232, 240, 0.8)",
                        display: "flex",
                        justifyContent: "flex-start", // Căn phải cho chuyên nghiệp
                        alignItems: "center",
                      }}
                    >
                      <Button
                        variant="contained"
                        startIcon={<MessageSquare size={18} />}
                        onClick={() => setReviewModalOpen(true)}
                        sx={{
                          borderRadius: "12px",
                          textTransform: "none",
                          px: 4,
                          py: 1.2,
                          fontWeight: 600,
                          fontSize: "0.95rem",
                          background:
                            "linear-gradient(135deg, #8B5CF6 0%, #7C3AED 100%)",
                          boxShadow: "0 4px 14px rgba(139, 92, 246, 0.4)",
                          transition: "all 0.3s ease",
                          "&:hover": {
                            background:
                              "linear-gradient(135deg, #7C3AED 0%, #6D28D9 100%)",
                            transform: "translateY(-2px)",
                            boxShadow: "0 6px 20px rgba(139, 92, 246, 0.6)",
                          },
                          "&:active": {
                            transform: "translateY(0)",
                          },
                        }}
                      >
                        Viết đánh giá trải nghiệm
                      </Button>
                    </Box>
                  )}
                  {/* --- KẾT THÚC PHẦN NÚT ĐÁNH GIÁ --- */}
                </Box>
                {detailBooking && (
                  <ReviewModal
                    open={reviewModalOpen}
                    onClose={() => setReviewModalOpen(false)}
                    bookingId={detailBooking.bookingId}
                    tourTitle={detailBooking.tourTitle}
                  />
                )}
              </Box>
            </Box>
          </DialogContent>
        )}
      </Dialog>
    </Box>
  );
};

export default BookingPage;
