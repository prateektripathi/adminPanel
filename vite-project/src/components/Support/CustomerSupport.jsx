import React, { useState, useEffect, useRef } from 'react';
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
  User,
  Bell,
  Clock,
  CheckCircle,
  AlertCircle,
  Search,
  Filter,
  Eye,
  Archive,
  Camera,
  Play,
  Pause,
  Square,
  Download
} from "lucide-react";

const CustomerSupportSystem = () => {
  // Sample support queries data
  const [supportQueries, setSupportQueries] = useState([
    {
      id: 1,
      userName: "Rahul Sharma",
      userEmail: "rahul@email.com",
      subject: "Payment Issue",
      message: "My payment failed but amount was deducted",
      priority: "high",
      status: "pending",
      timestamp: "2025-01-23T10:30:00",
      unreadCount: 3,
      lastMessage: "Please help me with refund process"
    },
    {
      id: 2,
      userName: "Priya Singh",
      userEmail: "priya@email.com",
      subject: "Product Delivery",
      message: "Order not delivered yet, tracking shows delivered",
      priority: "medium",
      status: "in-progress",
      timestamp: "2025-01-23T09:15:00",
      unreadCount: 1,
      lastMessage: "I need to track my order #12345"
    },
    {
      id: 3,
      userName: "Amit Kumar",
      userEmail: "amit@email.com",
      subject: "Account Access",
      message: "Cannot login to my account",
      priority: "low",
      status: "resolved",
      timestamp: "2025-01-23T08:45:00",
      unreadCount: 0,
      lastMessage: "Thank you for helping me reset password"
    },
    {
      id: 4,
      userName: "Neha Gupta",
      userEmail: "neha@email.com",
      subject: "Service Inquiry",
      message: "Want to know about premium services",
      priority: "low",
      status: "pending",
      timestamp: "2025-01-23T11:20:00",
      unreadCount: 2,
      lastMessage: "Can you explain the pricing plans?"
    }
  ]);

  const [selectedQuery, setSelectedQuery] = useState(null);
  const [showSupportChat, setShowSupportChat] = useState(false);
  const [chatMessages, setChatMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterPriority, setFilterPriority] = useState("all");
  const [isMinimized, setIsMinimized] = useState(false);
  const [file, setFile] = useState(null);
  
  // Voice and Camera states
  const [isRecording, setIsRecording] = useState(false);
  const [isCameraOn, setIsCameraOn] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [recordedChunks, setRecordedChunks] = useState([]);
  const [recordingType, setRecordingType] = useState(null); // 'audio' or 'video'
  const [stream, setStream] = useState(null);
  const [recordingTime, setRecordingTime] = useState(0);
  const [recordingTimer, setRecordingTimer] = useState(null);

  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  // Calculate total unread messages
  const totalUnreadMessages = supportQueries.reduce((total, query) => total + query.unreadCount, 0);

  // Filter queries based on search and filters
  const filteredQueries = supportQueries.filter(query => {
    const matchesSearch = query.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         query.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         query.message.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = filterStatus === "all" || query.status === filterStatus;
    const matchesPriority = filterPriority === "all" || query.priority === filterPriority;
    
    return matchesSearch && matchesStatus && matchesPriority;
  });

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatMessages]);

  // Cleanup media stream on unmount
  useEffect(() => {
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [stream]);

  const getPriorityColor = (priority) => {
    switch(priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'pending': return 'bg-orange-100 text-orange-800';
      case 'in-progress': return 'bg-blue-100 text-blue-800';
      case 'resolved': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Camera Functions
  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { width: 640, height: 480 },
        audio: false
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
      
      setStream(mediaStream);
      setIsCameraOn(true);
    } catch (error) {
      console.error('Error accessing camera:', error);
      alert('Camera access denied or not available');
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    setIsCameraOn(false);
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  };

  const capturePhoto = () => {
    if (!videoRef.current || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const video = videoRef.current;
    const context = canvas.getContext('2d');

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    context.drawImage(video, 0, 0);

    canvas.toBlob((blob) => {
      const file = new File([blob], `photo_${Date.now()}.jpg`, { type: 'image/jpeg' });
      setFile(file);
    }, 'image/jpeg', 0.9);
  };

  // Voice Recording Functions
  const startVoiceRecording = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: false
      });

      const recorder = new MediaRecorder(mediaStream);
      const chunks = [];

      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunks.push(event.data);
        }
      };

      recorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'audio/wav' });
        const file = new File([blob], `voice_${Date.now()}.wav`, { type: 'audio/wav' });
        setFile(file);
        mediaStream.getTracks().forEach(track => track.stop());
      };

      recorder.start();
      setMediaRecorder(recorder);
      setRecordedChunks(chunks);
      setIsRecording(true);
      setRecordingType('audio');
      setRecordingTime(0);

      // Start timer
      const timer = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
      setRecordingTimer(timer);

    } catch (error) {
      console.error('Error accessing microphone:', error);
      alert('Microphone access denied or not available');
    }
  };

  const startVideoRecording = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { width: 640, height: 480 },
        audio: true
      });

      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }

      const recorder = new MediaRecorder(mediaStream);
      const chunks = [];

      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunks.push(event.data);
        }
      };

      recorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'video/webm' });
        const file = new File([blob], `video_${Date.now()}.webm`, { type: 'video/webm' });
        setFile(file);
        mediaStream.getTracks().forEach(track => track.stop());
        if (videoRef.current) {
          videoRef.current.srcObject = null;
        }
      };

      recorder.start();
      setMediaRecorder(recorder);
      setRecordedChunks(chunks);
      setIsRecording(true);
      setRecordingType('video');
      setIsCameraOn(true);
      setStream(mediaStream);
      setRecordingTime(0);

      // Start timer
      const timer = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
      setRecordingTimer(timer);

    } catch (error) {
      console.error('Error accessing camera/microphone:', error);
      alert('Camera/microphone access denied or not available');
    }
  };

  const stopRecording = () => {
    if (mediaRecorder && mediaRecorder.state !== 'inactive') {
      mediaRecorder.stop();
    }
    
    if (recordingTimer) {
      clearInterval(recordingTimer);
      setRecordingTimer(null);
    }

    setIsRecording(false);
    setRecordingType(null);
    setRecordingTime(0);
    
    if (recordingType === 'video') {
      setIsCameraOn(false);
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
        setStream(null);
      }
    }
  };

  const handleQueryClick = (query) => {
    setSelectedQuery(query);
    
    // Initialize chat with user's initial message
    const initialMessages = [
      {
        id: 1,
        type: "user",
        text: query.message,
        timestamp: new Date(query.timestamp).toLocaleTimeString(),
        userName: query.userName
      },
      {
        id: 2,
        type: "admin",
        text: "Hi " + query.userName + ", I've received your query about " + query.subject + ". How can I help you today?",
        timestamp: new Date().toLocaleTimeString()
      }
    ];
    
    setChatMessages(initialMessages);
    setShowSupportChat(true);
    
    // Mark as read
    setSupportQueries(prev => prev.map(q => 
      q.id === query.id ? { ...q, unreadCount: 0 } : q
    ));
  };

  const sendMessage = () => {
    if (!newMessage.trim() && !file) return;

    const messageObj = {
      id: chatMessages.length + 1,
      type: "admin",
      timestamp: new Date().toLocaleTimeString()
    };

    if (file) {
      const fileUrl = URL.createObjectURL(file);
      const fileType = file.type.startsWith("image") ? "image" : 
                     file.type.startsWith("video") ? "video" : 
                     file.type.startsWith("audio") ? "audio" : "file";
      
      setChatMessages(prev => [...prev, { ...messageObj, mediaType: fileType, url: fileUrl, fileName: file.name }]);
      setFile(null);
    } else {
      setChatMessages(prev => [...prev, { ...messageObj, text: newMessage }]);
      setNewMessage("");
    }

    // Simulate user response
    setTimeout(() => {
      setChatMessages(prev => [...prev, {
        id: prev.length + 1,
        type: "user",
        text: "Thank you for your response! This is helpful.",
        timestamp: new Date().toLocaleTimeString(),
        userName: selectedQuery?.userName
      }]);
    }, 2000);
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

  const updateQueryStatus = (queryId, newStatus) => {
    setSupportQueries(prev => prev.map(q => 
      q.id === queryId ? { ...q, status: newStatus } : q
    ));
  };

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = (now - date) / (1000 * 60 * 60);
    
    if (diffInHours < 1) {
      return "Just now";
    } else if (diffInHours < 24) {
      return `${Math.floor(diffInHours)} hours ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  // Support Chat Component
  const SupportChatModal = () => {
    if (!showSupportChat || !selectedQuery) return null;

    if (isMinimized) {
      return (
        <div className="fixed bottom-4 right-4 z-50">
          <button
            onClick={() => setIsMinimized(false)}
            className="bg-blue-600 hover:bg-blue-700 text-white rounded-full p-4 shadow-lg transition-all duration-300 hover:scale-105"
          >
            <MessageCircle size={24} />
            <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center">
              {chatMessages.filter(m => m.type === 'user').length}
            </div>
          </button>
        </div>
      );
    }

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl h-[80vh] flex flex-col overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white p-4 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-white/20 p-2 rounded-full">
                <User size={20} />
              </div>
              <div>
                <h3 className="font-semibold">{selectedQuery.userName}</h3>
                <p className="text-sm opacity-90">{selectedQuery.subject}</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <select 
                value={selectedQuery.status}
                onChange={(e) => updateQueryStatus(selectedQuery.id, e.target.value)}
                className="bg-white/20 text-white border-0 rounded px-2 py-1 text-sm"
              >
                <option value="pending">Pending</option>
                <option value="in-progress">In Progress</option>
                <option value="resolved">Resolved</option>
              </select>
              <button
                onClick={() => setIsMinimized(true)}
                className="p-2 hover:bg-white/20 rounded-lg transition-colors"
              >
                <Minimize2 size={18} />
              </button>
              <button
                onClick={() => setShowSupportChat(false)}
                className="p-2 hover:bg-white/20 rounded-lg transition-colors"
              >
                <X size={18} />
              </button>
            </div>
          </div>

          {/* User Info Bar */}
          <div className="bg-gray-50 px-4 py-2 border-b">
            <div className="flex items-center justify-between text-sm text-gray-600">
              <div className="flex items-center space-x-4">
                <span>Email: {selectedQuery.userEmail}</span>
                <span>Priority: <span className={`px-2 py-1 rounded-full text-xs ${getPriorityColor(selectedQuery.priority)}`}>{selectedQuery.priority}</span></span>
              </div>
              <div className="flex items-center space-x-2">
                <Clock size={14} />
                <span>{formatTimestamp(selectedQuery.timestamp)}</span>
              </div>
            </div>
          </div>

          {/* Camera/Video Preview */}
          {(isCameraOn || isRecording) && (
            <div className="bg-black p-4">
              <div className="relative max-w-md mx-auto">
                <video
                  ref={videoRef}
                  autoPlay
                  muted
                  className="w-full h-48 object-cover rounded-lg"
                />
                {isRecording && recordingType === 'video' && (
                  <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded text-sm flex items-center space-x-1">
                    <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                    <span>REC {formatTime(recordingTime)}</span>
                  </div>
                )}
                {isCameraOn && !isRecording && (
                  <button
                    onClick={capturePhoto}
                    className="absolute bottom-2 right-2 bg-white text-gray-800 p-2 rounded-full hover:bg-gray-100 transition-colors"
                    title="Capture Photo"
                  >
                    <Camera size={20} />
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Recording Status for Audio */}
          {isRecording && recordingType === 'audio' && (
            <div className="bg-red-50 border-b px-4 py-3">
              <div className="flex items-center justify-center space-x-2 text-red-600">
                <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                <span className="font-medium">Recording Audio: {formatTime(recordingTime)}</span>
              </div>
            </div>
          )}

          {/* Messages Container */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
            {chatMessages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.type === "admin" ? "justify-end" : "justify-start"}`}
              >
                <div className={`flex items-end space-x-2 max-w-[80%] ${msg.type === "admin" ? "flex-row-reverse space-x-reverse" : ""}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${msg.type === "admin" ? "bg-blue-500" : "bg-green-500"}`}>
                    {msg.type === "admin" ? <Bot size={16} className="text-white" /> : <User size={16} className="text-white" />}
                  </div>
                  
                  <div className={`rounded-2xl px-4 py-2 ${msg.type === "admin" ? "bg-blue-600 text-white" : "bg-white border shadow-sm"}`}>
                    {msg.text && <p className="text-sm">{msg.text}</p>}
                    
                    {msg.mediaType === "image" && (
                      <img src={msg.url} alt="Shared image" className="max-w-full h-32 object-cover rounded-lg" />
                    )}
                    
                    {msg.mediaType === "video" && (
                      <video src={msg.url} controls className="max-w-full h-32 rounded-lg" />
                    )}
                    
                    {msg.mediaType === "audio" && (
                      <audio src={msg.url} controls className="max-w-full" />
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
                {file.type.startsWith('image/') && (
                  <img 
                    src={URL.createObjectURL(file)} 
                    alt="Preview" 
                    className="w-8 h-8 object-cover rounded"
                  />
                )}
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
              
              {/* Media Controls */}
              <div className="flex items-center space-x-1">
                {/* File Attachment */}
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                  title="Attach file"
                >
                  <Paperclip size={20} />
                </button>
                
                {/* Camera Controls */}
                {!isCameraOn ? (
                  <button
                    onClick={startCamera}
                    className="p-2 text-blue-500 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors"
                    title="Start Camera"
                    disabled={isRecording}
                  >
                    <Camera size={20} />
                  </button>
                ) : (
                  <button
                    onClick={stopCamera}
                    className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                    title="Stop Camera"
                  >
                    <VideoOff size={20} />
                  </button>
                )}
                
                {/* Voice Recording */}
                {!isRecording ? (
                  <button
                    onClick={startVoiceRecording}
                    className="p-2 text-green-500 hover:text-green-700 hover:bg-green-50 rounded-lg transition-colors"
                    title="Start Voice Recording"
                  >
                    <Mic size={20} />
                  </button>
                ) : recordingType === 'audio' ? (
                  <button
                    onClick={stopRecording}
                    className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors animate-pulse"
                    title="Stop Recording"
                  >
                    <Square size={20} />
                  </button>
                ) : null}
                
                {/* Video Recording */}
                {!isRecording ? (
                  <button
                    onClick={startVideoRecording}
                    className="p-2 text-purple-500 hover:text-purple-700 hover:bg-purple-50 rounded-lg transition-colors"
                    title="Start Video Recording"
                  >
                    <Video size={20} />
                  </button>
                ) : recordingType === 'video' ? (
                  <button
                    onClick={stopRecording}
                    className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors animate-pulse"
                    title="Stop Recording"
                  >
                    <Square size={20} />
                  </button>
                ) : null}
              </div>
              
              <div className="flex-1">
                <textarea
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Type your response..."
                  className="w-full resize-none border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows="2"
                  disabled={isRecording}
                />
              </div>
              
              <button
                onClick={sendMessage}
                disabled={(!newMessage.trim() && !file) || isRecording}
                className={`p-2 rounded-lg transition-all duration-200 ${
                  (newMessage.trim() || file) && !isRecording
                    ? 'bg-blue-600 text-white hover:bg-blue-700 hover:scale-105'
                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                }`}
              >
                <Send size={20} />
              </button>
            </div>
          </div>
        </div>

        {/* Hidden canvas for photo capture */}
        <canvas ref={canvasRef} style={{ display: 'none' }} />
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center space-x-3">
            <span>Customer Support</span>
            {totalUnreadMessages > 0 && (
              <div className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-medium flex items-center space-x-1">
                <Bell size={16} />
                <span>{totalUnreadMessages} New</span>
              </div>
            )}
          </h1>
          <p className="text-gray-600 mt-2">Manage customer queries and provide support with multimedia</p>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
              <input
                type="text"
                placeholder="Search queries..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="in-progress">In Progress</option>
              <option value="resolved">Resolved</option>
            </select>
            
            <select
              value={filterPriority}
              onChange={(e) => setFilterPriority(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All Priority</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>
        </div>
      </div>

      {/* Support Queries List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Support Queries ({filteredQueries.length})</h3>
        </div>
        
        <div className="divide-y divide-gray-200">
          {filteredQueries.map((query) => (
            <div
              key={query.id}
              className="p-6 hover:bg-gray-50 cursor-pointer transition-colors"
              onClick={() => handleQueryClick(query)}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-sm font-medium text-blue-600">
                        {query.userName.split(' ').map(n => n[0]).join('')}
                      </span>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">{query.userName}</h4>
                      <p className="text-sm text-gray-500">{query.userEmail}</p>
                    </div>
                    {query.unreadCount > 0 && (
                      <div className="bg-red-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                        {query.unreadCount} new
                      </div>
                    )}
                  </div>
                  
                  <div className="mb-2">
                    <h5 className="font-medium text-gray-800 mb-1">{query.subject}</h5>
                    <p className="text-gray-600 text-sm line-clamp-2">{query.message}</p>
                    {query.lastMessage && (
                      <p className="text-gray-500 text-xs mt-1 italic">Last: {query.lastMessage}</p>
                    )}
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(query.priority)}`}>
                      {query.priority} priority
                    </span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(query.status)}`}>
                      {query.status}
                    </span>
                    <div className="flex items-center text-gray-500 text-xs">
                      <Clock size={12} className="mr-1" />
                      {formatTimestamp(query.timestamp)}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleQueryClick(query);
                    }}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    title="Open Chat"
                  >
                    <MessageCircle size={16} />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      updateQueryStatus(query.id, 'resolved');
                    }}
                    className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                    title="Mark Resolved"
                  >
                    <CheckCircle size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
          
          {filteredQueries.length === 0 && (
            <div className="p-12 text-center">
              <MessageCircle size={48} className="mx-auto text-gray-300 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No queries found</h3>
              <p className="text-gray-500">No support queries match your current filters.</p>
            </div>
          )}
        </div>
      </div>

      {/* Support Chat Modal */}
      <SupportChatModal />
    </div>
  );
};

export default CustomerSupportSystem;