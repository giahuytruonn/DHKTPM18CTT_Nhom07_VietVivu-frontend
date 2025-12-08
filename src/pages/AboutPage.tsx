
import React from "react";
import { Globe, Users, Heart, Shield, Award, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";

export default function AboutPage() {
    return (
        <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-white">
            {/* Hero Section */}
            <section className="relative overflow-hidden bg-gradient-to-br from-indigo-600 to-blue-700 py-24">
                <div className="absolute inset-0 bg-black/10"></div>
                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
                        Chào mừng đến với <span className="text-yellow-300">VietVivu</span>
                    </h1>
                    <p className="text-xl text-indigo-100 max-w-3xl mx-auto leading-relaxed">
                        Nơi biến giấc mơ du lịch thành hiện thực. Chúng tôi mang đến những hành trình riêng tư,
                        ý nghĩa và trọn vẹn cảm xúc cùng hướng dẫn viên địa phương.
                    </p>
                </div>
            </section>

            {/* Mission & Vision */}
            <section className="py-16 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid md:grid-cols-2 gap-12">
                        <div className="bg-gradient-to-br from-indigo-50 to-blue-50 p-8 rounded-2xl shadow-lg">
                            <div className="w-14 h-14 bg-indigo-600 rounded-xl flex items-center justify-center mb-6">
                                <Globe className="w-8 h-8 text-white" />
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-4">Sứ mệnh</h3>
                            <p className="text-gray-600 leading-relaxed">
                                Kết nối du khách với những trải nghiệm du lịch chân thực, bền vững và đầy cảm hứng
                                tại Việt Nam thông qua các tour riêng tư được thiết kế tỉ mỉ.
                            </p>
                        </div>

                        <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-8 rounded-2xl shadow-lg">
                            <div className="w-14 h-14 bg-purple-600 rounded-xl flex items-center justify-center mb-6">
                                <Heart className="w-8 h-8 text-white" />
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-4">Tầm nhìn</h3>
                            <p className="text-gray-600 leading-relaxed">
                                Trở thành nền tảng đặt tour riêng tư hàng đầu Việt Nam, nơi mọi du khách đều tìm thấy
                                hành trình phù hợp với tâm hồn và sở thích của mình.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Values */}
            <section className="py-16 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Giá trị cốt lõi</h2>
                        <p className="mt-4 text-lg text-gray-600">Chúng tôi tin vào điều gì?</p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {[
                            { icon: Users, title: "Cá nhân hóa", desc: "Mỗi tour là duy nhất, được thiết kế riêng cho bạn." },
                            { icon: Shield, title: "An toàn & Tin cậy", desc: "Hỗ trợ 24/7, hướng dẫn viên được kiểm chứng." },
                            { icon: Award, title: "Chất lượng cao", desc: "Chỉ hợp tác với đối tác uy tín nhất." },
                        ].map((item, idx) => (
                            <div
                                key={idx}
                                className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 text-center"
                            >
                                <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <item.icon className="w-8 h-8 text-indigo-600" />
                                </div>
                                <h4 className="text-xl font-semibold text-gray-900 mb-2">{item.title}</h4>
                                <p className="text-gray-600">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Team */}
            <section className="py-16 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Đội ngũ sáng lập</h2>
                        <p className="mt-4 text-lg text-gray-600">Những người yêu du lịch và công nghệ</p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-12 items-center">
                        <div className="space-y-6">
                            <div className="flex items-center gap-4">
                                <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-blue-500 rounded-full flex items-center justify-center text-white font-bold text-xl">
                                    C
                                </div>
                                <div>
                                    <h4 className="text-xl font-semibold text-gray-900">Chúc</h4>
                                    <p className="text-indigo-600 font-medium">Founder & CEO</p>
                                </div>
                            </div>
                            <p className="text-gray-600 pl-20">
                                "Tôi tin rằng du lịch không chỉ là đi, mà là sống – sống trọn vẹn từng khoảnh khắc."
                            </p>
                        </div>

                        <div className="space-y-6">
                            <div className="flex items-center gap-4">
                                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold text-xl">
                                    D
                                </div>
                                <div>
                                    <h4 className="text-xl font-semibold text-gray-900">Double D H</h4>
                                    <p className="text-purple-600 font-medium">Co-Founder & CTO</p>
                                </div>
                            </div>
                            <p className="text-gray-600 pl-20">
                                "Công nghệ giúp chúng ta kết nối, nhưng chỉ có trải nghiệm mới chạm đến trái tim."
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="py-16 bg-gradient-to-r from-indigo-600 to-blue-600">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                        Sẵn sàng khám phá Việt Nam cùng VietVivu?
                    </h2>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link
                            to="/tours"
                            className="inline-flex items-center justify-center px-8 py-3 bg-white text-indigo-600 font-semibold rounded-lg hover:bg-gray-100 transition-all shadow-lg"
                        >
                            Xem tất cả tour
                            <ChevronRight className="ml-2 w-5 h-5" />
                        </Link>
                        <Link
                            to="/contact"
                            className="inline-flex items-center justify-center px-8 py-3 bg-transparent border-2 border-white text-white font-semibold rounded-lg hover:bg-white/10 transition-all"
                        >
                            Liên hệ ngay
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
}