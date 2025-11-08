// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { useAuthStore } from "../stores/useAuthStore";
// import { logout as logoutApi } from "../services/auth.service";
// import { createPassword } from "../services/user.servie";
// import type { PasswordCreationRequest } from "../types/user";
// import { useUser } from "../hooks/useUser";
// import { useMutation, useQueryClient } from "@tanstack/react-query";
// import { toast } from "sonner";

// const Home: React.FC = () => {
//   const navigate = useNavigate();
//   const queryClient = useQueryClient();
//   const { token, logout } = useAuthStore();
//   const [password, setPassword] =
//     useState<PasswordCreationRequest["password"]>("");

//   const { user, isLoading, isError, refetch } = useUser();

//   const createPasswordMutation = useMutation({
//     mutationFn: (data: PasswordCreationRequest) => createPassword(data),
//     onSuccess: () => {
//       toast.success("Tạo mật khẩu thành công!");
//       queryClient.invalidateQueries({ queryKey: ["userProfile"] });
//       setPassword("");
//     },
//     onError: () => {
//       toast.error("Tạo mật khẩu thất bại!");
//     },
//   });

//   const logoutMutation = useMutation({
//     mutationFn: async () => {
//       const currentToken = token || localStorage.getItem("token");
//       if (currentToken) {
//         await logoutApi(currentToken);
//       }
//     },
//     onSuccess: () => {
//       toast.info("Đăng xuất thành công!");
//     },
//     onError: () => {
//       toast.error("Lỗi khi đăng xuất!");
//     },
//     onSettled: () => {
//       logout();
//       localStorage.clear();
//       queryClient.clear();
//       navigate("/login", { replace: true });
//     },
//   });

//   if (isLoading) {
//     return (
//       <div className="flex flex-col items-center justify-center h-screen bg-gray-50">
//         <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
//         <p className="text-gray-600">Đang tải thông tin người dùng...</p>
//       </div>
//     );
//   }

//   if (isError || !user) {
//     return (
//       <div className="flex flex-col items-center justify-center h-screen bg-red-50">
//         <p className="text-red-600 text-lg mb-4">
//           Lỗi tải thông tin người dùng!
//         </p>
//         <button
//           onClick={() => refetch()}
//           className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
//         >
//           Thử lại
//         </button>
//       </div>
//     );
//   }

//   return (
//     <div className="flex flex-col items-center justify-center h-screen bg-gray-50">
//       <h1 className="text-3xl font-bold mb-6">Trang chủ</h1>

//       {/* ✅ Nút chuyển sang Stepper booking */}
//       <button
//         onClick={() => navigate("/book-tour")}
//         className="bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600 transition mb-6"
//       >
//         🧳 Đặt tour ngay
//       </button>

//       {user.noPassword ? (
//         <div className="flex flex-col items-center mb-6">
//           <input
//             type="password"
//             placeholder="Nhập mật khẩu mới"
//             value={password}
//             onChange={(e) => setPassword(e.target.value)}
//             className="border border-gray-300 rounded-lg px-4 py-2 mb-4 focus:ring focus:ring-blue-300 outline-none"
//           />
//           <button
//             onClick={() => {
//               if (!password.trim()) {
//                 toast.warning("Vui lòng nhập mật khẩu!");
//                 return;
//               }
//               createPasswordMutation.mutate({ password });
//             }}
//             disabled={createPasswordMutation.isPending}
//             className={`${
//               createPasswordMutation.isPending
//                 ? "bg-blue-300"
//                 : "bg-blue-500 hover:bg-blue-600"
//             } text-white px-4 py-2 rounded-lg transition`}
//           >
//             {createPasswordMutation.isPending ? "Đang tạo..." : "Tạo mật khẩu"}
//           </button>
//         </div>
//       ) : (
//         <p className="text-gray-700 mb-6">
//           Chào mừng, <span className="font-semibold">{user.name}</span>!
//         </p>
//       )}

//       <button
//         onClick={() => logoutMutation.mutate()}
//         disabled={logoutMutation.isPending}
//         className={`${
//           logoutMutation.isPending
//             ? "bg-red-300"
//             : "bg-red-500 hover:bg-red-600"
//         } text-white px-4 py-2 rounded-lg transition`}
//       >
//         {logoutMutation.isPending ? "Đang đăng xuất..." : "Đăng xuất"}
//       </button>
//     </div>
//   );
// };

// export default Home;


import { Link } from "react-router-dom";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import SearchBar from "../components/layout/SearchBar";
import { Users, Shield, Clock, Star, ChevronRight } from "lucide-react";

const spotlight = [
  "Hà Nội", "Đà Nẵng", "Hội An", "Sapa", "Huế", "Nha Trang",
  "Phú Quốc", "Đà Lạt", "Vũng Tàu", "Cần Thơ", "Hạ Long", "Phong Nha"
];

