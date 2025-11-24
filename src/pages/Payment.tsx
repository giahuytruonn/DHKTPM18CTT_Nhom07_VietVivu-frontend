import React, { useState, useEffect } from "react";
import { usePayOS, type PayOSConfig } from "@payos/payos-checkout";
import { createPaymentLink } from "../services/payments.services";
import { useNavigate } from "react-router-dom";

const Payment: React.FC = () => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [isCreatingLink, setIsCreatingLink] = useState(false);
  const [message, setMessage] = useState("");

  const [config, setConfig] = useState<PayOSConfig>({
    RETURN_URL: window.location.origin + "/payment-success",
    ELEMENT_ID: "embedded-payment",
    CHECKOUT_URL: "",
    embedded: true,
    onSuccess: () => {
      navigate("/payment-success")
      setMessage("✅ Thanh toán thành công!");
      setIsOpen(false);
    },
    onCancel: () => {
      setMessage("❌ Thanh toán bị hủy!");
      setIsOpen(false);
    },
  });

  const { open, exit } = usePayOS(config);

  const handlePayment = async () => {
    setIsCreatingLink(true);
    try {
      const data = await createPaymentLink({
        tourId: 1,
        description: "Thanh toán tour",
        amount: 10000,
      });

      setConfig((prev) => ({
        ...prev,
        CHECKOUT_URL: data.checkoutUrl || "",
      }));
      setIsOpen(true);
    } catch (error) {
      console.error(error);
    } finally {
      setIsCreatingLink(false);
    }
  };

  useEffect(() => {
    if (config.CHECKOUT_URL) {
      open();
    }
  }, [config, open]);

  return (
    <div>
      {message && <p>{message}</p>}
      {!isOpen ? (
        <button onClick={handlePayment} disabled={isCreatingLink}>
          {isCreatingLink ? "Đang tạo link..." : "Thanh toán ngay"}
        </button>
      ) : (
        <button
          onClick={() => {
            exit();
            setIsOpen(false);
          }}
        >
          Đóng thanh toán
        </button>
      )}
      <div id="embedded-payment" style={{ height: "400px" }}></div>
    </div>
  );
};

export default Payment;
