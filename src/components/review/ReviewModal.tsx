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
} from "@mui/material";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { createReview } from "../../services/review.services"; // Đảm bảo đường dẫn đúng
import { Star } from "lucide-react";

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
      toast.success("Đánh giá của bạn đã được gửi!");
      queryClient.invalidateQueries({ queryKey: ["my-reviews"] }); // Refresh list review nếu cần
      onClose();
      // Reset form
      setRating(5);
      setComment("");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Gửi đánh giá thất bại");
    },
  });

  const handleSubmit = () => {
    mutation.mutate();
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle sx={{ fontWeight: "bold", pb: 1 }}>
        Đánh giá Tour
        <Typography variant="body2" color="text.secondary">
          {tourTitle}
        </Typography>
      </DialogTitle>
      
      <DialogContent dividers>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 3, py: 1 }}>
          <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 1 }}>
            <Typography component="legend">Bạn cảm thấy chuyến đi thế nào?</Typography>
            <Rating
              name="simple-controlled"
              value={rating}
              onChange={(_, newValue) => {
                setRating(newValue);
              }}
              size="large"
              icon={<Star fill="currentColor" />}
              emptyIcon={<Star style={{ opacity: 0.55 }} />}
            />
          </Box>

          <TextField
            label="Chia sẻ trải nghiệm của bạn"
            multiline
            rows={4}
            variant="outlined"
            fullWidth
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Hướng dẫn viên nhiệt tình, cảnh đẹp..."
          />
        </Box>
      </DialogContent>

      <DialogActions sx={{ p: 2 }}>
        <Button onClick={onClose} variant="outlined" color="inherit">
          Hủy
        </Button>
        <Button 
          onClick={handleSubmit} 
          variant="contained" 
          disabled={mutation.isPending || !rating}
          sx={{ 
            background: "linear-gradient(135deg, #3B82F6 0%, #2563EB 100%)",
            color: "white"
          }}
        >
          {mutation.isPending ? "Đang gửi..." : "Gửi đánh giá"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ReviewModal;