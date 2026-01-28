import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ParticleText from '@/components/ParticleText';
import AuthForm from '@/components/AuthForm';
import { useAuthStore } from '@/state/authStore';
import '@/styles/LandingPage.css';

const LandingPage = () => {
    const [isLogin, setIsLogin] = useState(true);
    const navigate = useNavigate();
    const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

    // Redirect to dashboard if already authenticated
    useEffect(() => {
        if (isAuthenticated) {
            navigate('/dashboard', { replace: true });
        }
    }, [isAuthenticated, navigate]);

    return (
        <div className="landing-page">
            {/* Left Panel - Particle Animation */}
            <div className="left-panel">
                <ParticleText />
            </div>

            {/* Right Panel - Auth Form */}
            <div className="right-panel">
                <AuthForm isLogin={isLogin} setIsLogin={setIsLogin} />
            </div>
        </div>
    );
};

export default LandingPage;
