// src/components/Support/CustomerSupport.jsx
import React, { useEffect, useState, useRef } from "react";
import { io } from "socket.io-client";
import Peer from "simple-peer";
import { Phone, Video, Image as ImageIcon, Send } from "lucide-react";

const socket = io("http://localhost:5000"); // ✅ backend server URL

const CustomerSupport = () => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [file, setFile] = useState(null);
  const [stream, setStream] = useState(null);
  const [callAccepted, setCallAccepted] = useState(false);
  const [callType, setCallType] = useState(null); // "audio" | "video"

  const myVideo = useRef();
  const userVideo = useRef();
  const peerRef = useRef();

  useEffect(() => {
    socket.on("receiveMessage", (msg) => {
      setMessages((prev) => [...prev, msg]);
    });

    socket.on("callUser", ({ signal, type }) => {
      setCallType(type);
      const peer = new Peer({ initiator: false, trickle: false, stream });
      peer.on("signal", (data) => {
        socket.emit("answerCall", { signal: data });
      });
      peer.on("stream", (currentStream) => {
        if (userVideo.current) userVideo.current.srcObject = currentStream;
      });
      peer.signal(signal);
      peerRef.current = peer;
      setCallAccepted(true);
    });

    socket.on("callAccepted", (signal) => {
      peerRef.current.signal(signal);
      setCallAccepted(true);
    });
  }, [stream]);

  const sendMessage = () => {
    if (!message && !file) return;

    if (file) {
      const fileUrl = URL.createObjectURL(file); // ✅ upload API integrate later
      socket.emit("sendMessage", { type: file.type.startsWith("video") ? "video" : "image", url: fileUrl });
      setMessages((prev) => [...prev, { type: file.type.startsWith("video") ? "video" : "image", url: fileUrl }]);
      setFile(null);
    } else {
      socket.emit("sendMessage", { type: "text", text: message });
      setMessages((prev) => [...prev, { type: "text", text: message }]);
      setMessage("");
    }
  };

  const startCall = async (type) => {
    try {
      const userStream = await navigator.mediaDevices.getUserMedia({
        video: type === "video",
        audio: true,
      });
      setStream(userStream);
      if (myVideo.current) myVideo.current.srcObject = userStream;

      const peer = new Peer({ initiator: true, trickle: false, stream: userStream });
      peer.on("signal", (data) => {
        socket.emit("callUser", { signal: data, type });
      });
      peer.on("stream", (currentStream) => {
        if (userVideo.current) userVideo.current.srcObject = currentStream;
      });
      peerRef.current = peer;
    } catch (err) {
      console.error("Media error:", err);
    }
  };

  return (
    <div className="p-6 bg-white rounded-xl shadow-lg h-[90vh] flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-gray-800">Customer Support</h2>
        <div className="flex space-x-3">
          <button onClick={() => startCall("audio")} className="p-2 bg-green-500 text-white rounded-lg">
            <Phone size={20} />
          </button>
          <button onClick={() => startCall("video")} className="p-2 bg-blue-500 text-white rounded-lg">
            <Video size={20} />
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto space-y-3 border p-3 rounded-lg">
        {messages.map((m, i) => (
          <div key={i} className="p-2 bg-gray-100 rounded-lg">
            {m.type === "text" && <p>{m.text}</p>}
            {m.type === "image" && <img src={m.url} alt="upload" className="w-40 rounded" />}
            {m.type === "video" && (
              <video controls className="w-60 rounded">
                <source src={m.url} type="video/mp4" />
              </video>
            )}
          </div>
        ))}
      </div>

      {/* Input */}
      <div className="mt-4 flex space-x-2">
        <input
          type="file"
          onChange={(e) => setFile(e.target.files[0])}
          className="hidden"
          id="file-upload"
        />
        <label htmlFor="file-upload" className="p-2 bg-gray-200 rounded-lg cursor-pointer">
          <ImageIcon size={20} />
        </label>
        <input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type a message..."
          className="flex-1 border rounded-lg px-3 py-2"
        />
        <button onClick={sendMessage} className="bg-blue-600 text-white px-4 py-2 rounded-lg">
          <Send size={20} />
        </button>
      </div>

      {/* Video/Audio Call Area */}
      {callAccepted && (
        <div className="mt-4 grid grid-cols-2 gap-3">
          <video ref={myVideo} autoPlay playsInline muted className="w-full rounded-lg border" />
          <video ref={userVideo} autoPlay playsInline className="w-full rounded-lg border" />
        </div>
      )}
    </div>
  );
};

export default CustomerSupport;
