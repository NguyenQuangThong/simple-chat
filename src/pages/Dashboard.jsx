import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import './Chat.css';

const CreateRoomModal = ({ onClose, onCreated }) => {
    const [name, setName] = useState('');
    const [password, setPassword] = useState('');
    const [isPrivate, setIsPrivate] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!name.trim()) return;

        try {
            await api.createRoom(name, isPrivate ? password : null);
            onCreated();
        } catch (error) {
            console.error('Failed to create room:', error);
        }
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content auth-form" onClick={e => e.stopPropagation()}>
                <h3 className="auth-title" style={{ fontSize: '1.5rem' }}>Create New Room</h3>
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div className="form-group">
                        <label>Room Name</label>
                        <input
                            type="text"
                            value={name}
                            onChange={e => setName(e.target.value)}
                            placeholder="e.g., General Chat"
                            autoFocus
                        />
                    </div>

                    <div className="form-group">
                        <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                            <input
                                type="checkbox"
                                checked={isPrivate}
                                onChange={e => setIsPrivate(e.target.checked)}
                                style={{ width: 'auto' }}
                            />
                            Private Room (Password Protected)
                        </label>
                    </div>

                    {isPrivate && (
                        <div className="form-group">
                            <label>Room Password</label>
                            <input
                                type="password"
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                                placeholder="Set a password"
                            />
                        </div>
                    )}

                    <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                        <button type="button" className="auth-button" style={{ background: '#333' }} onClick={onClose}>Cancel</button>
                        <button type="submit" className="auth-button">Create</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

const Dashboard = () => {
    const [rooms, setRooms] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        loadRooms();
    }, []);

    const loadRooms = async () => {
        try {
            const data = await api.getRooms();
            setRooms(data);
        } catch (error) {
            console.error('Failed to load rooms:', error);
        }
    };

    const handleCreateRoom = () => {
        setShowModal(false);
        loadRooms();
    };

    const handleJoinRoom = async (room) => {
        if (room.hasPassword) {
            const password = prompt(`Enter password for ${room.name}:`);
            if (password === null) return; // Cancelled

            try {
                await api.joinRoom(room.id, password);
                navigate(`/room/${room.id}`, { state: { room } });
            } catch (error) {
                alert(error.message);
            }
        } else {
            navigate(`/room/${room.id}`, { state: { room } });
        }
    };

    return (
        <div className="dashboard-container">
            <div className="dashboard-header">
                <h1 className="dashboard-title">Chat Rooms</h1>
                <button className="auth-button" style={{ width: 'auto', margin: 0 }} onClick={() => setShowModal(true)}>
                    + Create Room
                </button>
            </div>

            <div className="room-grid">
                {rooms.map(room => (
                    <div key={room.id} className="room-card" onClick={() => handleJoinRoom(room)}>
                        <div>
                            <h3 className="room-name">{room.name}</h3>
                            <div className="room-info">
                                <span className={`status-badge ${room.hasPassword ? 'private' : 'public'}`}>
                                    {room.hasPassword ? 'Private' : 'Public'}
                                </span>
                                <span>•</span>
                                <span>{room.online} online</span>
                            </div>
                        </div>

                        <div className="room-status">
                            <span style={{ color: 'var(--primary-color)', fontSize: '0.9rem' }}>
                                Join Room &rarr;
                            </span>
                        </div>
                    </div>
                ))}
            </div>

            {showModal && (
                <CreateRoomModal
                    onClose={() => setShowModal(false)}
                    onCreated={handleCreateRoom}
                />
            )}
        </div>
    );
};

export default Dashboard;
