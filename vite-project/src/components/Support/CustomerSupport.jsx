import React, { useEffect, useState, useRef } from "react";
import { 
  MessageCircle, 
  Phone, 
  Video, 
  ImageIcon, 
  Send, 
  Paperclip,
  Mic,
  MicOff,
  VideoOff,
  PhoneOff,
  Minimize2,
  X,
  Bot,
  User
} from "lucide-react";

const CustomerSupport = () => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: "bot",
      text: "Welcome to our Madhumitra family! How can we help you today?",
      timestamp: new Date().toLocaleTimeString()
    }
  ]);
  const [file, setFile] = useState(null);
  const [isMinimized, setIsMinimized] = useState(false);
  const [isCallActive, setIsCallActive] = useState(false);
  const [callType, setCallType] = useState(null);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [isRecording, setIsRecording] = useState(false);

  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);
  const videoRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = () => {
    if (!message.trim() && !file) return;

    const newMessage = {
      id: messages.length + 1,
      type: "user",
      timestamp: new Date().toLocaleTimeString()
    };

    if (file) {
      const fileUrl = URL.createObjectURL(file);
      const fileType = file.type.startsWith("image") ? "image" : 
                     file.type.startsWith("video") ? "video" : 
                     file.type.startsWith("audio") ? "audio" : "file";
      
      setMessages(prev => [...prev, { ...newMessage, type: "user", mediaType: fileType, url: fileUrl, fileName: file.name }]);
      setFile(null);
      
      // Simulate bot response
      setTimeout(() => {
        setMessages(prev => [...prev, {
          id: prev.length + 1,
          type: "bot",
          text: "Thank you! I have received your file. I'm reviewing it now.",
          timestamp: new Date().toLocaleTimeString()
        }]);
      }, 1000);
    } else {
      setMessages(prev => [...prev, { ...newMessage, text: message }]);
      setMessage("");
      
      // Simulate bot response
      setTimeout(() => {
        setMessages(prev => [...prev, {
          id: prev.length + 1,
          type: "bot",
          text: "I understand your message. Please wait a moment, I'm here to help you.",
          timestamp: new Date().toLocaleTimeString()
        }]);
      }, 1000);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const handleFileSelect = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
  };

  const startCall = (type) => {
    setCallType(type);
    setIsCallActive(true);
  };

  const endCall = () => {
    setIsCallActive(false);
    setCallType(null);
    setIsMuted(false);
    setIsVideoOff(false);
    
    if (videoRef.current && videoRef.current.srcObject) {
      videoRef.current.srcObject.getTracks().forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
  };

  const toggleRecording = () => {
    setIsRecording(!isRecording);
    if (!isRecording) {
      // Start recording simulation
      setTimeout(() => {
        setIsRecording(false);
        const audioMessage = {
          id: messages.length + 1,
          type: "user",
          mediaType: "audio",
          duration: "0:15",
          timestamp: new Date().toLocaleTimeString()
        };
        setMessages(prev => [...prev, audioMessage]);
      }, 3000);
    }
  };

  if (isMinimized) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <button
          onClick={() => setIsMinimized(false)}
          className="bg-blue-600 hover:bg-blue-700 text-white rounded-full p-4 shadow-lg transition-all duration-300 hover:scale-105"
        >
          <MessageCircle size={24} />
          <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center">
            {messages.filter(m => m.type === 'bot').length}
          </div>
        </button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 w-80 md:w-[500px] h-[600px] bg-white rounded-2xl shadow-2xl border border-gray-200 flex flex-col overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white p-4 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="bg-white/20 p-2 rounded-full">
            <MessageCircle size={20} />
          </div>
          <div>
            <h3 className="font-semibold">Customer Support</h3>
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
              <span className="text-xs opacity-90">Online</span>
            </div>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => startCall("audio")}
            className="p-2 hover:bg-white/20 rounded-lg transition-colors"
            title="Audio Call"
          >
            <Phone size={18} />
          </button>
          <button
            onClick={() => setIsMinimized(true)}
            className="p-2 hover:bg-white/20 rounded-lg transition-colors"
          >
            <Minimize2 size={18} />
          </button>
        </div>
      </div>

      {/* Call Interface */}
      {isCallActive && (
        <div className="bg-gray-900 text-white p-4 flex flex-col items-center space-y-4">
          <div className="text-center">
            <p className="text-lg font-semibold">Audio Call Active</p>
            <p className="text-sm opacity-75">Connected with support agent</p>
          </div>
          
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setIsMuted(!isMuted)}
              className={`p-3 rounded-full ${isMuted ? 'bg-red-500' : 'bg-gray-600'} hover:bg-gray-500 transition-colors`}
            >
              {isMuted ? <MicOff size={20} /> : <Mic size={20} />}
            </button>
            
            <button
              onClick={endCall}
              className="p-3 bg-red-500 hover:bg-red-600 rounded-full transition-colors"
            >
              <PhoneOff size={20} />
            </button>
          </div>
        </div>
      )}

      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.type === "user" ? "justify-end" : "justify-start"}`}
          >
            <div className={`flex items-end space-x-2 max-w-[80%] ${msg.type === "user" ? "flex-row-reverse space-x-reverse" : ""}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${msg.type === "user" ? "bg-blue-500" : "bg-green-500"}`}>
                {msg.type === "user" ? <User size={16} className="text-white" /> : <Bot size={16} className="text-white" />}
              </div>
              
              <div className={`rounded-2xl px-4 py-2 ${msg.type === "user" ? "bg-blue-600 text-white" : "bg-white border shadow-sm"}`}>
                {msg.text && <p className="text-sm">{msg.text}</p>}
                
                {msg.mediaType === "image" && (
                  <img src={msg.url} alt="Shared image" className="max-w-full h-32 object-cover rounded-lg" />
                )}
                
                {msg.mediaType === "video" && (
                  <video controls className="max-w-full h-32 rounded-lg">
                    <source src={msg.url} type="video/mp4" />
                  </video>
                )}
                
                {msg.mediaType === "audio" && (
                  <div className="flex items-center space-x-2 py-2">
                    <div className="bg-blue-100 p-2 rounded-full">
                      <Mic size={16} className="text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <div className="bg-gray-200 h-1 rounded-full">
                        <div className="bg-blue-500 h-1 rounded-full w-1/3"></div>
                      </div>
                    </div>
                    <span className="text-xs opacity-75">{msg.duration}</span>
                  </div>
                )}
                
                {msg.fileName && (
                  <div className="flex items-center space-x-2 py-2">
                    <Paperclip size={16} />
                    <span className="text-xs">{msg.fileName}</span>
                  </div>
                )}
                
                <p className="text-xs opacity-60 mt-1">{msg.timestamp}</p>
              </div>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* File Preview */}
      {file && (
        <div className="p-3 bg-yellow-50 border-t flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Paperclip size={16} className="text-gray-500" />
            <span className="text-sm text-gray-700 truncate">{file.name}</span>
          </div>
          <button
            onClick={() => setFile(null)}
            className="text-red-500 hover:text-red-700"
          >
            <X size={16} />
          </button>
        </div>
      )}

      {/* Input Area */}
      <div className="p-4 bg-white border-t">
        <div className="flex items-end space-x-2">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileSelect}
            className="hidden"
            accept="image/*,video/*,audio/*,.pdf,.doc,.docx"
          />
          
          <button
            onClick={() => fileInputRef.current?.click()}
            className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            title="Attach file"
          >
            <Paperclip size={20} />
          </button>
          
          <button
            onClick={() => fileInputRef.current?.click()}
            className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            title="Send image"
          >
            <ImageIcon size={20} />
          </button>
          
          <button
            onClick={toggleRecording}
            className={`p-2 rounded-lg transition-colors ${isRecording ? 'bg-red-100 text-red-600' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'}`}
            title="Record voice message"
          >
            <Mic size={20} />
            {isRecording && <div className="absolute inset-0 bg-red-500 rounded-lg animate-pulse opacity-30"></div>}
          </button>
          
          <div className="flex-1">
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type your message here..."
              className="w-full resize-none border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows="1"
            />
          </div>
          
          <button
            onClick={sendMessage}
            disabled={!message.trim() && !file}
            className={`p-2 rounded-lg transition-all duration-200 ${
              (message.trim() || file)
                ? 'bg-blue-600 text-white hover:bg-blue-700 hover:scale-105'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
          >
            <Send size={20} />
          </button>
        </div>
        
        {isRecording && (
          <div className="mt-2 text-center">
            <span className="text-red-600 text-sm animate-pulse">● Recording...</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default CustomerSupport;

