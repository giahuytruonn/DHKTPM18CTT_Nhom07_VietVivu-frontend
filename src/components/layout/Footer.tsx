import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-white font-bold text-lg mb-4">VietVivu</h3>
            <p className="text-sm">
              Nền tảng đặt tour riêng tư với hướng dẫn viên địa phương.
            </p>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">Khám phá</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/tours" className="hover:text-white">Tất cả tour</Link></li>
              <li><Link to="/destinations" className="hover:text-white">Điểm đến</Link></li>
              <li><Link to="/blog" className="hover:text-white">Blog</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">Hỗ trợ</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/help" className="hover:text-white">Trợ giúp</Link></li>
              <li><Link to="/contact" className="hover:text-white">Liên hệ</Link></li>
              <li><Link to="/terms" className="hover:text-white">Điều khoản</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-font-semibold mb-4">Theo dõi</h4>
            <div className="flex space-x-4">
              <a href="#" className="hover:text-white">FB</a>
              <a href="#" className="hover:text-white">IG</a>
              <a href="#" className="hover:text-white">YT</a>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-gray-800 text-center text-sm">
          <p>© 2025 VietVivu. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}