// src/pages/GuideDetailPage.tsx
import React from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
    ArrowLeft,
    Star,
    MapPin,
    Globe,
    Mail,
    Phone,
    MapPinIcon,
    Calendar,
    Award,
    MessageCircle,
    Facebook,
    Instagram,
} from "lucide-react";

// Dữ liệu mẫu (giống Home)
const guidesData = [
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
        address: "123 Lê Lợi, Tp. Huế",
        bio: "Hướng dẫn viên chuyên nghiệp với 10 năm kinh nghiệm. Đam mê văn hóa và lịch sử Huế. Tôi luôn cố gắng mang đến cho du khách những trải nghiệm đáng nhớ nhất về cố đô ngàn năm tuổi.",
        specialties: ["Lịch sử văn hóa", "Ẩm thực", "Nhiếp ảnh"],
        experience: "10 năm",
        facebook: "facebook.com/chuc.guide",
        instagram: "@chuc_hue_guide",
        coverImage: "https://images.unsplash.com/photo-1557409518-691ebcd96038?w=1200",
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
        address: "456 Trần Hưng Đạo, Cao Lãnh",
        bio: "Chuyên gia về miền Tây sông nước. Yêu thích khám phá văn hóa địa phương và chia sẻ những câu chuyện thú vị về vùng đất này.",
        specialties: ["Sinh thái", "Văn hóa miền Tây", "Chợ nổi"],
        experience: "8 năm",
        facebook: "facebook.com/duy.guide",
        instagram: "@duy_mekong",
        coverImage: "https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=1200",
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
        address: "789 Võ Thị Sáu, Biên Hòa",
        bio: "Hướng dẫn viên trẻ nhiệt huyết, chuyên tour phiêu lưu và thiên nhiên. Tôi tin rằng thiên nhiên là nơi tốt nhất để con người tìm lại chính mình.",
        specialties: ["Trekking", "Cắm trại", "Thác nước"],
        experience: "6 năm",
        facebook: "facebook.com/thaiduy.adventure",
        instagram: "@thaiduy_outdoor",
        coverImage: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1200",
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
        address: "321 Quang Trung, Gò Vấp, TP.HCM",
        bio: "Chuyên gia về ẩm thực đường phố Sài Gòn. Đưa bạn đến những quán ăn ngon nhất mà chỉ người địa phương mới biết!",
        specialties: ["Ẩm thực", "Đường phố", "Café Sài Gòn"],
        experience: "7 năm",
        facebook: "facebook.com/giahuy.foodie",
        instagram: "@giahuy_saigon_food",
        coverImage: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1200",
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
        address: "654 Hùng Vương, Pleiku, Gia Lai",
        bio: "Hướng dẫn viên bản địa, am hiểu sâu sắc văn hóa Tây Nguyên. Tôi muốn giới thiệu đến bạn vẻ đẹp hoang sơ và con người nơi đây.",
        specialties: ["Văn hóa dân tộc", "Cao nguyên", "Lễ hội"],
        experience: "12 năm",
        facebook: "facebook.com/thanhhuy.taynguyen",
        instagram: "@huy_highlands",
        coverImage: "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=1200",
    },
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
        address: "22 Hoàn Kiếm, Hà Nội",
        bio: "Chuyên gia về lịch sử và kiến trúc Hà Nội. Tôi sẽ đưa bạn khám phá những câu chuyện ẩn giấu trong từng con phố, ngõ hẻm phố cổ.",
        specialties: ["Lịch sử", "Kiến trúc", "Phố cổ"],
        experience: "9 năm",
        facebook: "facebook.com/tuan.hanoi",
        instagram: "@tuan_hanoi_guide",
        coverImage: "https://images.unsplash.com/photo-1509023464722-18d996393ca8?w=1200",
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
        address: "789 Nguyễn Văn Linh, Đà Nẵng",
        bio: "Yêu thích biển và ẩm thực Đà Nẵng. Tôi sẽ giúp bạn khám phá những bãi biển đẹp nhất và thưởng thức món ăn địa phương tuyệt vời.",
        specialties: ["Biển đảo", "Ẩm thực", "Chụp ảnh"],
        experience: "11 năm",
        facebook: "facebook.com/mai.danang",
        instagram: "@mai_danang",
        coverImage: "https://images.unsplash.com/photo-1583417319070-4a69db38a482?w=1200",
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
        address: "Thị trấn Sapa, Lào Cai",
        bio: "Người dân tộc H'Mông, sinh ra và lớn lên tại Sapa. Tôi hiểu rõ mọi ngóc ngách của núi rừng và văn hóa các dân tộc nơi đây.",
        specialties: ["Núi non", "Dân tộc thiểu số", "Ruộng bậc thang"],
        experience: "8 năm",
        facebook: "facebook.com/long.sapa",
        instagram: "@long_sapa_trekking",
        coverImage: "https://images.unsplash.com/photo-1528127269322-539801943592?w=1200",
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
        address: "56 Trần Phú, Nha Trang",
        bio: "Chuyên gia lặn biển và khám phá các hòn đảo. Tôi sẽ đưa bạn đến những điểm lặn đẹp nhất và các hòn đảo hoang sơ tuyệt vời.",
        specialties: ["Lặn biển", "Du thuyền", "Đảo"],
        experience: "7 năm",
        facebook: "facebook.com/hong.nhatrang",
        instagram: "@hong_diving",
        coverImage: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=1200",
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
        address: "Dương Đông, Phú Quốc",
        bio: "Sinh ra tại đảo ngọc Phú Quốc. Tôi biết tất cả những bãi biển đẹp và nhà hàng hải sản ngon nhất trên đảo.",
        specialties: ["Bãi biển", "Sinh thái", "Hải sản"],
        experience: "5 năm",
        facebook: "facebook.com/anh.phuquoc",
        instagram: "@anh_phuquoc",
        coverImage: "https://images.unsplash.com/photo-1583245775338-65b8b550f31c?w=1200",
    },
];

