
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../stores/useAuthStore";
import { logout as logoutApi } from "../services/auth.service";
import { createPassword } from "../services/user.servie";
import type { PasswordCreationRequest } from "../types/user";
import { useUser } from "../hooks/useUser";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import ChatBox from "../components/ChatBox";
import { Link } from "react-router-dom";
import React, { useEffect, useState, useMemo } from "react";
import SearchBar from "../components/layout/SearchBar";
import {
  Users,
  Shield,
  Clock,
  Star,
  ChevronRight,
  Heart,
  MapPin,
  Globe,
  MessageCircle,
  ArrowRight,
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { getTours } from "../services/tour.service";
import type { TourResponse } from "../types/tour";

const blogPosts = [
  {
    date: "Oct 28 2025",
    title: "5 điểm đến ít người biết ở Hà Nội",
    excerpt: "Hà Nội không chỉ có Hồ Gươm...",
    link: "#",
    image:
      "https://dynamic-media-cdn.tripadvisor.com/media/photo-o/23/98/95/a0/hidden-gem-cafe-the-best.jpg?w=900&h=500&s=1",
  },
  {
    date: "Oct 14 2025",
    title: "Tại sao nên đi tour riêng?",
    excerpt: "Trải nghiệm chân thực, linh hoạt...",
    link: "#",
    image:
      "https://luxtraveldmc.com/blog/wp-content/uploads/2019/04/Benefits-of-Private-tour-to-Vietnam-and-Cambodia-2-e1555400956433.jpg",
  },
];
const localGuides = [
  {
    id: 1,
    name: "Nguyễn Xuân Chức",
    location: "Thành phố Huế, Việt Nam",
    rating: 5,
    reviews: 124,
    languages: ["Tiếng Việt", "English", "Français"],
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400",
    tours: 15,
  },
  {
    id: 2,
    name: "Trần Nhật Duy",
    location: "Thành phố Cao Lãnh, Đồng Tháp",
    rating: 5,
    reviews: 98,
    languages: ["Tiếng Việt", "English", "Japanese"],
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400",
    tours: 12,
  },
  {
    id: 3,
    name: "Võ Thái Duy",
    location: "Đồng Nai, Việt Nam",
    rating: 5,
    reviews: 156,
    languages: ["Tiếng Việt", "English", "Korean"],
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400",
    tours: 18,
  },
  {
    id: 4,
    name: "Trương Gia Huy",
    location: "Gò Vấp, TP.HCM",
    rating: 4.9,
    reviews: 87,
    languages: ["Tiếng Việt", "English", "Chinese"],
    avatar: "https://scontent.fsgn2-8.fna.fbcdn.net/v/t39.30808-6/480496622_2768612389967459_8581805903290317168_n.jpg?stp=cp6_dst-jpg_tt6&_nc_cat=102&ccb=1-7&_nc_sid=6ee11a&_nc_eui2=AeFvjdo8bt--0mrEj0653NQjff06shXzsGx9_TqyFfOwbJOrmEY7_ZdE-fcconuNY8z8ppDNd20MtWuaede2Z-vF&_nc_ohc=AaZtsFW2vY8Q7kNvwEQLiD2&_nc_oc=Adm5KrBOG3hbTeMFJCLGowYQpgS57nV-D2NByyjZ47WGRXojJ4SMSlEXbCVjPTdbby0&_nc_zt=23&_nc_ht=scontent.fsgn2-8.fna&_nc_gid=LL8MQ5D9dXAj9d1Vlp6_Dg&oh=00_AfgICS3US70c9YzqLQ403hyl5xKwcjM1XDtr-VrnoY0-Yg&oe=691CB7DA",
    tours: 10,
  },
  {
    id: 5,
    name: "Nguyễn Thanh Huy",
    location: "Gia Lai, Việt Nam",
    rating: 5,
    reviews: 124,
    languages: ["Tiếng Việt", "English", "Français"],
    avatar: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=400",
    tours: 15,
  },
];

export default function Home() {
  const { data: tours = [], isLoading } = useQuery({
    queryKey: ["tours-home"],
    queryFn: getTours, // Sử dụng hàm từ service
    staleTime: 1000 * 60 * 5,
  });

  const { destinations, featuredTours } = useMemo(() => {
    if (!tours.length) {
      return { destinations: [], featuredTours: [] };
    }

    const allDestinations: string[] = [];
    tours.forEach((t: TourResponse) => {
      if (t.destination) {
        const parts = t.destination
          .split(/–|-/)
          .map((s: string) => s.trim())
          .filter((s: string) => s.length > 0);
        allDestinations.push(...parts);
      }
    });

    const uniqueDests = Array.from(new Set(allDestinations));

    const usedImageUrls = new Set<string>();
    const destWithImages = uniqueDests
      .map((dest) => {
        // 1. Tìm tour có ảnh CHƯA SỬ DỤNG
        const tourWithUnusedImage = tours.find(
          (t: TourResponse) =>
            t.destination?.includes(dest) &&
            Array.isArray(t.imageUrls) &&
            t.imageUrls.length > 0 &&
            !usedImageUrls.has(t.imageUrls[0]) // Kiểm tra ảnh chưa dùng
        );

        if (tourWithUnusedImage) {
          const imageUrl = tourWithUnusedImage.imageUrls[0];
          usedImageUrls.add(imageUrl); // Đánh dấu là đã dùng
          return { name: dest, image: imageUrl };
        }

        // 2. Fallback: Tìm BẤT KỲ tour nào có ảnh (kể cả đã dùng)
        const tourWithAnyImage = tours.find(
          (t: TourResponse) =>
            t.destination?.includes(dest) &&
            Array.isArray(t.imageUrls) &&
            t.imageUrls.length > 0
        );

        if (tourWithAnyImage) {
          return { name: dest, image: tourWithAnyImage.imageUrls[0] };
        }

        // 3. Nếu không có ảnh, trả về null để lọc bỏ sau
        return null;
      })
      .filter((dest): dest is { name: string; image: string } => dest !== null) // Lọc bỏ các mục null
      .slice(0, 12); // Lấy 12 mục ĐÃ CÓ ẢNH
    // --- KẾT THÚC THAY ĐỔI ---

    const withImages = tours
      .filter((t: TourResponse) => Array.isArray(t.imageUrls) && t.imageUrls.length > 0)
      .slice(0, 3)
      .map((t: TourResponse) => ({
        ...t,
        id: t.tourId,
        rating: t.favoriteCount > 50 ? 4.9 : t.favoriteCount > 20 ? 4.7 : 4.5,
        reviews: Math.floor(Math.random() * 300) + 50,
      }));

    return { destinations: destWithImages, featuredTours: withImages };
  }, [tours]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-xl text-gray-600">Đang tải tour...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <ChatBox/>
      {/* ===== HERO ===== */}
      <section
        className="relative h-[70vh] bg-cover bg-center bg-no-repeat flex items-center justify-center text-white overflow-hidden"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80')`,
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-gray-900/60 to-indigo-900/30"></div>
        <div className="relative z-10 text-center px-4 max-w-4xl animate-fade-in">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight drop-shadow-lg">
            Đi theo cách thân thiện hơn
          </h1>
          <p className="text-xl mb-10 max-w-3xl mx-auto text-gray-100 drop-shadow-md">
            Thật sự hiểu một vùng đất qua những người biết rõ nhất — hướng dẫn
            viên địa phương.
          </p>
          <SearchBar className="max-w-2xl mx-auto shadow-lg" />
        </div>
      </section>

      {/* ===== ĐIỂM ĐẾN NỔI BẬT ===== */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-center mb-16 text-indigo-800 animate-fade-in-up">
            Điểm đến nổi bật
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
            {destinations.map((dest, index) => (
              <Link
                key={index}
                to="#"
                className="group relative overflow-hidden rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
              >
                <img
                  src={dest.image}
                  alt={dest.name}
                  className="w-full h-56 object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-indigo-900/70 to-transparent opacity-70 group-hover:opacity-90 transition-opacity duration-300"></div>
                <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                  <p className="font-bold text-lg drop-shadow-md">{dest.name}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ===== HƯỚNG DẪN VIÊN ===== */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 animate-fade-in">
            <Users className="w-12 h-12 text-indigo-600 mx-auto mb-4" />
            <h2 className="text-3xl md:text-4xl font-bold text-indigo-900 mb-4">
              Gặp gỡ hướng dẫn viên địa phương của bạn
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
            {localGuides.map((guide, index) => (
              <div
                key={guide.id}
                className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-2xl transition-all duration-300 group animate-fade-in-up flex flex-col"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="relative">
                  <img
                    src={guide.avatar}
                    alt={guide.name}
                    className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <button className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm p-2 rounded-full hover:bg-white transition-all shadow-md">
                    <Heart className="w-5 h-5 text-indigo-600" />
                  </button>
                </div>

                <div className="p-6 flex flex-col flex-grow">
                  <h3 className="text-xl font-bold text-indigo-900 mb-1 group-hover:text-indigo-700 transition-colors">
                    {guide.name}
                  </h3>

                  <div className="flex items-center text-sm text-gray-600 mb-3">
                    <MapPin className="w-4 h-4 mr-1 text-indigo-600" />
                    <span>{guide.location}</span>
                  </div>

                  <div className="flex items-center mb-3">
                    <span className="text-lg font-bold text-indigo-900 mr-1">
                      {guide.rating}
                    </span>
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className="w-4 h-4 text-yellow-400 fill-current"
                      />
                    ))}
                    <span className="ml-2 text-sm text-gray-600">
                      ({guide.reviews})
                    </span>
                  </div>

                  <div className="flex items-center text-sm text-gray-600 mb-4">
                    <Globe className="w-4 h-4 mr-2 text-indigo-600" />
                    <span className="line-clamp-1">
                      {guide.languages.join(", ")}
                    </span>
                  </div>

                  <button className="w-full bg-indigo-600 text-white py-2 rounded-full hover:bg-indigo-700 transition-all duration-300 flex items-center justify-center shadow-md hover:shadow-lg transform hover:-translate-y-0.5 mt-auto">
                    <MessageCircle className="w-4 h-4 mr-2" />
                    Nhắn tin
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link
              to="/guides"
              className="inline-flex items-center text-indigo-600 hover:text-indigo-800 font-medium text-lg transition-colors"
            >
              Xem tất cả hướng dẫn viên
              <ChevronRight className="w-5 h-5 ml-1" />
            </Link>
          </div>
        </div>
      </section>

      {/* ===== TOUR NỔI BẬT ===== */}
      <section id="tours" className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold text-indigo-900">Tour nổi bật</h2>
            <Link
              to="/tours"
              className="text-indigo-600 hover:text-indigo-800 flex items-center font-medium transition-colors"
            >
              Xem tất cả <ChevronRight size={20} />
            </Link>
          </div>

          {/* Cập nhật bố cục cho bằng nhau (đã làm ở lần trước) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:grid-rows-1">
            {featuredTours.map((tour, index) => (
              <Link
                key={tour.tourId}
                to={`/tours/${tour.tourId}`}
                // Thêm `flex flex-col`
                className="group bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1 animate-fade-in-up flex flex-col"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="relative">
                  <img
                    src={tour.imageUrls[0]}
                    alt={tour.title}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <button className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm p-2 rounded-full hover:bg-white transition-all shadow-md z-10">
                    <Heart className="w-5 h-5 text-indigo-600" />
                  </button>

                  {tour.rating === 4.9 && (
                    <div className="absolute top-4 left-4 bg-cyan-500 text-white text-xs font-bold px-3 py-1 rounded-full z-10">
                      Best Seller
                    </div>
                  )}
                </div>

                {/* Thêm `flex flex-col flex-grow` */}
                <div className="p-6 flex flex-col flex-grow">
                  <div className="flex items-center text-sm text-gray-600 mb-2">
                    <MapPin className="w-4 h-4 mr-1 text-indigo-600" />
                    <span>{tour.destination}</span>
                  </div>

                  <h3 className="text-lg font-bold text-indigo-900 mb-2 group-hover:text-indigo-700 transition line-clamp-2">
                    {tour.title}
                  </h3>

                  <div className="flex items-center mb-3">
                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                    <span className="ml-1 text-sm font-medium">
                      {tour.rating || 4.8}
                    </span>
                    <span className="ml-1 text-sm text-gray-600">
                      ({tour.reviews || 0})
                    </span>
                  </div>

                  <div className="flex items-center text-sm text-gray-600 mb-4">
                    <Clock className="w-4 h-4 mr-1 text-indigo-600" />
                    <span>{tour.duration}</span>
                  </div>

                  {/* Thêm `mt-auto` */}
                  <div className="border-t pt-4 mt-auto">
                    <div className="flex justify-between items-center">
                      <span className="text-2xl font-bold text-indigo-600">
                        {Number(tour.priceAdult).toLocaleString("vi-VN")}₫
                      </span>
                      <ArrowRight className="w-5 h-5 text-indigo-600 group-hover:translate-x-1 transition-all" />
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ===== FEATURES ===== */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            {[
              {
                icon: Users,
                title: "Hướng dẫn viên địa phương",
                desc: "Người bản địa am hiểu, nhiệt tình",
              },
              {
                icon: Shield,
                title: "Tour riêng tư",
                desc: "Chỉ bạn và nhóm của bạn",
              },
              {
                icon: Clock,
                title: "Linh hoạt hủy",
                desc: "Hủy miễn phí trước 24h",
              },
              {
                icon: Star,
                title: "Hỗ trợ 24/7",
                desc: "Luôn sẵn sàng giúp bạn",
              },
            ].map((f, i) => (
              <div
                key={i}
                className="group p-6 rounded-xl hover:bg-white hover:shadow-md transition-all duration-300 animate-fade-in-up"
                style={{ animationDelay: `${i * 100}ms` }}
              >
                <div className="bg-cyan-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-cyan-200 transition-colors">
                  <f.icon className="text-cyan-600" size={32} />
                </div>
                <h3 className="font-semibold text-indigo-900 mb-2 group-hover:text-indigo-700 transition-colors">
                  {f.title}
                </h3>
                <p className="text-gray-600">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== BLOG ===== */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold text-indigo-900">Từ blog</h2>
            <Link
              to="/blog"
              className="text-indigo-600 hover:text-indigo-800 flex items-center transition-colors"
            >
              Xem thêm <ChevronRight size={20} />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {blogPosts.map((p, i) => (
              <article
                key={i}
                className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 group animate-fade-in-up"
                style={{ animationDelay: `${i * 100}ms` }}
              >
                <img
                  src={p.image}
                  alt={p.title}
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="p-6">
                  <p className="text-sm text-gray-500 mb-2">{p.date}</p>
                  <h3 className="text-xl font-semibold text-indigo-900 mb-3 group-hover:text-indigo-700 transition-colors">
                    <Link to={p.link}>{p.title}</Link>
                  </h3>
                  <p className="text-gray-600 mb-4 line-clamp-3">
                    {p.excerpt}
                  </p>
                  <Link
                    to={p.link}
                    className="inline-flex items-center text-indigo-600 hover:text-indigo-800 font-medium transition-colors"
                  >
                    Đọc thêm{" "}
                    <ChevronRight
                      size={16}
                      className="ml-1 group-hover:translate-x-1 transition-transform"
                    />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ===== CTA ===== */}
      <section className="py-16 bg-gradient-to-r from-indigo-700 to-cyan-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center animate-fade-in">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 drop-shadow-md">
            Trở thành thành viên của Việt Vi Vu
          </h2>
          <p className="text-xl mb-8 max-w-3xl mx-auto drop-shadow-md">
            Bạn yêu du lịch, am hiểu địa phương?
            Hãy chia sẻ trải nghiệm độc
            đáo với du khách toàn cầu.
          </p>
          <Link
            to="/become-guide"
            className="inline-block bg-white text-indigo-600 px-8 py-3 rounded-full font-semibold hover:bg-gray-100 hover:shadow-lg transition-all duration-300 transform hover:scale-105"
          >
            Tham gia ngay
          </Link>
        </div>
      </section>
    </div>
  );
}