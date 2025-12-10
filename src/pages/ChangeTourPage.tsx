import { useState, useMemo, useEffect } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import {
  Box,
  Stepper,
  Step,
  StepLabel,
  Button,
  Typography,
  Card,
  CardContent,
  TextField,
  CircularProgress,
  Container,
  Divider,
  Stack,
  Alert,
} from "@mui/material";
import {
  ArrowLeft,
  CheckCircle,
  AlertTriangle,
  MapPin,
  Clock,
  Sparkles,
  Filter,
  Star,
  Heart,
  Users,
  Calendar,
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { getTours, searchTours, getTourById } from "../services/tour.service";
import type {
  TourSearchParams,
  PaginatedToursResponse,
} from "../services/tour.service";
import { requestChangeTour } from "../services/bookingRequest.services";
import { createPaymentLink } from "../services/payments.services";
import { usePayOS } from "@payos/payos-checkout";
import toast from "react-hot-toast";
import TourFilters from "../components/tour/TourFilters";
import PaginationControls from "../components/tour/PaginationControls";
import ConfirmationModal from "../components/ui/ConfirmationModal";
import CancellationPolicyNotice from "../components/ui/CancellationPolicyNotice";
import { formatDateYMD } from "../utils/date";
import { getPromotionById } from "../services/promotion.service";

// Import types
import type { TourResponse } from "../types/tour";
import type { BookingResponse } from "../services/booking.services";

const steps = ["Chọn tour mới", "Xác nhận & Lý do", "Thanh toán", "Hoàn tất"];
const TOURS_PER_PAGE = 9;

const initialFilterState: TourSearchParams = {
  keyword: null,
  destination: null,
  minPrice: null,
  maxPrice: null,
  startDate: null,
  durationDays: null,
  minQuantity: null,
  tourStatus: null,
};

const ChangeTourPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const oldBooking = location.state?.booking as BookingResponse | undefined;
  const [searchParams] = useSearchParams();

  // Stepper State
  const [activeStep, setActiveStep] = useState(0);
  const [selectedTour, setSelectedTour] = useState<TourResponse | null>(null);
  const [tourToConfirm, setTourToConfirm] = useState<TourResponse | null>(null);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [reason, setReason] = useState("");
  const [promotionCode, setPromotionCode] = useState("");
  const [appliedPromotion, setAppliedPromotion] = useState<{
    code: string;
    discount: number;
  } | null>(null);
  const [promotionLoading, setPromotionLoading] = useState(false);
  const [promotionError, setPromotionError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [paymentStatus, setPaymentStatus] = useState<
    "pending" | "success" | "failed"
  >("pending");
  const [oldTourDetail, setOldTourDetail] = useState<TourResponse | null>(null);
  const [policyLoading, setPolicyLoading] = useState(false);

  // Payment State
  const [paymentConfig, setPaymentConfig] = useState({
    RETURN_URL: window.location.origin + "/payment-success",
    ELEMENT_ID: "embedded-payment",
    CHECKOUT_URL: "",
    embedded: true,
    onSuccess: () => handlePaymentSuccess(),
    onCancel: () => handlePaymentCancel(),
  });

  // Filter & Pagination State
  const initialDestination = searchParams.get("destination");
  const [filters, setFilters] = useState<TourSearchParams>({
    ...initialFilterState,
    destination: initialDestination || null,
  });
  const [appliedFilters, setAppliedFilters] = useState<TourSearchParams>({
    ...initialFilterState,
    destination: initialDestination || null,
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  // Redirect if no booking data
  useEffect(() => {
    if (!oldBooking) {
      toast.error("Không tìm thấy thông tin booking cũ");
      navigate("/bookings");
    }
  }, [oldBooking, navigate]);

  useEffect(() => {
    const fetchOldTourDetail = async () => {
      if (!oldBooking?.tourId) {
        return;
      }
      try {
        setPolicyLoading(true);
        const detail = await getTourById(oldBooking.tourId);
        setOldTourDetail(detail);
      } catch (error) {
        console.error(
          "Không thể tải thông tin tour cũ để tính chính sách hoàn phí",
          error
        );
      } finally {
        setPolicyLoading(false);
      }
    };

    fetchOldTourDetail();
  }, [oldBooking?.tourId]);

  // PayOS Hook
  const { open: openPayment } = usePayOS(paymentConfig);

  useEffect(() => {
    if (paymentConfig.CHECKOUT_URL) {
      openPayment();
    }
  }, [paymentConfig]);

  // Query Logic
  const hasActiveFilters = useMemo(() => {
    return Object.entries(appliedFilters).some(([, value]) => {
      return value !== null && value !== undefined && value !== "";
    });
  }, [appliedFilters]);

  const queryKey = [
    "tours",
    appliedFilters.keyword,
    appliedFilters.destination,
    appliedFilters.minPrice,
    appliedFilters.maxPrice,
    appliedFilters.startDate,
    appliedFilters.durationDays,
    appliedFilters.minQuantity,
  ];

  const { data: tours = [], isLoading } = useQuery<TourResponse[]>({
    queryKey,
    queryFn: async () => {
      const rawResponse = (await (hasActiveFilters
        ? searchTours(appliedFilters)
        : getTours())) as PaginatedToursResponse | TourResponse[];
      if (Array.isArray(rawResponse)) {
        return rawResponse;
      }
      return rawResponse.items ?? [];
    },
    staleTime: 1000 * 60 * 5,
  });

  // Pagination Logic
  const totalPages = useMemo(
    () => Math.ceil(tours.length / TOURS_PER_PAGE),
    [tours]
  );
  const paginatedTours = useMemo(() => {
    const startIndex = (currentPage - 1) * TOURS_PER_PAGE;
    return tours.slice(startIndex, startIndex + TOURS_PER_PAGE);
  }, [tours, currentPage]);

  // Filter Handlers
  const handleFilterChange = (key: keyof TourSearchParams, value: any) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleApplyFilters = () => {
    setAppliedFilters({ ...filters });
    setCurrentPage(1);
    setShowMobileFilters(false);
  };

  const handleResetFilters = () => {
    setFilters(initialFilterState);
    setAppliedFilters(initialFilterState);
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Selection Logic
  const handleTourSelect = (tour: TourResponse) => {
    setTourToConfirm(tour);
    setIsConfirmModalOpen(true);
  };

  const handleConfirmTourSelection = () => {
    if (!tourToConfirm) return;
    setSelectedTour(tourToConfirm);
    setActiveStep(1);
    setIsConfirmModalOpen(false);
    setSubmitError(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleCloseConfirmModal = () => {
    setIsConfirmModalOpen(false);
    setTourToConfirm(null);
  };

  // Payment Logic
  const handlePaymentSuccess = () => {
    setPaymentStatus("success");
    submitChangeRequest();
  };

  const handlePaymentCancel = () => {
    setPaymentStatus("failed");
    toast.error("Thanh toán bị hủy");
  };

  // Calculation & Submission
  const calculatePriceDiff = () => {
    if (!selectedTour || !oldBooking) return 0;
    const newTotal =
      selectedTour.priceAdult * oldBooking.numOfAdults +
      selectedTour.priceChild * oldBooking.numOfChildren;
    const discount = appliedPromotion?.discount ?? 0;
    const adjustedTotal = Math.max(newTotal - discount, 0);
    return adjustedTotal - oldBooking.totalPrice;
  };

  const formatCurrency = (val: number) =>
    new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(val);

  const submitChangeRequest = async () => {
    setIsSubmitting(true);
    setSubmitError(null);
    try {
      await requestChangeTour(
        oldBooking!.bookingId,
        selectedTour!.tourId,
        reason,
        appliedPromotion?.code
      );
      setActiveStep(3);
    } catch (error) {
      console.error(error);
      const errorMessage =
        (error as { response?: { data?: { message?: string } } }).response
          ?.data?.message ||
        (error as Error)?.message ||
        "Gửi yêu cầu thất bại";
      setSubmitError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleConfirmChange = async () => {
    if (!reason.trim()) {
      toast.error("Vui lòng nhập lý do đổi tour");
      return;
    }
    setSubmitError(null);

    const priceDiff = calculatePriceDiff();

    if (priceDiff > 0) {
      setIsSubmitting(true);
      try {
        const paymentData = await createPaymentLink({
          tourId: selectedTour!.tourId,
          description: `Doi tour ${oldBooking!.bookingId.slice(0, 6)}`,
          amount: 10000,
        });

        setPaymentConfig({
          RETURN_URL: window.location.origin + "/payment-success",
          ELEMENT_ID: "embedded-payment",
          CHECKOUT_URL: paymentData.checkoutUrl || "",
          embedded: true,
          onSuccess: () => handlePaymentSuccess(),
          onCancel: () => handlePaymentCancel(),
        });
        setActiveStep(2);
      } catch (error) {
        console.error(error);
        toast.error("Lỗi tạo thanh toán");
      } finally {
        setIsSubmitting(false);
      }
    } else {
      submitChangeRequest();
    }
  };

  const handleApplyPromotion = async () => {
    if (!promotionCode.trim()) {
      toast.error("Vui lòng nhập mã khuyến mãi");
      return;
    }
    try {
      setPromotionLoading(true);
      setPromotionError(null);
      const promotion = await getPromotionById(promotionCode.trim());
      const discount = promotion.discount ?? 0;
      setAppliedPromotion({ code: promotion.promotionId, discount });
      toast.success(
        `Đã áp dụng mã ${promotion.promotionId} (-${formatCurrency(discount)})`
      );
    } catch (error) {
      console.error(error);
      setAppliedPromotion(null);
      const message =
        (error as { response?: { data?: { message?: string } } }).response
          ?.data?.message ||
        (error as Error)?.message ||
        "Không thể áp dụng mã khuyến mãi";
      setPromotionError(message);
      toast.error(message);
    } finally {
      setPromotionLoading(false);
    }
  };

  useEffect(() => {
    if (appliedPromotion && promotionCode.trim() !== appliedPromotion.code) {
      setAppliedPromotion(null);
      setPromotionError(null);
    }
  }, [promotionCode, appliedPromotion]);

  if (!oldBooking) return null;

  // Render Selectable Card
  const renderTourCard = (tour: TourResponse) => {
    const rating =
      tour.favoriteCount > 50 ? 4.9 : tour.favoriteCount > 20 ? 4.7 : 4.5;
    const reviews = tour.totalBookings || 0;
    const formattedStartDateRaw = formatDateYMD(tour.startDate, {
      includeTime: false,
    });
    const formattedStartDate =
      formattedStartDateRaw === "Không xác định"
        ? "Liên hệ"
        : formattedStartDateRaw;

    return (
      <div
        key={tour.tourId}
        className="group bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 flex flex-col md:flex-row border border-gray-100 hover:border-indigo-200 cursor-pointer"
        onClick={() => handleTourSelect(tour)}
      >
        <div className="relative md:w-1/3">
          <img
            src={
              tour.imageUrls?.[0] || "https://picsum.photos/seed/tour/400/300"
            }
            alt={tour.title}
            className="w-full h-56 md:h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
          {tour.quantity > 0 && (
            <div className="absolute bottom-4 left-4 bg-white/90 text-indigo-900 text-xs font-semibold px-3 py-1 rounded-full shadow-sm">
              Còn {tour.quantity} chỗ
            </div>
          )}
        </div>

        <div className="p-6 flex flex-col grow md:w-2/3">
          <div className="flex items-center text-sm text-gray-600 mb-2">
            <MapPin className="w-4 h-4 mr-1.5 text-indigo-600" />
            <span className="truncate">{tour.destination}</span>
          </div>

          <h3 className="text-xl font-bold text-indigo-900 mb-3 group-hover:text-indigo-700 transition-colors line-clamp-2">
            {tour.title}
          </h3>

          <p className="text-sm text-gray-600 mb-4 line-clamp-3">
            {tour.description}
          </p>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="flex items-center">
              <Star className="w-4 h-4 text-yellow-400 fill-current" />
              <span className="ml-1.5 text-sm font-medium text-gray-800">
                {rating.toFixed(1)}
              </span>
              <span className="ml-1.5 text-sm text-gray-500">({reviews})</span>
            </div>
            <div className="flex items-center">
              <Heart className="w-4 h-4 text-red-500 fill-current" />
              <span className="ml-1.5 text-sm font-medium text-gray-800">
                {tour.favoriteCount}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="flex items-center text-sm text-gray-600">
              <Clock className="w-4 h-4 mr-1.5 text-indigo-600" />
              <span>{tour.duration}</span>
            </div>
            <div className="flex items-center text-sm text-gray-600">
              <Users className="w-4 h-4 mr-1.5 text-indigo-600" />
              <span>Tối đa {tour.initialQuantity} khách</span>
            </div>
          </div>

          <div className="flex items-center text-sm text-gray-600 mb-4">
            <Calendar className="w-4 h-4 mr-1.5 text-indigo-600" />
            <span>Bắt đầu: {formattedStartDate}</span>
          </div>

          <div className="border-t border-gray-100 pt-4 mt-auto">
            <div className="flex justify-between items-center gap-4">
              <div>
                <span className="text-xs text-gray-500 block mb-1">Giá từ</span>
                <span className="text-2xl font-bold text-indigo-600">
                  {Number(tour.priceAdult).toLocaleString("vi-VN")}₫
                </span>
              </div>
              <span className="bg-indigo-600 text-white px-5 py-2.5 rounded-full font-semibold text-sm hover:bg-indigo-700 transition-all shadow-sm hover:shadow-md">
                Chọn tour này
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#f3f4f6", py: 5 }}>
      <Container maxWidth="xl">
        {/* Header */}
        <Button
          startIcon={<ArrowLeft />}
          onClick={() => navigate("/bookings")}
          sx={{ mb: 3, color: "text.secondary" }}
        >
          Quay lại danh sách
        </Button>

        <Card
          sx={{
            borderRadius: 4,
            boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
            mb: 4,
          }}
        >
          <CardContent sx={{ p: 4 }}>
            <Stepper activeStep={activeStep} alternativeLabel>
              {steps.map((label) => (
                <Step key={label}>
                  <StepLabel>{label}</StepLabel>
                </Step>
              ))}
            </Stepper>
          </CardContent>
        </Card>

        {/* Step 0: Select Tour (UI from AllToursPage) */}
        {activeStep === 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            <div className="hidden lg:block">
              <div className="sticky top-24">
                <TourFilters
                  filters={filters}
                  onFilterChange={handleFilterChange}
                  onReset={handleResetFilters}
                  onApplyFilters={handleApplyFilters}
                  isAdmin={false}
                />
              </div>
            </div>
            <div className="lg:col-span-3">
              <div className="text-center mb-6">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-indigo-100 text-indigo-700 rounded-full text-xs font-semibold mb-3">
                  <Sparkles className="w-4 h-4" />
                  Khám phá điểm đến mới
                </div>
                <h1 className="text-3xl lg:text-4xl font-bold bg-linear-to-r from-indigo-600 to-blue-600 bg-clip-text text-transparent mb-2">
                  Chọn Tour Thay Thế
                </h1>
                <p className="text-sm text-gray-600 max-w-xl mx-auto">
                  Tìm kiếm hành trình mới phù hợp với bạn
                </p>
              </div>

              <div className="lg:hidden mb-4">
                <button
                  onClick={() => setShowMobileFilters(!showMobileFilters)}
                  className="w-full flex items-center justify-center gap-2 bg-white text-gray-700 px-5 py-3 rounded-xl font-semibold shadow-md hover:shadow-lg transition-all"
                >
                  <Filter className="w-5 h-5" />
                  {showMobileFilters ? "Ẩn bộ lọc" : "Hiển thị bộ lọc"}
                </button>
              </div>

              {showMobileFilters && (
                <div className="lg:hidden mb-6">
                  <TourFilters
                    filters={filters}
                    onFilterChange={handleFilterChange}
                    onReset={handleResetFilters}
                    onApplyFilters={handleApplyFilters}
                    isAdmin={false}
                  />
                </div>
              )}

              <div>
                {isLoading ? (
                  <div className="flex justify-center py-10">
                    <CircularProgress />
                  </div>
                ) : tours.length === 0 ? (
                  <div className="bg-white rounded-2xl shadow-lg p-10 text-center">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      Không tìm thấy tour phù hợp
                    </h3>
                    <button
                      onClick={handleResetFilters}
                      className="mt-4 px-6 py-3 bg-indigo-600 text-white rounded-full shadow-md hover:bg-indigo-700"
                    >
                      Xóa bộ lọc
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 gap-8">
                    {paginatedTours.map(renderTourCard)}
                  </div>
                )}

                {!isLoading && tours.length > 0 && (
                  <div className="mt-6">
                    <PaginationControls
                      currentPage={currentPage}
                      totalPages={totalPages}
                      onPageChange={handlePageChange}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Step 1: Confirm & Reason */}
        {activeStep === 1 && selectedTour && (
          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", md: "row" },
              gap: 4,
            }}
          >
            <Box sx={{ flex: { md: 2 }, width: "100%" }}>
              <Card sx={{ borderRadius: 4, mb: 3 }}>
                <CardContent sx={{ p: 3 }}>
                  <Typography variant="h6" fontWeight={700} mb={2}>
                    So sánh thông tin
                  </Typography>
                  <Box
                    sx={{
                      display: "grid",
                      gridTemplateColumns: "1fr 1fr",
                      gap: 2,
                    }}
                  >
                    <Box>
                      <Box p={2} bgcolor="#f8fafc" borderRadius={2}>
                        <Typography
                          variant="subtitle2"
                          color="text.secondary"
                          mb={1}
                        >
                          Tour hiện tại
                        </Typography>
                        <Typography fontWeight={600}>
                          {oldBooking.tourTitle}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {formatCurrency(oldBooking.totalPrice)}
                        </Typography>
                      </Box>
                    </Box>
                    <Box>
                      <Box
                        p={2}
                        bgcolor="#eff6ff"
                        borderRadius={2}
                        border="1px solid #bfdbfe"
                      >
                        <Typography variant="subtitle2" color="primary" mb={1}>
                          Tour mới
                        </Typography>
                        <Typography fontWeight={600}>
                          {selectedTour.title}
                        </Typography>
                        <Typography variant="body2" color="primary">
                          {formatCurrency(
                            selectedTour.priceAdult * oldBooking.numOfAdults +
                              selectedTour.priceChild * oldBooking.numOfChildren
                          )}{" "}
                          (Dự kiến)
                        </Typography>
                        {appliedPromotion && (
                          <Typography variant="body2" color="success.main">
                            Sau khi giảm:{" "}
                            {formatCurrency(
                              Math.max(
                                selectedTour.priceAdult * oldBooking.numOfAdults +
                                  selectedTour.priceChild * oldBooking.numOfChildren -
                                  appliedPromotion.discount,
                                0
                              )
                            )}
                          </Typography>
                        )}
                      </Box>
                    </Box>
                  </Box>

                  <Box
                    mt={3}
                    p={2}
                    bgcolor="#fff7ed"
                    borderRadius={2}
                    display="flex"
                    gap={2}
                  >
                    <AlertTriangle className="text-orange-500" />
                    <Box>
                      <Typography fontWeight={600} color="warning.main">
                        Lưu ý quan trọng
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Việc đổi tour có thể phát sinh thêm chi phí chênh lệch.
                        Nếu tour mới có giá thấp hơn, phần chênh lệch sẽ tính
                        toán lại được hoàn lại theo chính sách của công ty.
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>

              <Box sx={{ mt: 3 }}>
                <CancellationPolicyNotice
                  totalPrice={oldBooking.totalPrice}
                  startDate={oldTourDetail?.startDate ?? null}
                  loading={policyLoading}
                  variant="change"
                />
              </Box>

              <Card sx={{ borderRadius: 4 }}>
                <CardContent sx={{ p: 3 }}>
                  <Typography variant="h6" fontWeight={700} mb={2}>
                    Lý do đổi tour
                  </Typography>
                  {submitError && (
                    <Alert severity="error" sx={{ mb: 2 }} onClose={() => setSubmitError(null)}>
                      {submitError}
                    </Alert>
                  )}
                  <TextField
                    fullWidth
                    multiline
                    rows={4}
                    placeholder="Vui lòng cho biết lý do bạn muốn đổi tour..."
                    value={reason}
                    onChange={(e) => {
                      setReason(e.target.value);
                      setSubmitError(null);
                    }}
                    sx={{ mb: 2 }}
                  />
                  <Stack
                    direction={{ xs: "column", sm: "row" }}
                    spacing={1}
                    sx={{ mb: 1 }}
                  >
                    <TextField
                      fullWidth
                      label="Mã khuyến mãi (nếu có)"
                      placeholder="Nhập mã giảm giá giống như khi đặt tour"
                      value={promotionCode}
                      onChange={(e) => setPromotionCode(e.target.value)}
                    />
                    <Button
                      variant={appliedPromotion ? "contained" : "outlined"}
                      color={appliedPromotion ? "success" : "primary"}
                      onClick={handleApplyPromotion}
                      disabled={promotionLoading}
                      sx={{ minWidth: 140, whiteSpace: "nowrap" }}
                    >
                      {promotionLoading ? (
                        <CircularProgress size={20} />
                      ) : appliedPromotion ? (
                        "Đã áp dụng"
                      ) : (
                        "Áp dụng"
                      )}
                    </Button>
                  </Stack>
                  {appliedPromotion && (
                    <Typography
                      variant="body2"
                      color="success.main"
                      sx={{ mb: 1 }}
                    >
                      Mã {appliedPromotion.code} giảm{" "}
                      {formatCurrency(appliedPromotion.discount)} cho tour mới
                    </Typography>
                  )}
                  {promotionError && (
                    <Typography variant="body2" color="error" sx={{ mb: 1 }}>
                      {promotionError}
                    </Typography>
                  )}
                </CardContent>
              </Card>
            </Box>

            <Box sx={{ flex: { md: 1 }, width: "100%" }}>
              <Card sx={{ borderRadius: 4, position: "sticky", top: 20 }}>
                <CardContent sx={{ p: 3 }}>
                  <Typography variant="h6" fontWeight={700} mb={2}>
                    Tổng kết
                  </Typography>
                  <Box display="flex" justifyContent="space-between" mb={1}>
                    <Typography color="text.secondary">Chênh lệch:</Typography>
                    <Typography
                      fontWeight={600}
                      color={
                        calculatePriceDiff() > 0 ? "error.main" : "success.main"
                      }
                    >
                      {formatCurrency(calculatePriceDiff())}
                    </Typography>
                  </Box>
                  {appliedPromotion && (
                    <Box
                      display="flex"
                      justifyContent="space-between"
                      mb={1}
                    >
                      <Typography color="text.secondary">
                        Giảm giá đã áp dụng:
                      </Typography>
                      <Typography fontWeight={600} color="success.main">
                        -{formatCurrency(appliedPromotion.discount)}
                      </Typography>
                    </Box>
                  )}
                  <Divider sx={{ my: 2 }} />
                  <Button
                    fullWidth
                    variant="contained"
                    size="large"
                    onClick={handleConfirmChange}
                    disabled={isSubmitting}
                    sx={{
                      borderRadius: 3,
                      background:
                        "linear-gradient(135deg, #3B82F6 0%, #2563EB 100%)",
                    }}
                  >
                    {isSubmitting ? (
                      <CircularProgress size={24} color="inherit" />
                    ) : (
                      "Xác nhận đổi tour"
                    )}
                  </Button>
                  <Button
                    fullWidth
                    variant="text"
                    onClick={() => {
                      setActiveStep(0);
                      setSubmitError(null);
                    }}
                    sx={{ mt: 1, borderRadius: 3 }}
                  >
                    Chọn lại tour
                  </Button>
                </CardContent>
              </Card>
            </Box>
          </Box>
        )}

        {/* Step 2: Payment */}
        {activeStep === 2 && (
          <Box textAlign="center" py={5}>
            <Typography variant="h5" fontWeight={700} mb={3}>
              Thanh toán chênh lệch
            </Typography>
            <div
              id="embedded-payment"
              style={{ height: "400px", width: "100%" }}
            ></div>
            {paymentStatus === "failed" && (
              <Button
                onClick={() => handleConfirmChange()}
                variant="contained"
                color="error"
                sx={{ mt: 2 }}
              >
                Thử lại
              </Button>
            )}
          </Box>
        )}

        {/* Step 3: Success */}
        {activeStep === 3 && (
          <Box textAlign="center" py={8}>
            <Box
              sx={{
                width: 80,
                height: 80,
                borderRadius: "50%",
                bgcolor: "#dcfce7",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                mx: "auto",
                mb: 3,
              }}
            >
              <CheckCircle size={48} className="text-green-600" />
            </Box>
            <Typography variant="h4" fontWeight={800} gutterBottom>
              Yêu cầu thành công!
            </Typography>
            <Typography color="text.secondary" mb={4} maxWidth="sm" mx="auto">
              Yêu cầu đổi tour của bạn đã được gửi đến hệ thống. Chúng tôi sẽ
              xem xét và phản hồi trong thời gian sớm nhất.
            </Typography>
            <Button
              variant="contained"
              size="large"
              onClick={() => navigate("/bookings")}
              sx={{
                borderRadius: 3,
                px: 5,
                background: "linear-gradient(135deg, #10B981 0%, #059669 100%)",
              }}
            >
              Về danh sách Booking
            </Button>
          </Box>
        )}
      </Container>
      <ConfirmationModal
        open={isConfirmModalOpen}
        onClose={handleCloseConfirmModal}
        onConfirm={handleConfirmTourSelection}
        title="Xác nhận đổi tour"
        content={
          tourToConfirm
            ? `Bạn có chắc chắn muốn chọn tour "${tourToConfirm.title}"?`
            : "Bạn có chắc chắn muốn chọn tour này?"
        }
        confirmLabel="Chọn tour này"
        cancelLabel="Hủy"
        variant="info"
      />
    </Box>
  );
};

export default ChangeTourPage;
