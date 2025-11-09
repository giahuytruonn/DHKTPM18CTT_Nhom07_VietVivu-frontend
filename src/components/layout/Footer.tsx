import { Link } from "react-router-dom";
import { Facebook, Instagram, Youtube, Globe, Mail, Phone, MapPin, ChevronRight } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-gradient-to-b from-gray-900 to-black text-gray-300 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Cột 1: Logo & Giới thiệu */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center shadow-lg">
                <Globe className="text-white" size={22} />
              </div>
              <h3 className="text-2xl font-bold bg-gradient-to-r from-indigo-400 to-blue-400 bg-clip-text text-transparent">
                VietVivu
              </h3>
            </div>
            <p className="text-sm leading-relaxed max-w-xs">
              Nền tảng đặt tour riêng tư với hướng dẫn viên địa phương. Khám phá Việt Nam theo cách của bạn.
            </p>
            <div className="flex space-x-3 pt-2">
              <a
                href="#"
                className="w-9 h-9 bg-gray-800 rounded-full flex items-center justify-center hover:bg-indigo-600 transition-all duration-300 group"
              >
                <Facebook size={16} className="text-gray-400 group-hover:text-white" />
              </a>
              <a
                href="#"
                className="w-9 h-9 bg-gray-800 rounded-full flex items-center justify-center hover:bg-pink-600 transition-all duration-300 group"
              >
                <Instagram size={16} className="text-gray-400 group-hover:text-white" />
              </a>
              <a
                href="#"
                className="w-9 h-9 bg-gray-800 rounded-full flex items-center justify-center hover:bg-red-600 transition-all duration-300 group"
              >
                <Youtube size={16} className="text-gray-400 group-hover:text-white" />
              </a>
            </div>
          </div>

          {/* Cột 2: Khám phá */}
          <div>
            <h4 className="text-white font-bold mb-5 flex items-center">
              <ChevronRight size={18} className="text-indigo-500 mr-1" />
              Khám phá
            </h4>
            <ul className="space-y-3">
              {[
                { to: "/tours", label: "Tất cả tour" },
                { to: "/destinations", label: "Điểm đến nổi bật" },
                { to: "/blog", label: "Blog du lịch" },
                { to: "/experiences", label: "Trải nghiệm độc đáo" },
              ].map((item) => (
                <li key={item.to}>
                  <Link
                    to={item.to}
                    className="text-sm flex items-center hover:text-white transition-colors duration-200 group"
                  >
                    <ChevronRight size={14} className="text-indigo-500 mr-1 opacity-0 group-hover:opacity-100 transition-opacity" />
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Cột 3: Hỗ trợ */}
          <div>
            <h4 className="text-white font-bold mb-5 flex items-center">
              <ChevronRight size={18} className="text-indigo-500 mr-1" />
              Hỗ trợ
            </h4>
            <ul className="space-y-3">
              {[
                { to: "/help", label: "Trung tâm trợ giúp", icon: "help" },
                { to: "/contact", label: "Liên hệ chúng tôi", icon: Mail },
                { to: "/terms", label: "Điều khoản dịch vụ", icon: "doc" },
                { to: "/privacy", label: "Chính sách bảo mật", icon: "lock" },
              ].map((item) => (
                <li key={item.to}>
                  <Link
                    to={item.to}
                    className="text-sm flex items-center hover:text-white transition-colors duration-200 group"
                  >
                    <ChevronRight size={14} className="text-indigo-500 mr-1 opacity-0 group-hover:opacity-100 transition-opacity" />
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Cột 4: Liên hệ */}
          <div>
            <h4 className="text-white font-bold mb-5 flex items-center">
              <ChevronRight size={18} className="text-indigo-500 mr-1" />
              Liên hệ
            </h4>
            <ul className="space-y-4 text-sm">
              <li className="flex items-start gap-3">
                <MapPin size={18} className="text-indigo-500 mt-0.5 flex-shrink-0" />
                <span>Hà Nội · TP.HCM · Đà Nẵng</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone size={18} className="text-indigo-500" />
                <a href="tel:1900xxxx" className="hover:text-white transition-colors">1900 XXXX</a>
              </li>
              <li className="flex items-center gap-3">
                <Mail size={18} className="text-indigo-500" />
                <a href="mailto:support@vietvivu.com" className="hover:text-white transition-colors">
                  support@vietvivu.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Dòng bản quyền */}
        <div className="mt-12 pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center text-sm text-gray-500">
          <p className="flex items-center gap-2">
            © 2025 <span className="text-indigo-400 font-medium">VietVivu</span>. Tất cả quyền được bảo lưu.
          </p>
          <p className="mt-2 md:mt-0 flex items-center gap-1">
            Made with <span className="text-red-500">Chuc and Double D H</span> in Vietnam
          </p>
        </div>
      </div>
    </footer>
  );
}