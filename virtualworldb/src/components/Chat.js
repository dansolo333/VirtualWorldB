import React, { useState, useEffect, useRef } from "react";
import "./Chat.css";

function Chat({ username: propUsername, recipient }) {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const ws = useRef(null);

  // Retrieve username from localStorage if not passed as a prop
  const username = propUsername || localStorage.getItem('username');

  useEffect(() => {
    if (!username) {
      const enteredUsername = prompt("Enter your username: ");
      localStorage.setItem('username', enteredUsername);
    }

    ws.current = new WebSocket("wss://virtualworldb-server.onrender.com/ws");

    ws.current.onmessage = (event) => {
      const message = JSON.parse(event.data);
      setMessages((prevMessages) => [...prevMessages, message]);
    };

    ws.current.onopen = () => {
        console.log("WebSocket connection established");
    };
    
    ws.current.onclose = () => {
        console.log("WebSocket connection closed");
    };

    ws.current.onerror = (error) => {
        console.error("WebSocket error:", error);
    };

    return () => {
      if (ws.current) {
        ws.current.close();
      }
    };
  }, [username]);

  const sendMessage = () => {
    if (newMessage && ws.current.readyState === WebSocket.OPEN) {
      const messageData = { username, recipient, content: newMessage };
      console.log("Sending Data to Backend:", messageData);
      ws.current.send(JSON.stringify(messageData));
      setNewMessage("");
    } else {
      console.error("WebSocket is not open or no message to send.");
    }
  };

  return (
    <div className="chat-container">
      <div id="chat" className="chat-window">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`chat-message ${
              msg.user === username ? "chat-message-sender" : "chat-message-recipient"
            }`}
          >
            <strong>{msg.user === username ? `${msg.user} (You)` : msg.user}:</strong>
            <p>{msg.content}</p>
            <span className="timestamp">{new Date(msg.timestamp).toLocaleTimeString()}</span>
          </div>
        ))}
      </div>
      <div className="chat-input-container">
        <input
          type="text"
          id="messageInput"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && sendMessage()}
          placeholder="Type your message..."
        />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
}

export default Chat;
