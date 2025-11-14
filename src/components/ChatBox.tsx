import React, { useState, useEffect, useRef } from "react";
import { MessageCircle, Send, X } from "lucide-react";
import { useLocation } from "react-router-dom";
import TourCard from "./ui/TourCard";
import { sendChatMessage } from "../services/chat.service";

interface ChatMessage {
  sender: "user" | "bot";
  text: string;
  tours?: { title: string; text: string }[];
}

const ChatBox: React.FC = () => {
  const location = useLocation();
  if (location.pathname === "/login") return null;

  const [isOpen, setIsOpen] = useState(false);
  const [hasGreeted, setHasGreeted] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [position, setPosition] = useState({ x: 20, y: 80 });
  const dragOffset = useRef({ x: 0, y: 0 });
  const dragging = useRef(false);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMsg: ChatMessage = { sender: "user", text: input };
    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const reply = await sendChatMessage(input);

      try {
        const parsed = JSON.parse(reply);
        if (parsed.tourId && parsed.summary) {
          setMessages(prev => [...prev, {
            sender: "bot",
            text: "Đây là tour phù hợp:",
            tours: [{
              title: parsed.summary.name,
              text: `Giá: ${parsed.summary.price}, Số ngày: ${parsed.summary.days}`
            }]
          }]);
        } else {
          setMessages(prev => [...prev, { sender: "bot", text: reply }]);
        }
      } catch {
        setMessages(prev => [...prev, { sender: "bot", text: reply }]);
      }
    } finally {
      setLoading(false);
    }
  };

  const toggleChat = () => {
    setIsOpen(prev => !prev);

    if (!hasGreeted) {
      const greeting: ChatMessage = {
        sender: "bot",
        text: "Xin chào! 👋 Tôi là VietViVu Assistant.\nBạn muốn tôi giúp gì hôm nay?",
      };
      setMessages(prev => [...prev, greeting]);
      setHasGreeted(true);
    }
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    dragging.current = true;
    dragOffset.current = { x: e.clientX - position.x, y: e.clientY - position.y };
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!dragging.current) return;
    setPosition({ x: e.clientX - dragOffset.current.x, y: e.clientY - dragOffset.current.y });
  };

  const handleMouseUp = () => {
    dragging.current = false;
  };

  useEffect(() => {
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, []);

  return (
    <>
      {/* 🔘 Nút mở chat */}
      <button
        onClick={toggleChat}
        className="fixed bottom-5 right-5 bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-full shadow-2xl z-50 transition-transform hover:scale-110"
      >
        {isOpen ? <X size={22} /> : <MessageCircle size={22} />}
      </button>

      {/* 💬 Cửa sổ chat */}
      {isOpen && (
        <div
          className="fixed bg-white shadow-2xl rounded-3xl border border-gray-200 flex flex-col z-50 select-none transition-all duration-300"
          style={{ width: "380px", height: "520px", left: `${position.x}px`, bottom: `${position.y}px` }}
        >
          {/* Thanh tiêu đề */}
          <div
            className="p-3 border-b font-bold text-blue-600 bg-gradient-to-r from-blue-100 to-blue-50 rounded-t-3xl cursor-move flex justify-between items-center shadow-inner"
            onMouseDown={handleMouseDown}
          >
            VietViVu Assistant 🧭
            <button onClick={() => setIsOpen(false)} className="text-gray-500 hover:text-red-500 transition-colors">
              <X size={18} />
            </button>
          </div>

          {/* Nội dung tin nhắn */}
          <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-gray-50">
            {messages.map((msg, idx) => (
              <div key={idx} className="flex flex-col">
                <div
                  className={`p-3 rounded-2xl max-w-[80%] break-words shadow-sm ${
                    msg.sender === "user"
                      ? "ml-auto bg-blue-600 text-white animate-slide-in-right"
                      : "mr-auto bg-gray-200 text-gray-800 animate-slide-in-left"
                  }`}
                >
                  {msg.sender === "bot" ? (
                    <div className="space-y-2">
                      <p className="whitespace-pre-line">{msg.text}</p>
                      {msg.tours?.length && (
                        <div className="mt-3 space-y-2">
                          {msg.tours.map((tour, i) => (
                            <TourCard key={i} title={tour.title} description={tour.text} />
                          ))}
                        </div>
                      )}
                    </div>
                  ) : (
                    msg.text
                  )}
                </div>
              </div>
            ))}
            {loading && <p className="text-gray-400 text-sm italic animate-pulse">AI đang trả lời...</p>}
            <div ref={messagesEndRef} />
          </div>

          {/* Ô nhập */}
          <div className="p-3 border-t flex items-center gap-2 bg-white">
            <input
              className="flex-1 border rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
              placeholder="Nhập yêu cầu..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
            />
            <button
              onClick={handleSend}
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-full transition-transform hover:scale-110"
            >
              <Send size={18} />
            </button>
          </div>
        </div>
      )}

      {/* ✨ Animation CSS */}
      <style>{`
        @keyframes slide-in-left {
          0% { transform: translateX(-30px); opacity: 0; }
          100% { transform: translateX(0); opacity: 1; }
        }
        @keyframes slide-in-right {
          0% { transform: translateX(30px); opacity: 0; }
          100% { transform: translateX(0); opacity: 1; }
        }
        .animate-slide-in-left { animation: slide-in-left 0.3s ease-out; }
        .animate-slide-in-right { animation: slide-in-right 0.3s ease-out; }
      `}</style>
    </>
  );
};

export default ChatBox;
