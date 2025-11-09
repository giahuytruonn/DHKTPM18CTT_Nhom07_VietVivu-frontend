import React from "react";
import { Link } from "react-router-dom";

const PaymentCancel: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen text-center">
      <h1 className="text-3xl font-bold text-red-500">❌ Thanh toán bị hủy</h1>
      <p className="mt-3 text-gray-700">
        Bạn có thể thử lại thanh toán hoặc quay về trang chủ.
      </p>
      <div className="mt-6 space-x-4">
        <Link to="/payment">
          <button className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition">
            🔁 Thử lại thanh toán
          </button>
        </Link>
        <Link to="/">
          <button className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition">
            ⬅ Trang chủ
          </button>
        </Link>
      </div>
    </div>
  );
};

export default PaymentCancel;
