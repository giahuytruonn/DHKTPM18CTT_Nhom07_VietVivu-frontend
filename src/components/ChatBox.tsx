import React, { useState, useEffect, useRef } from "react";
import { MessageCircle, Send, X } from "lucide-react";
import { useLocation } from "react-router-dom";
import TourCard from "./ui/TourCard"; // ✅ import component TourCard nếu có

interface ChatMessage {
  sender: "user" | "bot";
  text: string;
  tours?: { title: string; text: string }[];
}

const ChatBox: React.FC = () => {
  const location = useLocation();
  if (location.pathname === "/login") return null; // ❌ Không hiển thị ở trang Login

  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // ✅ Scroll xuống cuối khi có tin mới
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: ChatMessage = { sender: "user", text: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("http://localhost:8080/vietvivu/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: input }),
      });

      const data = await res.json();
      const botReply = data.result?.reply || data.result || "Xin lỗi, tôi chưa hiểu yêu cầu của bạn 😅";
      const suggestedTours = data.result?.tours || [];

      const botMessage: ChatMessage = {
        sender: "bot",
        text: botReply,
        tours: suggestedTours,
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (err) {
      console.error(err);
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: "Lỗi khi kết nối với AI Server 😢" },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* 🔘 Floating Chat Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-5 right-5 bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-full shadow-lg z-50 transition-transform hover:scale-110"
      >
        {isOpen ? <X size={22} /> : <MessageCircle size={22} />}
      </button>

      {/* 💬 Chat Window */}
      {isOpen && (
        <div className="fixed bottom-20 right-5 w-96 bg-white shadow-2xl rounded-2xl border border-gray-200 flex flex-col z-50">
          <div className="p-3 border-b font-semibold text-blue-600 bg-gray-50 rounded-t-2xl">
            VietViVu Assistant 🧭
          </div>

          {/* 🧾 Messages */}
          <div className="flex-1 p-3 overflow-y-auto h-96 space-y-3">
            {messages.map((msg, idx) => (
              <div key={idx}>
                <div
                  className={`p-2 rounded-xl max-w-[80%] ${
                    msg.sender === "user"
                      ? "ml-auto bg-blue-600 text-white"
                      : "mr-auto bg-gray-200 text-gray-800"
                  }`}
                >
                  {msg.sender === "bot" ? (
                    <div className="ai-reply">
                      <p className="whitespace-pre-line">{msg.text}</p>

                      {/* ✅ Nếu có tour gợi ý */}
                      {msg.tours && msg.tours.length > 0 && (
                        <div className="suggested-tours mt-3 space-y-2">
                          <p className="font-semibold text-blue-600 text-sm">
                            Gợi ý các tour phù hợp:
                          </p>
                          {msg.tours.map((tour, i) => (
                            <TourCard
                              key={i}
                              title={tour.title}
                              description={tour.text}
                            />
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

            {loading && (
              <div className="text-gray-400 text-sm italic">AI đang trả lời...</div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* ✍️ Input */}
          <div className="p-2 border-t flex items-center gap-2">
            <input
              className="flex-1 border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Nhập yêu cầu..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
            />
            <button
              onClick={handleSend}
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg"
            >
              <Send size={16} />
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default ChatBox;
