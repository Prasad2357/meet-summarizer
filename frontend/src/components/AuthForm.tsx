import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import { useAuthStore } from '@/state/authStore';

interface AuthFormProps {
    isLogin: boolean;
    setIsLogin: (value: boolean) => void;
}

declare global {
    interface Window {
        google: any;
    }
}

const AuthForm = ({ isLogin, setIsLogin }: AuthFormProps) => {
    const navigate = useNavigate();
    const { login, signup, googleLogin, isLoading } = useAuthStore();

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
    });
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [apiError, setApiError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    // Load Google Sign-In script
 useEffect(() => {
        const initGoogleButton = () => {
            if (!window.google) return;

            const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
            if (!clientId) return;

            window.google.accounts.id.initialize({
                client_id: clientId,
                callback: handleGoogleCallback,
            });

            const buttonDiv = document.getElementById('google-signin-button');
            if (buttonDiv) {
                window.google.accounts.id.renderButton(buttonDiv, {
                    theme: "outline",
                    size: "large",
                    width: 350,
                    text: "continue_with",
                });
            }
        };

        const loadGoogleScript = () => {
            const script = document.createElement('script');
            script.src = 'https://accounts.google.com/gsi/client';
            script.async = true;
            script.defer = true;
            script.onload = initGoogleButton;
            document.body.appendChild(script);
        };
        
        if (!document.querySelector('script[src="https://accounts.google.com/gsi/client"]')) {
            loadGoogleScript();
        } else if (window.google) {
            setTimeout(initGoogleButton, 100);
        }
    }, []);



    const handleGoogleCallback = async (response: any) => {
        try {
            await googleLogin(response.credential);
            navigate('/dashboard');
        } catch (error) {
            if (error instanceof Error) {
                setApiError(error.message);
            } else {
                setApiError('Google sign-in failed. Please try again.');
            }
        }
    };

    const validateForm = () => {
        const newErrors: Record<string, string> = {};

        if (!isLogin && !formData.name.trim()) {
            newErrors.name = 'Name is required';
        }

        if (!formData.email) {
            newErrors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Email is invalid';
        }

        if (!formData.password) {
            newErrors.password = 'Password is required';
        } else if (formData.password.length < 6) {
            newErrors.password = 'Password must be at least 6 characters';
        }

        if (!isLogin && !formData.confirmPassword) {
            newErrors.confirmPassword = 'Please confirm your password';
        } else if (!isLogin && formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = 'Passwords do not match';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setApiError('');

        if (!validateForm()) {
            return;
        }

        try {
            if (isLogin) {
                await login(formData.email, formData.password);
                // Redirect to dashboard on successful login
                navigate('/dashboard');
            } else {
                await signup(formData.name, formData.email, formData.password);
                // After successful signup, switch to login mode
                setIsLogin(true);
                setFormData({
                    name: '',
                    email: '',
                    password: '',
                    confirmPassword: '',
                });
                setApiError(''); // Clear any previous errors
                setSuccessMessage('Account created successfully! Please log in.');
            }
        } catch (error) {
            if (error instanceof Error) {
                setApiError(error.message);
            } else {
                setApiError('An unexpected error occurred. Please try again.');
            }
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        // Clear error when user starts typing
        if (errors[name]) {
            setErrors((prev) => ({ ...prev, [name]: '' }));
        }
        if (apiError) {
            setApiError('');
        }
    };

    const handleToggleMode = () => {
        setIsLogin(!isLogin);
        setErrors({});
        setApiError('');
        setSuccessMessage('');
        setFormData({
            name: '',
            email: '',
            password: '',
            confirmPassword: '',
        });
    };

    return (
        <div className="auth-form-container">
            <div className="auth-form-card">
                <h1 className="auth-title">{isLogin ? 'Welcome Back' : 'Sign Up'}</h1>
                <p className="auth-subtitle">
                    {isLogin
                        ? 'Sign in to access your meeting summaries'
                        : 'Create an account to get started'}
                </p>

                {successMessage && (
                    <div className="api-success-message">
                        {successMessage}
                    </div>
                )}

                {apiError && (
                    <div className="api-error-message">
                        {apiError}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="auth-form">
                    {!isLogin && (
                        <div className="form-group">
                            <label htmlFor="name" className="form-label">
                                Name
                            </label>
                            <input
                                type="text"
                                id="name"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                className={`form-input ${errors.name ? 'input-error' : ''}`}
                                placeholder="John Doe"
                                autoComplete="name"
                                disabled={isLoading}
                            />
                            {errors.name && <span className="error-message">{errors.name}</span>}
                        </div>
                    )}

                    <div className="form-group">
                        <label htmlFor="email" className="form-label">
                            Email
                        </label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className={`form-input ${errors.email ? 'input-error' : ''}`}
                            placeholder="you@example.com"
                            autoComplete="email"
                            disabled={isLoading}
                        />
                        {errors.email && <span className="error-message">{errors.email}</span>}
                    </div>

                    <div className="form-group">
                        <label htmlFor="password" className="form-label">
                            Password
                        </label>
                        <div className="password-input-wrapper">
                            <input
                                type={showPassword ? 'text' : 'password'}
                                id="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                className={`form-input ${errors.password ? 'input-error' : ''}`}
                                placeholder="••••••••"
                                autoComplete={isLogin ? 'current-password' : 'new-password'}
                                disabled={isLoading}
                            />
                            <button
                                type="button"
                                className="password-toggle"
                                onClick={() => setShowPassword(!showPassword)}
                                aria-label={showPassword ? 'Hide password' : 'Show password'}
                                disabled={isLoading}
                            >
                                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                            </button>
                        </div>
                        {errors.password && (
                            <span className="error-message">{errors.password}</span>
                        )}
                    </div>

                    {!isLogin && (
                        <div className="form-group">
                            <label htmlFor="confirmPassword" className="form-label">
                                Confirm Password
                            </label>
                            <div className="password-input-wrapper">
                                <input
                                    type={showConfirmPassword ? 'text' : 'password'}
                                    id="confirmPassword"
                                    name="confirmPassword"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    className={`form-input ${errors.confirmPassword ? 'input-error' : ''
                                        }`}
                                    placeholder="••••••••"
                                    autoComplete="new-password"
                                    disabled={isLoading}
                                />
                                <button
                                    type="button"
                                    className="password-toggle"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    aria-label={
                                        showConfirmPassword ? 'Hide password' : 'Show password'
                                    }
                                    disabled={isLoading}
                                >
                                    {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                </button>
                            </div>
                            {errors.confirmPassword && (
                                <span className="error-message">{errors.confirmPassword}</span>
                            )}
                        </div>
                    )}

                    {isLogin && (
                        <div className="forgot-password-wrapper">
                            <a href="#" className="forgot-password-link">
                                Forgot password?
                            </a>
                        </div>
                    )}

                    <button type="submit" className="submit-button" disabled={isLoading}>
                        {isLoading && <Loader2 className="spinner" size={20} />}
                        {isLogin ? (isLoading ? 'Signing In...' : 'Sign In') : (isLoading ? 'Creating Account...' : 'Create Account')}
                    </button>
                </form>

                <div className="auth-toggle">
                    <p>
                        {isLogin ? "Don't have an account?" : 'Already have an account?'}{' '}
                        <button
                            type="button"
                            onClick={handleToggleMode}
                            className="toggle-link"
                            disabled={isLoading}
                        >
                            {isLogin ? 'Sign Up' : 'Log In'}
                        </button>
                    </p>
                </div>

                <div className="divider">
                    <span>or</span>
                </div>

                <div className="social-auth">
                    <div id="google-signin-button" style={{ width: '100%' }}></div>
                </div>
            </div>
        </div>
    );
};

export default AuthForm;
