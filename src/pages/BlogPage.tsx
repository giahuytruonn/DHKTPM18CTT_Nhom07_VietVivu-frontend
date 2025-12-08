import { useState } from "react";
import { Calendar, Clock, User, ChevronRight, Search, Tag } from "lucide-react";

const allBlogPosts = [
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
    {
        id: 4,
        date: "20/09/2025",
        title: "Hướng dẫn du lịch Đà Lạt mùa hoa dã quỳ",
        excerpt: "Những điểm check-in đẹp nhất khi mùa hoa dã quỳ nở rộ tại thành phố ngàn hoa.",
        image: "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=800",
        author: "Phạm Thị D",
        category: "Khám phá",
        readTime: "6 phút",
    },
    {
        id: 5,
        date: "05/09/2025",
        title: "Top 10 bãi biển đẹp nhất Việt Nam",
        excerpt: "Từ Phú Quốc đến Nha Trang, khám phá những bãi biển xanh ngọc bích tuyệt đẹp.",
        image: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800",
        author: "Hoàng Văn E",
        category: "Khám phá",
        readTime: "10 phút",
    },
    {
        id: 6,
        date: "22/08/2025",
        title: "Kinh nghiệm du lịch bụi Sapa tự túc",
        excerpt: "Hướng dẫn chi tiết từ A-Z cho chuyến du lịch Sapa với ngân sách tiết kiệm.",
        image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800",
        author: "Nguyễn Thị F",
        category: "Tips & Tricks",
        readTime: "12 phút",
    },
    {
        id: 7,
        date: "10/08/2025",
        title: "Những món ăn đường phố Sài Gòn phải thử",
        excerpt: "Danh sách 15 món ăn vặt đêm khuya mà bất kỳ tín đồ ẩm thực nào cũng phải thử.",
        image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800",
        author: "Lê Thị G",
        category: "Ẩm thực",
        readTime: "7 phút",
    },
    {
        id: 8,
        date: "28/07/2025",
        title: "Cẩm nang du lịch Hội An toàn tập",
        excerpt: "Khám phá phố cổ, ẩm thực và những trải nghiệm không thể bỏ qua tại Hội An.",
        image: "https://images.unsplash.com/photo-1583417319070-4a69db38a482?w=800",
        author: "Trần Văn H",
        category: "Khám phá",
        readTime: "15 phút",
    },
    {
        id: 9,
        date: "15/07/2025",
        title: "Review homestay đẹp ở Mộc Châu",
        excerpt: "Top 5 homestay view đẹp, giá tốt cho chuyến du lịch Mộc Châu của bạn.",
        image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800",
        author: "Phạm Văn I",
        category: "Review",
        readTime: "9 phút",
    },
];

const categories = ["Tất cả", "Khám phá", "Tips & Tricks", "Ẩm thực", "Review"];

export default function BlogPage() {
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("Tất cả");
    const [displayCount, setDisplayCount] = useState(6);

    const filteredPosts = allBlogPosts.filter((post) => {
        const matchesSearch =
            post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            post.excerpt.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory =
            selectedCategory === "Tất cả" || post.category === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    const displayedPosts = filteredPosts.slice(0, displayCount);
    const hasMore = displayCount < filteredPosts.length;

    const loadMore = () => {
        setDisplayCount((prev) => prev + 3);
    };

    return (
        <div className="min-h-screen bg-gray-50 py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="text-center mb-12">
                    <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                        Blog Du Lịch <span className="text-indigo-600">VietVivu</span>
                    </h1>
                    <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                        Chia sẻ kinh nghiệm, cảm hứng và những câu chuyện đẹp từ hành trình khám phá Việt Nam.
                    </p>
                </div>

                {/* Search & Filter */}
                <div className="bg-white rounded-xl shadow-md p-6 mb-8">
                    <div className="flex flex-col md:flex-row gap-4">
                        {/* Search */}
                        <div className="flex-1 relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                            <input
                                type="text"
                                placeholder="Tìm kiếm bài viết..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                            />
                        </div>

                        {/* Category Filter */}
                        <div className="flex gap-2 flex-wrap">
                            {categories.map((cat) => (
                                <button
                                    key={cat}
                                    onClick={() => setSelectedCategory(cat)}
                                    className={`px-4 py-2 rounded-lg font-medium transition-all ${selectedCategory === cat
                                        ? "bg-indigo-600 text-white shadow-md"
                                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                        }`}
                                >
                                    <Tag size={16} className="inline mr-1" />
                                    {cat}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="mt-4 text-sm text-gray-600">
                        Tìm thấy <span className="font-bold text-indigo-600">{filteredPosts.length}</span> bài viết
                    </div>
                </div>

                {/* Blog Grid */}
                {displayedPosts.length > 0 ? (
                    <>
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {displayedPosts.map((post, index) => (
                                <article
                                    key={post.id}
                                    className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 group"
                                    style={{ animationDelay: `${index * 50}ms` }}
                                >
                                    <div className="relative overflow-hidden">
                                        <img
                                            src={post.image}
                                            alt={post.title}
                                            className="w-full h-56 object-cover group-hover:scale-110 transition-transform duration-500"
                                        />
                                        <span className="absolute top-4 left-4 bg-indigo-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                                            {post.category}
                                        </span>
                                    </div>

                                    <div className="p-6">
                                        <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                                            <div className="flex items-center gap-1">
                                                <User className="w-4 h-4" />
                                                <span>{post.author}</span>
                                            </div>
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
                                        <p className="text-gray-600 mb-4 line-clamp-3">{post.excerpt}</p>

                                        <a
                                            href={`/blog/${post.id}`}
                                            className="inline-flex items-center text-indigo-600 font-semibold hover:text-indigo-800 transition-colors"
                                        >
                                            Đọc thêm
                                            <ChevronRight className="ml-1 w-5 h-5" />
                                        </a>
                                    </div>
                                </article>
                            ))}
                        </div>

                        {/* Load More Button */}
                        {hasMore && (
                            <div className="text-center mt-12">
                                <button
                                    onClick={loadMore}
                                    className="px-8 py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition-all shadow-md hover:shadow-lg"
                                >
                                    Xem thêm bài viết
                                </button>
                            </div>
                        )}
                    </>
                ) : (
                    <div className="text-center py-12 bg-white rounded-xl shadow-md">
                        <h3 className="text-2xl font-bold text-gray-900 mb-2">Không tìm thấy bài viết</h3>
                        <p className="text-gray-600 mb-4">Thử thay đổi từ khóa hoặc bộ lọc</p>
                        <button
                            onClick={() => {
                                setSearchTerm("");
                                setSelectedCategory("Tất cả");
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
}