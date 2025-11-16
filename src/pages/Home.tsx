import { Link } from "react-router-dom";
import React, { useMemo, useState, useEffect } from "react";
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

const PEXELS_API_KEY = import.meta.env.VITE_PEXELS_API_KEY;

if (!PEXELS_API_KEY) {
  console.error("REACT_APP_PEXELS_API_KEY is missing in .env file!");
}

// === LẤY ẢNH ĐỊA ĐIỂM TỪ PEXELS (CHÍNH XÁC + KHÔNG TRÙNG) ===
const fetchDestinationImage = async (query: string): Promise<{ url: string; id: string }> => {
  const searchQuery = `${query} Vietnam travel landmark`;

  try {
    const res = await fetch(
      `https://api.pexels.com/v1/search?query=${encodeURIComponent(searchQuery)}&per_page=1&orientation=landscape`,
      {
        headers: {
          Authorization: PEXELS_API_KEY!,
        },
      }
    );

    if (!res.ok) throw new Error(`Pexels API error: ${res.status}`);

    const data = await res.json();
    const photo = data.photos?.[0];

    if (photo) {
      return {
        url: photo.src.large || photo.src.medium || photo.src.small,
        id: photo.id.toString(),
      };
    }
  } catch (error) {
    console.warn(`[Pexels] Không tìm thấy ảnh cho: ${query}`, error);
  }

  // === FALLBACK: Dùng Picsum với seed theo tên địa điểm (không trùng) ===
  const fallbackUrl = `https://picsum.photos/seed/${encodeURIComponent(query)}/800/600`;
  return {
    url: fallbackUrl,
    id: `fallback-${query}`,
  };
};

// === CACHE ẢNH ĐỂ TỐI ƯU ===
const imageCache = new Map<string, { url: string; id: string }>();

// === DỮ LIỆU TĨNH ===
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
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400",
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

// === SKELETON COMPONENTS ===
const SkeletonDestination = () => (
  <div className="group relative overflow-hidden rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 animate-pulse">
    <div className="w-full h-56 bg-gray-300"></div>
    <div className="absolute inset-0 bg-gradient-to-t from-indigo-900/70 to-transparent opacity-70 group-hover:opacity-90 transition-opacity duration-300"></div>
    <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
      <div className="h-5 bg-gray-400 rounded w-3/4"></div>
    </div>
  </div>
);

const SkeletonTour = () => (
  <div className="group bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1 animate-pulse flex flex-col">
    <div className="relative">
      <div className="w-full h-48 bg-gray-300"></div>
    </div>
    <div className="p-6 flex flex-col flex-grow">
      <div className="h-4 bg-gray-300 rounded w-1/2 mb-2"></div>
      <div className="h-5 bg-gray-400 rounded w-3/4 mb-2"></div>
      <div className="flex items-center mb-3">
        <div className="h-4 bg-gray-300 rounded w-20"></div>
      </div>
      <div className="flex items-center text-sm text-gray-600 mb-4">
        <div className="h-4 bg-gray-300 rounded w-24"></div>
      </div>
      <div className="border-t pt-4 mt-auto">
        <div className="flex justify-between items-center">
          <div className="h-6 bg-gray-400 rounded w-1/3"></div>
          <div className="h-5 w-5 bg-gray-300 rounded-full"></div>
        </div>
      </div>
    </div>
  </div>
);

