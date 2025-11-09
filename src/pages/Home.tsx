import { Link } from "react-router-dom";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import SearchBar from "../components/layout/SearchBar";
import { Users, Shield, Clock, Star, ChevronRight, Heart, MapPin, Globe, MessageCircle, ArrowRight } from "lucide-react";

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

const localGuides = [
  {
    id: 1,
    name: 'Nguyễn Văn A',
    location: 'Hà Nội, Việt Nam',
    rating: 5,
    reviews: 124,
    languages: ['Tiếng Việt', 'English', 'Français'],
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400',
    tours: 15
  },
  {
    id: 2,
    name: 'Trần Thị B',
    location: 'Hội An, Quảng Nam',
    rating: 5,
    reviews: 98,
    languages: ['Tiếng Việt', 'English', 'Japanese'],
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400',
    tours: 12
  },
  {
    id: 3,
    name: 'Lê Văn C',
    location: 'Sapa, Lào Cai',
    rating: 5,
    reviews: 156,
    languages: ['Tiếng Việt', 'English', 'Korean'],
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400',
    tours: 18
  },
  {
    id: 4,
    name: 'Phạm Thị D',
    location: 'Đà Nẵng, Việt Nam',
    rating: 4.9,
    reviews: 87,
    languages: ['Tiếng Việt', 'English', 'Chinese'],
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400',
    tours: 10
  },
];

const spotlightDestinations = [
  { name: 'Hà Nội', image: 'https://images.unsplash.com/photo-1509023464722-18d996393ca8?w=400' },
  { name: 'Đà Nẵng', image: 'https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?w=400' },
  { name: 'Hội An', image: 'https://images.unsplash.com/photo-1583417319070-4a69db38a482?w=400' },
  { name: 'Sapa', image: 'https://images.unsplash.com/photo-1528127269322-539801943592?w=400' },
  { name: 'Huế', image: 'https://images.unsplash.com/photo-1583417319070-4a69db38a482?w=400' },
  { name: 'Nha Trang', image: 'https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?w=400' },
  { name: 'Phú Quốc', image: 'https://images.unsplash.com/photo-1528127269322-539801943592?w=400' },
  { name: 'Đà Lạt', image: 'https://images.unsplash.com/photo-1509023464722-18d996393ca8?w=400' },
  { name: 'Vũng Tàu', image: 'https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?w=400' },
  { name: 'Cần Thơ', image: 'https://images.unsplash.com/photo-1583417319070-4a69db38a482?w=400' },
  { name: 'Hạ Long', image: 'https://images.unsplash.com/photo-1528127269322-539801943592?w=400' },
  { name: 'Phong Nha', image: 'https://images.unsplash.com/photo-1509023464722-18d996393ca8?w=400' },
];

const featuredTours = [
  {
    id: 1,
    title: 'Khám phá Hà Nội cổ kính',
    destination: 'Hà Nội',
    duration: '1 ngày',
    priceAdult: 1200000,
    priceChild: 800000,
    rating: 4.8,
    reviews: 234,
    image: 'https://images.unsplash.com/photo-1509023464722-18d996393ca8?w=600',
    guide: 'Nguyễn Văn A'
  },
  {
    id: 2,
    title: 'Vịnh Hạ Long – Kỳ quan thiên nhiên',
    destination: 'Quảng Ninh',
    duration: '2 ngày 1 đêm',
    priceAdult: 2500000,
    priceChild: 1800000,
    rating: 4.9,
    reviews: 456,
    image: 'https://images.unsplash.com/photo-1528127269322-539801943592?w=600',
    guide: 'Trần Thị B'
  },
  {
    id: 3,
    title: 'Phú Quốc – Thiên đường biển đảo',
    destination: 'Kiên Giang',
    duration: '3 ngày 2 đêm',
    priceAdult: 3500000,
    priceChild: 2500000,
    rating: 4.7,
    reviews: 189,
    image: 'https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?w=600',
    guide: 'Lê Văn C'
  },
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
          <h2 className="text-3xl font-bold text-center mb-12">Điểm đến nổi bật</h2>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {spotlightDestinations.map((dest, index) => (
              <Link
                key={index}
                to="#"
                className="group relative overflow-hidden rounded-xl shadow-md hover:shadow-xl transition-all duration-300"
              >
                <img
                  src={dest.image}
                  alt={dest.name}
                  className="w-full h-32 object-cover group-hover:scale-110 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-center justify-center">
                  <p className="text-white font-semibold text-lg">{dest.name}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <Users className="w-12 h-12 text-blue-600 mx-auto mb-4" />
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Gặp gỡ hướng dẫn viên địa phương của bạn
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {localGuides.map((guide) => (
              <div key={guide.id} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 group">
                <div className="relative">
                  <img
                    src={guide.avatar}
                    alt={guide.name}
                    className="w-full h-64 object-cover"
                  />
                  <button className="absolute top-4 right-4 bg-white p-2 rounded-full hover:bg-gray-100 transition">
                    <Heart className="w-5 h-5 text-gray-600" />
                  </button>
                </div>

                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-1">{guide.name}</h3>

                  <div className="flex items-center text-sm text-gray-600 mb-3">
                    <MapPin className="w-4 h-4 mr-1" />
                    <span>{guide.location}</span>
                  </div>

                  <div className="flex items-center mb-3">
                    <span className="text-lg font-bold text-gray-900 mr-1">{guide.rating}</span>
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                    ))}
                    <span className="ml-2 text-sm text-gray-600">({guide.reviews})</span>
                  </div>

                  <div className="flex items-center text-sm text-gray-600 mb-4">
                    <Globe className="w-4 h-4 mr-2" />
                    <span className="line-clamp-1">{guide.languages.join(', ')}</span>
                  </div>

                  <button className="w-full bg-white border-2 border-gray-300 text-gray-700 py-2 rounded-full hover:border-blue-600 hover:text-blue-600 transition font-medium flex items-center justify-center">
                    <MessageCircle className="w-4 h-4 mr-2" />
                    Nhắn tin
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link to="/guides" className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium text-lg">
              Xem tất cả hướng dẫn viên
              <ChevronRight className="w-5 h-5 ml-1" />
            </Link>
          </div>
        </div>
      </section>

      <section id="tours" className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold">Tour nổi bật</h2>
            <Link to="/tours" className="text-blue-600 hover:text-blue-700 flex items-center font-medium">
              Xem tất cả <ChevronRight size={20} />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featuredTours.map((tour) => (
              <Link
                key={tour.id}
                to={`/tours/${tour.id}`}
                className="group bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300"
              >
                <img
                  src={tour.image}
                  alt={tour.title}
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                />

                <div className="p-6">
                  <div className="flex items-center text-sm text-gray-600 mb-2">
                    <MapPin className="w-4 h-4 mr-1" />
                    <span>{tour.destination}</span>
                  </div>

                  <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition line-clamp-2">
                    {tour.title}
                  </h3>

                  <div className="flex items-center mb-3">
                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                    <span className="ml-1 text-sm font-medium">{tour.rating}</span>
                    <span className="ml-1 text-sm text-gray-600">({tour.reviews})</span>
                  </div>

                  <div className="flex items-center text-sm text-gray-600 mb-4">
                    <Clock className="w-4 h-4 mr-1" />
                    <span>{tour.duration}</span>
                  </div>

                  <div className="border-t pt-4">
                    <div className="flex justify-between items-center">
                      <span className="text-2xl font-bold text-blue-600">
                        {tour.priceAdult.toLocaleString('vi-VN')}₫
                      </span>
                      <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
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