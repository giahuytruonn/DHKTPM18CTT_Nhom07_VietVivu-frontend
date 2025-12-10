import React, { useState, useEffect, useRef } from "react";
import { MessageCircle, Send, X, Minimize2 } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import TourCard from "../components/ui/TourCard"; // Đảm bảo bạn đã cập nhật file này như bước trước
import TourImageCarousel from "../components/ui/TourImageCarousel";
import {
  sendChatMessage,
  type TourSummary,
  type ChatResponse,
} from "../services/chat.service";

interface ChatMessage {
  sender: "user" | "bot";
  text?: string;
  tours?: {
    title: string;
    link: string;
    description?: string;
    imageUrls?: string[];
    price?: string; // Thêm trường giá nếu API có trả về
  }[];
}

const ChatBox: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Ẩn chatbox ở trang login/register nếu cần
  if (["/login", "/register"].includes(location.pathname)) return null;

  const [isOpen, setIsOpen] = useState(false);
  const [hasGreeted, setHasGreeted] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // --- STATE VỊ TRÍ CHAT WINDOW ---
  // Mặc định là {0,0} -> sẽ dùng CSS bottom/right. Khi kéo sẽ cập nhật giá trị này.
  const [windowPos, setWindowPos] = useState({ x: 0, y: 0 });
  const windowDragOffset = useRef({ x: 0, y: 0 });
  const isWindowDragging = useRef(false);

  // --- STATE VỊ TRÍ ICON ---
  // Mặc định là null -> dùng CSS bottom/right.
  const [iconPos, setIconPos] = useState<{ x: number; y: number } | null>(null);
  const iconDragOffset = useRef({ x: 0, y: 0 });
  const isIconDragging = useRef(false);

  // Auto scroll xuống cuối
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isOpen, loading]);

  // --- LOGIC KÉO THẢ CỬA SỔ CHAT ---
  const handleWindowMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    isWindowDragging.current = true;
    
    // Nếu cửa sổ chưa từng bị kéo (đang ở vị trí mặc định), lấy tọa độ hiện tại của nó
    const currentX = windowPos.x !== 0 ? windowPos.x : e.currentTarget.parentElement?.getBoundingClientRect().left || 0;
    const currentY = windowPos.y !== 0 ? windowPos.y : e.currentTarget.parentElement?.getBoundingClientRect().top || 0;

    windowDragOffset.current = {
      x: e.clientX - currentX,
      y: e.clientY - currentY,
    };
  };

  const handleWindowMouseMove = (e: MouseEvent) => {
    if (!isWindowDragging.current) return;
    setWindowPos({
      x: e.clientX - windowDragOffset.current.x,
      y: e.clientY - windowDragOffset.current.y,
    });
  };

  const handleWindowMouseUp = () => {
    isWindowDragging.current = false;
  };

  // --- LOGIC KÉO THẢ ICON ---
  const handleIconMouseDown = (e: React.MouseEvent) => {
    // Chỉ bắt đầu kéo nếu không phải là click mở/đóng (chống rung)
    isIconDragging.current = true;
    
    const target = e.currentTarget as HTMLElement;
    const rect = target.getBoundingClientRect();
    
    // Nếu iconPos là null (vị trí mặc định), lấy tọa độ thực tế từ DOM
    const currentX = iconPos ? iconPos.x : rect.left;
    const currentY = iconPos ? iconPos.y : rect.top;

    iconDragOffset.current = {
      x: e.clientX - currentX,
      y: e.clientY - currentY,
    };
  };

  const handleIconMouseMove = (e: MouseEvent) => {
    if (!isIconDragging.current) return;
    e.preventDefault(); // Ngăn chọn text khi kéo
    setIconPos({
      x: e.clientX - iconDragOffset.current.x,
      y: e.clientY - iconDragOffset.current.y,
    });
  };

  const handleIconMouseUp = () => {
    isIconDragging.current = false;
  };

  // --- GLOBAL LISTENERS ---
  useEffect(() => {
    window.addEventListener("mousemove", handleWindowMouseMove);
    window.addEventListener("mouseup", handleWindowMouseUp);
    window.addEventListener("mousemove", handleIconMouseMove);
    window.addEventListener("mouseup", handleIconMouseUp);

    return () => {
      window.removeEventListener("mousemove", handleWindowMouseMove);
      window.removeEventListener("mouseup", handleWindowMouseUp);
      window.removeEventListener("mousemove", handleIconMouseMove);
      window.removeEventListener("mouseup", handleIconMouseUp);
    };
  }, [iconPos, windowPos]); // Re-bind nếu state thay đổi (thực ra không cần thiết lắm với ref nhưng an toàn)

  // --- XỬ LÝ TIN NHẮN ---
  const handleSend = async () => {
    if (!input.trim()) return;

    const userMsg: ChatMessage = { sender: "user", text: input };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const reply = await sendChatMessage(input);
let botMsg: ChatMessage;

// 1) TourSummary (1 tour)
if ("tourId" in reply && reply.summary) {
  botMsg = {
    sender: "bot",
    text: "Mình tìm thấy tour này hợp với bạn:",
    tours: [
      {
        title: reply.summary.name,
        link: `/tours/${reply.tourId}`,
        description: `Thời gian: ${reply.summary.days} ngày`,
        price: reply.summary.priceAdult.toString(),
        imageUrls: reply.summary.imageUrls,
      },
    ],
  };
}
// 2) ChatResponse
else if ("answer" in reply) {
  botMsg = { sender: "bot", text: reply.answer };
}
// fallback
else {
  botMsg = {
    sender: "bot",
    text: "Xin lỗi, mình chưa hiểu ý bạn lắm.",
  };
}

setMessages((prev) => [...prev, botMsg]);

    } catch (error) {
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: "Hệ thống đang bận, vui lòng thử lại sau." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const toggleChat = () => {
    // Check xem có phải đang kéo không để tránh click nhầm
    if (isIconDragging.current) return;
    
    setIsOpen((prev) => !prev);
    if (!hasGreeted && !isOpen) {
      setMessages((prev) => [
        ...prev,
        {
          sender: "bot",
          text: "Xin chào! 👋 Mình là trợ lý ảo VietViVu.\nMình có thể giúp bạn tìm tour du lịch nha!",
        },
      ]);
      setHasGreeted(true);
    }
  };

  return (
    <>
      {/* --- NÚT ICON CHAT --- */}
      <div
        onMouseDown={handleIconMouseDown}
        onClick={toggleChat}
        className="fixed z-[9999] cursor-pointer touch-none"
        style={
          iconPos
            ? { left: iconPos.x, top: iconPos.y } // Vị trí theo chuột (khi đã kéo)
            : { bottom: "30px", right: "30px" }   // Vị trí mặc định (Góc phải dưới)
        }
      >
        <div className="bg-gradient-to-tr from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white p-4 rounded-full shadow-lg shadow-blue-500/30 transition-transform hover:scale-105 active:scale-95 flex items-center justify-center">
          {isOpen ? <Minimize2 size={24} /> : <MessageCircle size={28} />}
        </div>
        
        {/* Badge thông báo giả lập (nếu chưa mở) */}
        {!isOpen && !hasGreeted && (
          <span className="absolute -top-1 -right-1 flex h-4 w-4">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-4 w-4 bg-red-500 border-2 border-white"></span>
          </span>
        )}
      </div>

      {/* --- CỬA SỔ CHAT --- */}
      {isOpen && (
        <div
          className="fixed flex flex-col z-[9998] bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden font-sans"
          style={{
            width: "350px",
            height: "550px",
            maxHeight: "80vh",
            // Nếu windowPos = {0,0} thì neo theo vị trí mặc định (trên icon), ngược lại theo tọa độ
            ...(windowPos.x === 0 && windowPos.y === 0
              ? { bottom: "100px", right: "30px" }
              : { left: windowPos.x, top: windowPos.y }),
          }}
        >
          {/* Header */}
          <div
            onMouseDown={handleWindowMouseDown}
            className="p-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white flex justify-between items-center cursor-move select-none"
          >
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              <span className="font-bold text-sm tracking-wide">VietViVu Support</span>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-white/80 hover:text-white transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 bg-gray-50 space-y-4">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex flex-col ${
                  msg.sender === "user" ? "items-end" : "items-start"
                }`}
              >
                <div
                  className={`px-4 py-2.5 max-w-[85%] rounded-2xl text-sm leading-relaxed shadow-sm ${
                    msg.sender === "user"
                      ? "bg-blue-600 text-white rounded-br-none"
                      : "bg-white text-gray-800 border border-gray-100 rounded-tl-none"
                  }`}
                >
                  {msg.text && <p className="whitespace-pre-line">{msg.text}</p>}
                </div>

                {/* Hiển thị danh sách Tour (Nếu có) */}
                {msg.tours && msg.tours.length > 0 && (
                  <div className="mt-2 w-full pl-2 space-y-3">
                    {msg.tours.map((tour, i) => (
                      <TourCard
                        key={i}
                        title={tour.title}
                        description={tour.description}
                        link={tour.link}
                        imageUrls={tour.imageUrls}
                        // Nếu API chưa có rating/price thì component TourCard sẽ dùng default hoặc placeholder
                        price={tour.price} 
                        onClick={() => {
                            // Đóng chat hoặc minimize khi click link
                            navigate(tour.link);
                        }}
                      />
                    ))}
                  </div>
                )}
              </div>
            ))}

            {loading && (
              <div className="flex items-center gap-2 text-gray-400 text-xs ml-2">
                <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0s' }}/>
                <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}/>
                <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}/>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-3 bg-white border-t border-gray-100">
            <div className="flex items-center gap-2 bg-gray-100 rounded-full px-4 py-2 border border-transparent focus-within:border-blue-300 focus-within:bg-white transition-all">
              <input
                className="flex-1 bg-transparent text-sm outline-none text-gray-700 placeholder-gray-400"
                placeholder="Hỏi về tour Đà Lạt..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
              />
              <button
                onClick={handleSend}
                disabled={loading || !input.trim()}
                className={`p-2 rounded-full transition-all ${
                    input.trim() 
                    ? "bg-blue-600 text-white hover:bg-blue-700 shadow-md" 
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                }`}
              >
                <Send size={16} />
              </button>
            </div>
            <div className="text-[10px] text-center text-gray-400 mt-2">
                Được hỗ trợ bởi AI • Thông tin có thể cần kiểm chứng
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ChatBox;