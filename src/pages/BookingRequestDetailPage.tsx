import { useState, useEffect, useCallback } from "react";
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
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Skeleton,
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
  MapPin,
  Image as ImageIcon,
  DollarSign,
  Sparkles,
  Users,
} from "lucide-react";
import {
  getBookingRequestById,
  updateBookingRequestStatus,
  type BookingRequestResponse,
} from "../services/bookingRequest.services";
import { getTourById } from "../services/tour.service";
import type { TourResponse } from "../types/tour";
import toast from "react-hot-toast";
import { formatDateYMD } from "../utils/date";

const BookingRequestDetailPage = () => {
  const { requestId } = useParams<{ requestId: string }>();
  const navigate = useNavigate();
  const [request, setRequest] = useState<BookingRequestResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [oldTour, setOldTour] = useState<TourResponse | null>(null);
  const [newTour, setNewTour] = useState<TourResponse | null>(null);
  const [tourLoading, setTourLoading] = useState(false);
  const [tourError, setTourError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
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
  }, [requestId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    let cancelled = false;
    const fetchTours = async () => {
      if (!request) {
        setOldTour(null);
        setNewTour(null);
        return;
      }
      if (!request.oldTourId && !request.newTourId) {
        setOldTour(null);
        setNewTour(null);
        return;
      }
      try {
        setTourLoading(true);
        setTourError(null);
        const [oldData, newData] = await Promise.all([
          request.oldTourId
            ? getTourById(request.oldTourId).catch(() => null)
            : Promise.resolve(null),
          request.newTourId
            ? getTourById(request.newTourId).catch(() => null)
            : Promise.resolve(null),
        ]);
        if (cancelled) return;
        setOldTour(oldData);
        setNewTour(newData);
      } catch (err) {
        if (cancelled) return;
        console.error("Error fetching tour detail:", err);
        const errorMessage =
          err instanceof Error
            ? err.message
            : (err as { response?: { data?: { message?: string } } }).response
                ?.data?.message || "Không thể tải thông tin tour";
        setTourError(errorMessage);
      } finally {
        if (!cancelled) {
          setTourLoading(false);
        }
      }
    };

    fetchTours();
    return () => {
      cancelled = true;
    };
  }, [request]);

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

  const handleDenyClick = () => {
    setConfirmDialogOpen(true);
  };

  const handleDenyConfirm = async () => {
    if (!requestId || !request) return;

    setConfirmDialogOpen(false);

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

  const formatDate = (dateString?: string | null) =>
    formatDateYMD(dateString, { includeTime: true });
  const formatDateCompact = (dateString?: string | null) =>
    formatDateYMD(dateString, { includeTime: false });
  const formatCurrency = (value?: number | null) =>
    new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(value ?? 0);
  const heroFallbackImage =
    "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1400&q=80";

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

  const renderTourCard = (
    tour: TourResponse | null,
    variant: "old" | "new"
  ) => {
    const variantConfig = {
      old: {
        label: "Tour hiện tại",
        color: "#fb923c",
        gradient: "linear-gradient(135deg, #f97316 0%, #fb923c 100%)",
      },
      new: {
        label: "Tour đề xuất",
        color: "#38bdf8",
        gradient: "linear-gradient(135deg, #2563eb 0%, #38bdf8 100%)",
      },
    }[variant];

    if (tourLoading && !tour) {
      return (
        <Card
          sx={{
            borderRadius: 3,
            overflow: "hidden",
            boxShadow: "0 18px 45px rgba(15, 23, 42, 0.15)",
          }}
        >
          <Skeleton variant="rectangular" height={220} animation="wave" />
          <CardContent>
            <Skeleton variant="text" height={36} width="80%" sx={{ mb: 1.5 }} />
            <Skeleton variant="text" width="60%" />
            <Skeleton variant="rounded" height={80} sx={{ mt: 2 }} />
          </CardContent>
        </Card>
      );
    }

    if (!tour) {
      return (
        <Card
          sx={{
            borderRadius: 3,
            border: "1px dashed rgba(148, 163, 184, 0.6)",
            background: "linear-gradient(135deg, #f8fafc, #f1f5f9)",
            minHeight: 220,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center",
          }}
        >
          <CardContent>
            <ImageIcon size={32} color="#94a3b8" />
            <Typography variant="subtitle1" sx={{ mt: 2, fontWeight: 600 }}>
              Chưa có dữ liệu tour
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Không tìm thấy thông tin tour tương ứng
            </Typography>
          </CardContent>
        </Card>
      );
    }

    const coverImage =
      tour.imageUrls?.[0] ||
      `https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80&sig=${tour.tourId}`;

    return (
      <Card
        sx={{
          borderRadius: 3,
          overflow: "hidden",
          boxShadow: "0 18px 45px rgba(15, 23, 42, 0.15)",
          position: "relative",
        }}
      >
        <Box
          sx={{
            position: "relative",
            height: 220,
            overflow: "hidden",
          }}
        >
          <Box
            component="img"
            src={coverImage}
            alt={tour.title}
            sx={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              filter: "brightness(0.85)",
            }}
          />
          <Box
            sx={{
              position: "absolute",
              inset: 0,
              background:
                "linear-gradient(180deg, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.65) 100%)",
            }}
          />
          <Chip
            label={variantConfig.label}
            sx={{
              position: "absolute",
              top: 16,
              left: 16,
              background: variantConfig.gradient,
              color: "#fff",
              fontWeight: 600,
            }}
          />
          <Chip
            icon={<Sparkles size={14} />}
            label={tour.tourStatus}
            sx={{
              position: "absolute",
              top: 16,
              right: 16,
              bgcolor: "rgba(255,255,255,0.15)",
              color: "white",
              border: "1px solid rgba(255,255,255,0.3)",
              textTransform: "uppercase",
              letterSpacing: 1,
            }}
          />
          <Box
            sx={{
              position: "absolute",
              bottom: 16,
              left: 16,
              right: 16,
              color: "white",
            }}
          >
            <Typography
              variant="h6"
              sx={{ fontWeight: 700, lineHeight: 1.3, mb: 1 }}
            >
              {tour.title}
            </Typography>
            <Stack direction="row" spacing={1} alignItems="center">
              <MapPin size={16} />
              <Typography variant="body2">{tour.destination}</Typography>
            </Stack>
          </Box>
        </Box>
        <CardContent sx={{ p: 3 }}>
          <Stack spacing={2}>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ lineHeight: 1.6 }}
            >
              {tour.description}
            </Typography>
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: {
                  xs: "1fr",
                  sm: "repeat(2, minmax(0, 1fr))",
                },
                gap: 2,
              }}
            >
              <Paper
                elevation={0}
                sx={{
                  p: 2,
                  borderRadius: 2,
                  border: "1px solid rgba(99, 102, 241, 0.2)",
                }}
              >
                <Stack direction="row" spacing={1} alignItems="center">
                  <Calendar size={18} color="#6366f1" />
                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      Ngày khởi hành
                    </Typography>
                    <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                      {formatDateCompact(tour.startDate)}
                    </Typography>
                  </Box>
                </Stack>
              </Paper>
              <Paper
                elevation={0}
                sx={{
                  p: 2,
                  borderRadius: 2,
                  border: "1px solid rgba(16, 185, 129, 0.2)",
                }}
              >
                <Stack direction="row" spacing={1} alignItems="center">
                  <Calendar size={18} color="#10b981" />
                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      Ngày kết thúc
                    </Typography>
                    <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                      {formatDateCompact(tour.endDate)}
                    </Typography>
                  </Box>
                </Stack>
              </Paper>
              <Paper
                elevation={0}
                sx={{
                  p: 2,
                  borderRadius: 2,
                  border: "1px solid rgba(14, 165, 233, 0.2)",
                }}
              >
                <Stack direction="row" spacing={1} alignItems="center">
                  <DollarSign size={18} color="#0ea5e9" />
                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      Giá người lớn
                    </Typography>
                    <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                      {formatCurrency(tour.priceAdult)}
                    </Typography>
                  </Box>
                </Stack>
              </Paper>
              <Paper
                elevation={0}
                sx={{
                  p: 2,
                  borderRadius: 2,
                  border: "1px solid rgba(249, 115, 22, 0.2)",
                }}
              >
                <Stack direction="row" spacing={1} alignItems="center">
                  <Users size={18} color="#f97316" />
                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      Số chỗ còn lại
                    </Typography>
                    <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                      {tour.quantity}/{tour.initialQuantity}
                    </Typography>
                  </Box>
                </Stack>
              </Paper>
            </Box>
          </Stack>
        </CardContent>
      </Card>
    );
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
  const heroTour =
    request.requestType === "CHANGE"
      ? newTour ?? oldTour ?? newTour
      : oldTour ?? newTour;
  const heroImage =
    heroTour?.imageUrls?.[0] ??
    newTour?.imageUrls?.[0] ??
    oldTour?.imageUrls?.[0] ??
    heroFallbackImage;
  const heroSubtitle = heroTour?.destination ?? "Điểm đến đang cập nhật";
  const heroDuration = heroTour?.duration ?? "Thời lượng cập nhật sau";
  const heroSlots = heroTour
    ? `${heroTour.quantity}/${heroTour.initialQuantity}`
    : "N/A";
  const shouldShowTourGrid =
    Boolean(request.oldTourId) || Boolean(request.newTourId) || tourLoading;

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

      {tourError && (
        <Alert
          severity="warning"
          sx={{ mb: 3 }}
          action={
            <IconButton
              aria-label="close"
              color="inherit"
              size="small"
              onClick={() => setTourError(null)}
            >
              <XCircle size={18} />
            </IconButton>
          }
        >
          {tourError}
        </Alert>
      )}

      <Box sx={{ mb: 4 }}>
        <Box
          sx={{
            borderRadius: 4,
            overflow: "hidden",
            position: "relative",
            minHeight: { xs: 260, md: 360 },
            boxShadow: "0 30px 60px rgba(15, 23, 42, 0.35)",
            backgroundColor: "#0f172a",
          }}
        >
          {heroTour ? (
            <>
              <Box
                component="img"
                src={heroImage}
                alt={heroTour.title}
                sx={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  filter: "brightness(0.75)",
                }}
              />
              <Box
                sx={{
                  position: "absolute",
                  inset: 0,
                  background:
                    "linear-gradient(120deg, rgba(15, 23, 42, 0.85) 0%, rgba(30, 64, 175, 0.25) 60%, rgba(59, 130, 246, 0.4) 100%)",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  p: { xs: 3, md: 5 },
                  color: "white",
                }}
              >
                <Stack
                  direction="row"
                  spacing={1.5}
                  alignItems="center"
                  flexWrap="wrap"
                  useFlexGap
                >
                  <Chip
                    icon={<TypeIcon size={16} />}
                    label={typeConfig.label}
                    sx={{
                      color: typeConfig.textColor,
                      backgroundColor: "rgba(255,255,255,0.95)",
                      fontWeight: 700,
                    }}
                  />
                  <Chip
                    icon={<StatusIcon size={16} />}
                    label={statusConfig.label}
                    sx={{
                      color: statusConfig.textColor,
                      backgroundColor: "rgba(255,255,255,0.95)",
                      fontWeight: 700,
                    }}
                  />
                  <Chip
                    label={request.requestId.slice(0, 8)}
                    sx={{
                      color: "white",
                      backgroundColor: "rgba(255,255,255,0.15)",
                      border: "1px solid rgba(255,255,255,0.25)",
                      fontFamily: "monospace",
                    }}
                  />
                  {request.promotionId && (
                    <Chip
                      icon={<DollarSign size={16} />}
                      label={`Promotion • ${request.promotionId}`}
                      sx={{
                        color: "white",
                        border: "1px solid rgba(255,255,255,0.3)",
                        backgroundColor: "transparent",
                        fontWeight: 600,
                      }}
                    />
                  )}
                </Stack>
                <Box>
                  <Typography
                    variant="overline"
                    sx={{ letterSpacing: 4, opacity: 0.8 }}
                  >
                    THÔNG TIN YÊU CẦU
                  </Typography>
                  <Typography
                    variant="h3"
                    sx={{
                      fontWeight: 800,
                      lineHeight: 1.2,
                      mt: 1,
                    }}
                  >
                    {heroTour.title}
                  </Typography>
                  <Stack
                    direction={{ xs: "column", md: "row" }}
                    spacing={3}
                    mt={3}
                    divider={
                      <Divider
                        orientation="vertical"
                        flexItem
                        sx={{
                          borderColor: "rgba(255,255,255,0.2)",
                          display: { xs: "none", md: "block" },
                        }}
                      />
                    }
                  >
                    <Stack spacing={0.5}>
                      <Typography variant="caption" sx={{ opacity: 0.7 }}>
                        Điểm đến
                      </Typography>
                      <Stack direction="row" spacing={1} alignItems="center">
                        <MapPin size={16} />
                        <Typography variant="h6">{heroSubtitle}</Typography>
                      </Stack>
                    </Stack>
                    <Stack spacing={0.5}>
                      <Typography variant="caption" sx={{ opacity: 0.7 }}>
                        Thời lượng
                      </Typography>
                      <Stack direction="row" spacing={1} alignItems="center">
                        <Clock size={16} />
                        <Typography variant="h6">{heroDuration}</Typography>
                      </Stack>
                    </Stack>
                    <Stack spacing={0.5}>
                      <Typography variant="caption" sx={{ opacity: 0.7 }}>
                        Số chỗ còn
                      </Typography>
                      <Stack direction="row" spacing={1} alignItems="center">
                        <Users size={16} />
                        <Typography variant="h6">{heroSlots}</Typography>
                      </Stack>
                    </Stack>
                  </Stack>
                </Box>
                <Stack
                  direction={{ xs: "column", md: "row" }}
                  spacing={2}
                  justifyContent="space-between"
                  alignItems={{ xs: "flex-start", md: "center" }}
                >
                  <Stack direction="row" spacing={2} flexWrap="wrap" useFlexGap>
                    <Box>
                      <Typography variant="caption" sx={{ opacity: 0.7 }}>
                        Ngày tạo yêu cầu
                      </Typography>
                      <Typography variant="body1" sx={{ fontWeight: 600 }}>
                        {formatDate(request.createdAt)}
                      </Typography>
                    </Box>
                    {request.reviewedAt && (
                      <Box>
                        <Typography variant="caption" sx={{ opacity: 0.7 }}>
                          Ngày xử lý gần nhất
                        </Typography>
                        <Typography variant="body1" sx={{ fontWeight: 600 }}>
                          {formatDate(request.reviewedAt)}
                        </Typography>
                      </Box>
                    )}
                  </Stack>
                </Stack>
              </Box>
            </>
          ) : (
            <Skeleton variant="rectangular" height="100%" width="100%" />
          )}
        </Box>
      </Box>

      {shouldShowTourGrid && (
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              md: request.newTourId ? "repeat(2, minmax(0, 1fr))" : "1fr",
            },
            gap: { xs: 3, md: 4 },
            mb: 4,
          }}
        >
          <Box>{renderTourCard(oldTour, "old")}</Box>
          {request.newTourId && <Box>{renderTourCard(newTour, "new")}</Box>}
        </Box>
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

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", md: "repeat(2, minmax(0, 1fr))" },
          gap: 3,
        }}
      >
        {/* Request Info */}
        <Box>
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
        </Box>

        {/* Booking Info */}
        <Box>
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
                  <Stack
                    direction="row"
                    spacing={2}
                    alignItems="center"
                    sx={{ mt: 0.75 }}
                  >
                    <Box
                      component="img"
                      src={oldTour?.imageUrls?.[0] ?? heroFallbackImage}
                      alt={oldTour?.title ?? "Old tour"}
                      sx={{
                        width: 56,
                        height: 56,
                        borderRadius: 2,
                        objectFit: "cover",
                        boxShadow: "0 8px 18px rgba(15,23,42,0.25)",
                      }}
                    />
                    <Box>
                      <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                        {oldTour?.title ?? "Chưa có dữ liệu"}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Mã tour: {request.oldTourId}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Khởi hành: {formatDateCompact(oldTour?.startDate)}
                      </Typography>
                    </Box>
                  </Stack>
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
                    <Stack
                      direction="row"
                      spacing={2}
                      alignItems="center"
                      sx={{ mt: 0.75 }}
                    >
                      <Box
                        component="img"
                        src={newTour?.imageUrls?.[0] ?? heroFallbackImage}
                        alt={newTour?.title ?? "New tour"}
                        sx={{
                          width: 56,
                          height: 56,
                          borderRadius: 2,
                          objectFit: "cover",
                          boxShadow: "0 8px 18px rgba(37,99,235,0.3)",
                        }}
                      />
                      <Box>
                        <Typography
                          variant="subtitle2"
                          sx={{ fontWeight: 700, color: "#2563eb" }}
                        >
                          {newTour?.title ?? "Chưa có dữ liệu"}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Mã tour: {request.newTourId}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          Khởi hành: {formatDateCompact(newTour?.startDate)}
                        </Typography>
                      </Box>
                    </Stack>
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
        </Box>

        {/* Actions */}
        {canAcceptDeny && (
          <Box>
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
                    onClick={handleDenyClick}
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
          </Box>
        )}

        {!canAcceptDeny && (
          <Box>
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
          </Box>
        )}
      </Box>

      {/* Custom Confirmation Dialog */}
      <Dialog
        open={confirmDialogOpen}
        onClose={() => setConfirmDialogOpen(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: "24px",
            background: "rgba(255, 255, 255, 0.98)",
            backdropFilter: "blur(10px)",
            boxShadow: "0 20px 60px rgba(0, 0, 0, 0.3)",
            border: "1px solid rgba(255, 255, 255, 0.3)",
          },
        }}
      >
        <Box
          sx={{
            background: "linear-gradient(135deg, #EF4444 0%, #DC2626 100%)",
            p: 3,
            borderRadius: "24px 24px 0 0",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            mb: 2,
          }}
        >
          <Box
            sx={{
              width: 64,
              height: 64,
              borderRadius: "50%",
              background: "rgba(255, 255, 255, 0.2)",
              backdropFilter: "blur(10px)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              border: "2px solid rgba(255, 255, 255, 0.3)",
            }}
          >
            <XCircle size={32} color="white" />
          </Box>
        </Box>

        <DialogTitle
          sx={{
            textAlign: "center",
            pb: 1,
            pt: 0,
          }}
        >
          <Typography
            variant="h5"
            sx={{
              fontWeight: 800,
              background: "linear-gradient(135deg, #EF4444 0%, #DC2626 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            Xác nhận từ chối
          </Typography>
        </DialogTitle>

        <DialogContent sx={{ textAlign: "center", px: 4, pb: 2 }}>
          <Typography
            variant="body1"
            sx={{
              color: "text.secondary",
              fontSize: "1.1rem",
              lineHeight: 1.6,
              mb: 2,
            }}
          >
            Bạn có chắc chắn muốn từ chối yêu cầu này không?
          </Typography>
          <Alert
            severity="warning"
            icon={<AlertCircle size={20} />}
            sx={{
              borderRadius: "12px",
              background: "linear-gradient(135deg, #FEF3C7 0%, #FDE68A 100%)",
              border: "1px solid #F59E0B",
              "& .MuiAlert-icon": {
                color: "#F59E0B",
              },
            }}
          >
            <Typography
              variant="body2"
              sx={{ color: "#92400E", fontWeight: 600 }}
            >
              Hành động này không thể hoàn tác
            </Typography>
          </Alert>
        </DialogContent>

        <DialogActions
          sx={{
            px: 4,
            pb: 3,
            gap: 2,
            justifyContent: "center",
          }}
        >
          <Button
            onClick={() => setConfirmDialogOpen(false)}
            variant="outlined"
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
            onClick={handleDenyConfirm}
            variant="contained"
            sx={{
              borderRadius: "12px",
              textTransform: "none",
              px: 4,
              py: 1.5,
              background: "linear-gradient(135deg, #EF4444 0%, #DC2626 100%)",
              fontWeight: 600,
              boxShadow: "0 4px 16px rgba(239, 68, 68, 0.3)",
              "&:hover": {
                background: "linear-gradient(135deg, #DC2626 0%, #B91C1C 100%)",
                transform: "scale(1.02)",
                boxShadow: "0 6px 20px rgba(239, 68, 68, 0.4)",
              },
            }}
            startIcon={<XCircle size={20} />}
          >
            Xác nhận từ chối
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default BookingRequestDetailPage;
