import { useState, useEffect, useRef } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import './Chat.css';

const ChatRoom = () => {
    const { roomId } = useParams();
    const { state } = useLocation();
    const navigate = useNavigate();
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [isVideoActive, setIsVideoActive] = useState(false);
    const messagesEndRef = useRef(null);

    const roomName = state?.room?.name || `Room ${roomId}`;

    useEffect(() => {
        loadMessages();
        // Poll for messages every 5 seconds (mock real-time)
        const interval = setInterval(loadMessages, 5000);
        return () => clearInterval(interval);
    }, [roomId]);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const loadMessages = async () => {
        try {
            const data = await api.getMessages(roomId);
            setMessages(data);
        } catch (error) {
            console.error('Failed to load messages:', error);
        }
    };

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    const handleSend = async (e) => {
        e.preventDefault();
        if (!newMessage.trim()) return;

        try {
            await api.sendMessage(roomId, newMessage);
            setNewMessage('');
            loadMessages();
        } catch (error) {
            console.error('Failed to send message:', error);
        }
    };

    return (
        <div className="chat-layout">
            {/* Sidebar (Room Info) */}
            <div className="chat-sidebar">
                <div style={{ marginBottom: '2rem' }}>
                    <button
                        onClick={() => navigate('/dashboard')}
                        style={{
                            background: 'transparent',
                            border: 'none',
                            color: 'var(--text-secondary)',
                            cursor: 'pointer',
                            padding: 0,
                            fontSize: '0.9rem',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem'
                        }}
                    >
                        &larr; Back to Dashboard
                    </button>
                </div>

                <h2 style={{ color: 'var(--text-primary)', margin: '0 0 1rem 0' }}>{roomName}</h2>
                <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                    <p>Online: 12 members</p>
                </div>

                <button
                    className="auth-button"
                    onClick={() => setIsVideoActive(!isVideoActive)}
                    style={{
                        marginTop: 'auto',
                        background: isVideoActive ? '#dc2626' : 'var(--primary-color)'
                    }}
                >
                    {isVideoActive ? 'Leave Video Call' : 'Join Video Call'}
                </button>
            </div>

            {/* Main Chat Area */}
            <div className="chat-main">
                {/* Video Grid */}
                <div className={`video-grid ${isVideoActive ? 'active' : ''}`}>
                    <div className="video-placeholder">
                        <span style={{ fontSize: '2rem', marginBottom: '1rem' }}>📹</span>
                        <p>Video Stream Placeholder</p>
                        <small>WebRTC integration required</small>
                    </div>
                </div>

                {/* Messages */}
                <div className="messages-container">
                    {messages.map((msg, index) => (
                        <div
                            key={msg.id || index}
                            className={`message-bubble ${msg.sender === 'Me' ? 'mine' : 'theirs'}`}
                        >
                            <div className="message-sender">{msg.sender}</div>
                            {msg.content}
                            <div className="message-time">
                                {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </div>
                        </div>
                    ))}
                    <div ref={messagesEndRef} />
                </div>

                {/* Input */}
                <form className="chat-input-area" onSubmit={handleSend}>
                    <input
                        type="text"
                        className="chat-input"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder={`Message #${roomName}...`}
                    />
                    <button type="submit" className="send-button">
                        ➤
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ChatRoom;
