// src/pages/BlogDetailPage.tsx
import React from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
    ArrowLeft,
    Calendar,
    Clock,
    User,
    Tag,
    Share2,
    Heart,
    MessageCircle,
} from "lucide-react";

// Dữ liệu blog (giống Home nhưng có content đầy đủ)
const blogPostsData = [
    {
        id: 1,
        date: "28/10/2025",
        title: "5 điểm đến ít người biết ở Hà Nội",
        excerpt: "Hà Nội không chỉ có Hồ Gươm, Văn Miếu... Hãy cùng khám phá những địa điểm ẩn mình đầy thú vị!",
        image: "https://dynamic-media-cdn.tripadvisor.com/media/photo-o/23/98/95/a0/hidden-gem-cafe-the-best.jpg?w=900&h=500&s=1",
        author: "Nguyễn Văn A",
        category: "Khám phá",
        readTime: "5 phút",
        likes: 234,
        comments: 45,
        content: `<p class="lead">Hà Nội - thủ đô ngàn năm văn hiến với vô vàn điểm đến hấp dẫn. Tuy nhiên, bên cạnh những địa danh nổi tiếng, vẫn còn rất nhiều nơi ít được biết đến nhưng lại vô cùng đặc biệt.</p>
<h2>1. Làng gốm Bát Tràng</h2>
<p>Nằm cách trung tâm Hà Nội khoảng 15km, làng gốm Bát Tràng là một trong những làng nghề truyền thống lâu đời nhất Việt Nam với lịch sử hơn 700 năm.</p>
<p>Tại đây, bạn không chỉ được chiêm ngưỡng những sản phẩm gốm sứ tinh xảo mà còn có thể tự tay nặn gốm, vẽ hoa văn và tạo ra những món đồ độc đáo của riêng mình.</p>
<ul>
  <li>Thời gian: Mở cửa cả ngày, nhưng buổi sáng hoặc chiều muộn là lý tưởng nhất</li>
  <li>Giá vé: Miễn phí tham quan, chỉ trả phí nếu tham gia hoạt động làm gốm</li>
  <li>Tips: Mặc quần áo cũ vì có thể bị bẩn khi nặn gốm</li>
</ul>
<h2>2. Chùa Trấn Quốc</h2>
<p>Được xây dựng từ thế kỷ 6, chùa Trấn Quốc là ngôi chùa cổ nhất Hà Nội, nằm yên bình bên Hồ Tây. Đây là nơi lý tưởng để tìm về sự bình yên và tĩnh lặng giữa lòng phố thị ồn ào.</p>
<h2>3. Phố cổ Hà Nội về đêm</h2>
<p>Khi màn đêm buông xuống, phố cổ lại khoác lên mình một vẻ đẹp khác - lung linh, huyền bí và đầy sức sống.</p>
<h2>4. Làng hoa Tây Tựu</h2>
<p>Đặc biệt vào dịp Tết Nguyên Đán, làng hoa Tây Tựu trở thành điểm đến được nhiều người yêu thích với hàng nghìn loại hoa rực rỡ.</p>
<h2>5. Bảo tàng Dân tộc học Việt Nam</h2>
<p>Nơi lưu giữ nét đẹp văn hóa của 54 dân tộc Việt Nam với khuôn viên rộng lớn và các hiện vật sống động.</p>
<h2>Lời kết</h2>
<p>Hà Nội còn rất nhiều điều bí ẩn chờ bạn khám phá. Hãy dành thời gian để đi sâu vào từng con ngõ, từng con phố, và bạn sẽ tìm thấy những điều thú vị bất ngờ!</p>
<p><strong>Chúc bạn có những chuyến đi đáng nhớ!</strong></p>`
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
        likes: 189,
        comments: 32,
        content: `<p class="lead">Trong thời đại hiện nay, du lịch không chỉ là di chuyển mà là cả một hành trình trải nghiệm. Tour riêng chính là cách tốt nhất để bạn tận hưởng trọn vẹn giá trị ấy.</p>
<h2>1. Linh hoạt về thời gian</h2>
<p>Không lịch trình cứng nhắc - bạn quyết định mọi thứ!</p>
<h2>2. Trải nghiệm cá nhân hóa</h2>
<p>Hướng dẫn viên sẽ điều chỉnh hành trình theo đúng sở thích của bạn: chụp ảnh, ẩm thực, lịch sử...</p>
<h2>3. Không gian riêng tư</h2>
<p>Không chen chúc, không ồn ào - chỉ có bạn và những khoảnh khắc riêng tư tuyệt đối.</p>
<h2>4. Học hỏi sâu sắc hơn</h2>
<p>Bạn có thể hỏi bất kỳ điều gì, nghe những câu chuyện chỉ dành riêng cho mình.</p>
<h2>5. An toàn và yên tâm hơn</h2>
<p>Hạn chế tiếp xúc đông người, phương tiện riêng, kiểm soát vệ sinh thực phẩm.</p>
<h2>Vậy ai nên chọn tour riêng?</h2>
<ul>
  <li>Gia đình có trẻ nhỏ hoặc người lớn tuổi</li>
  <li>Cặp đôi muốn không gian lãng mạn</li>
  <li>Nhóm bạn thân muốn thoải mái</li>
  <li>Người có nhu cầu đặc biệt về ẩm thực, di chuyển</li>
</ul>
<h2>Kết luận</h2>
<p>Tour riêng tuy chi phí cao hơn một chút, nhưng giá trị trải nghiệm là vô giá!</p>
<p><strong>Hãy thử một lần để cảm nhận sự khác biệt!</strong></p>`
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
        likes: 312,
        comments: 67,
        content: `<p class="lead">Huế không chỉ nổi tiếng với di tích mà còn là thiên đường ẩm thực với hơn 50 món đặc sắc.</p>
<h2>Bún bò Huế - Hồn cốt ẩm thực Huế</h2>
<p>Nước dùng đậm đà, thịt bò mềm, chả cua thơm lừng.</p>
<ul>
  <li>Bà Tuyết (74 Nguyễn Công Trứ)</li>
  <li>Hoa Khải (12 Nguyễn Hoàng)</li>
  <li>Nam Giao (36A Ông Ích Khiêm)</li>
</ul>
<h2>Cơm hến - Bình dân mà đậm đà</h2>
<p>Cơm trắng + hến xào + tóp mỡ + rau sống + bánh tráng = tuyệt phẩm!</p>
<h2>Bánh khoái, bánh bèo, bánh nậm, bánh lọc</h2>
<p>Những món bánh nhỏ xinh nhưng cực kỳ gây nghiện.</p>
<h2>Chè Huế - Ngọt ngào cuối bữa</h2>
<ul>
  <li>Chè Hẻm (đỉnh cao)</li>
  <li>Chè Bà Ba</li>
</ul>
<h2>Tips ăn uống ở Huế</h2>
<ol>
  <li>Ăn quán ven đường = ngon nhất</li>
  <li>Đi sớm kẻo hết (nhiều quán hết từ 9-10h sáng)</li>
  <li>Mang tiền mặt</li>
  <li>Hỏi người địa phương</li>
</ol>
<p><strong>Chúc bạn ăn no căng bụng ở Huế!</strong></p>`
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
        likes: 278,
        comments: 54,
        content: `<p class="lead">Mùa hoa dã quỳ Đà Lạt (tháng 11-12) là thời điểm đẹp nhất trong năm để ghé thăm cao nguyên mộng mơ.</p>
<h2>Điểm ngắm hoa đẹp nhất</h2>
<ul>
  <li>Đồi Cù Lần (rộng & đẹp nhất)</li>
  <li>Đồi Mộng Mơ</li>
  <li>Đường hầm đất sét</li>
  <li>Thung lũng Vàng</li>
</ul>
<h2>Thời gian chụp ảnh đẹp</h2>
<ul>
  <li>Sáng sớm 6h-8h: sương mù + ánh sáng dịu</li>
  <li>Chiều 4h-5h30: nắng vàng óng ả</li>
</ul>
<h2>Tips chụp đẹp</h2>
<ol>
  <li>Mặc đồ trắng/pastel nổi bật trên nền vàng</li>
  <li>Tránh cuối tuần vì đông</li>
  <li>Mang mũ + kem chống nắng</li>
</ol>
<p><strong>Chúc bạn có album sống ảo triệu like!</strong></p>`
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
        likes: 425,
        comments: 89,
        content: `<p class="lead">Việt Nam có hơn 3000km đường bờ biển - đây là top 10 bãi biển đẹp nhất mà bạn phải ghé ít nhất một lần!</p>
<ol>
  <li>Bãi Sao - Phú Quốc (đẹp nhất VN)</li>
  <li>Mỹ Khê - Đà Nẵng (Forbes công nhận)</li>
  <li>Lăng Cô - Huế (vịnh đẹp nhất thế giới)</li>
  <li>An Bàng - Hội An</li>
  <li>Côn Đảo</li>
  <li>Quy Nhơn</li>
  <li>Nha Trang</li>
  <li>Phú Yên</li>
  <li>Lý Sơn</li>
  <li>Hòn Chồng - Nha Trang</li>
</ol>
<p><strong>Chúc bạn có kỳ nghỉ biển thật chill!</strong></p>`
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
        likes: 487,
        comments: 102,
        content: `<p class="lead">Sài Gòn về đêm là thiên đường của dân ăn vặt!</p>
<h2>Top món phải thử</h2>
<ul>
  <li>Bánh tráng trộn (15-25k)</li>
  <li>Hủ tiếu Nam Vang</li>
  <li>Bánh xèo miền Tây</li>
  <li>Ốc các loại</li>
  <li>Chè thập cẩm, chè thái</li>
</ul>
<h2>Lịch ăn vặt đêm lý tưởng</h2>
<ul>
  <li>19h: Bánh tráng trộn</li>
  <li>20h: Hủ tiếu hoặc bánh xèo</li>
  <li>21h: Ốc + bia</li>
  <li>22h: Chè tráng miệng</li>
</ul>
<p><strong>Ăn no từ vỉa hè tới... tim!</strong></p>`
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
        likes: 523,
        comments: 95,
        content: `<p class="lead">Hội An - viên ngọc quý của miền Trung với phố cổ lung linh đèn lồng.</p>
<h2>Điểm phải ghé</h2>
<ul>
  <li>Phố cổ + thả đèn hoa đăng</li>
  <li>Chùa Cầu</li>
  <li>Rừng dừa Bảy Mẫu</li>
  <li>Bãi biển An Bàng</li>
</ul>
<h2>Ẩm thực không thể bỏ lỡ</h2>
<ul>
  <li>Cao lầu</li>
  <li>Mì Quảng</li>
  <li>Bánh mì Phượng</li>
  <li>Cơm gà</li>
</ul>
<p><strong>Hội An đẹp nhất vào đêm - đừng về sớm nhé!</strong></p>`
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
        likes: 298,
        comments: 61,
        content: `<p class="lead">Mộc Châu có vô vàn homestay xinh xắn giữa đồi chè, thung lũng hoa.</p>
<h2>Top 5 homestay đáng ở nhất</h2>
<ul>
  <li>Mộc Châu Arena Village (view đồi chè đẹp nhất)</li>
  <li>Happy Hill (giá rẻ, chủ siêu dễ thương)</li>
  <li>Mộc Châu Ecolodge (sang - xịn - mịn)</li>
  <li>Nhà Nghỉ Mộc Châu (rẻ, gần trung tâm)</li>
  <li>Mộc Châu Highland Resort (5 sao)</li>
</ul>
<p><strong>Chọn đúng homestay = 90% chuyến đi thành công!</strong></p>`
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
        likes: 356,
        comments: 78,
        content: `<p class="lead">Sapa hoàn toàn có thể đi tự túc với chi phí siêu hợp lý nếu bạn biết cách!</p>
<h2>Chi phí ước tính 3N2Đ</h2>
<ul>
  <li>Xe khách HN ↔ Sapa: 300.000đ khứ hồi</li>
  <li>Homestay: 150.000đ/đêm × 2 = 300.000đ</li>
  <li>Ăn uống: 200.000đ/ngày × 3 = 600.000đ</li>
  <li>Tham quan + xe máy: 300.000đ</li>
  <li><strong>Tổng:</strong> ~1.500.000đ/người</li>
</ul>
<h2>Lịch trình gợi ý</h2>
<ul>
  <li><strong>Ngày 1:</strong> Xe đêm → Sapa sáng → Check-in → Dạo thị trấn</li>
  <li><strong>Ngày 2:</strong> Trekking Cát Cát → Thác Bạc → Lao Chải - Tả Van</li>
  <li><strong>Ngày 3:</strong> Fansipan (tùy chọn) → Chợ tình → Xe về HN</li>
</ul>
<h2>Tips tiết kiệm</h2>
<ol>
  <li>Đặt xe + phòng sớm</li>
  <li>Ăn quán địa phương</li>
  <li>Thuê xe máy thay vì đi taxi</li>
  <li>Mua đồ lưu niệm ở bản</li>
</ol>
<p><strong>Chúc bạn chinh phục nóc nhà Đông Dương thành công!</strong></p>`
    },
];

