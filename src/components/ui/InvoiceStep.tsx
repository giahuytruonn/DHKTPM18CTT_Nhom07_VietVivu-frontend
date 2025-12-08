import React from "react";
import { useNavigate } from "react-router-dom";

type Invoice = {
  amount: number;
  invoiceDate: string | number;
  transactionId: string;
};

interface Props {
  invoice: Invoice;
}

export default function InvoiceStep({ invoice }: Props) {
  const navigate = useNavigate();

  const amount = invoice?.amount ?? 0;
  const invoiceDate = invoice?.invoiceDate
    ? new Date(invoice.invoiceDate)
    : null;

  return (
    <div className="flex justify-center p-6">
      <div className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-md text-center">
        <div className="text-green-600 text-5xl mb-2">✔</div>
        <h2 className="text-2xl font-bold text-green-600 mb-4">
          Thanh toán thành công!
        </h2>

        <div className="space-y-3 text-gray-700 text-lg">
          <p>
            <span className="font-semibold">Số tiền: </span>
            {amount.toLocaleString()}₫
          </p>

          <p>
            <span className="font-semibold">Ngày phát hành: </span>
            {invoiceDate ? invoiceDate.toLocaleString() : "-"}
          </p>

          <p>
            <span className="font-semibold">Mã giao dịch: </span>
            {invoice?.transactionId ?? "-"}
          </p>
        </div>

        <button
          onClick={() => navigate("/")}
          className="mt-6 w-full py-3 rounded-xl bg-blue-600 text-white font-semibold shadow-md hover:bg-blue-700 transition-all"
        >
          Về trang chủ
        </button>
      </div>
    </div>
  );
}
