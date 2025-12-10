import { Link, useNavigate } from "react-router-dom";
import React, { useMemo, useState, useEffect, useCallback } from "react";
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
  ArrowRight,
  Mail,
  Phone,
  Calendar,
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { getTours } from "../services/tour.service";
import type { TourResponse } from "../types/tour";
import ChatBox from "./ChatBox";
import DestinationCard from "../components/home/DestinationCard";
import TourCard from "../components/home/TourCard";
import GuideCard from "../components/home/GuideCard";
import { searchPexelsImage } from "../services/pexels.service";

const PEXELS_API_KEY = import.meta.env.VITE_PEXELS_API_KEY;

// === DỮ LIỆU HƯỚNG DẪN VIÊN ===
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
    email: "chuc.nguyen@vietvivu.com",
    phone: "+84 905 123 456",
    specialties: ["Lịch sử văn hóa", "Ẩm thực", "Nhiếp ảnh"],
    experience: "10 năm",
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
    email: "duy.tran@vietvivu.com",
    phone: "+84 912 345 678",
    specialties: ["Sinh thái", "Văn hóa miền Tây", "Chợ nổi"],
    experience: "8 năm",
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
    email: "thaiduy@vietvivu.com",
    phone: "+84 908 765 432",
    specialties: ["Trekking", "Cắm trại", "Thác nước"],
    experience: "6 năm",
  },
  {
    id: 4,
    name: "Trương Gia Huy",
    location: "Gò Vấp, TP.HCM",
    rating: 4.9,
    reviews: 87,
    languages: ["Tiếng Việt", "English", "Chinese"],
    avatar: "https://raw.githubusercontent.com/giahuytruonn/giahuytruonn/refs/heads/main/assets/giahuytruonn.jpg",
    tours: 10,
    email: "giahuy@vietvivu.com",
    phone: "+84 903 456 789",
    specialties: ["Ẩm thực", "Đường phố", "Café Sài Gòn"],
    experience: "7 năm",
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
    email: "thanhhuy@vietvivu.com",
    phone: "+84 907 888 999",
    specialties: ["Văn hóa dân tộc", "Cao nguyên", "Lễ hội"],
    experience: "12 năm",
  },
];

// === DỮ LIỆU BLOG ===
const blogPosts = [
  {
    id: 1,
    date: "28/10/2025",
    title: "5 điểm đến ít người biết ở Hà Nội",
    excerpt: "Hà Nội không chỉ có Hồ Gươm, Văn Miếu... Hãy cùng khám phá những địa điểm ẩn mình đầy thú vị!",
    image: "https://dynamic-media-cdn.tripadvisor.com/media/photo-o/23/98/95/a0/hidden-gem-cafe-the-best.jpg?w=900&h=500&s=1",
    author: "Nguyễn Văn A",
    category: "Khám phá",
    readTime: "5 phút",
  },
  {
    id: 2,
    date: "14/10/2025",
    title: "Tại sao nên đi tour riêng?",
    excerpt: "Trải nghiệm chân thực, linh hoạt và cá nhân hóa - đó là lý do bạn nên chọn tour riêng!",
    image: "https://luxtraveldmc.com/blog/wp-content/uploads/2019/04/Benefits-of-Private-tour-to-Vietnam-and-Cambodia-2-e1555400956433.jpg",
    author: "Trần Thị B",
    category: "Tips & Tricks",
    readTime: "7 phút",
  },
  {
    id: 3,
    date: "01/10/2025",
    title: "Khám phá ẩm thực Huế - Cố đô ngàn năm",
    excerpt: "Từ bún bò Huế đến cơm hến, bánh bèo... Huế là thiên đường của những tín đồ ẩm thực!",
    image: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800",
    author: "Lê Văn C",
    category: "Ẩm thực",
    readTime: "8 phút",
  },
];

// === FETCH ẢNH TỪ PEXELS ===
const fetchDestinationImage = searchPexelsImage;

const imageCache = new Map<string, { url: string; id: string }>();

