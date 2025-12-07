import React, { useState, useEffect, useRef } from "react";
import { MessageCircle, Send, X } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import TourCard from "../components/ui/TourCard";
import TourImageCarousel from "../components/ui/TourImageCarousel";
import { sendChatMessage, type TourSummary, type ChatResponse } from "../services/chat.service";

interface ChatMessage {
  sender: "user" | "bot";
  text?: string;
  tours?: {
    title: string;
    link: string;
    description?: string;
    imageUrls?: string[];
  }[];
}

const ChatBox: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  if (location.pathname === "/login") return null;

  const [isOpen, setIsOpen] = useState(false);
  const [hasGreeted, setHasGreeted] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // --- DRAG CHATBOX ---
  const [position, setPosition] = useState({ x: 20, y: 80 });
  const dragOffset = useRef({ x: 0, y: 0 });
  const dragging = useRef(false);

  // --- DRAG CHAT ICON ---
  const [iconPos, setIconPos] = useState({ x: 1840, y: 780 });
  const iconDrag = useRef(false);
  const iconOffset = useRef({ x: 0, y: 0 });

  // Scroll xuống cuối khi có message mới
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // --- DRAG CHATBOX EVENTS ---
  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    dragging.current = true;
    dragOffset.current = {
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    };
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!dragging.current) return;
    setPosition({
      x: e.clientX - dragOffset.current.x,
      y: e.clientY - dragOffset.current.y,
    });
  };

  const handleMouseUp = () => {
    dragging.current = false;
  };

  // --- DRAG ICON EVENTS ---
  const handleIconDown = (e: React.MouseEvent) => {
    iconDrag.current = true;
    iconOffset.current = {
      x: e.clientX - iconPos.x,
      y: e.clientY - iconPos.y,
    };
  };

  const onIconMove = (e: MouseEvent) => {
    if (!iconDrag.current) return;
    setIconPos({
      x: e.clientX - iconOffset.current.x,
      y: e.clientY - iconOffset.current.y,
    });
  };

  const onIconUp = () => {
    iconDrag.current = false;
  };

  // --- GLOBAL LISTENERS ---
  useEffect(() => {
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);

    window.addEventListener("mousemove", onIconMove);
    window.addEventListener("mouseup", onIconUp);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);

      window.removeEventListener("mousemove", onIconMove);
      window.removeEventListener("mouseup", onIconUp);
    };
  }, []);

  // --- SEND MESSAGE ---
  const handleSend = async () => {
    if (!input.trim()) return;

    const userMsg: ChatMessage = { sender: "user", text: input };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const reply = await sendChatMessage(input);
      let botMsg: ChatMessage;

      if ("tourId" in reply) {
        botMsg = {
          sender: "bot",
          text: "Đây là tour phù hợp:",
          tours: [
            {
              title: reply.summary.name,
              link: `/tours/${reply.tourId}`,
              description: `Giá người lớn: ${reply.summary.priceAdult}\nGiá trẻ em: ${reply.summary.priceChild}\nSố ngày: ${reply.summary.days}`,
              imageUrls: reply.summary.imageUrls,
            },
          ],
        };
      } else if ("answer" in reply) {
        botMsg = { sender: "bot", text: reply.answer };
      } else {
        botMsg = {
          sender: "bot",
          text: "Xin lỗi, tôi không hiểu phản hồi này.",
        };
      }

      setMessages((prev) => [...prev, botMsg]);
    } finally {
      setLoading(false);
    }
  };

  const toggleChat = () => {
    setIsOpen((prev) => !prev);
    if (!hasGreeted) {
      setMessages((prev) => [
        ...prev,
        {
          sender: "bot",
          text: "Xin chào! 👋 Tôi là VietViVu Assistant.\nBạn muốn tôi giúp gì hôm nay?",
        },
      ]);
      setHasGreeted(true);
    }
  };

  return (
    <>
      {/* Nút mở chat (drag được) */}
      <button
        onMouseDown={handleIconDown}
        onClick={toggleChat}
        className="fixed bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-full shadow-2xl z-50 transition-transform hover:scale-110"
        style={{
          left: iconPos.x,
          top: iconPos.y,
          position: "fixed",
        }}
      >
        {isOpen ? <X size={22} /> : <MessageCircle size={22} />}
      </button>

      {/* Cửa sổ chat */}
      {isOpen && (
        <div
          className="fixed bg-white shadow-2xl rounded-3xl border border-gray-200 flex flex-col z-50 select-none"
          style={{
            width: "380px",
            height: "520px",
            left: position.x,
            bottom: position.y,
          }}
        >
          {/* Header */}
          <div
            onMouseDown={handleMouseDown}
            className="p-3 border-b font-bold text-blue-600 bg-gradient-to-r from-blue-100 to-blue-50 rounded-t-3xl cursor-move flex justify-between items-center shadow-inner"
          >
            VietViVu Assistant 🧭
            <button
              onClick={() => setIsOpen(false)}
              className="text-gray-500 hover:text-red-500 transition-colors"
            >
              <X size={18} />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-gray-50">
            {messages.map((msg, idx) => (
              <div key={idx} className="flex flex-col">
                <div
                  className={`p-3 rounded-2xl max-w-[80%] break-words shadow-sm ${
                    msg.sender === "user"
                      ? "ml-auto bg-blue-600 text-white"
                      : "mr-auto bg-gray-200 text-gray-800"
                  }`}
                >
                  {msg.text && (
                    <p className="whitespace-pre-line">{msg.text}</p>
                  )}

                  {/* TOUR + hình dạng carousel */}
                  {msg.tours?.map((tour, i) => (
                    <div key={i}>
                      <TourCard
                        title={tour.title}
                        description={tour.description}
                        link={tour.link}
                        onClick={() => navigate(tour.link)}
                      />

                      {tour.imageUrls && (
                        <TourImageCarousel
                          images={tour.imageUrls}
                          onClick={() => navigate(tour.link)}
                        />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}

            {loading && (
              <p className="text-gray-400 text-sm italic animate-pulse">
                AI đang trả lời...
              </p>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-3 border-t flex items-center gap-2 bg-white">
            <input
              className="flex-1 border rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Nhập yêu cầu..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleSend();
                }
              }}
            />
            <button
              onClick={handleSend}
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-full"
            >
              <Send size={18} />
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default ChatBox;
