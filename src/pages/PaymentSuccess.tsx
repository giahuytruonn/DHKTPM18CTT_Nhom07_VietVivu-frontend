import React from "react";
import { Link } from "react-router-dom";

const PaymentSuccess: React.FC = () => {
  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h1>🎉 Thanh toán thành công!</h1>
      <p>Cảm ơn bạn đã đặt tour tại VietVivu.</p>
      <Link to="/">
        <button style={{ marginTop: "20px", padding: "10px 20px" }}>
          ⬅ Quay về Trang Chủ
        </button>
      </Link>
    </div>
  );
};

export default PaymentSuccess;
