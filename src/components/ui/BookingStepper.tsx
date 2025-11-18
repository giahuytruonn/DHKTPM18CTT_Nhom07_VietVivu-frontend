import { useParams } from "react-router-dom";
import { Stepper, Step, StepLabel } from "@mui/material";
import { useState } from "react";
import { useAuthStore } from "../../stores/useAuthStore";
import { jwtDecode } from "jwt-decode";

import BookingForm from "./BookingForm";
import PaymentStep from "./PaymentStep";
import InvoiceStep from "./InvoiceStep";

interface JwtPayload {
  sub?: string;
  scope?: string;
  exp?: number;
}

export default function BookingStepper() {
  const { tourId } = useParams<{ tourId: string }>();
  const { authenticated, token } = useAuthStore();

  const [activeStep, setActiveStep] = useState<number>(0);
  const [bookingData, setBookingData] = useState<any>(null);
  const [invoiceData, setInvoiceData] = useState<any>(null);

  const userId =
    authenticated && token
      ? (jwtDecode(token) as JwtPayload).sub ?? null
      : null;

  const handleNext = () => setActiveStep((s) => s + 1);
  const handleBack = () => setActiveStep((s) => s - 1);

  return (
    <div className="max-w-2xl mx-auto mt-10 bg-white p-6 rounded-2xl shadow-lg">
      <Stepper activeStep={activeStep} alternativeLabel>
        {["Thông tin đặt tour", "Thanh toán", "Hóa đơn"].map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>

      <div className="mt-8">
        {activeStep === 0 && (
          <BookingForm
            tourId={tourId!}
            userId={userId}
            authenticated={authenticated}
            onBooked={(data) => {
              setBookingData(data);
              handleNext();
            }}
          />
        )}

        {activeStep === 1 && bookingData && (
          <PaymentStep
            booking={bookingData}
            onPaid={(invoice: any) => {
              setInvoiceData(invoice);
              handleNext();
            }}
            onBack={handleBack}
          />
        )}

        {activeStep === 2 && invoiceData && (
          <InvoiceStep invoice={invoiceData} />
        )}
      </div>
    </div>
  );
}
