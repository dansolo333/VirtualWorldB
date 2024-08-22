import React, { useState, useEffect, useRef } from "react";
import "./Chat.css";

function Chat({ username, recipient }) {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const ws = useRef(null);

  useEffect(() => {
    if (!username) {
      const enteredUsername = prompt("Enter your username: ");
      username = enteredUsername;
      localStorage.setItem("username", enteredUsername);
    }

    ws.current = new WebSocket("wss://virtualworldb.onrender.com/ws");

    ws.current.onmessage = (event) => {
      const message = JSON.parse(event.data);
      setMessages((prevMessages) => [...prevMessages, message]);
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
