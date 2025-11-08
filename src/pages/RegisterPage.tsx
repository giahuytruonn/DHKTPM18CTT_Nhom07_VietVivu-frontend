import { Link } from "react-router-dom";

export default function RegisterPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <div className="bg-white p-8 rounded-2xl shadow-md w-96">
        <h2 className="text-2xl font-semibold text-center mb-6">Đăng ký</h2>
        <p className="text-center text-gray-600">
          (Chức năng đăng ký sẽ được triển khai sau)
        </p>
        <Link
          to="/login"
          className="mt-6 w-full block text-center bg-indigo-600 text-white p-2 rounded hover:bg-indigo-700"
        >
          Quay lại Đăng nhập
        </Link>
      </div>
    </div>
  );
}