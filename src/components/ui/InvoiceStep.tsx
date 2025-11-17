import { useNavigate } from "react-router-dom";

export default function InvoiceStep({ invoice }: any) {
  const navigate = useNavigate();
  return (
    <div className="text-center">
      <h2 className="text-2xl font-bold text-green-600 mb-4">
        🎉 Thanh toán thành công!
      </h2>
      <p>Hóa đơn: #{invoice.invoiceId}</p>
      <p>Số tiền: {invoice.amount.toLocaleString()}₫</p>
      <p>Ngày phát hành: {invoice.invoiceDate}</p>
      <p>Mã giao dịch: {invoice.transactionId}</p>

      <button
        className="bg-blue-500 p-2 m-2 text-white border rounded cursor-pointer hover:bg-blue-600"
        onClick={() => navigate("/")}
      >
        Về trang chủ
      </button>
    </div>
  );
}
