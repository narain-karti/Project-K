'use client';

export default function GlobalBackground() {
    return (
        <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
            {/* Base dark gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#050508] via-[#0a0a1a] to-[#0d0515]" />

            {/* 3D Mesh Grid — subtle perspective grid */}
            <div
                className="absolute inset-0 opacity-[0.04]"
                style={{
                    backgroundImage: `
                        linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
                        linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
                    `,
                    backgroundSize: '60px 60px',
                    perspective: '500px',
                    transform: 'rotateX(60deg) translateY(-30%)',
                    transformOrigin: 'center top',
                }}
            />

            {/* Floating Orb 1 — Neon Crimson / Red */}
            <div
                className="absolute w-[500px] h-[500px] rounded-full"
                style={{
                    top: '10%',
                    left: '15%',
                    background: 'radial-gradient(circle, rgba(255,23,68,0.15) 0%, rgba(255,0,64,0.05) 40%, transparent 70%)',
                    filter: 'blur(80px)',
                    animation: 'orb-drift-1 20s ease-in-out infinite',
                }}
            />

            {/* Floating Orb 2 — Neon Cyan / Blue */}
            <div
                className="absolute w-[600px] h-[600px] rounded-full"
                style={{
                    top: '50%',
                    right: '10%',
                    background: 'radial-gradient(circle, rgba(0,240,255,0.12) 0%, rgba(61,90,254,0.05) 40%, transparent 70%)',
                    filter: 'blur(100px)',
                    animation: 'orb-drift-2 25s ease-in-out infinite',
                }}
            />

            {/* Floating Orb 3 — Neon Purple / Violet */}
            <div
                className="absolute w-[450px] h-[450px] rounded-full"
                style={{
                    bottom: '10%',
                    left: '30%',
                    background: 'radial-gradient(circle, rgba(213,0,249,0.12) 0%, rgba(124,77,255,0.04) 40%, transparent 70%)',
                    filter: 'blur(90px)',
                    animation: 'orb-drift-3 22s ease-in-out infinite',
                }}
            />

            {/* Floating Orb 4 — Neon Green (subtle) */}
            <div
                className="absolute w-[350px] h-[350px] rounded-full"
                style={{
                    top: '70%',
                    right: '60%',
                    background: 'radial-gradient(circle, rgba(0,230,118,0.08) 0%, transparent 60%)',
                    filter: 'blur(80px)',
                    animation: 'orb-drift-1 30s ease-in-out infinite reverse',
                }}
            />

            {/* Rotating Mesh Gradient — large, slow spin */}
            <div
                className="absolute w-[800px] h-[800px] opacity-[0.06]"
                style={{
                    top: '20%',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    background: 'conic-gradient(from 0deg, #FF1744, #D500F9, #3D5AFE, #00F0FF, #00E676, #FFAB00, #FF1744)',
                    borderRadius: '50%',
                    filter: 'blur(120px)',
                    animation: 'mesh-rotate 60s linear infinite',
                }}
            />

            {/* Noise texture overlay for depth */}
            <div
                className="absolute inset-0 opacity-[0.015]"
                style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
                }}
            />
        </div>
    );
}