const BlogDetailPage: React.FC = () => {
    const { blogId } = useParams<{ blogId: string }>();
    const navigate = useNavigate();

    const post = blogPostsData.find((p) => p.id === Number(blogId));

    if (!post) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">Không tìm thấy bài viết</h2>
                    <Link to="/blog" className="text-indigo-600 hover:text-indigo-800">
                        Quay lại danh sách blog
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Hero Image */}
            <div
                className="relative h-[500px] bg-cover bg-center"
                style={{ backgroundImage: `url('${post.image}')` }}
            >
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent"></div>

                {/* Back Button */}
                <button
                    onClick={() => navigate(-1)}
                    className="absolute top-6 left-6 flex items-center gap-2 text-white hover:text-indigo-300 transition-colors z-10 bg-black/40 px-5 py-2.5 rounded-full backdrop-blur-md hover:bg-black/60"
                >
                    <ArrowLeft size={20} />
                    <span className="font-semibold">Quay lại</span>
                </button>

                {/* Title Overlay */}
                <div className="absolute bottom-0 left-0 right-0 p-8 pb-12">
                    <div className="max-w-4xl mx-auto">
                        <div className="flex items-center gap-3 mb-4">
                            <span className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-sm font-bold rounded-full shadow-lg">
                                <Tag className="w-4 h-4" />
                                {post.category}
                            </span>
                            <span className="px-4 py-2 bg-white/20 backdrop-blur-md text-white text-sm font-medium rounded-full">
                                {post.readTime} đọc
                            </span>
                        </div>
                        <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-4 leading-tight drop-shadow-2xl">
                            {post.title}
                        </h1>
                        <p className="text-xl text-gray-200 font-medium max-w-3xl drop-shadow-lg">
                            {post.excerpt}
                        </p>
                    </div>
                </div>
            </div>

            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {/* Meta Info Card */}
                <div className="bg-white rounded-2xl shadow-2xl p-6 mb-8 border border-gray-100">
                    <div className="flex flex-wrap items-center justify-between gap-4">
                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2 text-gray-600">
                                <User className="w-5 h-5" />
                                <span className="font-medium">{post.author}</span>
                            </div>
                            <div className="flex items-center gap-2 text-gray-600">
                                <Calendar className="w-5 h-5" />
                                <span>{post.date}</span>
                            </div>
                            <div className="flex items-center gap-2 text-gray-600">
                                <Clock className="w-5 h-5" />
                                <span>{post.readTime}</span>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <button className="flex items-center gap-2 text-gray-600 hover:text-red-600 transition-colors">
                                <Heart className="w-5 h-5" />
                                <span>{post.likes}</span>
                            </button>
                            <button className="flex items-center gap-2 text-gray-600 hover:text-indigo-600 transition-colors">
                                <MessageCircle className="w-5 h-5" />
                                <span>{post.comments}</span>
                            </button>
                            <button className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors">
                                <Share2 className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Content */}
                <article className="bg-white rounded-2xl shadow-lg p-8 md:p-12">
                    <div
                        className="prose prose-lg prose-indigo max-w-none
              prose-headings:font-bold prose-headings:text-gray-900
              prose-h2:text-2xl prose-h2:mt-8 prose-h2:mb-4
              prose-p:text-gray-700 prose-p:leading-relaxed prose-p:mb-4
              prose-ul:my-4 prose-li:my-2
              prose-strong:text-gray-900 prose-strong:font-bold
              prose-a:text-indigo-600 prose-a:no-underline hover:prose-a:underline
              prose-img:rounded-xl prose-img:shadow-lg"
                        dangerouslySetInnerHTML={{ __html: post.content }}
                    />
                </article>

                {/* Related Posts */}
                <div className="mt-12">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">Bài viết liên quan</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {blogPostsData
                            .filter((p) => p.id !== post.id)
                            .slice(0, 2)
                            .map((relatedPost) => (
                                <Link
                                    key={relatedPost.id}
                                    to={`/blog/${relatedPost.id}`}
                                    className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all group"
                                >
                                    <img
                                        src={relatedPost.image}
                                        alt={relatedPost.title}
                                        className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                                    />
                                    <div className="p-5">
                                        <span className="inline-block px-3 py-1 bg-indigo-100 text-indigo-700 text-xs font-semibold rounded-full mb-2">
                                            {relatedPost.category}
                                        </span>
                                        <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-indigo-600 transition-colors line-clamp-2">
                                            {relatedPost.title}
                                        </h3>
                                        <p className="text-sm text-gray-600 line-clamp-2">{relatedPost.excerpt}</p>
                                    </div>
                                </Link>
                            ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BlogDetailPage;