import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import ForgotPassword from './pages/ForgotPassword';
import Dashboard from './pages/Dashboard';
import ChatRoom from './pages/ChatRoom';
import './App.css';

function Home() {
  return (
    <div className="auth-container">
      <div className="auth-form" style={{ textAlign: 'center', alignItems: 'center' }}>
        <h1 className="auth-title" style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>
          Welcome To Chat
        </h1>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>
          Experience the future of connection.
        </p>

        <div style={{ display: 'flex', gap: '1rem', width: '100%', flexDirection: 'column' }}>
          <Link to="/login" style={{ width: '100%' }}>
            <button className="auth-button" style={{ width: '100%', margin: 0 }}>
              Sign In
            </button>
          </Link>
          <Link to="/register" style={{ width: '100%' }}>
            <button className="auth-button" style={{
              width: '100%',
              margin: 0,
              background: 'transparent',
              border: '1px solid var(--glass-border)'
            }}>
              Create Account
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<SignUp />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/room/:roomId" element={<ChatRoom />} />
      </Routes>
    </Router>
  );
}

export default App;
