import React from "react";
import { Link } from "react-router-dom";

const PaymentCancel: React.FC = () => {
  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h1>❌ Thanh toán đã bị hủy</h1>
      <p>Nếu đây là sự nhầm lẫn, bạn có thể thử thanh toán lại.</p>
      <Link to="/payment">
        <button style={{ marginTop: "20px", padding: "10px 20px" }}>
          🔄 Thử thanh toán lại
        </button>
      </Link>
      <br />
      <Link to="/">
        <button style={{ marginTop: "20px", padding: "10px 20px" }}>
          ⬅ Quay về Trang Chủ
        </button>
      </Link>
    </div>
  );
};

export default PaymentCancel;
