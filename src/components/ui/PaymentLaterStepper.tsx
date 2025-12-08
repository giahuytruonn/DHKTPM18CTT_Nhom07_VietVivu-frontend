import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Stepper, Step, StepLabel } from "@mui/material";

import PaymentStep from "./PaymentStep";
import InvoiceStep from "./InvoiceStep";
import api from "../../services/api";
import { getTourById } from "../../services/tour.service";
import { getBookingById } from "../../services/booking.services";

export default function PaymentLaterStepper() {
  const { bookingId } = useParams<{ bookingId: string }>();

  const [activeStep, setActiveStep] = useState(0);
  const [bookingData, setBookingData] = useState<any>(null);
  const [invoiceData, setInvoiceData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Lấy thông tin booking cũ để thanh toán
  const fetchBooking = async () => {
    try {
      setLoading(true);
      const res = await getBookingById(bookingId!);

      setBookingData(res);
      console.log("Fetched booking data:", res);
    } catch (err) {
      console.error("Lỗi kết nối:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBooking();
  }, [bookingId]);

  const handleNext = () => setActiveStep((s) => s + 1);
  const handleBack = () => setActiveStep((s) => s - 1);

  if (loading)
    return (
      <div className="flex justify-center items-center h-[300px] text-lg">
        Đang tải thông tin booking...
      </div>
    );

  return (
    <div className="flex flex-col items-center justify-center bg-gradient-to-br from-indigo-50 to-blue-50 py-10">
      <div className="bg-white p-10 rounded-2xl shadow-xl w-full max-w-3xl border border-white/40 backdrop-blur-xl">
        <h2 className="text-3xl font-bold text-center mb-6 bg-gradient-to-r from-indigo-600 to-blue-600 bg-clip-text text-transparent">
          Thanh Toán Lại
        </h2>

        {/* Stepper */}
        <Stepper
          activeStep={activeStep}
          alternativeLabel
          sx={{
            "& .MuiStepLabel-label": { fontSize: "1rem", fontWeight: 600 },
            "& .MuiStepIcon-root.Mui-active": { color: "#4f46e5" },
            "& .MuiStepIcon-root.Mui-completed": { color: "#16a34a" },
          }}
        >
          {["Thanh toán", "Hóa đơn"].map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        {/* Nội dung Step */}
        <div className="mt-10">
          {activeStep === 0 && bookingData && (
            <PaymentStep
              booking={bookingData}
              onPaid={(invoice) => {
                setInvoiceData(invoice);
                handleNext();
              }}
              onBack={handleBack}
            />
          )}

          {activeStep === 1 && invoiceData && (
            <InvoiceStep invoice={invoiceData} />
          )}
        </div>
      </div>
    </div>
  );
}
