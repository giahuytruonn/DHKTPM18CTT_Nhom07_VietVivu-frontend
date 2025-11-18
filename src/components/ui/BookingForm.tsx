import React, { useState } from "react";
import { bookTour } from "../../services/booking.services";
import { toast } from "sonner";

interface BookingFormProps {
  tourId: string;
  userId: string | null;
  authenticated: boolean;
  onBooked: (data: any) => void;
}

interface BookingFormData {
  tourId: string;
  userId: string | null;
  name: string;
  email: string;
  phone: string;
  address: string;
  numOfAdults: number;
  numOfChildren: number;
  bookingDate: string;
  promotionId: string; // ← thêm vào
}

export default function BookingForm({
  tourId,
  userId,
  authenticated,
  onBooked,
}: BookingFormProps) {
  const [form, setForm] = useState<BookingFormData>({
    tourId,
    userId,
    name: "",
    email: "",
    phone: "",
    address: "",
    numOfAdults: 1,
    numOfChildren: 0,
    bookingDate: new Date().toISOString().split("T")[0],
    promotionId: "124-51-1198", // hoặc "" nếu backend chấp nhận
  });

  const handleChange = (key: keyof BookingFormData, value: any) => {
    setForm({ ...form, [key]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("userId:", form.userId);

    if (!authenticated) {
      if (!form.name || !form.email || !form.phone) {
        toast.error("Vui lòng nhập đầy đủ thông tin!");
        return;
      }
    }

    try {
      const res = await bookTour(form);
      toast.success("Đặt tour thành công!");
      onBooked(res);
    } catch (err) {
      toast.error("Lỗi khi đặt tour!");
      console.error(err);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
      {!authenticated && (
        <>
          <input
            type="text"
            placeholder="Họ tên"
            value={form.name}
            onChange={(e) => handleChange("name", e.target.value)}
            className="border p-2 rounded"
          />

          <input
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={(e) => handleChange("email", e.target.value)}
            className="border p-2 rounded"
          />

          <input
            type="tel"
            placeholder="Số điện thoại"
            value={form.phone}
            onChange={(e) => handleChange("phone", e.target.value)}
            className="border p-2 rounded"
          />
        </>
      )}
      <p>Số người lớn</p>
      <input
        type="number"
        min={1}
        placeholder="Số người lớn"
        value={form.numOfAdults}
        onChange={(e) => handleChange("numOfAdults", Number(e.target.value))}
        className="border p-2 rounded"
      />
      <p>Số trẻ em</p>
      <input
        type="number"
        min={0}
        placeholder="Số trẻ em"
        value={form.numOfChildren}
        onChange={(e) => handleChange("numOfChildren", Number(e.target.value))}
        className="border p-2 rounded"
      />
      <p>Địa chỉ</p>
      <input
        type="text"
        placeholder="Địa chỉ"
        value={form.address}
        onChange={(e) => handleChange("address", e.target.value)}
        className="border p-2 rounded"
      />

      <button
        type="submit"
        className="bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
      >
        Tiếp tục
      </button>
    </form>
  );
}
