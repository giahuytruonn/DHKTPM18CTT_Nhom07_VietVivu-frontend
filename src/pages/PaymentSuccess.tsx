import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { savePaymentSuccess } from "../services/payments.services";
import { toast } from "sonner";

const PaymentSuccess: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    console.log(params)
    const transactionId = params.get("orderCode") || "";
    const amount = Number(params.get("amount")) || 0;
    const bookingId = params.get("bookingId") || "";
    if (!transactionId || !bookingId) {
      toast.error("Thiếu thông tin thanh toán!");
      navigate("/");
      return;
    }

    const savePayment = async () => {
      try {
        await savePaymentSuccess({
          bookingId,
          amount,
          transactionId,
          paymentMethod: "PAYOS",
          paymentStatus: "SUCCESS",
        });
        toast.success("✅ Đã lưu hóa đơn & thanh toán!");
      } catch (error) {
        toast.error("⚠ Lưu thanh toán thất bại!");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    savePayment();
  }, []);

  return (
    <div className="flex flex-col items-center justify-center h-screen text-center">
      {loading ? (
        <>
          <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-gray-600">Đang xử lý thanh toán...</p>
        </>
      ) : (
        <>
          <h1 className="text-3xl font-bold text-green-600">
            🎉 Thanh toán thành công!
          </h1>
          <p className="mt-3 text-gray-700">
            Cảm ơn bạn đã đặt tour tại <b>VietVivu</b>.
          </p>
          <Link to="/">
            <button className="mt-6 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition">
              ⬅ Quay về Trang Chủ
            </button>
          </Link>
        </>
      )}
    </div>
  );
};

export default PaymentSuccess;
