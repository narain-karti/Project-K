'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Bot, User, MapPin, Navigation, AlertTriangle } from 'lucide-react';
import { GoogleGenerativeAI } from '@google/generative-ai';

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
}

export default function ChatInterface({ onRouteUpdate }: ChatInterfaceProps) {
    const [messages, setMessages] = useState<Message[]>([
        {
            id: 'welcome',
            role: 'assistant',
            content: 'Hello! I\'m your K-Maps assistant. Where would you like to go today? I can help you find pollution-free or pothole-free routes.',
            timestamp: Date.now()
        }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSend = async () => {
        if (!input.trim() || isLoading) return;

        const apiKey = process.env.NEXT_PUBLIC_GOOGLE_AI_KEY;
        if (!apiKey) {
            const errorMessage: Message = {
                id: Date.now().toString(),
                role: 'assistant',
                content: "⚠️ Configuration Error: Google AI API Key is missing. Please restart your development server to load the new environment variables.",
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
            // System prompt to extract route info
            const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

            const prompt = `
                You are a smart routing assistant for K-Maps. 
                Analyze the user's request: "${input}"
                
                Extract the source, destination, and any route preferences (pollution-free, pothole-free, fastest, scenic).
                If the user asks for a route, return a JSON object with this structure (and ONLY the JSON):
                {
                    "type": "route_request",
                    "source": "extracted source location (default to 'Current Location' if not specified but implied)",
                    "destination": "extracted destination location",
                    "preferences": ["pollution-free", "pothole-free", etc],
                    "response_text": "A friendly, short confirmation message like 'Finding a pollution-free route to [destination]...'"
                }
                
                If it's just general chat or unclear, return:
                {
                    "type": "chat",
                    "response_text": "A helpful response asking for clarification or answering the question"
                }
            `;

            const result = await model.generateContent(prompt);
            const responseText = result.response.text();

            console.log("AI Response Raw:", responseText);

            // Parse JSON response
            let parsedResponse;
            try {
                // Clean up markdown code blocks if present
                const cleanJson = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
                // Find the first '{' and last '}' to extract JSON object if there's extra text
                const firstBrace = cleanJson.indexOf('{');
                const lastBrace = cleanJson.lastIndexOf('}');

                if (firstBrace !== -1 && lastBrace !== -1) {
                    const jsonString = cleanJson.substring(firstBrace, lastBrace + 1);
                    parsedResponse = JSON.parse(jsonString);
                } else {
                    throw new Error("No JSON object found");
                }
            } catch (e) {
                console.error("Failed to parse AI response", e);
                // Fallback: treat the whole response as chat if it's not valid JSON
                parsedResponse = {
                    type: 'chat',
                    response_text: responseText || "I'm having trouble connecting to the routing service. Please try again."
                };
            }

            const aiMessage: Message = {
                id: (Date.now() + 1).toString(),
                role: 'assistant',
                content: parsedResponse.response_text,
                timestamp: Date.now()
            };

            console.log("📨 Adding AI message to chat:", aiMessage);
            setMessages(prev => [...prev, aiMessage]);

            console.log("🔍 Checking parsedResponse.type:", parsedResponse.type);
            if (parsedResponse.type === 'route_request') {
                console.log("✅ ROUTE REQUEST DETECTED! Calling onRouteUpdate with:", parsedResponse);
                console.log("🗺️ Route details:", {
                    source: parsedResponse.source,
                    destination: parsedResponse.destination,
                    preferences: parsedResponse.preferences
                });
                onRouteUpdate(parsedResponse);
                console.log("✅ onRouteUpdate called successfully!");
            } else {
                console.log("ℹ️ Not a route request, just chat. Type:", parsedResponse.type);
            }

        } catch (error: any) {
            console.error("AI Error:", error);
            const errorMessage: Message = {
                id: (Date.now() + 1).toString(),
                role: 'assistant',
                content: `Error: ${error.message || "Unknown error occurred"}. Please try again.`,
                timestamp: Date.now()
            };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex flex-col h-full bg-gradient-to-br from-black/30 via-black/20 to-black/30 backdrop-blur-2xl shadow-2xl">
            {/* Header */}
            <div className="p-4 border-b border-white/20 bg-gradient-to-r from-white/5 to-transparent flex items-center gap-3 backdrop-blur-sm">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-accent-cyan to-accent-violet flex items-center justify-center shadow-lg shadow-accent-cyan/30 ring-2 ring-white/10">
                    <Bot className="w-6 h-6 text-white" />
                </div>
                <div>
                    <h2 className="font-bold text-lg text-white drop-shadow-lg">K-Maps Assistant</h2>
                    <p className="text-xs text-accent-cyan/80">AI-Powered Routing</p>
                </div>
            </div>

            {/* Messages */}
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
                        placeholder="Type your route request..."
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
        </div>
    );
}
