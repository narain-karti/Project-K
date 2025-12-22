import { ReactNode } from 'react';

interface GlassPanelProps {
    children: ReactNode;
    className?: string;
    title?: string;
}

export default function GlassPanel({ children, className = '', title }: GlassPanelProps) {
    return (
        <div className={`backdrop-blur-md bg-black/40 border border-white/10 rounded-xl overflow-hidden shadow-2xl ${className}`}>
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
