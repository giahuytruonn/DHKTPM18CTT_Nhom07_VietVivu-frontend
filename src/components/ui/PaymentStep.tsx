import { useEffect, useState } from "react";
import { usePayOS } from "@payos/payos-checkout";
import {
  createPaymentLink,
  savePaymentSuccess,
} from "./../../services/payments.services";
import { toast } from "sonner";

export default function PaymentStep({ booking, onPaid, onBack }: any) {
  const [config, setConfig] = useState({
    RETURN_URL: window.location.origin + "/payment-success",
    ELEMENT_ID: "embedded-payment",
    CHECKOUT_URL: "",
    embedded: true,
    onSuccess: () => handleSuccess(),
    onCancel: () => toast.info("Hủy thanh toán!"),
  });

  const { open, exit } = usePayOS(config);

  const handlePay = async () => {
    try {
      const data = await createPaymentLink({
        tourId: booking.tourId,
        description: `thanh toan tour`,
        amount: 10000,
      });
      console.log(data);
      setConfig((prev) => ({ ...prev, CHECKOUT_URL: data.checkoutUrl }));
    } catch (err) {
      toast.error("Không thể tạo link thanh toán!");
    }
  };

  useEffect(() => {
    if (config.CHECKOUT_URL) open();
  }, [config]);

  const handleSuccess = async () => {
    try {
      const payload = {
        bookingId: booking.bookingId,
        amount: booking.remainingAmount,
        transactionId: String(Date.now()),
        paymentMethod: "VIETQR",
        paymentStatus: "PAID",
      };
      const invoice = await savePaymentSuccess(payload);
      toast.success("💳 Thanh toán thành công!");
      onPaid(invoice.data.result);
    } catch (err) {
      toast.error("Lỗi khi lưu hóa đơn!");
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <p>Vui lòng thanh toán để hoàn tất đặt tour.</p>
      <button
        onClick={handlePay}
        className="bg-green-500 text-white py-2 rounded"
      >
        Thanh toán ngay
      </button>
      <div id="embedded-payment" style={{ height: 400 }}></div>
      <button onClick={onBack} className="text-gray-500 underline mt-2">
        ← Quay lại
      </button>
    </div>
  );
}
