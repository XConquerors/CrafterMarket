import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import '../css/Chatbot.css';

const socket = io('http://localhost:3001'); // Your server URL

function RealTimeChat() {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');

  useEffect(() => {
    // Listening for incoming messages
    socket.on('receiveMessage', (message) => {
      setMessages((prevMessages) => [...prevMessages, { text: message, sender: 'other' }]);
    });

    socket.on('botMessage', (botMessage) => {
        setMessages((prevMessages) => [...prevMessages, { text: botMessage, sender: 'bot' }]);
      });

    return () => {
      socket.off('receiveMessage');
      socket.off('botMessage');
    };
  }, []);

  const sendMessage = () => {
    if (newMessage.trim()) {
      socket.emit('sendMessage', newMessage);
      // Add the message to the local state to display it in the UI
      setMessages((prevMessages) => [...prevMessages, { text: newMessage, sender: 'user' }]);

      // Clear the input after sending the message
      setNewMessage('');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      sendMessage();
    }
  };

  return (
    <div className="chat-container">
      <div className="chat-header">Chatbot</div>
      <div className="message-area">
        {messages.map((message, index) => (
          <div key={index} className={`message ${message.sender}-message`}>
            {message.text}
          </div>
        ))}
      </div>
      <div className="input-area">
        <input
          type="text"
          className="message-input"
          placeholder="Type a message..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyPress={handleKeyPress}
        />
        <button className="send-button" onClick={sendMessage}>
          Send
        </button>
      </div>
    </div>
  );
}

export default RealTimeChat;
