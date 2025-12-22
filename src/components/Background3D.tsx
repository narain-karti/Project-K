'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

export default function Background3D() {
    const containerRef = useRef<HTMLDivElement>(null);
    const [scrollY, setScrollY] = useState(0);

    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    const springConfig = { damping: 25, stiffness: 150 };
    const mouseXSpring = useSpring(mouseX, springConfig);
    const mouseYSpring = useSpring(mouseY, springConfig);

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            const { clientX, clientY } = e;
            const { innerWidth, innerHeight } = window;

            mouseX.set((clientX / innerWidth - 0.5) * 2);
            mouseY.set((clientY / innerHeight - 0.5) * 2);
        };

        const handleScroll = () => {
            setScrollY(window.scrollY);
        };

        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('scroll', handleScroll);

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('scroll', handleScroll);
        };
    }, [mouseX, mouseY]);

    const shapes = [
        { id: 1, size: 400, color: 'from-accent-cyan/30 to-accent-cyan/5', initialX: '10%', initialY: '15%', moveIntensity: 0.6, rotateSpeed: 0.3 },
        { id: 2, size: 500, color: 'from-accent-violet/25 to-accent-violet/5', initialX: '75%', initialY: '8%', moveIntensity: 0.4, rotateSpeed: -0.25 },
        { id: 3, size: 300, color: 'from-accent-rose/30 to-accent-rose/5', initialX: '85%', initialY: '55%', moveIntensity: 0.7, rotateSpeed: 0.4 },
        { id: 4, size: 450, color: 'from-accent-amber/20 to-transparent', initialX: '15%', initialY: '70%', moveIntensity: 0.5, rotateSpeed: -0.35 },
        { id: 5, size: 250, color: 'from-accent-cyan/20 to-transparent', initialX: '50%', initialY: '35%', moveIntensity: 0.8, rotateSpeed: 0.5 },
        { id: 6, size: 350, color: 'from-accent-violet/20 to-accent-violet/5', initialX: '30%', initialY: '45%', moveIntensity: 0.45, rotateSpeed: -0.2 },
        { id: 7, size: 280, color: 'from-accent-rose/25 to-transparent', initialX: '65%', initialY: '25%', moveIntensity: 0.65, rotateSpeed: 0.35 },
        { id: 8, size: 320, color: 'from-accent-amber/25 to-accent-amber/5', initialX: '40%', initialY: '80%', moveIntensity: 0.55, rotateSpeed: -0.3 },
        { id: 9, size: 380, color: 'from-accent-cyan/15 to-transparent', initialX: '90%', initialY: '40%', moveIntensity: 0.4, rotateSpeed: 0.25 },
        { id: 10, size: 270, color: 'from-accent-violet/30 to-transparent', initialX: '20%', initialY: '60%', moveIntensity: 0.75, rotateSpeed: -0.4 },
    ];

    const geometricShapes = [
        { id: 'geo1', type: 'square', size: 120, color: 'accent-cyan/25', initialX: '12%', initialY: '50%', moveX: -35, moveY: -35, rotate: 0.12 },
        { id: 'geo2', type: 'circle', size: 90, color: 'accent-rose/20', initialX: '78%', initialY: '68%', moveX: 45, moveY: 45, rotate: -0.18 },
        { id: 'geo3', type: 'triangle', size: 100, color: 'accent-violet/25', initialX: '55%', initialY: '15%', moveX: 30, moveY: -40, rotate: 0.15 },
        { id: 'geo4', type: 'hexagon', size: 110, color: 'accent-amber/20', initialX: '35%', initialY: '82%', moveX: -40, moveY: 35, rotate: -0.2 },
        { id: 'geo5', type: 'diamond', size: 95, color: 'accent-cyan/30', initialX: '88%', initialY: '20%', moveX: 38, moveY: -30, rotate: 0.22 },
    ];

    return (
        <div
            ref={containerRef}
            className="fixed inset-0 -z-50 overflow-hidden pointer-events-none bg-black"
            style={{ perspective: '1200px' }}
        >
            {shapes.map((shape) => (
                <motion.div
                    key={shape.id}
                    className={`absolute rounded-full bg-gradient-to-br ${shape.color} blur-[100px] mix-blend-screen`}
                    style={{
                        width: shape.size,
                        height: shape.size,
                        left: shape.initialX,
                        top: shape.initialY,
                    }}
                    animate={{
                        x: mouseXSpring.get() * 60 * shape.moveIntensity,
                        y: mouseYSpring.get() * 60 * shape.moveIntensity - scrollY * 0.25,
                        rotate: scrollY * shape.rotateSpeed,
                        scale: [1, 1.15, 1],
                    }}
                    transition={{
                        x: { type: 'spring', ...springConfig },
                        y: { type: 'spring', ...springConfig },
                        rotate: { duration: 0 },
                        scale: {
                            duration: 10,
                            repeat: Infinity,
                            ease: 'easeInOut',
                        },
                    }}
                />
            ))}

            {geometricShapes.map((geo) => (
                <motion.div
                    key={geo.id}
                    className={`absolute border-2 border-${geo.color}`}
                    style={{
                        width: geo.size,
                        height: geo.size,
                        left: geo.initialX,
                        top: geo.initialY,
                        borderRadius: geo.type === 'circle' ? '50%' :
                            geo.type === 'hexagon' ? '20%' :
                                geo.type === 'diamond' ? '10%' : '15%',
                        ...(geo.type === 'triangle' && {
                            clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)',
                            border: 'none',
                            background: `linear-gradient(135deg, var(--color-${geo.color.replace('/', '-')}))`,
                        }),
                    }}
                    animate={{
                        x: mouseXSpring.get() * geo.moveX,
                        y: mouseYSpring.get() * geo.moveY - scrollY * 0.18,
                        rotate: scrollY * geo.rotate,
                    }}
                    transition={{
                        x: { type: 'spring', ...springConfig },
                        y: { type: 'spring', ...springConfig },
                    }}
                />
            ))}

            <div className="absolute inset-0 opacity-[0.03]"
                style={{
                    backgroundImage: `
            linear-gradient(to right, rgba(6, 182, 212, 0.3) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(6, 182, 212, 0.3) 1px, transparent 1px)
          `,
                    backgroundSize: '100px 100px',
                    transform: `translateY(${-scrollY * 0.3}px)`,
                }}
            />

            <div className="absolute inset-0 bg-gradient-radial from-transparent via-black/20 to-black/60 pointer-events-none" />
            <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/60 pointer-events-none" />
        </div>
    );
}
