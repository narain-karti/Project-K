import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Bot, User, MapPin, Navigation, AlertTriangle, ToggleLeft, ToggleRight } from 'lucide-react';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { FilterState } from '../hooks/useIncidentData';

// Initialize Gemini API
const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GOOGLE_AI_KEY || '');

interface Message {
    id: string;
    role: 'user' | 'assistant';
    content: string;
    timestamp: number;
}

interface ChatInterfaceProps {
    onRouteUpdate: (routeData: any) => void;
    filters?: FilterState;
}

export default function ChatInterface({ onRouteUpdate, filters }: ChatInterfaceProps) {
    const [messages, setMessages] = useState<Message[]>([
        {
            id: 'welcome',
            role: 'assistant',
            content: 'Hello! I\'m your K-Maps assistant. Where would you like to go today?',
            timestamp: Date.now()
        }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    // Track pending route context for confirmation/follow-up
    const [pendingRoute, setPendingRoute] = useState<any>(null);
    const [isManualMode, setIsManualMode] = useState(false);

    // Manual Mode State
    const [manualSource, setManualSource] = useState('');
    const [manualDest, setManualDest] = useState('');

    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleManualSubmit = () => {
        if (!manualDest.trim()) return;

        const routeData = {
            type: 'route_request',
            source: manualSource || 'Current Location',
            destination: manualDest,
            preferences: filters?.types ?
                Object.entries(filters.types)
                    .filter(([_, isActive]) => isActive)
                    .map(([type]) => type)
                : []
        };

        onRouteUpdate(routeData);
        setMessages(prev => [...prev, {
            id: Date.now().toString(),
            role: 'assistant',
            content: `Mapping route to ${manualDest}...`,
            timestamp: Date.now()
        }]);
    };

    const handleSend = async () => {
        if (!input.trim() || isLoading) return;

        const apiKey = process.env.NEXT_PUBLIC_GOOGLE_AI_KEY;
        if (!apiKey) {
            // Auto-switch to manual mode if API key is missing
            setIsManualMode(true);
            const errorMessage: Message = {
                id: Date.now().toString(),
                role: 'assistant',
                content: "⚠️ AI Offline. Switched to Manual Mode.",
                timestamp: Date.now()
            };
            setMessages(prev => [...prev, errorMessage]);
            return;
        }

        const userMessage: Message = {
            id: Date.now().toString(),
            role: 'user',
            content: input,
            timestamp: Date.now()
        };

        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);

        try {
            const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

            // Prepare context about active filters
            const activeFilters = filters?.types ?
                Object.entries(filters.types)
                    .filter(([_, isActive]) => isActive)
                    .map(([type]) => type)
                : [];

            // Check if this is a confirmation response ("Yes", "Sure", etc.)
            let promptContext = "";
            if (pendingRoute) {
                promptContext = `
                    PREVIOUS CONTEXT: You suggested a route from ${pendingRoute.source} to ${pendingRoute.destination}.
                    You asked if they wanted to apply these filters: ${activeFilters.join(', ')}.
                    The user just replied: "${input}".
                    
                    Analyze if the user confirmed (Yes/Okay/Sure) or declined (No/Just normal route).
                    
                    If CONFIRMED:
                    Return JSON:
                    {
                        "type": "route_request",
                        "source": "${pendingRoute.source}",
                        "destination": "${pendingRoute.destination}",
                        "preferences": ${JSON.stringify([...(pendingRoute.preferences || []), ...activeFilters])},
                        "response_text": "Understood. Calculating a route that avoids ${activeFilters.join(', ')}..."
                    }
                    
                    If DECLINED:
                    Return JSON:
                    {
                        "type": "route_request",
                        "source": "${pendingRoute.source}",
                        "destination": "${pendingRoute.destination}",
                        "preferences": ["fastest"],
                        "response_text": "Okay, showing the standard fastest route."
                    }

                    If UNRELATED:
                    Treat as a new chat.
                `;
            } else {
                promptContext = `
                    Analyze the user's request: "${input}"
                    Active Map Filters: ${JSON.stringify(activeFilters)}
                    
                    If the user asks for a route:
                    1. Extract source and destination.
                    2. If there are active filters (like ACCIDENT, POTHOLE) and the user didn't explicitly say "avoid X", 
                       you MUST ask for confirmation first.
                       Return JSON:
                       {
                           "type": "confirmation_request",
                           "source": "extracted source",
                           "destination": "extracted destination",
                           "preferences": [], 
                           "response_text": "I see you have filters enabled for ${activeFilters.join(', ')}. Do you want to find a route that avoids these?"
                       }
                    
                    3. If filters are effectively empty OR user explicitly stated preferences:
                       Return JSON for route_request.
                `;
            }

            const prompt = `
                You are a smart routing assistant for K-Maps.
                ${promptContext}
                
                Standard Output Format (JSON ONLY):
                {
                    "type": "route_request" | "confirmation_request" | "chat",
                    "source": "string",
                    "destination": "string",
                    "preferences": ["string"],
                    "response_text": "string"
                }
            `;

            const result = await model.generateContent(prompt);
            const responseText = result.response.text();
            console.log("AI Raw:", responseText);

            let parsed;
            try {
                const clean = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
                parsed = JSON.parse(clean.substring(clean.indexOf('{'), clean.lastIndexOf('}') + 1));
            } catch (e) {
                parsed = { type: 'chat', response_text: responseText };
            }

            const aiMessage: Message = {
                id: (Date.now() + 1).toString(),
                role: 'assistant',
                content: parsed.response_text,
                timestamp: Date.now()
            };
            setMessages(prev => [...prev, aiMessage]);

            if (parsed.type === 'confirmation_request') {
                setPendingRoute({
                    source: parsed.source,
                    destination: parsed.destination,
                    preferences: []
                });
            } else if (parsed.type === 'route_request') {
                onRouteUpdate(parsed);
                setPendingRoute(null); // Clear pending state
            } else {
                setPendingRoute(null);
            }

        } catch (error: any) {
            console.error("AI Error:", error);
            setMessages(prev => [...prev, {
                id: Date.now().toString(),
                role: 'assistant',
                content: "Switched to Manual Mode due to connection error.",
                timestamp: Date.now()
            }]);
            setIsManualMode(true);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex flex-col h-full bg-gradient-to-br from-black/30 via-black/20 to-black/30 backdrop-blur-2xl shadow-2xl relative">
            {/* Header */}
            <div className="p-4 border-b border-white/20 bg-gradient-to-r from-white/5 to-transparent flex items-center justify-between backdrop-blur-sm">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-accent-cyan to-accent-violet flex items-center justify-center shadow-lg shadow-accent-cyan/30 ring-2 ring-white/10">
                        {isManualMode ? <MapPin className="w-6 h-6 text-white" /> : <Bot className="w-6 h-6 text-white" />}
                    </div>
                    <div>
                        <h2 className="font-bold text-lg text-white drop-shadow-lg">
                            {isManualMode ? 'Route Finder' : 'K-Maps Assistant'}
                        </h2>
                        <p className="text-xs text-accent-cyan/80">
                            {isManualMode ? 'Manual Entry' : 'AI-Powered Agent'}
                        </p>
                    </div>
                </div>
                <button
                    onClick={() => setIsManualMode(!isManualMode)}
                    className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 hover:border-accent-cyan/50 transition-all flex items-center gap-2 text-xs font-medium"
                >
                    {isManualMode ? <ToggleRight className="w-4 h-4 text-accent-cyan" /> : <ToggleLeft className="w-4 h-4 text-white/50" />}
                    <span className={isManualMode ? 'text-accent-cyan' : 'text-white/70'}>
                        {isManualMode ? 'Manual' : 'AI Mode'}
                    </span>
                </button>
            </div>

            {/* Content Area */}
            {isManualMode ? (
                <div className="flex-1 p-6 space-y-6 overflow-y-auto">
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-xs text-white/50 uppercase tracking-wider font-bold">From</label>
                            <div className="relative group">
                                <MapPin className="absolute left-3 top-3 w-4 h-4 text-accent-cyan group-focus-within:animate-bounce" />
                                <input
                                    type="text"
                                    value={manualSource}
                                    onChange={(e) => setManualSource(e.target.value)}
                                    placeholder="Source (e.g. Guindy)"
                                    className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-accent-cyan transition-all"
                                />
                            </div>
                        </div>

                        <div className="flex items-center justify-center">
                            <div className="h-4 w-0.5 bg-white/10" />
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs text-white/50 uppercase tracking-wider font-bold">To</label>
                            <div className="relative group">
                                <Navigation className="absolute left-3 top-3 w-4 h-4 text-accent-violet group-focus-within:animate-pulse" />
                                <input
                                    type="text"
                                    value={manualDest}
                                    onChange={(e) => setManualDest(e.target.value)}
                                    placeholder="Destination (e.g. T. Nagar)"
                                    className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-accent-violet transition-all"
                                />
                            </div>
                        </div>
                    </div>

                    <button
                        onClick={handleManualSubmit}
                        disabled={!manualDest}
                        className="w-full bg-gradient-to-r from-accent-cyan to-accent-violet text-white font-bold py-3 rounded-xl shadow-lg shadow-accent-cyan/20 hover:shadow-accent-cyan/40 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Find Route
                    </button>

                    <div className="text-center">
                        <p className="text-[10px] text-white/30">
                            Active filters will be applied to routing preferences.
                        </p>
                    </div>
                </div>
            ) : (
                <>
                    {/* Chat Messages */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-white/10">
                        {messages.map((msg) => (
                            <motion.div
                                key={msg.id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                            >
                                <div
                                    className={`max-w-[85%] p-3 rounded-2xl backdrop-blur-md shadow-lg transition-all hover:scale-[1.02] ${msg.role === 'user'
                                        ? 'bg-gradient-to-br from-accent-violet/25 to-accent-violet/15 border border-accent-violet/40 text-white rounded-tr-none shadow-accent-violet/20'
                                        : 'bg-gradient-to-br from-white/10 to-white/5 border border-white/20 text-white rounded-tl-none shadow-black/20'
                                        }`}
                                >
                                    <p className="text-sm leading-relaxed font-medium">{msg.content}</p>
                                    <span className="text-[10px] opacity-50 mt-1 block">
                                        {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </span>
                                </div>
                            </motion.div>
                        ))}
                        {isLoading && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="flex justify-start"
                            >
                                <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md border border-white/20 p-3 rounded-2xl rounded-tl-none flex gap-1 shadow-lg">
                                    <span className="w-2 h-2 bg-accent-cyan/50 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                                    <span className="w-2 h-2 bg-accent-cyan/50 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                                    <span className="w-2 h-2 bg-accent-cyan/50 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                                </div>
                            </motion.div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input */}
                    <div className="p-4 border-t border-white/20 bg-gradient-to-t from-black/30 to-transparent backdrop-blur-md">
                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                                placeholder="Type route request..."
                                className="flex-1 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm border border-white/20 rounded-xl px-4 py-3 text-sm text-white placeholder:text-white/50 focus:outline-none focus:border-accent-cyan focus:ring-2 focus:ring-accent-cyan/20 transition-all shadow-inner"
                            />
                            <button
                                onClick={handleSend}
                                disabled={isLoading || !input.trim()}
                                className="p-3 bg-gradient-to-br from-accent-cyan/25 to-accent-cyan/15 hover:from-accent-cyan/35 hover:to-accent-cyan/25 text-accent-cyan rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed backdrop-blur-sm border border-accent-cyan/30 shadow-lg shadow-accent-cyan/10 hover:shadow-accent-cyan/20 hover:scale-105 active:scale-95"
                            >
                                <Send className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}
