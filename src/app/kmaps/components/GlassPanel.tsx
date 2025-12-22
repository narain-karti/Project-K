import { ReactNode } from 'react';

interface GlassPanelProps {
    children: ReactNode;
    className?: string;
    title?: string;
}

export default function GlassPanel({ children, className = '', title }: GlassPanelProps) {
    return (
        <div className={`glass-card rounded-xl overflow-hidden shadow-2xl hover:shadow-[0_0_40px_rgba(99,102,241,0.3)] hover:border-indigo-500/30 transition-all duration-300 ${className}`}>
            {title && (
                <div className="px-4 py-3 border-b border-white/5 bg-white/5">
                    <h3 className="text-sm font-medium text-white/80 uppercase tracking-wider">{title}</h3>
                </div>
            )}
            <div className="p-4">
                {children}
            </div>
        </div>
    );
}
