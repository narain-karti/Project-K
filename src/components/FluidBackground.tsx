'use client';

import { useEffect, useState } from 'react';

export default function FluidBackground() {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;

    return (
        <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
            {/* Animated Gradient Orbs */}
            <div className="absolute top-0 -left-40 w-96 h-96 bg-gradient-to-br from-accent-teal/30 to-accent-purple/30 rounded-full blur-3xl animate-float-slow" />
            <div className="absolute top-1/4 right-0 w-80 h-80 bg-gradient-to-br from-accent-rose/20 to-accent-amber/20 rounded-full blur-3xl animate-float-medium" />
            <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-gradient-to-br from-accent-purple/25 to-accent-teal/25 rounded-full blur-3xl animate-float-fast" />
            <div className="absolute top-1/2 left-1/2 w-72 h-72 bg-gradient-to-br from-accent-amber/15 to-accent-rose/15 rounded-full blur-3xl animate-float-slow" />
        </div>
    );
}
