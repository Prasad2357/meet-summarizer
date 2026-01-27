import { useState } from 'react';
import ParticleText from '@/components/ParticleText';
import AuthForm from '@/components/AuthForm';
import '@/styles/LandingPage.css';

const LandingPage = () => {
    const [isLogin, setIsLogin] = useState(false);

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
