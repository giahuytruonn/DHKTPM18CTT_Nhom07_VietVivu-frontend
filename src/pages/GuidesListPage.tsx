// src/pages/GuidesListPage.tsx
import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
    Star,
    MapPin,
    Globe,
    Heart,
    Mail,
    Search,
    Filter,
} from "lucide-react";

// Dữ liệu mẫu - THÊM NHIỀU HƯỚNG DẪN VIÊN HƠN
const allGuides = [
    {
        id: 1,
        name: "Nguyễn Xuân Chúc",
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
    // THÊM HƯỚNG DẪN VIÊN MỚI
    {
        id: 6,
        name: "Phạm Minh Tuấn",
        location: "Hà Nội, Việt Nam",
        rating: 4.8,
        reviews: 92,
        languages: ["Tiếng Việt", "English", "German"],
        avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400",
        tours: 14,
        email: "tuan.pham@vietvivu.com",
        phone: "+84 901 234 567",
        specialties: ["Lịch sử", "Kiến trúc", "Phố cổ"],
        experience: "9 năm",
    },
    {
        id: 7,
        name: "Lê Thị Mai",
        location: "Đà Nẵng, Việt Nam",
        rating: 5,
        reviews: 145,
        languages: ["Tiếng Việt", "English", "Spanish"],
        avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400",
        tours: 20,
        email: "mai.le@vietvivu.com",
        phone: "+84 909 876 543",
        specialties: ["Biển đảo", "Ẩm thực", "Chụp ảnh"],
        experience: "11 năm",
    },
    {
        id: 8,
        name: "Hoàng Văn Long",
        location: "Sapa, Lào Cai",
        rating: 4.9,
        reviews: 110,
        languages: ["Tiếng Việt", "English", "Chinese"],
        avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400",
        tours: 16,
        email: "long.hoang@vietvivu.com",
        phone: "+84 904 567 890",
        specialties: ["Núi non", "Dân tộc thiểu số", "Ruộng bậc thang"],
        experience: "8 năm",
    },
    {
        id: 9,
        name: "Đặng Thị Hồng",
        location: "Nha Trang, Khánh Hòa",
        rating: 5,
        reviews: 133,
        languages: ["Tiếng Việt", "English", "Russian"],
        avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400",
        tours: 17,
        email: "hong.dang@vietvivu.com",
        phone: "+84 906 123 789",
        specialties: ["Lặn biển", "Du thuyền", "Đảo"],
        experience: "7 năm",
    },
    {
        id: 10,
        name: "Bùi Quốc Anh",
        location: "Phú Quốc, Kiên Giang",
        rating: 4.8,
        reviews: 78,
        languages: ["Tiếng Việt", "English", "Thai"],
        avatar: "https://images.unsplash.com/photo-1463453091185-61582044d556?w=400",
        tours: 9,
        email: "anh.bui@vietvivu.com",
        phone: "+84 902 345 678",
        specialties: ["Bãi biển", "Sinh thái", "Hải sản"],
        experience: "5 năm",
    },
];

const GuidesListPage: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [locationFilter, setLocationFilter] = useState("");

    const filteredGuides = allGuides.filter((guide) => {
        const matchesSearch =
            guide.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            guide.specialties.some((s) => s.toLowerCase().includes(searchTerm.toLowerCase()));

        const matchesLocation =
            !locationFilter ||
            guide.location.toLowerCase().includes(locationFilter.toLowerCase());

        return matchesSearch && matchesLocation;
    });

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {/* Header */}
                <div className="text-center mb-12">
                    <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                        Hướng dẫn viên địa phương
                    </h1>
                    <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                        Gặp gỡ những hướng dẫn viên nhiệt huyết, am hiểu sâu sắc về văn hóa và địa danh địa phương
                    </p>
                </div>

                {/* Filters */}
                <div className="bg-white rounded-xl shadow-md p-6 mb-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Search */}
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                            <input
                                type="text"
                                placeholder="Tìm theo tên hoặc chuyên môn..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                            />
                        </div>

                        {/* Location Filter */}
                        <div className="relative">
                            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                            <input
                                type="text"
                                placeholder="Lọc theo địa điểm..."
                                value={locationFilter}
                                onChange={(e) => setLocationFilter(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                            />
                        </div>
                    </div>

                    <div className="mt-4 flex items-center gap-2 text-sm text-gray-600">
                        <Filter size={16} />
                        <span>Tìm thấy {filteredGuides.length} hướng dẫn viên</span>
                    </div>
                </div>

                {/* Guides Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {filteredGuides.map((guide, index) => (
                        <Link
                            key={guide.id}
                            to={`/guides/${guide.id}`}
                            className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-2xl transition-all duration-300 group animate-fade-in-up flex flex-col"
                            style={{ animationDelay: `${index * 50}ms` }}
                        >
                            <div className="relative">
                                <img
                                    src={guide.avatar}
                                    alt={guide.name}
                                    className="w-full h-56 object-cover group-hover:scale-105 transition-transform duration-300"
                                />
                                <button className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm p-2 rounded-full hover:bg-white transition-all shadow-md">
                                    <Heart className="w-5 h-5 text-indigo-600" />
                                </button>
                                <div className="absolute bottom-4 left-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-2 rounded-lg">
                                    <p className="text-sm font-semibold text-gray-900">{guide.experience} kinh nghiệm</p>
                                </div>
                            </div>

                            <div className="p-5 flex flex-col flex-grow">
                                <h3 className="text-lg font-bold text-indigo-900 mb-2 group-hover:text-indigo-700 transition-colors">
                                    {guide.name}
                                </h3>

                                <div className="flex items-center text-sm text-gray-600 mb-3">
                                    <MapPin className="w-4 h-4 mr-1 text-indigo-600" />
                                    <span className="line-clamp-1">{guide.location}</span>
                                </div>

                                <div className="flex items-center mb-3">
                                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                                    <span className="ml-1 text-sm font-bold text-gray-900">{guide.rating}</span>
                                    <span className="ml-1 text-sm text-gray-600">({guide.reviews})</span>
                                    <span className="ml-auto text-sm text-gray-600">{guide.tours} tours</span>
                                </div>

                                <div className="flex items-center text-xs text-gray-600 mb-4">
                                    <Globe className="w-3 h-3 mr-1 text-indigo-600" />
                                    <span className="line-clamp-1">{guide.languages.join(", ")}</span>
                                </div>

                                {/* Specialties */}
                                <div className="flex flex-wrap gap-2 mb-4">
                                    {guide.specialties.slice(0, 2).map((spec, idx) => (
                                        <span
                                            key={idx}
                                            className="px-2 py-1 bg-indigo-50 text-indigo-700 text-xs rounded-full"
                                        >
                                            {spec}
                                        </span>
                                    ))}
                                    {guide.specialties.length > 2 && (
                                        <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                                            +{guide.specialties.length - 2}
                                        </span>
                                    )}
                                </div>

                                <button className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition-all duration-300 flex items-center justify-center shadow-md hover:shadow-lg mt-auto">
                                    <Mail className="w-4 h-4 mr-2" />
                                    Liên hệ
                                </button>
                            </div>
                        </Link>
                    ))}
                </div>

                {filteredGuides.length === 0 && (
                    <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
                        <h3 className="text-2xl font-bold text-gray-900 mb-2">
                            Không tìm thấy hướng dẫn viên
                        </h3>
                        <p className="text-gray-600 mb-6">
                            Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm
                        </p>
                        <button
                            onClick={() => {
                                setSearchTerm("");
                                setLocationFilter("");
                            }}
                            className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                        >
                            Xóa bộ lọc
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default GuidesListPage;