const SkeletonDestination = () => (
  <div className="group relative overflow-hidden rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 animate-pulse">
    <div className="w-full h-56 bg-gray-300"></div>
    <div className="absolute inset-0 bg-gradient-to-t from-indigo-900/70 to-transparent opacity-70"></div>
    <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
      <div className="h-5 bg-gray-400 rounded w-3/4"></div>
    </div>
  </div>
);

const SkeletonTour = () => (
  <div className="group bg-white rounded-xl shadow-md overflow-hidden animate-pulse flex flex-col">
    <div className="w-full h-48 bg-gray-300"></div>
    <div className="p-6 flex flex-col flex-grow">
      <div className="h-4 bg-gray-300 rounded w-1/2 mb-2"></div>
      <div className="h-5 bg-gray-400 rounded w-3/4 mb-2"></div>
      <div className="flex items-center mb-3">
        <div className="h-4 bg-gray-300 rounded w-20"></div>
      </div>
      <div className="h-4 bg-gray-300 rounded w-24 mb-4"></div>
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

  const navigate = useNavigate();

  const skeletonDestinations = useMemo(() =>
    Array(12).fill(0).map((_, i) => <SkeletonDestination key={i} />),
    []
  );

  const skeletonTours = useMemo(() =>
    Array(3).fill(0).map((_, i) => <SkeletonTour key={i} />),
    []
  );


  const featuresData = useMemo(() => [
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
  ], []);

  const statsData = useMemo(() => [
    { value: "500+", label: "Tour đã tổ chức" },
    { value: "4.9★", label: "Đánh giá trung bình" },
    { value: "10k+", label: "Du khách hài lòng" },
    { value: "24/7", label: "Hỗ trợ khách hàng" },
  ], []);

  const handleNavigateToTours = useCallback(() => {
    navigate('/tours');
  }, [navigate]);

  const handleNavigateToGuides = useCallback(() => {
    navigate('/guides');
  }, [navigate]);

  const handleToggleFavorite = useCallback((e: React.MouseEvent, itemId: string) => {
    e.preventDefault();
    e.stopPropagation();
    // Implement favorite logic here
    console.log('Toggle favorite:', itemId);
  }, []);

  const handleDestinationClick = useCallback((destination: string) => {
    navigate(`/tours?destination=${encodeURIComponent(destination)}`);
  }, [navigate]);



  const { data: toursResponse, isLoading } = useQuery({
    queryKey: ["tours-home", 0, 6],
    queryFn: () => getTours(0, 6),
    staleTime: 1000 * 60 * 5,
  });

  const tours = useMemo(() => {
    return toursResponse?.items || [];
  }, [toursResponse]);

  const uniqueDestinations = useMemo(() => {
    const set = new Set<string>();
    tours.forEach((t: TourResponse) => {
      if (t.destination) {
        const parts = t.destination.split(/—|-/).map((s) => s.trim()).filter((s) => s.length > 0);
        parts.forEach((p) => set.add(p));
      }
    });
    return Array.from(set).slice(0, 12);
  }, [tours]);

  const [destinationImages, setDestinationImages] = useState<Record<string, { url: string; id: string }>>({});

  const [imagesLoaded, setImagesLoaded] = useState(false);

  useEffect(() => {
    if (!uniqueDestinations.length || !PEXELS_API_KEY) return;

    const loadImages = async () => {
      // Load từng batch 4 ảnh
      const batchSize = 4;
      const batches = [];

      for (let i = 0; i < uniqueDestinations.length; i += batchSize) {
        batches.push(uniqueDestinations.slice(i, i + batchSize));
      }

      for (const batch of batches) {
        const promises = batch.map(async (dest) => {
          if (imageCache.has(dest)) {
            return { dest, ...imageCache.get(dest)! };
          }
          const result = await fetchDestinationImage(dest);
          imageCache.set(dest, result);
          return { dest, ...result };
        });

        const results = await Promise.all(promises);

        setDestinationImages(prev => {
          const map = { ...prev };
          results.forEach((r) => {
            map[r.dest] = { url: r.url, id: r.id };
          });
          return map;
        });

        if (batches.indexOf(batch) < batches.length - 1) {
          await new Promise(resolve => setTimeout(resolve, 300));
        }
      }

      setImagesLoaded(true);
    };

    loadImages();
  }, [uniqueDestinations]);

  const destinations = uniqueDestinations.map((dest, index) => {
    const img = destinationImages[dest];
    return {
      name: dest,
      image: img?.url || `https://picsum.photos/seed/loading-${encodeURIComponent(dest)}/800/600`,
      id: `destination-${encodeURIComponent(dest)}-${index}`,
    };
  });

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
      {/* <ChatBox /> */}
      {/* HERO */}
      <section
        className="relative h-[70vh] bg-cover bg-center bg-no-repeat flex items-center justify-center text-white"
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
            Thật sự hiểu một vùng đất qua những người biết rõ nhất — hướng dẫn viên địa phương.
          </p>
          <SearchBar className="max-w-2xl mx-auto shadow-lg" />
        </div>
      </section>

      {/* ĐIỂM ĐẾN NỔI BẬT */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-center mb-16 text-indigo-800 animate-fade-in-up">
            Điểm đến nổi bật
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
            {isLoading || Object.keys(destinationImages).length === 0 ? (
              skeletonDestinations
            ) : (
              destinations.map((dest) => (
                <DestinationCard
                  key={dest.id}
                  dest={dest}
                  onClick={handleDestinationClick}
                />
              ))
            )}
          </div>
        </div>
      </section>

      {/* HƯỚNG DẪN VIÊN */}
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
              <GuideCard
                key={guide.id}
                guide={guide}
                index={index}
                onToggleFavorite={handleToggleFavorite}
              />
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

      {/* TOUR NỔI BẬT */}
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
              skeletonTours
            ) : (
              featuredTours.map((tour, i) => (
                <TourCard
                  key={tour.tourId}
                  tour={tour}
                  index={i}
                  onToggleFavorite={handleToggleFavorite}
                />
              ))
            )}
          </div>
        </div>
      </section>

      {/* FEATURES */}
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

      {/* WHY CHOOSE US */}
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

      {/* BLOG */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-12">
            <h2 className="text-3xl font-bold text-indigo-900">
              Blog du lịch
            </h2>
            <Link
              to="/blog"
              className="text-indigo-600 hover:text-indigo-800 flex items-center font-medium transition-colors"
            >
              Xem tất cả <ChevronRight size={20} />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {blogPosts.map((post, index) => (
              <article
                key={post.id}
                className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-2xl transition-all duration-300 group animate-fade-in-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="relative overflow-hidden">
                  <img
                    src={post.image}
                    alt={post.title}
                    className="w-full h-56 object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  <span className="absolute top-4 left-4 bg-indigo-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                    {post.category}
                  </span>
                </div>

                <div className="p-6">
                  <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      <span>{post.date}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      <span>{post.readTime}</span>
                    </div>
                  </div>

                  <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-indigo-600 transition-colors line-clamp-2">
                    {post.title}
                  </h3>

                  <p className="text-gray-600 mb-4 line-clamp-3">
                    {post.excerpt}
                  </p>

                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <span className="text-sm text-gray-500">{post.author}</span>
                    <Link
                      to={`/blog/${post.id}`}
                      className="text-indigo-600 font-semibold hover:text-indigo-800 flex items-center transition-colors"
                    >
                      Đọc thêm <ChevronRight size={16} className="ml-1" />
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-gradient-to-r from-indigo-700 to-cyan-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center animate-fade-in">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 drop-shadow-md">
            Trở thành thành viên của VietVivu
          </h2>
          <p className="text-xl mb-8 max-w-3xl mx-auto drop-shadow-md">
            Bạn yêu du lịch, am hiểu địa phương?
            Hãy chia sẻ trải nghiệm độc đáo với du khách toàn cầu.
          </p>
          <Link
            to="/register"
            className="inline-block bg-white text-indigo-600 px-8 py-3 rounded-full font-semibold hover:bg-gray-100 hover:shadow-lg transition-all duration-300 transform hover:scale-105"
          >
            Tham gia ngay
          </Link>
        </div>
      </section>
    </div>
  );
}