import { useState } from 'react';
import { Link } from 'react-router-dom';
import './Auth.css';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        setError('');
        setMessage('');

        if (!email) {
            setError('Please enter your email address');
            return;
        }

        console.log('Password reset request for:', email);
        // Simulate password reset email sent
        setMessage('If an account exists with this email, you will receive a password reset link.');
    };

    return (
        <div className="auth-container">
            <form className="auth-form" onSubmit={handleSubmit}>
                <h2 className="auth-title">Reset Password</h2>

                {error && <div className="error-message">{error}</div>}
                {message && <div className="success-message" style={{ color: '#4caf50', backgroundColor: 'rgba(76, 175, 80, 0.1)', padding: '0.5rem', borderRadius: '4px', textAlign: 'center' }}>{message}</div>}

                <div className="form-group">
                    <label htmlFor="email">Email</label>
                    <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter your email"
                    />
                </div>

                <button type="submit" className="auth-button">Send Reset Link</button>

                <div className="auth-links" style={{ justifyContent: 'center' }}>
                    <Link to="/login" class="auth-link">Back to Login</Link>
                </div>
            </form>
        </div>
    );
};

export default ForgotPassword;
