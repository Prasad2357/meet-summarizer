import { useEffect, useRef, useState } from 'react';

interface Particle {
    x: number;
    y: number;
    targetX: number;
    targetY: number;
    vx: number;
    vy: number;
    size: number;
    color: string;
}

const ParticleText = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [particles, setParticles] = useState<Particle[]>([]);
    const [isHovering, setIsHovering] = useState(false);
    const mousePos = useRef({ x: 0, y: 0 });
    const rotationAngle = useRef(0);
    const animationFrameId = useRef<number | undefined>(undefined);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d', { willReadFrequently: true });
        if (!ctx) return;

        // Set canvas size
        const resizeCanvas = () => {
            canvas.width = canvas.offsetWidth;
            canvas.height = canvas.offsetHeight;
            initParticles();
        };

        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);

        // Initialize particles based on text
        function initParticles() {
            if (!canvas || !ctx) return;

            const text1 = 'MEET';
            const text2 = 'SUMMARIZER';
            const fontSize = 80;
            const lineHeight = 100;

            ctx.font = `bold ${fontSize}px 'Inter', sans-serif`;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';

            const centerX = canvas.width / 2;
            const centerY = canvas.height / 2;

            const newParticles: Particle[] = [];
            const density = 6; // Particle density - optimized for smooth performance

            // Draw text1
            ctx.fillStyle = 'white';
            ctx.fillText(text1, centerX, centerY - lineHeight / 2);

            // Sample particles from text1
            const imageData1 = ctx.getImageData(0, 0, canvas.width, canvas.height);
            for (let y = 0; y < canvas.height; y += density) {
                for (let x = 0; x < canvas.width; x += density) {
                    const index = (y * canvas.width + x) * 4;
                    const alpha = imageData1.data[index + 3];
                    if (alpha > 128) {
                        newParticles.push({
                            x: Math.random() * canvas.width,
                            y: Math.random() * canvas.height,
                            targetX: x,
                            targetY: y,
                            vx: 0,
                            vy: 0,
                            size: Math.random() * 2 + 1,
                            color: `hsla(${270 + Math.random() * 30}, 80%, ${60 + Math.random() * 20}%, 0.9)`,
                        });
                    }
                }
            }

            // Clear and draw text2
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.fillText(text2, centerX, centerY + lineHeight / 2);

            // Sample particles from text2
            const imageData2 = ctx.getImageData(0, 0, canvas.width, canvas.height);
            for (let y = 0; y < canvas.height; y += density) {
                for (let x = 0; x < canvas.width; x += density) {
                    const index = (y * canvas.width + x) * 4;
                    const alpha = imageData2.data[index + 3];
                    if (alpha > 128) {
                        newParticles.push({
                            x: Math.random() * canvas.width,
                            y: Math.random() * canvas.height,
                            targetX: x,
                            targetY: y,
                            vx: 0,
                            vy: 0,
                            size: Math.random() * 2 + 1,
                            color: `hsla(${270 + Math.random() * 30}, 80%, ${60 + Math.random() * 20}%, 0.9)`,
                        });
                    }
                }
            }

            setParticles(newParticles);
        }

        return () => {
            window.removeEventListener('resize', resizeCanvas);
            if (animationFrameId.current) {
                cancelAnimationFrame(animationFrameId.current);
            }
        };
    }, []);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            const centerX = canvas.width / 2;
            const centerY = canvas.height / 2;

            // Update rotation angle when hovering - smoother rotation
            if (isHovering) {
                rotationAngle.current += 0.015;
            }

            particles.forEach((particle, i) => {
                // Calculate relative position from center
                let relX = particle.targetX - centerX;
                let relY = particle.targetY - centerY;

                // Apply rotation when hovering
                let finalTargetX = particle.targetX;
                let finalTargetY = particle.targetY;

                if (isHovering) {
                    const cos = Math.cos(rotationAngle.current);
                    const sin = Math.sin(rotationAngle.current);
                    finalTargetX = centerX + (relX * cos - relY * sin);
                    finalTargetY = centerY + (relX * sin + relY * cos);
                }

                // Apply attraction to target position
                const dx = finalTargetX - particle.x;
                const dy = finalTargetY - particle.y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                // Smooth movement with optimized physics
                if (distance > 0.5) {
                    const force = distance * 0.08;
                    particle.vx += (dx / distance) * force * 0.25;
                    particle.vy += (dy / distance) * force * 0.25;
                }

                // Apply velocity damping for smoother motion
                particle.vx *= 0.88;
                particle.vy *= 0.88;

                // Update position
                particle.x += particle.vx;
                particle.y += particle.vy;

                // Mouse interaction - smoother repulsion
                if (isHovering) {
                    const mdx = mousePos.current.x - particle.x;
                    const mdy = mousePos.current.y - particle.y;
                    const mdist = Math.sqrt(mdx * mdx + mdy * mdy);

                    if (mdist < 120 && mdist > 0) {
                        const pushForce = (120 - mdist) * 0.3;
                        particle.vx -= (mdx / mdist) * pushForce * 0.08;
                        particle.vy -= (mdy / mdist) * pushForce * 0.08;
                    }
                }

                // Draw particle
                ctx.fillStyle = particle.color;
                ctx.beginPath();
                ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
                ctx.fill();

                // Draw connecting lines - only check particles ahead to avoid duplicate lines
                for (let j = i + 1; j < particles.length; j++) {
                    const other = particles[j];
                    const dist = Math.sqrt(
                        (particle.x - other.x) ** 2 + (particle.y - other.y) ** 2
                    );
                    if (dist < 60) {
                        ctx.strokeStyle = `hsla(270, 70%, 65%, ${(1 - dist / 60) * 0.15})`;
                        ctx.lineWidth = 0.5;
                        ctx.beginPath();
                        ctx.moveTo(particle.x, particle.y);
                        ctx.lineTo(other.x, other.y);
                        ctx.stroke();
                    }
                }
            });

            animationFrameId.current = requestAnimationFrame(animate);
        };

        animate();

        return () => {
            if (animationFrameId.current) {
                cancelAnimationFrame(animationFrameId.current);
            }
        };
    }, [particles, isHovering]);

    const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const rect = canvas.getBoundingClientRect();
        mousePos.current = {
            x: e.clientX - rect.left,
            y: e.clientY - rect.top,
        };
    };

    return (
        <canvas
            ref={canvasRef}
            className="particle-canvas"
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => {
                setIsHovering(false);
                rotationAngle.current = 0;
            }}
            onMouseMove={handleMouseMove}
        />
    );
};

export default ParticleText;