export default function Home() {
  const { data: rawTours = [], isLoading } = useQuery({
    queryKey: ["tours-home"],
    queryFn: getTours,
    staleTime: 1000 * 60 * 5,
  });

  // === CHỈ LẤY 15 TOUR ĐẦU ===
  const tours = useMemo(() => rawTours.slice(0, 15), [rawTours]);

  // === TÁCH ĐỊA ĐIỂM DUY NHẤT (tối đa 12) ===
  const uniqueDestinations = useMemo(() => {
    const set = new Set<string>();
    tours.forEach((t: TourResponse) => {
      if (t.destination) {
        const parts = t.destination
          .split(/–|-/)
          .map((s) => s.trim())
          .filter((s) => s.length > 0);
        parts.forEach((p) => set.add(p));
      }
    });
    return Array.from(set).slice(0, 12);
  }, [tours]);

  // === LOAD ẢNH TỪ PEXELS (DYNAMIC + CACHE + KHÔNG TRÙNG) ===
  const [destinationImages, setDestinationImages] = useState<Record<string, { url: string; id: string }>>({});

  useEffect(() => {
    if (!uniqueDestinations.length || !PEXELS_API_KEY) return;

    const loadImages = async () => {
      const promises = uniqueDestinations.map(async (dest) => {
        if (imageCache.has(dest)) {
          return { dest, ...imageCache.get(dest)! };

        }
        const result = await fetchDestinationImage(dest);
        imageCache.set(dest, result);
        return { dest, ...result };
      });

      const results = await Promise.all(promises);
      const map: Record<string, { url: string; id: string }> = {};
      results.forEach((r) => {
        map[r.dest] = { url: r.url, id: r.id };
      });
      setDestinationImages(map);
    };

    loadImages();
  }, [uniqueDestinations]);

  // === CHUẨN BỊ DATA CHO RENDER ===
  const destinations = uniqueDestinations.map((dest) => {
    const img = destinationImages[dest];
    return {
      name: dest,
      image: img?.url || `https://picsum.photos/seed/loading-${encodeURIComponent(dest)}/800/600`,
      id: img?.id || `loading-${dest}`,
    };
  });

  // === TOUR NỔI BẬT (3 tour đầu có ảnh) ===
  const featuredTours = useMemo(() => {
    return tours
      .filter((t: TourResponse) => Array.isArray(t.imageUrls) && t.imageUrls.length > 0)
      .slice(0, 3)
      .map((t: TourResponse) => ({
        ...t,
        id: t.tourId,
        rating: t.favoriteCount > 50 ? 4.9 : t.favoriteCount > 20 ? 4.7 : 4.5,
        reviews: Math.floor(Math.random() * 300) + 50,
      }));
  }, [tours]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ===== HERO ===== */}
      <section
        className="relative h-[70vh] bg-cover bg-center bg-no-repeat flex items-center justify-center text-white"
        // CẬP NHẬT: Xóa 'overflow-hidden' để cho phép dropdown hiển thị
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80')`,
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-gray-900/60 to-indigo-900/30"></div>
        {/* CẬP NHẬT: Đảm bảo z-index của content là 10 */}
        <div className="relative z-10 text-center px-4 max-w-4xl animate-fade-in">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight drop-shadow-lg">
            Đi theo cách thân thiện hơn
          </h1>
          <p className="text-xl mb-10 max-w-3xl mx-auto text-gray-100 drop-shadow-md">
            Thật sự hiểu một vùng đất qua những người biết rõ nhất — hướng dẫn
            viên địa phương.
          </p>
          {/* SearchBar sẽ có z-40, nằm trong z-10 này, nhưng vẫn hoạt động vì cha của nó (section) không còn overflow-hidden */}
          <SearchBar className="max-w-2xl mx-auto shadow-lg" />
        </div>
      </section>

      {/* ===== ĐIỂM ĐẾN NỔI BẬT (12) ===== */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-center mb-16 text-indigo-800 animate-fade-in-up">
            Điểm đến nổi bật
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
            {isLoading || Object.keys(destinationImages).length === 0 ? (
              Array(12).fill(0).map((_, i) => <SkeletonDestination key={i} />)
            ) : (
              destinations.map((dest) => (
                <Link
                  key={dest.id}
                  to={`/tours?destination=${encodeURIComponent(dest.name)}`}
                  className="group relative overflow-hidden rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                >
                  <img
                    src={dest.image}
                    alt={dest.name}
                    className="w-full h-56 object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-indigo-900/70 to-transparent opacity-70 group-hover:opacity-90 transition-opacity duration-300"></div>
                  <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                    <p className="font-bold text-lg drop-shadow-md">{dest.name}</p>
                  </div>
                </Link>
              ))
            )}
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
                    loading="lazy"
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

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {isLoading ? (
              Array(3).fill(0).map((_, i) => <SkeletonTour key={i} />)
            ) : (
              featuredTours.map((tour, i) => (
                <Link
                  key={tour.tourId}
                  to={`/tours/${tour.tourId}`}
                  className="group bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1 animate-fade-in-up flex flex-col"
                  style={{ animationDelay: `${i * 100}ms` }}
                >
                  <div className="relative">
                    <img
                      src={tour.imageUrls[0]}
                      alt={tour.title}
                      className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                      loading="lazy"
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
                        {tour.rating}
                      </span>
                      <span className="ml-1 text-sm text-gray-600">
                        ({tour.reviews})
                      </span>
                    </div>

                    <div className="flex items-center text-sm text-gray-600 mb-4">
                      <Clock className="w-4 h-4 mr-1 text-indigo-600" />
                      <span>{tour.duration}</span>
                    </div>

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
              ))
            )}
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

      <section className="py-16 bg-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Tại sao chọn <span className="text-indigo-600">VietVivu</span>?
              </h2>
              <p className="text-lg text-gray-600 mb-8">
                Chúng tôi không chỉ là nền tảng đặt tour – chúng tôi là người bạn đồng hành
                trong mỗi chuyến đi, mang đến trải nghiệm cá nhân hóa và đáng nhớ.
              </p>
              <div className="space-y-4">
                <Link
                  to="/about"
                  className="block w-full text-center bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 transition-all"
                >
                  Tìm hiểu về chúng tôi
                </Link>
                <Link
                  to="/blog"
                  className="block w-full text-center border-2 border-indigo-600 text-indigo-600 py-3 rounded-lg font-semibold hover:bg-indigo-50 transition-all"
                >
                  Đọc blog du lịch
                </Link>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-6 text-center">
              <div className="bg-white p-6 rounded-xl shadow-md">
                <div className="text-3xl font-bold text-indigo-600">500+</div>
                <p className="text-gray-600 mt-2">Tour đã tổ chức</p>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-md">
                <div className="text-3xl font-bold text-indigo-600">4.9★</div>
                <p className="text-gray-600 mt-2">Đánh giá trung bình</p>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-md">
                <div className="text-3xl font-bold text-indigo-600">10k+</div>
                <p className="text-gray-600 mt-2">Du khách hài lòng</p>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-md">
                <div className="text-3xl font-bold text-indigo-600">24/7</div>
                <p className="text-gray-600 mt-2">Hỗ trợ khách hàng</p>
              </div>
            </div>
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
                  loading="lazy"
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