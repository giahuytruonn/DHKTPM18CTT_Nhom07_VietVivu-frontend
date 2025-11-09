import React, { useState } from "react";
import { bookTour } from "../../services/booking.services";
import { toast } from "sonner";

export default function BookingForm({
  onBooked,
}: {
  onBooked: (data: any) => void;
}) {
  const [form, setForm] = useState({
    tourId: "083d54e7-89d5-44e8-8032-32acf651aab5",
    name: "",
    email: "",
    phone: "",
    address: "",
    numOfAdults: 1,
    numOfChildren: 0,
    promotionId: "124-51-1198",
    bookingDate: new Date().toISOString().split("T")[0],
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await bookTour(form);
      toast.success("✅ Đặt tour thành công!");
      onBooked(res);
    } catch (err) {
      toast.error("❌ Lỗi khi đặt tour!");
      console.error(err);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
      <input
        type="text"
        placeholder="Họ tên"
        value={form.name}
        onChange={(e) => setForm({ ...form, name: e.target.value })}
        className="border p-2 rounded"
      />
      <input
        type="email"
        placeholder="Email"
        value={form.email}
        onChange={(e) => setForm({ ...form, email: e.target.value })}
        className="border p-2 rounded"
      />
      <input
        type="tel"
        placeholder="Số điện thoại"
        value={form.phone}
        onChange={(e) => setForm({ ...form, phone: e.target.value })}
        className="border p-2 rounded"
      />
      <input
        type="text"
        placeholder="Địa chỉ"
        value={form.address}
        onChange={(e) => setForm({ ...form, address: e.target.value })}
        className="border p-2 rounded"
      />
      <button
        type="submit"
        className="bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
      >
        Đặt tour
      </button>
    </form>
  );
}
