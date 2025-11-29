import React from "react";
import {
    Dialog,
    DialogContent,
    DialogActions,
    Typography,
    Button,
    Box,
    IconButton,
} from "@mui/material";
import { X, AlertCircle, CheckCircle2 } from "lucide-react";

interface ConfirmationModalProps {
    open: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    content: string;
    confirmLabel?: string;
    cancelLabel?: string;
    variant?: "danger" | "info" | "success";
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
    open,
    onClose,
    onConfirm,
    title,
    content,
    confirmLabel = "Xác nhận",
    cancelLabel = "Hủy bỏ",
    variant = "info",
}) => {
    const getVariantConfig = () => {
        switch (variant) {
            case "danger":
                return {
                    icon: <AlertCircle size={48} color="#EF4444" />,
                    gradient: "linear-gradient(135deg, #FEF2F2 0%, #FEE2E2 100%)",
                    buttonGradient: "linear-gradient(135deg, #EF4444 0%, #DC2626 100%)",
                    buttonHover: "linear-gradient(135deg, #DC2626 0%, #B91C1C 100%)",
                };
            case "success":
                return {
                    icon: <CheckCircle2 size={48} color="#10B981" />,
                    gradient: "linear-gradient(135deg, #ECFDF5 0%, #D1FAE5 100%)",
                    buttonGradient: "linear-gradient(135deg, #10B981 0%, #059669 100%)",
                    buttonHover: "linear-gradient(135deg, #059669 0%, #047857 100%)",
                };
            default:
                return {
                    icon: <AlertCircle size={48} color="#3B82F6" />,
                    gradient: "linear-gradient(135deg, #EFF6FF 0%, #DBEAFE 100%)",
                    buttonGradient: "linear-gradient(135deg, #3B82F6 0%, #2563EB 100%)",
                    buttonHover: "linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%)",
                };
        }
    };

    const config = getVariantConfig();

    return (
        <Dialog
            open={open}
            onClose={onClose}
            PaperProps={{
                sx: {
                    borderRadius: "24px",
                    padding: "16px",
                    maxWidth: "400px",
                    width: "100%",
                    boxShadow: "0 20px 60px rgba(0, 0, 0, 0.15)",
                },
            }}
        >
            <Box sx={{ position: "absolute", right: 8, top: 8 }}>
                <IconButton onClick={onClose} size="small">
                    <X size={20} />
                </IconButton>
            </Box>

            <DialogContent
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    textAlign: "center",
                    pt: 4,
                    pb: 2,
                }}
            >
                <Box
                    sx={{
                        width: 80,
                        height: 80,
                        borderRadius: "50%",
                        background: config.gradient,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        mb: 3,
                    }}
                >
                    {config.icon}
                </Box>

                <Typography variant="h5" sx={{ fontWeight: 700, mb: 1.5 }}>
                    {title}
                </Typography>

                <Typography variant="body1" color="text.secondary" sx={{ mb: 1 }}>
                    {content}
                </Typography>
            </DialogContent>

            <DialogActions sx={{ p: 2, justifyContent: "center", gap: 2 }}>
                <Button
                    variant="outlined"
                    onClick={onClose}
                    sx={{
                        borderRadius: "12px",
                        textTransform: "none",
                        px: 3,
                        py: 1,
                        color: "text.secondary",
                        borderColor: "divider",
                        "&:hover": {
                            borderColor: "text.primary",
                            backgroundColor: "rgba(0,0,0,0.02)",
                        },
                    }}
                >
                    {cancelLabel}
                </Button>
                <Button
                    variant="contained"
                    onClick={onConfirm}
                    sx={{
                        borderRadius: "12px",
                        textTransform: "none",
                        px: 3,
                        py: 1,
                        background: config.buttonGradient,
                        boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                        "&:hover": {
                            background: config.buttonHover,
                            boxShadow: "0 6px 16px rgba(0,0,0,0.15)",
                        },
                    }}
                >
                    {confirmLabel}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default ConfirmationModal;
