import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Rating,
  TextField,
  Typography,
  Box,
  IconButton,
  Stack,
  alpha,
} from "@mui/material";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { createReview } from "../../services/review.services"; // Kiểm tra lại đường dẫn
import { Star, X, MessageSquare, Sparkles } from "lucide-react";

interface ReviewModalProps {
  open: boolean;
  onClose: () => void;
  bookingId: string;
  tourTitle: string;
}

const ReviewModal: React.FC<ReviewModalProps> = ({
  open,
  onClose,
  bookingId,
  tourTitle,
}) => {
  const [rating, setRating] = useState<number | null>(5);
  const [comment, setComment] = useState("");
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async () => {
      if (!rating) throw new Error("Vui lòng chọn số sao");
      await createReview({
        bookingId,
        rating,
        comment,
      });
    },
    onSuccess: () => {
      toast.success("Cảm ơn bạn đã gửi đánh giá! 🎉");
      queryClient.invalidateQueries({ queryKey: ["my-reviews"] });
      // Cập nhật lại list booking để ẩn nút đánh giá nếu cần
      queryClient.invalidateQueries({ queryKey: ["bookings"] }); 
      handleClose();
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Gửi đánh giá thất bại");
    },
  });

  const handleSubmit = () => {
    mutation.mutate();
  };

  const handleClose = () => {
    onClose();
    // Reset form sau khi đóng animation (có thể thêm setTimeout nếu muốn)
    setTimeout(() => {
        setRating(5);
        setComment("");
    }, 200);
  };

  const labels: { [index: string]: string } = {
    1: "Rất tệ",
    2: "Không hài lòng",
    3: "Bình thường",
    4: "Hài lòng",
    5: "Tuyệt vời",
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      fullWidth
      maxWidth="sm"
      PaperProps={{
        sx: {
          borderRadius: "28px",
          boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
          overflow: "hidden",
          background: "#FFFFFF",
        },
      }}
    >
      {/* Header */}
      <DialogTitle
        sx={{
          p: 3,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          background: "linear-gradient(180deg, #F8FAFC 0%, #FFFFFF 100%)",
        }}
      >
        <Box sx={{ pr: 4 }}>
          <Typography
            variant="h5"
            sx={{ fontWeight: 800, color: "#0F172A", mb: 0.5 }}
          >
            Đánh giá trải nghiệm
          </Typography>
          <Typography
            variant="body2"
            sx={{
              color: "#64748B",
              fontWeight: 500,
              display: "-webkit-box",
              WebkitLineClamp: 1,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
            }}
          >
            {tourTitle}
          </Typography>
        </Box>
        <IconButton
          onClick={handleClose}
          size="small"
          sx={{
            color: "#94A3B8",
            "&:hover": { color: "#EF4444", backgroundColor: "#FEF2F2" },
          }}
        >
          <X size={20} />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ p: 0 }}>
        <Box sx={{ px: 4, py: 2, display: "flex", flexDirection: "column", gap: 3 }}>
          {/* Rating Section */}
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 1.5,
              py: 2,
              borderRadius: "20px",
              backgroundColor: alpha("#3B82F6", 0.04),
              border: "1px dashed",
              borderColor: alpha("#3B82F6", 0.2),
            }}
          >
            <Typography
              variant="subtitle2"
              sx={{ fontWeight: 600, color: "#3B82F6", display: "flex", alignItems: "center", gap: 0.5 }}
            >
              <Sparkles size={16} />
              Bạn cảm thấy chuyến đi thế nào?
            </Typography>
            
            <Rating
              value={rating}
              onChange={(_, newValue) => setRating(newValue)}
              size="large"
              icon={
                <Star
                  fill="currentColor"
                  size={40}
                  style={{ filter: "drop-shadow(0 2px 4px rgba(250, 204, 21, 0.4))" }}
                />
              }
              emptyIcon={<Star size={40} style={{ opacity: 0.3 }} />}
              sx={{
                "& .MuiRating-iconFilled": { color: "#FACC15" },
                "& .MuiRating-iconHover": { color: "#EAB308" },
              }}
            />
            
            <Typography
              variant="caption"
              sx={{
                height: "20px",
                fontWeight: 600,
                color: rating ? "#F59E0B" : "#94A3B8",
                transition: "all 0.2s",
              }}
            >
              {rating !== null && labels[rating]}
            </Typography>
          </Box>

          {/* Comment Section */}
          <Box>
            <Typography
              variant="subtitle2"
              sx={{ fontWeight: 700, color: "#1E293B", mb: 1.5, display: "flex", alignItems: "center", gap: 1 }}
            >
              <MessageSquare size={18} className="text-gray-400" />
              Chia sẻ thêm (không bắt buộc)
            </Typography>
            <TextField
              multiline
              rows={4}
              fullWidth
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Hãy chia sẻ về hướng dẫn viên, địa điểm tham quan, hoặc những điều bạn ấn tượng nhất..."
              variant="outlined"
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: "16px",
                  backgroundColor: "#F8FAFC",
                  transition: "all 0.2s",
                  "& fieldset": {
                    borderColor: "#E2E8F0",
                  },
                  "&:hover fieldset": {
                    borderColor: "#CBD5E1",
                  },
                  "&.Mui-focused": {
                    backgroundColor: "#FFFFFF",
                    boxShadow: "0 4px 12px rgba(59, 130, 246, 0.08)",
                    "& fieldset": {
                      borderColor: "#3B82F6",
                      borderWidth: "1.5px",
                    },
                  },
                },
                "& .MuiInputBase-input": {
                  fontSize: "0.95rem",
                  color: "#334155",
                },
              }}
            />
          </Box>
        </Box>
      </DialogContent>

      <DialogActions sx={{ p: 3, pt: 1, gap: 1.5 }}>
        <Button
          onClick={handleClose}
          variant="text"
          sx={{
            borderRadius: "12px",
            color: "#64748B",
            fontWeight: 600,
            textTransform: "none",
            px: 2.5,
            "&:hover": { backgroundColor: "#F1F5F9", color: "#0F172A" },
          }}
        >
          Để sau
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={mutation.isPending || !rating}
          sx={{
            borderRadius: "12px",
            textTransform: "none",
            fontWeight: 600,
            fontSize: "0.95rem",
            px: 4,
            py: 1,
            background: "linear-gradient(135deg, #3B82F6 0%, #2563EB 100%)",
            boxShadow: "0 4px 12px rgba(37, 99, 235, 0.3)",
            transition: "all 0.2s",
            "&:hover": {
              background: "linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%)",
              boxShadow: "0 6px 16px rgba(37, 99, 235, 0.4)",
              transform: "translateY(-1px)",
            },
            "&:disabled": {
              background: "#E2E8F0",
              color: "#94A3B8",
              boxShadow: "none",
            },
          }}
        >
          {mutation.isPending ? "Đang gửi..." : "Gửi đánh giá"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ReviewModal;