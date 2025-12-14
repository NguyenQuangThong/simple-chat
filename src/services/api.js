// Mock API service to mimic Spring Boot endpoints

// Simulating database
const STORAGE_KEY = 'chat_app_data';

const getStorage = () => {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : { rooms: [], messages: {}, users: [] };
};

const setStorage = (data) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
};

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const API_BASE_URL = 'http://localhost:8080/api/v1';

export const api = {
    // Auth
    login: async (username, password) => {
        const response = await fetch(`${API_BASE_URL}/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, password }),
        });
        return response.json();
    },

    register: async (userData) => {
        const response = await fetch(`${API_BASE_URL}/auth/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(userData),
        });
        return response.json();
    },

    // Rooms
    getRooms: async () => {
        await delay(300);
        const data = getStorage();
        // Initialize with default rooms if empty
        if (data.rooms.length === 0) {
            data.rooms = [
                { id: '1', name: 'General', hasPassword: false, online: 12 },
                { id: '2', name: 'Random', hasPassword: false, online: 5 },
                { id: '3', name: 'Private Room', hasPassword: true, online: 2 },
            ];
            setStorage(data);
        }
        return data.rooms;
    },

    createRoom: async (name, password = null) => {
        await delay(500);
        const data = getStorage();
        const newRoom = {
            id: Date.now().toString(),
            name,
            hasPassword: !!password,
            password, // In real app, never store plain text
            online: 1
        };
        data.rooms.push(newRoom);
        setStorage(data);
        return newRoom;
    },

    joinRoom: async (roomId, password = null) => {
        await delay(300);
        const data = getStorage();
        const room = data.rooms.find(r => r.id === roomId);

        if (!room) throw new Error('Room not found');

        if (room.hasPassword && room.password !== password) {
            throw new Error('Invalid password');
        }

        return { success: true, room };
    },

    // Messages
    getMessages: async (roomId) => {
        await delay(300);
        const data = getStorage();
        if (!data.messages[roomId]) {
            // Default welcome message
            data.messages[roomId] = [
                { id: 'init', sender: 'System', content: `Welcome to the ${roomId} room!`, timestamp: new Date().toISOString() }
            ];
            setStorage(data);
        }
        return data.messages[roomId];
    },

    sendMessage: async (roomId, content, senderName) => {
        await delay(100);
        const data = getStorage();
        if (!data.messages[roomId]) data.messages[roomId] = [];

        const newMessage = {
            id: Date.now().toString(),
            sender: senderName || 'Me',
            content,
            timestamp: new Date().toISOString()
        };

        data.messages[roomId].push(newMessage);
        setStorage(data);
        return newMessage;
    }
};
