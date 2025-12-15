'use client'
import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Send, Bot, User, Sparkles } from 'lucide-react'

export default function DemoChatbot() {
    const [messages, setMessages] = useState([
        { id: 1, role: 'bot', text: 'Hello, I am MediLLM. How can I help you today?', time: 'Now' }
    ])
    const [isTyping, setIsTyping] = useState(false)
    const scrollRef = useRef(null)

    useEffect(() => {
        // Simulation sequence
        const sequence = [
            { t: 1000, action: () => addMessage({ role: 'user', text: "I've had a severe headache for 2 days." }) },
            { t: 2000, action: () => setIsTyping(true) },
            {
                t: 3500, action: () => {
                    setIsTyping(false)
                    addMessage({ role: 'bot', text: "I understand. Is the pain localized to one side, and do you have sensitivity to light?" })
                }
            },
            { t: 5000, action: () => addMessage({ role: 'user', text: "Yes, left side mostly. Light hurts." }) },
            { t: 6000, action: () => setIsTyping(true) },
            {
                t: 8000, action: () => {
                    setIsTyping(false)
                    addMessage({ role: 'bot', text: "Based on these vectors, this aligns with a migraine. Analyzing recent biomarkers..." })
                }
            }
        ]

        let timeouts = []
        sequence.forEach(({ t, action }) => {
            timeouts.push(setTimeout(action, t))
        })

        return () => timeouts.forEach(clearTimeout)
    }, [])

    const addMessage = (msg) => {
        setMessages(prev => [...prev, { id: Date.now(), time: 'Just now', ...msg }])
    }

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight
        }
    }, [messages, isTyping])

    return (
        <div className="w-100 h-100 rounded-4 overflow-hidden position-relative p-0 d-flex flex-column text-white" style={{ background: '#0f172a' }}>

            {/* Header - Fixed to top */}
            <div className="p-3 border-bottom border-white border-opacity-10 d-flex align-items-center gap-3 flex-shrink-0" style={{ background: 'rgba(255,255,255,0.03)' }}>
                <div className="position-relative">
                    <div className="w-10 h-10 rounded-circle d-flex align-items-center justify-content-center text-white" style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}>
                        <Bot size={20} />
                    </div>
                    <div className="position-absolute bottom-0 end-0 w-2.5 h-2.5 bg-emerald-500 rounded-circle border border-slate-900"></div>
                </div>
                <div>
                    <h6 className="fw-bold mb-0 text-sm d-flex align-items-center gap-2">
                        MediLLM <span className="badge bg-indigo-500 bg-opacity-20 text-indigo-300 border border-indigo-500 border-opacity-30 text-[10px] px-1 py-0.5 rounded">BETA</span>
                    </h6>
                    <div className="text-white-50 text-xs">AI Medical Assistant</div>
                </div>
                <div className="ms-auto">
                    <Sparkles size={16} className="text-indigo-400 opacity-50" />
                </div>
            </div>

            {/* Chat Area - Scrollable */}
            <div className="flex-grow-1 p-4 overflow-y-auto custom-scrollbar" ref={scrollRef} style={{ background: 'rgba(0,0,0,0.2)', minHeight: 0 }}>
                <div className="d-flex flex-column gap-3">
                    <AnimatePresence initial={false}>
                        {messages.map((msg) => (
                            <motion.div
                                key={msg.id}
                                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                className={`d-flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
                            >
                                <div className={`w-8 h-8 rounded-circle d-flex align-items-center justify-content-center flex-shrink-0 ${msg.role === 'user' ? 'bg-slate-700' : 'bg-indigo-600'}`}>
                                    {msg.role === 'user' ? <User size={14} /> : <Bot size={14} />}
                                </div>
                                <div className={`p-3 rounded-3 text-sm ${msg.role === 'user' ? 'bg-slate-800 text-white border border-slate-700' : 'bg-indigo-500/10 border border-indigo-500/20 text-indigo-100'}`} style={{ maxWidth: '80%' }}>
                                    {msg.text}
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>

                    {isTyping && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="d-flex gap-3"
                        >
                            <div className="w-8 h-8 rounded-circle bg-indigo-600 d-flex align-items-center justify-content-center flex-shrink-0">
                                <Bot size={14} />
                            </div>
                            <div className="px-3 py-2 rounded-3 bg-indigo-500/10 border border-indigo-500/20 d-flex align-items-center gap-1">
                                <span className="w-1.5 h-1.5 bg-indigo-400 rounded-circle animate-bounce" style={{ animationDelay: '0s' }}></span>
                                <span className="w-1.5 h-1.5 bg-indigo-400 rounded-circle animate-bounce" style={{ animationDelay: '0.2s' }}></span>
                                <span className="w-1.5 h-1.5 bg-indigo-400 rounded-circle animate-bounce" style={{ animationDelay: '0.4s' }}></span>
                            </div>
                        </motion.div>
                    )}
                </div>
            </div>

            {/* Input Area - Fixed at bottom */}
            <div className="p-3 border-top border-white border-opacity-10 flex-shrink-0" style={{ background: 'rgba(255,255,255,0.03)' }}>
                <div className="position-relative">
                    <input
                        type="text"
                        placeholder="Type your symptoms..."
                        disabled
                        className="w-100 px-4 py-2.5 rounded-pill border-0 text-white text-sm focus-ring-0"
                        style={{ background: 'rgba(0,0,0,0.3)', outline: 'none' }}
                    />
                    <button className="position-absolute top-50 end-2 translate-middle-y w-8 h-8 rounded-circle bg-indigo-600 d-flex align-items-center justify-content-center border-0 text-white hover-opacity-90 transition-all">
                        <Send size={14} />
                    </button>
                </div>
            </div>

            <style jsx>{`
                .custom-scrollbar::-webkit-scrollbar { width: 4px; }
                .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 4px; }
            `}</style>
        </div>
    )
}
