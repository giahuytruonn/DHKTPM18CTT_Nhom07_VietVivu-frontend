// src/pages/BlogPage.tsx
import React from "react";
import { Calendar, Clock, User, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";

const blogPosts = [
    {
        id: 1,
        title: "Top 5 Địa Điểm Check-in Đẹp Nhất Đà Lạt 2025",
        excerpt: "Khám phá những góc sống ảo mới toanh tại thành phố ngàn hoa mà bạn không thể bỏ lỡ...",
        author: "Chúc",
        date: "15/11/2025",
        readTime: "5 phút",
        image: "https://picsum.photos/seed/dalat/800/600",
        category: "Đà Lạt",
    },
    {
        id: 2,
        title: "Hướng Dẫn Du Lịch Bụi Hà Giang Từ A-Z",
        excerpt: "Kinh nghiệm xương máu từ dân phượt 10 năm, giúp bạn chinh phục cung đường hạnh phúc...",
        author: "Double D H",
        date: "12/11/2025",
        readTime: "8 phút",
        image: "https://picsum.photos/seed/hagiang/800/600",
        category: "Hà Giang",
    },
    {
        id: 3,
        title: "Ẩm Thực Đường Phố Sài Gòn: Ăn Gì, Ở Đâu?",
        excerpt: "Danh sách 20 món ăn vặt đêm khuya mà bất kỳ tín đồ ẩm thực nào cũng phải thử...",
        author: "VietVivu Team",
        date: "10/11/2025",
        readTime: "6 phút",
        image: "https://picsum.photos/seed/saigon/800/600",
        category: "Sài Gòn",
    },
];

export default function BlogPage() {
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

                {/* Blog Grid */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {blogPosts.map((post) => (
                        <article
                            key={post.id}
                            className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 group"
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

                                <Link
                                    to={`/blog/${post.id}`}
                                    className="inline-flex items-center text-indigo-600 font-semibold hover:text-indigo-800 transition-colors"
                                >
                                    Đọc thêm
                                    <ChevronRight className="ml-1 w-5 h-5" />
                                </Link>
                            </div>
                        </article>
                    ))}
                </div>

                {/* Load More */}
                <div className="text-center mt-12">
                    <button className="px-8 py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition-all shadow-md hover:shadow-lg">
                        Xem thêm bài viết
                    </button>
                </div>
            </div>
        </div>
    );
}