const mockTours = [
  { id: "1", title: "Khám phá Hà Nội cổ kính", destination: "Hà Nội", price: 1_200_000, duration: "1 ngày", rating: 4.8 },
  { id: "2", title: "Vịnh Hạ Long – Kỳ quan thiên nhiên", destination: "Quảng Ninh", price: 2_500_000, duration: "2 ngày 1 đêm", rating: 4.9 },
  { id: "3", title: "Phú Quốc – Thiên đường biển đảo", destination: "Kiên Giang", price: 3_500_000, duration: "3 ngày 2 đêm", rating: 4.7 },
];

const blogPosts = [
  { date: "Oct 28 2025", title: "5 điểm đến ít người biết ở Hà Nội", excerpt: "Hà Nội không chỉ có Hồ Gươm...", link: "#" },
  { date: "Oct 14 2025", title: "Tại sao nên đi tour riêng?", excerpt: "Trải nghiệm chân thực, linh hoạt...", link: "#" },
];

export default function Home() {
  return (
    <>
      <Header />

      
      <section className="relative bg-gradient-to-br from-indigo-50 to-blue-100 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Đi theo cách thân thiện hơn
          </h1>
          <p className="text-xl text-gray-700 mb-10 max-w-3xl mx-auto">
            Thật sự hiểu một vùng đất qua những người biết rõ nhất — hướng dẫn viên địa phương.
          </p>
          <SearchBar className="max-w-2xl mx-auto" />
        </div>
      </section>

      
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            {[
              { icon: Users, title: "Hướng dẫn viên địa phương", desc: "Người bản địa am hiểu, nhiệt tình" },
              { icon: Shield, title: "Tour riêng tư", desc: "Chỉ bạn và nhóm của bạn" },
              { icon: Clock, title: "Linh hoạt hủy", desc: "Hủy miễn phí trước 24h" },
              { icon: Star, title: "Hỗ trợ 24/7", desc: "Luôn sẵn sàng giúp bạn" },
            ].map((f, i) => (
              <div key={i}>
                <div className="bg-indigo-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <f.icon className="text-indigo-600" size={32} />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">{f.title}</h3>
                <p className="text-gray-600">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

     
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">Điểm đến nổi bật</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {spotlight.map((d) => (
              <Link
                key={d}
                to="#"
                className="group relative overflow-hidden rounded-xl shadow-md hover:shadow-xl transition"
              >
                <div className="bg-gray-200 border-2 border-dashed rounded-xl w-full h-32" />
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 flex items-center justify-center transition">
                  <p className="text-white font-semibold opacity-0 group-hover:opacity-100">{d}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

     
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold">Tour nổi bật</h2>
            <Link to="/tours" className="text-indigo-600 hover:text-indigo-700 flex items-center">
              Xem tất cả <ChevronRight size={20} />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {mockTours.map((t) => (
              <Link
                key={t.id}
                to={`/tours/${t.id}`}
                className="group bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition"
              >
                <div className="bg-gray-200 border-2 border-dashed rounded-t-xl w-full h-48" />
                <div className="p-6">
                  <h3 className="font-semibold text-lg text-gray-900 group-hover:text-indigo-600 transition">
                    {t.title}
                  </h3>
                  <p className="text-gray-600 mt-1">{t.destination}</p>
                  <div className="flex justify-between items-center mt-4">
                    <span className="text-2xl font-bold text-indigo-600">
                      {t.price.toLocaleString("vi-VN")}₫
                    </span>
                    <span className="text-sm text-gray-600">{t.duration}</span>
                  </div>
                  {t.rating && (
                    <div className="flex items-center mt-2">
                      <Star className="text-yellow-400 fill-current" size={16} />
                      <span className="ml-1 text-sm text-gray-700">{t.rating}</span>
                    </div>
                  )}
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

    
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold">Từ blog</h2>
            <Link to="/blog" className="text-indigo-600 hover:text-indigo-700 flex items-center">
              Xem thêm <ChevronRight size={20} />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {blogPosts.map((p, i) => (
              <article key={i} className="bg-white rounded-xl shadow-md overflow-hidden">
                <div className="bg-gray-200 border-2 border-dashed rounded-t-xl w-full h-48" />
                <div className="p-6">
                  <p className="text-sm text-gray-500">{p.date}</p>
                  <h3 className="text-xl font-semibold text-gray-900 mt-2 hover:text-indigo-600 transition">
                    <Link to={p.link}>{p.title}</Link>
                  </h3>
                  <p className="text-gray-600 mt-2">{p.excerpt}</p>
                  <Link to={p.link} className="inline-flex items-center text-indigo-600 mt-4 hover:text-indigo-700 font-medium">
                    Đọc thêm <ChevronRight size={16} className="ml-1" />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>


      <section className="py-16 bg-indigo-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Trở thành hướng dẫn viên
          </h2>
          <p className="text-xl mb-8 max-w-3xl mx-auto">
            Bạn yêu du lịch, am hiểu địa phương? Hãy chia sẻ trải nghiệm độc đáo với du khách toàn cầu.
          </p>
          <Link
            to="/become-guide"
            className="inline-block bg-white text-indigo-600 px-8 py-3 rounded-full font-semibold hover:bg-gray-100 transition"
          >
            Tham gia ngay
          </Link>
        </div>
      </section>

      <Footer />
    </>
  );
}