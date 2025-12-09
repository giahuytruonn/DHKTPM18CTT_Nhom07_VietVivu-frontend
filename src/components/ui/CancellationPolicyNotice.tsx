import { FC, useMemo } from "react";
import {
  Box,
  Card,
  CardContent,
  CircularProgress,
  Divider,
  Stack,
  Typography,
} from "@mui/material";
import { AlertTriangle, Calendar, Wallet } from "lucide-react";
import {
  CANCELLATION_POLICY_RULES,
  computeDaysUntilStart,
  determineCancellationPolicy,
} from "../../utils/cancellationPolicy";
import { formatDateYMD } from "../../utils/date";

type CancellationPolicyNoticeProps = {
  totalPrice: number;
  startDate?: string | null;
  loading?: boolean;
  variant?: "cancel" | "change";
};

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
  }).format(Math.max(0, Math.round(value)));

const CancellationPolicyNotice: FC<CancellationPolicyNoticeProps> = ({
  totalPrice,
  startDate = null,
  loading = false,
  variant = "cancel",
}) => {
  const daysUntilStart = useMemo(
    () => computeDaysUntilStart(startDate),
    [startDate]
  );

  const policy = determineCancellationPolicy(daysUntilStart);
  const penaltyAmount = Math.max(totalPrice * policy.rate, 0);
  const refundAmount = Math.max(totalPrice - penaltyAmount, 0);

  const safeDays =
    typeof daysUntilStart === "number"
      ? Math.max(daysUntilStart, 0)
      : daysUntilStart;

  const formattedStartDate = useMemo(() => {
    const formatted = formatDateYMD(startDate, { includeTime: false });
    return formatted === "Không xác định" ? "Chưa cập nhật" : formatted;
  }, [startDate]);

  const subtitle =
    variant === "cancel"
      ? "Áp dụng cho yêu cầu hủy tour hiện tại"
      : "Áp dụng khi xác nhận đổi tour và hủy tour cũ";

  const penaltyLabel = `${Math.round(policy.rate * 100)}% tổng giá tour`;

  return (
    <Card
      sx={{
        borderRadius: "24px",
        background: "linear-gradient(145deg, #ffffff 0%, #f8fbff 100%)",
        border: "1px solid rgba(226, 232, 240, 0.8)",
        boxShadow: "0 24px 60px rgba(15, 23, 42, 0.1)",
      }}
    >
      <CardContent sx={{ p: { xs: 3, md: 4 } }}>
        <Stack spacing={3}>
          <Box>
            <Typography
              variant="overline"
              sx={{ color: "#6366f1", letterSpacing: "0.3em" }}
            >
              Chính sách hoàn phí
            </Typography>
            <Typography
              variant="h5"
              sx={{ fontWeight: 800, mt: 1, color: "#0f172a" }}
            >
              {variant === "cancel"
                ? "Thông tin hoàn tiền khi hủy tour"
                : "Thông tin hoàn tiền khi đổi tour"}
            </Typography>
            <Typography color="text.secondary">{subtitle}</Typography>
          </Box>

          <Stack
            spacing={3}
            direction={{ xs: "column", md: "row" }}
            alignItems="stretch"
          >
            <Box
              sx={{
                flex: 1,
                borderRadius: "24px",
                p: 3,
                background:
                  "linear-gradient(135deg, #312e81 0%, #4338ca 50%, #2563eb 100%)",
                color: "white",
                position: "relative",
                overflow: "hidden",
              }}
            >
              <Box
                sx={{
                  position: "absolute",
                  inset: 0,
                  background:
                    "radial-gradient(circle at top, rgba(255,255,255,0.2), transparent 55%)",
                  opacity: 0.8,
                }}
              />
              <Stack spacing={2} sx={{ position: "relative", zIndex: 1 }}>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                    color: "rgba(255,255,255,0.85)",
                  }}
                >
                  <Calendar size={18} />
                  <Typography variant="body2">
                    Khởi hành: {formattedStartDate}
                  </Typography>
                </Box>

                {loading ? (
                  <Box sx={{ display: "flex", justifyContent: "center", py: 2 }}>
                    <CircularProgress size={32} sx={{ color: "white" }} />
                  </Box>
                ) : (
                  <>
                    <Typography variant="body1" sx={{ fontWeight: 500 }}>
                      {typeof safeDays === "number"
                        ? `Còn ${safeDays} ngày trước khởi hành`
                        : "Đang áp dụng mức phạt tiêu chuẩn 25% do chưa có ngày khởi hành"}
                    </Typography>
                    <Typography variant="body2" sx={{ opacity: 0.8 }}>
                      Mức phạt hiện tại:{" "}
                      <strong style={{ color: "white" }}>{penaltyLabel}</strong>
                    </Typography>
                    <Divider
                      sx={{
                        borderColor: "rgba(255, 255, 255, 0.25)",
                        my: 1,
                      }}
                    />
                    <Box>
                      <Typography variant="subtitle2" sx={{ opacity: 0.85 }}>
                        Tiền khách nhận lại
                      </Typography>
                      <Typography
                        variant="h4"
                        sx={{ fontWeight: 800, lineHeight: 1.2, mt: 0.5 }}
                      >
                        {formatCurrency(refundAmount)}
                      </Typography>
                      <Typography variant="body2" sx={{ opacity: 0.8 }}>
                        Sau khi khấu trừ {penaltyLabel} (
                        {formatCurrency(penaltyAmount)})
                      </Typography>
                    </Box>
                  </>
                )}
              </Stack>
            </Box>

            <Stack spacing={2} flex={1}>
              {CANCELLATION_POLICY_RULES.map((rule) => {
                const isActive = rule.id === policy.id;
                return (
                  <Box
                    key={rule.id}
                    sx={{
                      borderRadius: "20px",
                      border: isActive
                        ? "1px solid rgba(59, 130, 246, 0.6)"
                        : "1px solid rgba(226, 232, 240, 0.9)",
                      background: isActive
                        ? "linear-gradient(135deg, rgba(219,234,254,0.85) 0%, rgba(191,219,254,0.7) 100%)"
                        : "rgba(248, 250, 252, 0.9)",
                      boxShadow: isActive
                        ? "0 12px 30px rgba(59, 130, 246, 0.25)"
                        : "none",
                      p: 2.5,
                    }}
                  >
                    <Stack direction="row" spacing={1.5} alignItems="center">
                      {isActive ? (
                        <Wallet size={24} color="#2563eb" />
                      ) : (
                        <AlertTriangle size={24} color="#cbd5f5" />
                      )}
                      <Box>
                        <Typography
                          variant="subtitle1"
                          sx={{ fontWeight: 700, color: "#0f172a" }}
                        >
                          {rule.title}
                        </Typography>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{ fontWeight: 500 }}
                        >
                          {rule.timeRange}
                        </Typography>
                      </Box>
                    </Stack>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ mt: 1 }}
                    >
                      {rule.description}
                    </Typography>
                    <Typography
                      variant="caption"
                      sx={{
                        mt: 1.5,
                        display: "inline-flex",
                        px: 1.5,
                        py: 0.5,
                        borderRadius: "999px",
                        backgroundColor: isActive
                          ? "rgba(37, 99, 235, 0.12)"
                          : "rgba(148, 163, 184, 0.15)",
                        color: isActive ? "#1d4ed8" : "#475569",
                        fontWeight: 600,
                        letterSpacing: "0.05em",
                        textTransform: "uppercase",
                      }}
                    >
                      Phạt {Math.round(rule.rate * 100)}%
                    </Typography>
                  </Box>
                );
              })}
            </Stack>
          </Stack>

          <Divider />

          <Typography variant="body2" color="text.secondary">
            Số tiền hoàn dự kiến sẽ được cố định tại thời điểm bạn gửi yêu cầu và
            sẽ được phản hồi chính thức qua email khi quản trị viên duyệt yêu cầu.
          </Typography>
        </Stack>
      </CardContent>
    </Card>
  );
};

export default CancellationPolicyNotice;

