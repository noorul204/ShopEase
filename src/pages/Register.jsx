
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

function Register() {
    const navigate = useNavigate();

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleRegister = async (event) => {
        event.preventDefault();
        setError('');

        if (password !== confirmPassword) {
            setError('Passwords do not match!');
            return;
        }

        try {
            setLoading(true);

            const response = await fetch(
                'http://localhost:5000/api/auth/register',
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        name: name.trim(),
                        email: email.trim(),
                        password
                    })
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Registration failed.');
            }

            navigate('/login', {
                state: {
                    message: 'Account created successfully! Please log in.'
                }
            });

        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-page">
            <div className="auth-card">
                <Link to="/" className="auth-logo">
                    ShopEase<span>.</span>
                </Link>

                <h2>Create Account</h2>

                <p className="auth-subtitle">
                    Join ShopEase and start shopping!
                </p>

                <form onSubmit={handleRegister}>
                    <label>Full Name</label>
                    <input
                        type="text"
                        placeholder="Enter your full name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />

                    <label>Email Address</label>
                    <input
                        type="email"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />

                    <label>Password</label>
                    <input
                        type="password"
                        placeholder="Create a password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        minLength={6}
                        required
                    />

                    <label>Confirm Password</label>
                    <input
                        type="password"
                        placeholder="Confirm your password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        minLength={6}
                        required
                    />

                    {error && (
                        <p style={{ color: 'red', marginTop: '10px' }}>
                            {error}
                        </p>
                    )}

                    <button
                        type="submit"
                        className="auth-button"
                        disabled={loading}
                    >
                        {loading ? 'Creating Account...' : 'Create Account'}
                    </button>
                </form>

                <p className="auth-switch">
                    Already have an account?{' '}
                    <Link to="/login">Login</Link>
                </p>

                <Link to="/" className="back-home">
                    ← Back to Home
                </Link>
            </div>
        </div>
    );
}

export default Register;
