import { useEffect, useState, useCallback } from "react";
import { usePayOS } from "@payos/payos-checkout";
import {
  createPaymentLink,
  savePaymentSuccess,
} from "../../services/payments.services";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

type Booking = {
  bookingId: string;
  tourId: string;
  remainingAmount: number;
};

interface Props {
  booking: Booking;
  onPaid: (invoice: any) => void;
  onBack: () => void;
}

export default function PaymentStep({ booking, onPaid, onBack }: Props) {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [showQR, setShowQR] = useState(false);

  const [config, setConfig] = useState<any>({
    RETURN_URL: window.location.origin + "/payment-success",
    ELEMENT_ID: "embedded-payment",
    CHECKOUT_URL: "",
    embedded: true,
  });

  const { open } = usePayOS(config);

  const handleSuccess = useCallback(async () => {
    try {
      const payload = {
        bookingId: booking.bookingId,
        amount: booking.remainingAmount || 10000,
        transactionId: String(Date.now()),
        paymentMethod: "VIETQR",
        paymentStatus: "PAID",
      };
      console.log("Payment success payload:", payload);

      const invoice = await savePaymentSuccess(payload);
      toast.success("💳 Thanh toán thành công!");
      onPaid(invoice.data?.result ?? invoice.data);
    } catch (err) {
      toast.error("Lỗi khi lưu hóa đơn!");
    }
  }, [booking, onPaid]);

  const handlePay = async () => {
    setIsLoading(true);
    setShowQR(false);
    try {
      const data = await createPaymentLink({
        tourId: booking.tourId,
        description: `Thanh toán tour du lịch`,
        amount: 10000,
      });

      // attach success/cancel handlers and update checkout url
      setConfig((prev: any) => ({
        ...prev,
        CHECKOUT_URL: data.checkoutUrl,
        onSuccess: handleSuccess,
        onCancel: () => toast.info("Hủy thanh toán!"),
      }));

      setTimeout(() => setShowQR(true), 400);
    } catch (err) {
      toast.error("Không thể tạo link thanh toán!");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (config.CHECKOUT_URL) open();
    // only want to react when checkout url changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [config.CHECKOUT_URL]);

  return (
    <div className="flex flex-col gap-6 items-center text-center">
      <h2 className="text-xl font-semibold text-gray-800">
        Vui lòng thanh toán để hoàn tất đặt tour
      </h2>

      <button
        onClick={handlePay}
        disabled={isLoading}
        className={`px-6 py-3 rounded-xl text-white font-semibold transition-all shadow-md bg-gradient-to-r from-purple-500 to-indigo-600 hover:opacity-90 ${
          isLoading ? "opacity-50 cursor-not-allowed" : ""
        }`}
      >
        {isLoading ? "Đang tạo mã thanh toán..." : "Thanh toán ngay"}
      </button>

      {/* QR Loading + Animation */}
      <div
        className={`transition-all duration-500 w-full max-w-md ${
          showQR ? "opacity-100 scale-100" : "opacity-0 scale-95"
        }`}
      >
        <div
          id="embedded-payment"
          className="rounded-2xl border shadow-xl bg-white/80 backdrop-blur-md border-gray-200"
          style={{ height: 420 }}
        ></div>
      </div>
      <button
        onClick={() => navigate("/")}
        className={`px-6 py-3 rounded-xl text-white font-semibold transition-all shadow-md bg-gradient-to-r from-purple-500 to-indigo-600 hover:opacity-90 `}
      >
        Bỏ qua
      </button>

      <button
        onClick={onBack}
        className="mt-4 text-indigo-600 hover:text-indigo-800 underline font-medium"
      >
        ← Quay lại bước trước
      </button>
    </div>
  );
}
