import { ReactNode } from 'react';

interface GlassPanelProps {
    children: ReactNode;
    className?: string;
    title?: string;
    noPadding?: boolean;
}

export default function GlassPanel({ children, className = '', title, noPadding = false }: GlassPanelProps) {
    return (
        <div className={`glass-card rounded-xl overflow-hidden shadow-2xl hover:shadow-[0_0_40px_rgba(45,212,191,0.4)] hover:border-accent-teal/40 transition-all duration-300 ${className}`}>
            {title && (
                <div className="px-4 py-3 border-b border-white/5 bg-white/5">
                    <h3 className="text-sm font-medium text-white/80 uppercase tracking-wider">{title}</h3>
                </div>
            )}
            <div className={noPadding ? '' : 'p-4'}>
                {children}
            </div>
        </div>
    );
}
