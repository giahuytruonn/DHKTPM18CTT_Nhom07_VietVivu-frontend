
export default function InvoiceStep({ invoice }: any) {
  return (
    <div className="text-center">
      <h2 className="text-2xl font-bold text-green-600 mb-4">
        🎉 Thanh toán thành công!
      </h2>
      <p>Hóa đơn: #{invoice.invoiceId}</p>
      <p>Số tiền: {invoice.amount.toLocaleString()}₫</p>
      <p>Ngày phát hành: {invoice.invoiceDate}</p>
      <p>Mã giao dịch: {invoice.transactionId}</p>

      <a
        href={`/api/invoices/${invoice.invoiceId}/pdf`}
        target="_blank"
        rel="noreferrer"
        className="mt-4 inline-block bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        📄 Tải hóa đơn PDF
      </a>
    </div>
  );
}
