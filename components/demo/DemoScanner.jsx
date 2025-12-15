'use client'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Scan, CheckCircle, Wifi, Database, Activity, Cpu } from 'lucide-react'

export default function DemoScanner() {
    const [isScanning, setIsScanning] = useState(false)
    const [scanState, setScanState] = useState('idle') // idle, scanning, analyzing, result
    const [progress, setProgress] = useState(0)

    const startScan = () => {
        setIsScanning(true)
        setScanState('scanning')
        setProgress(0)
    }

    useEffect(() => {
        if (isScanning && scanState === 'scanning') {
            const interval = setInterval(() => {
                setProgress(prev => {
                    if (prev >= 100) {
                        clearInterval(interval)
                        setScanState('analyzing')
                        return 100
                    }
                    return prev + 2
                })
            }, 30)
            return () => clearInterval(interval)
        }

        if (scanState === 'analyzing') {
            const timeout = setTimeout(() => {
                setScanState('result')
                setIsScanning(false)
            }, 1500)
            return () => clearTimeout(timeout)
        }
    }, [isScanning, scanState])

    return (
        <div className="w-100 h-100 rounded-4 overflow-hidden position-relative p-0 d-flex flex-column align-items-center justify-content-center text-center" style={{ background: '#0f172a' }}>
            {/* Technical Grid Background */}
            <div className="position-absolute top-0 start-0 w-100 h-100 opacity-10 pointer-events-none"
                style={{
                    backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.05) 1px, transparent 1px)',
                    backgroundSize: '40px 40px'
                }}>
            </div>

            <AnimatePresence mode="wait">
                {scanState === 'idle' && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="d-flex flex-column align-items-center gap-4 z-10 p-5"
                    >
                        <div className="position-relative">
                            <div className="w-20 h-20 rounded-circle border border-white border-opacity-10 d-flex align-items-center justify-content-center box-shadow-glow" style={{ background: 'rgba(255,255,255,0.05)' }}>
                                <Scan size={32} className="text-white opacity-80" />
                            </div>
                            <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                                className="position-absolute -inset-4 border border-dashed border-white border-opacity-10 rounded-circle w-100 h-100"
                                style={{ top: '-10%', left: '-10%', width: '120%', height: '120%' }}
                            />
                        </div>
                        <div>
                            <h4 className="text-white fw-bold mb-1">AI Diagnostic Engine</h4>
                            <p className="text-white-50 text-sm mb-4">Initialize symptom vector analysis</p>
                            <button
                                onClick={startScan}
                                className="px-5 py-2 rounded-pill bg-white text-dark fw-bold border-0 hover-opacity-90 transition-all text-sm tracking-wide"
                            >
                                INITIALIZE SCAN
                            </button>
                        </div>
                    </motion.div>
                )}

                {(scanState === 'scanning' || scanState === 'analyzing') && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="w-100 px-5 z-10"
                        style={{ maxWidth: '320px' }}
                    >
                        <div className="d-flex justify-content-between mb-2 text-xs text-white-50 font-monospace tracking-widest">
                            <span>{scanState === 'scanning' ? 'ACQUIRING...' : 'PROCESSING...'}</span>
                            <span>{progress}%</span>
                        </div>
                        <div className="h-1 w-100 mb-4 overflow-hidden" style={{ background: 'rgba(255,255,255,0.1)' }}>
                            <motion.div
                                className="h-100 bg-white"
                                initial={{ width: 0 }}
                                animate={{ width: `${progress}%` }}
                            />
                        </div>

                        <div className="d-flex flex-column gap-3 mt-4">
                            {[
                                { icon: Wifi, text: 'Neural Net Connection' },
                                { icon: Database, text: 'Medical Records Sync' },
                                { icon: Cpu, text: 'Pattern Recognition' }
                            ].map((item, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{
                                        opacity: (scanState === 'analyzing' || progress > (i + 1) * 30) ? 1 : 0.2,
                                        x: 0
                                    }}
                                    className="d-flex align-items-center gap-3"
                                >
                                    <item.icon size={14} className={scanState === 'analyzing' || progress > (i + 1) * 30 ? "text-emerald-400" : "text-white-50"} />
                                    <span className="text-white text-xs tracking-wide">{item.text}</span>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                )}

                {scanState === 'result' && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="d-flex flex-column align-items-center gap-4 z-10 w-100 px-5"
                        style={{ maxWidth: '320px' }}
                    >
                        <div className="text-center">
                            <div className="d-inline-flex p-3 rounded-circle text-emerald-400 mb-3 border border-emerald-500 border-opacity-20" style={{ background: 'rgba(16, 185, 129, 0.1)' }}>
                                <CheckCircle size={32} />
                            </div>
                            <h4 className="text-white fw-bold mb-1">Analysis Complete</h4>
                            <p className="text-white-50 text-xs text-uppercase tracking-widest">System Nominal</p>
                        </div>

                        <div className="rounded-1 p-3 w-100 border border-white border-opacity-05" style={{ background: 'rgba(255,255,255,0.05)' }}>
                            <div className="d-flex justify-content-between align-items-center mb-2">
                                <span className="text-white-50 text-xs">Risk Factor</span>
                                <span className="text-emerald-400 text-xs fw-bold">LOW (12%)</span>
                            </div>
                            <div className="w-100 h-1 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.1)' }}>
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: '12%' }}
                                    transition={{ delay: 0.2, duration: 0.5 }}
                                    className="h-100 bg-emerald-500"
                                />
                            </div>
                        </div>

                        <button
                            onClick={() => setScanState('idle')}
                            className="text-white-50 text-xs hover:text-white transition-colors border-bottom border-transparent hover:border-white pb-1 bg-transparent"
                        >
                            Reset Analysis
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}
