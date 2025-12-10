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
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Pagination,
  Divider,
  InputAdornment,
} from "@mui/material";
import {
  ArrowLeft,
  RefreshCw,
  Eye,
  AlertCircle,
  CheckCircle2,
  XCircle,
  Clock,
  Phone,
  Mail,
  MapPin,
  Users,
  Calendar,
  DollarSign,
  X,
} from "lucide-react";
import {
  getAllContacts,
  getContactById,
  cancelBookingByContact,
  type ContactResponse,
  type PaginationContactResponse,
} from "../services/contact.service";
import { formatDateYMD } from "../utils/date";
import toast from "react-hot-toast";

const AdminContactManagement = () => {
  const navigate = useNavigate();
  const [contacts, setContacts] = useState<ContactResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalItems, setTotalItems] = useState(0);
  const [searchPhone, setSearchPhone] = useState("");
  const pageSize = 10;

  // Detail Modal State
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [selectedContact, setSelectedContact] = useState<ContactResponse | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);

  // Cancel Modal State
  const [cancelModalOpen, setCancelModalOpen] = useState(false);
  const [cancelContactId, setCancelContactId] = useState<string | null>(null);
  const [cancelReason, setCancelReason] = useState("");
  const [cancelLoading, setCancelLoading] = useState(false);

  const formatCurrency = (value: number | null | undefined) => {
    if (value === null || value === undefined) return "0 ₫";
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
      maximumFractionDigits: 0,
    }).format(value);
  };

  const formatDate = (dateString?: string | null) =>
    formatDateYMD(dateString, { includeTime: true });

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const data: PaginationContactResponse = await getAllContacts(page, pageSize);
      setContacts(data.items);
      setTotalPages(data.totalPages);
      setTotalItems(data.totalItems);
    } catch (err) {
      console.error("Error fetching contacts:", err);
      const errorMessage =
        err instanceof Error
          ? err.message
          : (err as { response?: { data?: { message?: string } } })?.response
              ?.data?.message || "Không thể tải danh sách contact";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [page]);

  const handlePageChange = (_event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value - 1);
  };

  const getStatusConfig = (status: string | null | undefined) => {
    switch (status) {
      case "PENDING":
        return {
          label: "Chưa thanh toán",
          color: "#F59E0B",
          bgColor: "#FEF3C7",
          icon: Clock,
        };
      case "CONFIRMED":
        return {
          label: "Đã thanh toán",
          color: "#10B981",
          bgColor: "#D1FAE5",
          icon: CheckCircle2,
        };
      case "CANCELLED":
      case "CONFIRMED_CANCELLATION":
        return {
          label: "Đã hủy",
          color: "#EF4444",
          bgColor: "#FEE2E2",
          icon: XCircle,
        };
      case "COMPLETED":
        return {
          label: "Hoàn thành",
          color: "#3B82F6",
          bgColor: "#DBEAFE",
          icon: CheckCircle2,
        };
      default:
        return {
          label: status || "N/A",
          color: "#6B7280",
          bgColor: "#F3F4F6",
          icon: AlertCircle,
        };
    }
  };

  const canCancel = (status: string | null | undefined) => {
    return (
      status === "CONFIRMED" ||
      status === "PENDING" ||
      status === "DENIED_CANCELLATION" ||
      status === "DENIED_CHANGE"
    );
  };

  const handleViewDetails = async (contact: ContactResponse) => {
    setDetailModalOpen(true);
    setDetailLoading(true);
    try {
      const detail = await getContactById(contact.contactId);
      setSelectedContact(detail);
    } catch (err) {
      console.error("Error fetching contact detail:", err);
      setSelectedContact(contact);
    } finally {
      setDetailLoading(false);
    }
  };

  const handleOpenCancelModal = (contactId: string) => {
    setCancelContactId(contactId);
    setCancelReason("");
    setCancelModalOpen(true);
  };

  const handleCancelBooking = async () => {
    if (!cancelContactId) return;

    setCancelLoading(true);
    try {
      await cancelBookingByContact(cancelContactId, cancelReason || "Hủy bởi Admin");
      toast.success("Hủy booking thành công! Email đã được gửi đến khách hàng.");
      setCancelModalOpen(false);
      setCancelContactId(null);
      setCancelReason("");
      fetchData();
    } catch (err) {
      console.error("Error cancelling booking:", err);
      const errorMessage =
        err instanceof Error
          ? err.message
          : (err as { response?: { data?: { message?: string } } })?.response
              ?.data?.message || "Không thể hủy booking";
      toast.error(errorMessage);
    } finally {
      setCancelLoading(false);
    }
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
            Quản lý Contact
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Danh sách khách hàng đặt tour không cần đăng nhập
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

      {/* Search and Stats Section */}
      <Box sx={{ mb: 3, display: "flex", gap: 2, flexWrap: "wrap", alignItems: "center" }}>
        {/* Search by Phone */}
        <TextField
          placeholder="Tìm kiếm theo SĐT..."
          value={searchPhone}
          onChange={(e) => setSearchPhone(e.target.value)}
          size="small"
          sx={{
            minWidth: 280,
            "& .MuiOutlinedInput-root": {
              borderRadius: "12px",
              backgroundColor: "white",
              "&:hover fieldset": {
                borderColor: "#667eea",
              },
              "&.Mui-focused fieldset": {
                borderColor: "#667eea",
              },
            },
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Phone size={18} color="#9CA3AF" />
              </InputAdornment>
            ),
          }}
        />

        {/* Stats Cards */}
        {!loading && !error && contacts.length > 0 && (
          <>
            <Card
              sx={{
                flex: 1,
                minWidth: 180,
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                color: "white",
                boxShadow: "0 4px 20px rgba(102, 126, 234, 0.3)",
              }}
            >
              <CardContent sx={{ py: 1.5, px: 2, "&:last-child": { pb: 1.5 } }}>
                <Typography variant="h5" sx={{ fontWeight: 700 }}>
                  {totalItems}
                </Typography>
                <Typography variant="caption" sx={{ opacity: 0.9 }}>
                  Tổng số contacts
                </Typography>
              </CardContent>
            </Card>
            <Card
              sx={{
                flex: 1,
                minWidth: 180,
                background: "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)",
                color: "white",
                boxShadow: "0 4px 20px rgba(239, 68, 68, 0.3)",
              }}
            >
              <CardContent sx={{ py: 1.5, px: 2, "&:last-child": { pb: 1.5 } }}>
                <Typography variant="h5" sx={{ fontWeight: 700 }}>
                  {
                    contacts.filter(
                      (c) =>
                        c.bookingStatus === "CANCELLED" ||
                        c.bookingStatus === "CONFIRMED_CANCELLATION"
                    ).length
                  }
                </Typography>
                <Typography variant="caption" sx={{ opacity: 0.9 }}>
                  Đã hủy
                </Typography>
              </CardContent>
            </Card>
          </>
        )}
      </Box>

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
          <CircularProgress sx={{ color: "#667eea" }} size={60} />
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
          <Alert severity="error" sx={{ mb: 2, bgcolor: "rgba(255,255,255,0.2)" }}>
            {error}
          </Alert>
          <Button
            variant="contained"
            onClick={fetchData}
            sx={{
              bgcolor: "white",
              color: "#ff6b6b",
              "&:hover": { bgcolor: "rgba(255,255,255,0.9)" },
            }}
          >
            Thử lại
          </Button>
        </Card>
      )}

      {/* Empty State */}
      {!loading && !error && contacts.length === 0 && (
        <Card
          sx={{
            p: 6,
            textAlign: "center",
            background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
          }}
        >
          <CheckCircle2 size={64} style={{ margin: "0 auto 16px", color: "#667eea" }} />
          <Typography variant="h5" sx={{ mb: 1, fontWeight: 600 }}>
            Không có contact nào
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Hiện tại chưa có khách hàng nào đặt tour
          </Typography>
        </Card>
      )}

      {/* Table */}
      {!loading && !error && contacts.length > 0 && (
        <>
          <Paper
            sx={{
              width: "100%",
              overflow: "hidden",
              borderRadius: 2,
              boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
            }}
          >
            <TableContainer>
              <Table stickyHeader>
                <TableHead>
                  <TableRow>
                    {["Tên KH", "Email", "SĐT", "Tour", "Tổng tiền", "Ngày đặt", "Thao tác"].map(
                      (header) => (
                        <TableCell
                          key={header}
                          sx={{
                            fontWeight: 700,
                            backgroundColor: "#f5f7fa",
                            color: "#374151",
                            fontSize: "0.875rem",
                            borderBottom: "2px solid #e5e7eb",
                          }}
                        >
                          {header}
                        </TableCell>
                      )
                    )}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {contacts
                    .filter((contact) =>
                      searchPhone
                        ? contact.phoneNumber?.toLowerCase().includes(searchPhone.toLowerCase())
                        : true
                    )
                    .map((contact) => (
                      <TableRow
                        hover
                        key={contact.contactId}
                        sx={{
                          "&:nth-of-type(even)": {
                            backgroundColor: "rgba(102, 126, 234, 0.02)",
                          },
                          "&:hover": {
                            backgroundColor: "rgba(102, 126, 234, 0.05)",
                          },
                          transition: "all 0.2s ease",
                        }}
                      >
                        <TableCell>
                          <Typography variant="body2" sx={{ fontWeight: 600 }}>
                            {contact.name || "N/A"}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" color="text.secondary">
                            {contact.email || "N/A"}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" color="text.secondary">
                            {contact.phoneNumber || "N/A"}
                          </Typography>
                        </TableCell>
                        <TableCell sx={{ maxWidth: 200 }}>
                          <Tooltip title={contact.tourTitle || "N/A"} arrow>
                            <Typography
                              variant="body2"
                              sx={{
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                whiteSpace: "nowrap",
                              }}
                            >
                              {contact.tourTitle || "N/A"}
                            </Typography>
                          </Tooltip>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" sx={{ fontWeight: 600, color: "#10B981" }}>
                            {formatCurrency(contact.totalPrice)}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" color="text.secondary">
                            {formatDate(contact.bookingDate)}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Stack direction="row" spacing={1}>
                            <Tooltip title="Xem chi tiết">
                              <IconButton
                                size="small"
                                onClick={() => handleViewDetails(contact)}
                                sx={{
                                  color: "#3B82F6",
                                  "&:hover": { backgroundColor: "rgba(59, 130, 246, 0.1)" },
                                }}
                              >
                                <Eye size={18} />
                              </IconButton>
                            </Tooltip>
                            {canCancel(contact.bookingStatus) && (
                              <Tooltip title="Hủy tour">
                                <IconButton
                                  size="small"
                                  onClick={() => handleOpenCancelModal(contact.contactId)}
                                  sx={{
                                    color: "#EF4444",
                                    "&:hover": { backgroundColor: "rgba(239, 68, 68, 0.1)" },
                                  }}
                                >
                                  <XCircle size={18} />
                                </IconButton>
                              </Tooltip>
                            )}
                          </Stack>
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>

          {/* Pagination */}
          {totalPages > 1 && (
            <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
              <Pagination
                count={totalPages}
                page={page + 1}
                onChange={handlePageChange}
                color="primary"
                sx={{
                  "& .MuiPaginationItem-root": {
                    borderRadius: "12px",
                    fontWeight: 600,
                  },
                  "& .Mui-selected": {
                    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%) !important",
                    color: "white",
                  },
                }}
              />
            </Box>
          )}
        </>
      )}

      {/* Detail Modal */}
      <Dialog
        open={detailModalOpen}
        onClose={() => setDetailModalOpen(false)}
        fullWidth
        maxWidth="sm"
        PaperProps={{
          sx: {
            borderRadius: "20px",
            background: "linear-gradient(180deg, #f9fbff 0%, #ffffff 100%)",
          },
        }}
      >
        <DialogTitle
          sx={{
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            color: "white",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography variant="h6" sx={{ fontWeight: 700 }}>
            Chi tiết Contact
          </Typography>
          <IconButton onClick={() => setDetailModalOpen(false)} sx={{ color: "white" }}>
            <X size={20} />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ p: 3, mt: 2 }}>
          {detailLoading ? (
            <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
              <CircularProgress />
            </Box>
          ) : selectedContact ? (
            <Stack spacing={3}>
              {/* Contact Info */}
              <Box>
                <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1.5, color: "#667eea" }}>
                  Thông tin khách hàng
                </Typography>
                <Stack spacing={1.5}>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <Users size={16} color="#64748B" />
                    <Typography variant="body2">
                      <strong>Tên:</strong> {selectedContact.name || "N/A"}
                    </Typography>
                  </Stack>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <Mail size={16} color="#64748B" />
                    <Typography variant="body2">
                      <strong>Email:</strong> {selectedContact.email || "N/A"}
                    </Typography>
                  </Stack>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <Phone size={16} color="#64748B" />
                    <Typography variant="body2">
                      <strong>SĐT:</strong> {selectedContact.phoneNumber || "N/A"}
                    </Typography>
                  </Stack>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <MapPin size={16} color="#64748B" />
                    <Typography variant="body2">
                      <strong>Địa chỉ:</strong> {selectedContact.address || "N/A"}
                    </Typography>
                  </Stack>
                </Stack>
              </Box>

              <Divider />

              {/* Booking Info */}
              <Box>
                <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1.5, color: "#667eea" }}>
                  Thông tin Booking
                </Typography>
                <Stack spacing={1.5}>
                  <Typography variant="body2">
                    <strong>Mã Booking:</strong> {selectedContact.bookingId || "N/A"}
                  </Typography>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <Calendar size={16} color="#64748B" />
                    <Typography variant="body2">
                      <strong>Ngày đặt:</strong> {formatDate(selectedContact.bookingDate)}
                    </Typography>
                  </Stack>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <Users size={16} color="#64748B" />
                    <Typography variant="body2">
                      <strong>Số người:</strong> {selectedContact.numAdults || 0} người lớn
                      {selectedContact.numChildren ? `, ${selectedContact.numChildren} trẻ em` : ""}
                    </Typography>
                  </Stack>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <DollarSign size={16} color="#64748B" />
                    <Typography variant="body2">
                      <strong>Tổng tiền:</strong>{" "}
                      <span style={{ color: "#10B981", fontWeight: 700 }}>
                        {formatCurrency(selectedContact.totalPrice)}
                      </span>
                    </Typography>
                  </Stack>
                  <Box>
                    <strong>Trạng thái:</strong>{" "}
                    <Chip
                      label={getStatusConfig(selectedContact.bookingStatus).label}
                      size="small"
                      sx={{
                        ml: 1,
                        fontWeight: 600,
                        backgroundColor: getStatusConfig(selectedContact.bookingStatus).bgColor,
                        color: getStatusConfig(selectedContact.bookingStatus).color,
                      }}
                    />
                  </Box>
                </Stack>
              </Box>

              <Divider />

              {/* Tour Info */}
              <Box>
                <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1.5, color: "#667eea" }}>
                  Thông tin Tour
                </Typography>
                <Stack spacing={1.5}>
                  <Typography variant="body2">
                    <strong>Tên tour:</strong> {selectedContact.tourTitle || "N/A"}
                  </Typography>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <MapPin size={16} color="#64748B" />
                    <Typography variant="body2">
                      <strong>Điểm đến:</strong> {selectedContact.tourDestination || "N/A"}
                    </Typography>
                  </Stack>
                </Stack>
              </Box>
            </Stack>
          ) : null}
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setDetailModalOpen(false)} variant="outlined">
            Đóng
          </Button>
          {selectedContact && canCancel(selectedContact.bookingStatus) && (
            <Button
              variant="contained"
              color="error"
              onClick={() => {
                setDetailModalOpen(false);
                handleOpenCancelModal(selectedContact.contactId);
              }}
            >
              Hủy Tour
            </Button>
          )}
        </DialogActions>
      </Dialog>

      {/* Cancel Confirmation Modal */}
      <Dialog
        open={cancelModalOpen}
        onClose={() => setCancelModalOpen(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: { borderRadius: "16px" },
        }}
      >
        <DialogTitle sx={{ fontWeight: 700 }}>Xác nhận hủy tour</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Bạn có chắc chắn muốn hủy tour này? Email thông báo sẽ được gửi đến khách hàng.
          </Typography>
          <TextField
            fullWidth
            label="Lý do hủy (tùy chọn)"
            multiline
            rows={3}
            value={cancelReason}
            onChange={(e) => setCancelReason(e.target.value)}
            placeholder="Nhập lý do hủy tour..."
            sx={{ mt: 1 }}
          />
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setCancelModalOpen(false)} disabled={cancelLoading}>
            Hủy bỏ
          </Button>
          <Button
            variant="contained"
            color="error"
            onClick={handleCancelBooking}
            disabled={cancelLoading}
            startIcon={cancelLoading ? <CircularProgress size={18} color="inherit" /> : <XCircle size={18} />}
          >
            {cancelLoading ? "Đang xử lý..." : "Xác nhận hủy"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AdminContactManagement;

