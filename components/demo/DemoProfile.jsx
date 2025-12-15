'use client'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { User, Heart, Activity, Calendar, Shield } from 'lucide-react'

export default function DemoProfile() {
    const [activeTab, setActiveTab] = useState('overview')

    return (
        <div className="w-100 h-100 rounded-4 overflow-hidden position-relative p-0 d-flex flex-column text-white" style={{ background: 'linear-gradient(145deg, rgba(30, 41, 59, 0.4), rgba(15, 23, 42, 0.6))', backdropFilter: 'blur(20px)' }}>

            {/* Minimal Header */}
            <div className="p-4 border-bottom border-white border-opacity-10 d-flex align-items-center gap-4 flex-shrink-0">
                <div className="position-relative">
                    <div className="w-12 h-12 rounded-circle d-flex align-items-center justify-content-center overflow-hidden border border-white border-opacity-20 shadow-sm" style={{ background: 'rgba(255,255,255,0.1)' }}>
                        <User size={24} className="text-white opacity-80" />
                    </div>
                    <div className="position-absolute bottom-0 end-0 w-3 h-3 bg-emerald-500 rounded-circle border border-slate-900"></div>
                </div>
                <div className="flex-grow-1">
                    <h5 className="fw-bold mb-0 tracking-tight">Alex Chen</h5>
                    <div className="d-flex align-items-center gap-2 text-white-50 text-xs">
                        <Shield size={10} />
                        <span className="tracking-wider">VERIFIED MEMBER</span>
                    </div>
                </div>
            </div>

            {/* Content Container - Scrollable */}
            <div className="flex-grow-1 p-4 d-flex flex-column gap-4 overflow-y-auto custom-scrollbar">
                {/* Tabs */}
                <div className="d-flex p-1 rounded-3 w-100 flex-shrink-0" style={{ background: 'rgba(0,0,0,0.2)' }}>
                    {['overview', 'vitals', 'history'].map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`flex-grow-1 py-2 rounded-2 text-xs fw-bold text-uppercase tracking-wider border-0 transition-all ${activeTab === tab
                                    ? 'text-white shadow-sm'
                                    : 'bg-transparent text-white-50 hover:text-white'
                                }`}
                            style={{ background: activeTab === tab ? 'rgba(255,255,255,0.1)' : 'transparent' }}
                        >
                            {tab}
                        </button>
                    ))}
                </div>

                {/* Tab Content */}
                <div className="flex-grow-1 position-relative">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeTab}
                            initial={{ opacity: 0, scale: 0.98 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.98 }}
                            transition={{ duration: 0.2 }}
                            className="h-100"
                        >
                            {activeTab === 'overview' && (
                                <div className="d-flex flex-column gap-3">
                                    <div className="p-3 rounded-3 border border-white border-opacity-05 d-flex align-items-center justify-content-between" style={{ background: 'rgba(255,255,255,0.05)' }}>
                                        <div className="d-flex align-items-center gap-3">
                                            <div className="p-2 rounded-circle text-rose-400" style={{ background: 'rgba(244, 63, 94, 0.2)' }}>
                                                <Heart size={18} />
                                            </div>
                                            <div>
                                                <div className="text-white-50 text-xs text-uppercase mb-0">Health Score</div>
                                                <div className="fw-bold h5 mb-0">92<span className="text-white-50 text-sm fw-normal">/100</span></div>
                                            </div>
                                        </div>
                                        <div className="text-emerald-400 text-xs fw-bold px-2 py-1 rounded" style={{ background: 'rgba(16, 185, 129, 0.1)' }}>+2.4%</div>
                                    </div>

                                    <div className="row g-3">
                                        <div className="col-6">
                                            <div className="p-3 rounded-3 border border-white border-opacity-05 text-center" style={{ background: 'rgba(255,255,255,0.05)' }}>
                                                <div className="text-white-50 text-xs text-uppercase mb-1">Age</div>
                                                <div className="fw-bold fs-5">28</div>
                                            </div>
                                        </div>
                                        <div className="col-6">
                                            <div className="p-3 rounded-3 border border-white border-opacity-05 text-center" style={{ background: 'rgba(255,255,255,0.05)' }}>
                                                <div className="text-white-50 text-xs text-uppercase mb-1">Blood</div>
                                                <div className="fw-bold fs-5">O+</div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Mock Extra Content to demonstrate scroll */}
                                    <div className="p-3 rounded-3 border border-white border-opacity-05 mt-2" style={{ background: 'rgba(255,255,255,0.02)' }}>
                                        <div className="text-white-50 text-xs text-uppercase mb-2">Upcoming</div>
                                        <div className="d-flex align-items-center gap-2">
                                            <Calendar size={14} className="text-indigo-400" />
                                            <span className="text-sm">Annual Dental Checkup</span>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {activeTab === 'vitals' && (
                                <div className="d-flex flex-column gap-2">
                                    {[
                                        { label: 'Heart Rate', val: '72 bpm', col: 'text-rose-400', icon: Activity },
                                        { label: 'Blood Pressure', val: '120/80', col: 'text-blue-400' },
                                        { label: 'Oxygen Level', val: '98%', col: 'text-emerald-400' },
                                        { label: 'Glucose', val: '95 mg/dL', col: 'text-yellow-400' },
                                        { label: 'Temp', val: '98.6°F', col: 'text-slate-200' },
                                    ].map((v, i) => (
                                        <div key={i} className="d-flex justify-content-between align-items-center p-3 rounded-3 border border-white border-opacity-05 hover-bg-shine transition-all" style={{ background: 'rgba(255,255,255,0.05)' }}>
                                            <span className="text-white-50 text-sm">{v.label}</span>
                                            <span className={`fw-bold font-monospace ${v.col}`}>{v.val}</span>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {activeTab === 'history' && (
                                <div className="d-flex flex-column justify-content-center align-items-center h-100 text-center opacity-50 py-4">
                                    <div className="p-3 rounded-circle mb-3" style={{ background: 'rgba(255,255,255,0.05)' }}>
                                        <Calendar size={24} className="text-white-50" />
                                    </div>
                                    <small className="text-white-50">No recent medical incidents recorded.</small>
                                </div>
                            )}
                        </motion.div>
                    </AnimatePresence>
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