const GuideDetailPage: React.FC = () => {
    const { guideId } = useParams<{ guideId: string }>();
    const navigate = useNavigate();

    const guide = guidesData.find((g) => g.id === Number(guideId));

    if (!guide) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">
                        Không tìm thấy hướng dẫn viên
                    </h2>
                    <Link to="/guides" className="text-indigo-600 hover:text-indigo-800">
                        Quay lại danh sách
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Cover Image */}
            <div
                className="relative h-80 bg-cover bg-center"
                style={{ backgroundImage: `url('${guide.coverImage}')` }}
            >
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>

                {/* Back Button */}
                <button
                    onClick={() => navigate(-1)}
                    className="absolute top-6 left-6 flex items-center gap-2 text-white hover:text-indigo-300 transition-colors z-10 bg-black/30 px-4 py-2 rounded-full backdrop-blur-sm"
                >
                    <ArrowLeft size={20} />
                    <span className="font-medium">Quay lại</span>
                </button>
            </div>

            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 -mt-24 pb-16 relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Profile Card */}
                        <div className="bg-white rounded-2xl shadow-lg p-8">
                            <div className="flex items-start gap-6 mb-6">
                                <img
                                    src={guide.avatar}
                                    alt={guide.name}
                                    className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-xl relative z-10"
                                />
                                <div className="flex-1">
                                    <h1 className="text-3xl font-bold text-gray-900 mb-2">{guide.name}</h1>
                                    <div className="flex items-center gap-2 text-gray-600 mb-3">
                                        <MapPin className="w-5 h-5 text-indigo-600" />
                                        <span>{guide.location}</span>
                                    </div>
                                    <div className="flex items-center gap-4 mb-4">
                                        <div className="flex items-center gap-1">
                                            <Star className="w-5 h-5 text-yellow-400 fill-current" />
                                            <span className="font-bold text-gray-900">{guide.rating}</span>
                                            <span className="text-gray-500">({guide.reviews} đánh giá)</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Calendar className="w-5 h-5 text-indigo-600" />
                                            <span className="text-gray-600">{guide.tours} tours</span>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Globe className="w-5 h-5 text-indigo-600" />
                                        <span className="text-gray-600">{guide.languages.join(", ")}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Bio */}
                            <div className="border-t pt-6">
                                <h2 className="text-xl font-bold text-gray-900 mb-3">Giới thiệu</h2>
                                <p className="text-gray-600 leading-relaxed">{guide.bio}</p>
                            </div>
                        </div>

                        {/* Specialties */}
                        <div className="bg-white rounded-2xl shadow-lg p-8">
                            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                                <Award className="w-6 h-6 text-indigo-600" />
                                Chuyên môn
                            </h2>
                            <div className="flex flex-wrap gap-3">
                                {guide.specialties.map((specialty, index) => (
                                    <span
                                        key={index}
                                        className="px-4 py-2 bg-indigo-50 text-indigo-700 rounded-full font-medium"
                                    >
                                        {specialty}
                                    </span>
                                ))}
                            </div>
                        </div>

                        {/* Experience */}
                        <div className="bg-white rounded-2xl shadow-lg p-8">
                            <h2 className="text-xl font-bold text-gray-900 mb-4">Kinh nghiệm</h2>
                            <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-indigo-50 to-blue-50 rounded-xl">
                                <Calendar className="w-8 h-8 text-indigo-600" />
                                <div>
                                    <p className="font-bold text-2xl text-indigo-600">{guide.experience}</p>
                                    <p className="text-gray-600">Kinh nghiệm hướng dẫn</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Sidebar - Contact Info */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-24">
                            <h2 className="text-xl font-bold text-gray-900 mb-6">Thông tin liên hệ</h2>

                            <div className="space-y-4 mb-6">
                                {/* Email */}
                                <a
                                    href={`mailto:${guide.email}`}
                                    className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg transition-colors group"
                                >
                                    <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center group-hover:bg-indigo-600 transition-colors">
                                        <Mail className="w-5 h-5 text-indigo-600 group-hover:text-white" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-xs text-gray-500">Email</p>
                                        <p className="font-medium text-gray-900 break-all">{guide.email}</p>
                                    </div>
                                </a>

                                {/* Phone */}
                                <a
                                    href={`tel:${guide.phone}`}
                                    className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg transition-colors group"
                                >
                                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center group-hover:bg-green-600 transition-colors">
                                        <Phone className="w-5 h-5 text-green-600 group-hover:text-white" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-xs text-gray-500">Điện thoại</p>
                                        <p className="font-medium text-gray-900">{guide.phone}</p>
                                    </div>
                                </a>

                                {/* Address */}
                                <div className="flex items-center gap-3 p-3">
                                    <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                                        <MapPinIcon className="w-5 h-5 text-purple-600" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-xs text-gray-500">Địa chỉ</p>
                                        <p className="font-medium text-gray-900">{guide.address}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Social Media */}
                            <div className="border-t pt-6 mb-6">
                                <h3 className="font-bold text-gray-900 mb-3">Mạng xã hội</h3>
                                <div className="space-y-2">
                                    <a
                                        href={`https://${guide.facebook}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-3 p-3 hover:bg-blue-50 rounded-lg transition-colors group"
                                    >
                                        <Facebook className="w-5 h-5 text-blue-600" />
                                        <span className="text-gray-700 group-hover:text-blue-600">Facebook</span>
                                    </a>
                                    <a
                                        href={`https://instagram.com/${guide.instagram.replace('@', '')}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-3 p-3 hover:bg-pink-50 rounded-lg transition-colors group"
                                    >
                                        <Instagram className="w-5 h-5 text-pink-600" />
                                        <span className="text-gray-700 group-hover:text-pink-600">Instagram</span>
                                    </a>
                                </div>
                            </div>

                            {/* Contact Buttons */}
                            <div className="space-y-3">
                                <a
                                    href={`mailto:${guide.email}?subject=Yêu cầu liên hệ từ VietVivu`}
                                    className="w-full bg-gradient-to-r from-indigo-600 to-blue-600 text-white py-3 rounded-xl font-bold hover:from-indigo-700 hover:to-blue-700 transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
                                >
                                    <Mail className="w-5 h-5" />
                                    Gửi Email
                                </a>
                                <a
                                    href={`tel:${guide.phone}`}
                                    className="w-full bg-green-600 text-white py-3 rounded-xl font-bold hover:bg-green-700 transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
                                >
                                    <Phone className="w-5 h-5" />
                                    Gọi điện
                                </a>
                                <button className="w-full border-2 border-indigo-600 text-indigo-600 py-3 rounded-xl font-bold hover:bg-indigo-50 transition-all flex items-center justify-center gap-2">
                                    <MessageCircle className="w-5 h-5" />
                                    Nhắn tin
                                </button>
                            </div>

                            <p className="text-xs text-gray-500 text-center mt-4">
                                Liên hệ trực tiếp với hướng dẫn viên để được tư vấn chi tiết
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default GuideDetailPage;