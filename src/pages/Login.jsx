
import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';

function Login() {
    const navigate = useNavigate();
    const location = useLocation();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const successMessage = location.state?.message;

    const handleLogin = async (event) => {
        event.preventDefault();
        setError('');

        try {
            setLoading(true);

            const response = await fetch(
                'http://localhost:5000/api/auth/login',
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        email: email.trim(),
                        password
                    })
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Login failed.');
            }

            // Save authentication details
            localStorage.setItem('shopEaseToken', data.token);

            localStorage.setItem(
                'shopEaseUser',
                JSON.stringify(data.user)
            );

            // Preserve existing customer profile information
            let existingCustomer = {};

            try {
                existingCustomer = JSON.parse(
                    localStorage.getItem('shopEaseCustomer') || '{}'
                );
            } catch {
                existingCustomer = {};
            }

            localStorage.setItem(
                'shopEaseCustomer',
                JSON.stringify({
                    ...existingCustomer,
                    fullName: data.user.name,
                    email: data.user.email
                })
            );

            navigate('/');

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

                <h2>Welcome Back!</h2>

                <p className="auth-subtitle">
                    Login to continue shopping with us.
                </p>

                {successMessage && (
                    <p style={{ color: 'green', marginBottom: '12px' }}>
                        {successMessage}
                    </p>
                )}

                <form onSubmit={handleLogin}>

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
                        placeholder="Enter your password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
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
                        {loading ? 'Logging in...' : 'Login'}
                    </button>

                </form>

                <p className="auth-switch">
                    Don't have an account?{' '}
                    <Link to="/register">Create Account</Link>
                </p>

                <Link to="/" className="back-home">
                    ← Back to Home
                </Link>

            </div>
        </div>
    );
}

export default Login;
