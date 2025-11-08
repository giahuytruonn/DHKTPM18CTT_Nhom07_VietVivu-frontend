import { useState } from "react";
import { Stepper, Step, StepLabel} from "@mui/material";
import BookingForm from "./BookingForm";
import PaymentStep from "./PaymentStep";
import InvoiceStep from "./InvoiceStep";

const steps = ["Thông tin đặt tour", "Thanh toán", "Hóa đơn"];

export default function BookingStepper() {
  const [activeStep, setActiveStep] = useState(0);
  const [bookingData, setBookingData] = useState<any>(null);
  const [invoiceData, setInvoiceData] = useState<any>(null);

  const handleNext = () => setActiveStep((prev) => prev + 1);
  const handleBack = () => setActiveStep((prev) => prev - 1);

  return (
    <div className="max-w-2xl mx-auto mt-10 bg-white p-6 rounded-2xl shadow-lg">
      <Stepper activeStep={activeStep} alternativeLabel>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>

      <div className="mt-8">
        {activeStep === 0 && (
          <BookingForm
            onBooked={(data) => {
              setBookingData(data);
              handleNext();
            }}
          />
        )}
        {activeStep === 1 && bookingData && (
          <PaymentStep
            booking={bookingData}
            onPaid={(invoice : any) => {
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
