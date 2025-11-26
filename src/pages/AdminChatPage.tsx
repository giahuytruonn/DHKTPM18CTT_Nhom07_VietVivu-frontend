
import React, { useState, useEffect, useRef } from "react";
import {
  subscribeToChats,
  subscribeToMessages,
  sendMessage,
  markMessagesAsRead,
  type Chat,
  type Message,
} from "../services/chat.service";
import {
  MessageCircle,
  Send,
  User,
  Clock,
  CheckCheck,
  Search,
  Loader,
} from "lucide-react";

const AdminChatPage: React.FC = () => {
  const [chats, setChats] = useState<Chat[]>([]);
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [searchKeyword, setSearchKeyword] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const unsubscribeChatsRef = useRef<(() => void) | null>(null);
  const unsubscribeMessagesRef = useRef<(() => void) | null>(null);

  // Subscribe to all chats
  useEffect(() => {
    setIsLoading(true);

    // Timeout 5s để tránh loading mãi mãi
    const timeout = setTimeout(() => {
      console.warn("⚠️ Timeout: No data from Firebase after 5s");
      setIsLoading(false);
    }, 5000);

    const unsubscribe = subscribeToChats((newChats) => {
      console.log("📨 Admin received chats:", newChats.length);
      clearTimeout(timeout); // ✅ Hủy timeout khi nhận được data
      setChats(newChats);
      setIsLoading(false);
    });

    unsubscribeChatsRef.current = unsubscribe;

    return () => {
      clearTimeout(timeout);
      unsubscribe();
    };
  }, []);

  // Subscribe to messages of selected chat
  useEffect(() => {
    if (!selectedChat) return;

    const unsubscribe = subscribeToMessages(selectedChat.chatId, (newMessages) => {
      setMessages(newMessages);
      scrollToBottom();
    });

    unsubscribeMessagesRef.current = unsubscribe;

    // Mark as read
    markMessagesAsRead(selectedChat.chatId, "admin");

    return () => {
      unsubscribe();
    };
  }, [selectedChat]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || !selectedChat) return;

    try {
      await sendMessage(
        selectedChat.chatId,
        "admin",
        "Admin",
        inputMessage.trim()
      );
      setInputMessage("");
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const filteredChats = chats.filter(
    (chat) =>
      chat.participantName.toLowerCase().includes(searchKeyword.toLowerCase()) ||
      chat.participantEmail?.toLowerCase().includes(searchKeyword.toLowerCase())
  );

  const totalUnread = chats.reduce((sum, chat) => sum + chat.unreadCount, 0);

  return (
    <div className="h-[calc(100vh-120px)] flex gap-4">
      {/* Sidebar - Chat List */}
      <div className="w-80 bg-white rounded-2xl shadow-md flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900">Tin nhắn</h2>
            {totalUnread > 0 && (
              <span className="px-3 py-1 bg-red-500 text-white text-xs font-bold rounded-full">
                {totalUnread}
              </span>
            )}
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Tìm kiếm..."
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm"
            />
          </div>
        </div>

        {/* Chat List */}
        <div className="flex-1 overflow-y-auto">
          {isLoading ? (
            <div className="flex items-center justify-center h-full">
              <Loader className="animate-spin text-indigo-600" size={32} />
            </div>
          ) : filteredChats.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full p-6 text-center">
              <MessageCircle size={48} className="text-gray-300 mb-3" />
              <p className="text-gray-500 text-sm">
                {searchKeyword ? "Không tìm thấy cuộc trò chuyện" : "Chưa có tin nhắn nào"}
              </p>
            </div>
          ) : (
            filteredChats.map((chat) => (
              <button
                key={chat.chatId}
                onClick={() => setSelectedChat(chat)}
                className={`w-full p-4 border-b border-gray-100 hover:bg-gray-50 transition-colors text-left ${selectedChat?.chatId === chat.chatId ? "bg-indigo-50" : ""
                  }`}
              >
                <div className="flex items-start gap-3">
                  <div className="relative flex-shrink-0">
                    <div
                      className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-white ${chat.participantType === "guest"
                        ? "bg-gray-400"
                        : "bg-gradient-to-br from-indigo-500 to-blue-500"
                        }`}
                    >
                      {chat.participantName.charAt(0).toUpperCase()}
                    </div>
                    {chat.unreadCount > 0 && (
                      <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                        {chat.unreadCount}
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <p className="font-semibold text-gray-900 truncate">
                        {chat.participantName}
                      </p>
                      <span className="text-xs text-gray-500 flex-shrink-0">
                        {new Date(chat.lastMessageAt).toLocaleTimeString("vi-VN", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 truncate">{chat.lastMessage}</p>
                    {chat.participantType === "guest" && (
                      <span className="inline-block mt-1 px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded-full">
                        Khách
                      </span>
                    )}
                  </div>
                </div>
              </button>
            ))
          )}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 bg-white rounded-2xl shadow-md flex flex-col">
        {selectedChat ? (
          <>
            {/* Chat Header */}
            <div className="p-4 border-b border-gray-200 flex items-center gap-3">
              <div
                className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-white ${selectedChat.participantType === "guest"
                  ? "bg-gray-400"
                  : "bg-gradient-to-br from-indigo-500 to-blue-500"
                  }`}
              >
                {selectedChat.participantName.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900">
                  {selectedChat.participantName}
                </h3>
                <p className="text-sm text-gray-500">
                  {selectedChat.participantEmail || "Không có email"}
                </p>
              </div>
              {selectedChat.participantType === "guest" && (
                <span className="px-3 py-1 bg-gray-100 text-gray-600 text-sm rounded-full font-medium">
                  Khách
                </span>
              )}
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50">
              {messages.map((message) => (
                <div
                  key={message.messageId}
                  className={`flex ${message.senderId === "admin" ? "justify-end" : "justify-start"
                    }`}
                >
                  <div
                    className={`max-w-[70%] rounded-2xl px-4 py-3 ${message.type === "system"
                      ? "bg-yellow-50 text-yellow-800 text-xs italic text-center w-full"
                      : message.senderId === "admin"
                        ? "bg-indigo-600 text-white"
                        : "bg-white text-gray-900 shadow-sm"
                      }`}
                  >
                    {message.type !== "system" && message.senderId !== "admin" && (
                      <p className="text-xs text-gray-500 mb-1">
                        {message.senderName}
                      </p>
                    )}
                    <p className="text-sm whitespace-pre-wrap break-words">
                      {message.content}
                    </p>
                    <div className="flex items-center justify-end gap-2 mt-1">
                      <p
                        className={`text-xs ${message.senderId === "admin"
                          ? "text-indigo-200"
                          : "text-gray-400"
                          }`}
                      >
                        {new Date(message.timestamp).toLocaleTimeString("vi-VN", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                      {message.senderId === "admin" && message.read && (
                        <CheckCheck size={14} className="text-indigo-200" />
                      )}
                    </div>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-4 border-t border-gray-200">
              <div className="flex gap-3">
                <input
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Nhập tin nhắn..."
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-full focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                />
                <button
                  onClick={handleSendMessage}
                  disabled={!inputMessage.trim()}
                  className="w-12 h-12 bg-indigo-600 text-white rounded-full flex items-center justify-center hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send size={20} />
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center h-full">
            <MessageCircle size={64} className="text-gray-300 mb-4" />
            <p className="text-gray-500 text-lg">Chọn một cuộc trò chuyện để bắt đầu</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminChatPage;