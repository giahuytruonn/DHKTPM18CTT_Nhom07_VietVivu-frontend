import React, { useState } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  MenuItem,
  Card,
  CardContent,
  Container,
  CircularProgress,
  Stack,
  Paper,
  Alert, // <--- 1. Import Alert
  Collapse, // <--- 2. Import Collapse để hiển thị mượt mà hơn
} from "@mui/material";
import { Send, Mail, MapPin } from "lucide-react";
import { toast } from "sonner";
import { sendContactRequest } from "../services/contact.service";

const ContactPage = () => {
  const [loading, setLoading] = useState(false);
  // 3. State quản lý thông báo hiển thị trên Form
  const [notification, setNotification] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  const [formData, setFormData] = useState({
    customerName: "",
    customerEmail: "",
    topic: "TOUR_CONSULT",
    message: "",
  });

  const topics = [
    { value: "TOUR_CONSULT", label: "Tư vấn Tour du lịch" },
    { value: "PAYMENT", label: "Vấn đề Thanh toán & Hoàn tiền" },
    { value: "BOOKING_CHANGE", label: "Thay đổi hoặc Hủy lịch đặt" },
    { value: "OTHER", label: "Góp ý & Câu hỏi khác" },
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    // Tắt thông báo khi người dùng bắt đầu nhập lại
    if (notification) setNotification(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setNotification(null); // Reset thông báo cũ

    if (!formData.customerEmail || !formData.message) {
      // Hiển thị Alert lỗi validation
      setNotification({
        type: "error",
        message: "Vui lòng điền đầy đủ Email và Nội dung câu hỏi.",
      });
      toast.error("Vui lòng điền đầy đủ thông tin");
      return;
    }

    setLoading(true);
    try {
      await sendContactRequest(formData);
      
      // 4. Set thông báo thành công
      setNotification({
        type: "success",
        message: "Đã gửi yêu cầu thành công! Ban tư vấn sẽ liên hệ lại sớm.",
      });
      toast.success("Đã gửi yêu cầu! Ban tư vấn sẽ liên hệ lại sớm.");
      
      setFormData({
        customerName: "",
        customerEmail: "",
        topic: "TOUR_CONSULT",
        message: "",
      });
    } catch (error) {
      // 5. Set thông báo thất bại
      setNotification({
        type: "error",
        message: "Gửi thất bại. Vui lòng kiểm tra kết nối và thử lại.",
      });
      toast.error("Gửi thất bại. Vui lòng thử lại sau.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(180deg, #F0F9FF 0%, #E0F2FE 100%)",
        py: { xs: 6, md: 10 },
        px: 2,
        fontFamily: "'Inter', sans-serif",
      }}
    >
      <Container maxWidth="lg">
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { md: "1fr 1.5fr" },
            gap: { xs: 6, md: 8 },
            alignItems: "start",
          }}
        >
          {/* Cột trái: Thông tin & Lời chào (GIỮ NGUYÊN) */}
          <Box>
            <Typography variant="overline" sx={{ color: "#2563EB", fontWeight: 700, letterSpacing: "0.1em", mb: 1, display: "block" }}>
              LIÊN HỆ VỚI CHÚNG TÔI
            </Typography>
            <Typography variant="h2" sx={{ fontWeight: 800, color: "#0F172A", mb: 2, fontSize: { xs: "2.5rem", md: "3rem" }, lineHeight: 1.2 }}>
              Chúng tôi luôn sẵn sàng <br />
              <span style={{ color: "#3B82F6" }}>lắng nghe bạn.</span>
            </Typography>
            <Typography variant="body1" sx={{ color: "#64748B", fontSize: "1.1rem", mb: 6, lineHeight: 1.6 }}>
              Dù bạn có thắc mắc về tour, cần hỗ trợ đặt vé hay chỉ muốn chia sẻ trải nghiệm, đội ngũ VietVivu luôn ở đây để hỗ trợ bạn nhanh nhất.
            </Typography>

            <Stack spacing={3}>
              <Paper elevation={0} sx={{ p: 3, borderRadius: "16px", background: "rgba(255, 255, 255, 0.6)", backdropFilter: "blur(10px)", border: "1px solid rgba(255, 255, 255, 0.8)", display: "flex", alignItems: "center", gap: 2, transition: "transform 0.2s", "&:hover": { transform: "translateY(-4px)" } }}>
                <Box sx={{ width: 48, height: 48, borderRadius: "12px", background: "#EFF6FF", display: "flex", alignItems: "center", justifyContent: "center", color: "#2563EB" }}>
                  <Mail size={24} />
                </Box>
                <Box>
                  <Typography variant="subtitle2" color="text.secondary">Email hỗ trợ</Typography>
                  <Typography variant="h6" fontWeight="700" color="#1E293B">support@vietvivu.com</Typography>
                </Box>
              </Paper>

              <Paper elevation={0} sx={{ p: 3, borderRadius: "16px", background: "rgba(255, 255, 255, 0.6)", backdropFilter: "blur(10px)", border: "1px solid rgba(255, 255, 255, 0.8)", display: "flex", alignItems: "center", gap: 2, transition: "transform 0.2s", "&:hover": { transform: "translateY(-4px)" } }}>
                <Box sx={{ width: 48, height: 48, borderRadius: "12px", background: "#F0FDF4", display: "flex", alignItems: "center", justifyContent: "center", color: "#16A34A" }}>
                  <MapPin size={24} />
                </Box>
                <Box>
                  <Typography variant="subtitle2" color="text.secondary">Văn phòng</Typography>
                  <Typography variant="h6" fontWeight="700" color="#1E293B">TP. Hồ Chí Minh, Việt Nam</Typography>
                </Box>
              </Paper>
            </Stack>
          </Box>

          {/* Cột phải: Form liên hệ */}
          <Card
            elevation={0}
            sx={{
              borderRadius: "32px",
              background: "#FFFFFF",
              boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.1)",
              border: "1px solid #F1F5F9",
              overflow: "visible",
            }}
          >
            <CardContent sx={{ p: { xs: 4, md: 5 } }}>
              <Typography variant="h5" fontWeight="800" sx={{ mb: 4, color: "#0F172A" }}>
                Gửi yêu cầu hỗ trợ
              </Typography>

              <form onSubmit={handleSubmit}>
                <Stack spacing={3}>
                  <Box display="grid" gridTemplateColumns={{ sm: "1fr 1fr" }} gap={3}>
                    <TextField
                      label="Họ và tên"
                      name="customerName"
                      value={formData.customerName}
                      onChange={handleChange}
                      fullWidth
                      variant="outlined"
                      placeholder="Nguyễn Văn A"
                      InputProps={{ sx: { borderRadius: "12px", backgroundColor: "#F8FAFC" } }}
                      sx={{ "& fieldset": { borderColor: "#E2E8F0" } }}
                    />
                    <TextField
                      label="Email liên hệ *"
                      name="customerEmail"
                      type="email"
                      required
                      value={formData.customerEmail}
                      onChange={handleChange}
                      fullWidth
                      variant="outlined"
                      placeholder="email@example.com"
                      InputProps={{ sx: { borderRadius: "12px", backgroundColor: "#F8FAFC" } }}
                      sx={{ "& fieldset": { borderColor: "#E2E8F0" } }}
                    />
                  </Box>

                  <TextField
                    select
                    label="Vấn đề cần hỗ trợ"
                    name="topic"
                    value={formData.topic}
                    onChange={handleChange}
                    fullWidth
                    variant="outlined"
                    InputProps={{ sx: { borderRadius: "12px", backgroundColor: "#F8FAFC" } }}
                    sx={{ "& fieldset": { borderColor: "#E2E8F0" } }}
                  >
                    {topics.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </TextField>

                  <TextField
                    label="Nội dung câu hỏi *"
                    name="message"
                    multiline
                    rows={5}
                    required
                    value={formData.message}
                    onChange={handleChange}
                    fullWidth
                    variant="outlined"
                    placeholder="Hãy mô tả chi tiết vấn đề của bạn để chúng tôi hỗ trợ tốt nhất..."
                    InputProps={{ sx: { borderRadius: "12px", backgroundColor: "#F8FAFC" } }}
                    sx={{ "& fieldset": { borderColor: "#E2E8F0" } }}
                  />

                  {/* 6. Hiển thị thông báo Alert tại đây */}
                  <Collapse in={!!notification}>
                    {notification && (
                      <Alert 
                        severity={notification.type} 
                        sx={{ borderRadius: "12px" }}
                        onClose={() => setNotification(null)}
                      >
                        {notification.message}
                      </Alert>
                    )}
                  </Collapse>

                  <Button
                    type="submit"
                    variant="contained"
                    size="large"
                    disabled={loading}
                    endIcon={loading ? <CircularProgress size={20} color="inherit" /> : <Send size={18} />}
                    sx={{
                      borderRadius: "14px",
                      py: 2,
                      fontSize: "1rem",
                      fontWeight: "700",
                      background: "linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%)",
                      boxShadow: "0 10px 25px -5px rgba(37, 99, 235, 0.4)",
                      textTransform: "none",
                      transition: "all 0.3s ease",
                      "&:hover": {
                        background: "linear-gradient(135deg, #1D4ED8 0%, #1E40AF 100%)",
                        transform: "translateY(-2px)",
                        boxShadow: "0 15px 30px -5px rgba(37, 99, 235, 0.5)",
                      },
                    }}
                  >
                    {loading ? "Đang gửi..." : "Gửi tin nhắn ngay"}
                  </Button>
                </Stack>
              </form>
            </CardContent>
          </Card>
        </Box>
      </Container>
    </Box>
  );
};

export default ContactPage;