import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import './Auth.css';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        // Mock validation
        if (!username || !password) {
            setError('Please fill in all fields');
            return;
        }

        console.log('Login attempt:', { username, password });
        try {
            const response = await api.login(username, password);
            if (response.success) {
                console.log(response.message);
                // In a real app, store token: localStorage.setItem('token', response.data.token);
                navigate('/dashboard');
            } else {
                setError(response.message || 'Login failed');
            }
        } catch (err) {
            setError(err.message || 'An error occurred');
        }
    };

    return (
        <div className="auth-container">
            <form className="auth-form" onSubmit={handleSubmit}>
                <h2 className="auth-title">Sign In</h2>

                {error && <div className="error-message">{error}</div>}

                <div className="form-group">
                    <label htmlFor="username">Username</label>
                    <input
                        type="text"
                        id="username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="Enter your username"
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="password">Password</label>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter your password"
                    />
                </div>

                <button type="submit" className="auth-button">Sign In</button>

                <div className="auth-links">
                    <Link to="/forgot-password" class="auth-link">Forgot Password?</Link>
                    <Link to="/register" class="auth-link">Don't have an account? Sign Up</Link>
                </div>
            </form>
        </div>
    );
};

export default Login;
