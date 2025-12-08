import React, { useState } from "react";
import { bookTour, type BookingRequest } from "../../services/booking.services";
import { toast } from "sonner";

interface BookingFormProps {
  tourId: string;
  userId: string | null;
  authenticated: boolean;
  onBooked: (data: any) => void;
}

export default function BookingForm({
  tourId,
  userId,
  authenticated,
  onBooked,
}: BookingFormProps) {
  const [form, setForm] = useState<BookingRequest>({
    tourId,
    userId,
    name: "",
    email: "",
    phone: "",
    address: "",
    numOfAdults: 1,
    numOfChildren: 0,
    bookingDate: new Date().toISOString().split("T")[0],
    promotionId: "",
  });

  const handleChange = (key: keyof BookingRequest, value: any) => {
    setForm({ ...form, [key]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    console.log("Submitting booking form:", form);
    e.preventDefault();

    if (!authenticated && (!form.name || !form.email || !form.phone)) {
      toast.error("Vui lòng nhập đầy đủ thông tin!");
      return;
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
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 ">
      {!authenticated && (
        <>
          <input
            type="text"
            placeholder="Họ tên"
            value={form.name}
            onChange={(e) => handleChange("name", e.target.value)}
            className="border p-3 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500"
          />

          <input
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={(e) => handleChange("email", e.target.value)}
            className="border p-3 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500"
          />

          <input
            type="tel"
            placeholder="Số điện thoại"
            value={form.phone}
            onChange={(e) => handleChange("phone", e.target.value)}
            className="border p-3 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500"
          />
        </>
      )}

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium">Người lớn</label>
          <input
            type="number"
            min={1}
            value={form.numOfAdults}
            onChange={(e) =>
              handleChange("numOfAdults", Number(e.target.value))
            }
            className="border p-3 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 w-full"
          />
        </div>

        <div>
          <label className="text-sm font-medium">Trẻ em</label>
          <input
            type="number"
            min={0}
            value={form.numOfChildren}
            onChange={(e) =>
              handleChange("numOfChildren", Number(e.target.value))
            }
            className="border p-3 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 w-full"
          />
        </div>
      </div>

      <input
        type="text"
        placeholder="Địa chỉ"
        value={form.address}
        onChange={(e) => handleChange("address", e.target.value)}
        className="border p-3 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500"
      />

      {/* ⭐ Thêm field mã giảm giá */}
      <input
        type="text"
        placeholder="Mã khuyến mãi (nếu có)"
        value={form.promotionId}
        onChange={(e) => handleChange("promotionId", e.target.value)}
        className="border p-3 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500"
      />

      <button
        type="submit"
        className="bg-indigo-600 text-white py-3 rounded-xl font-semibold hover:bg-indigo-700 shadow-md mt-2"
      >
        Tiếp tục
      </button>
    </form>
  );
}
