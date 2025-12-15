'use client'
import { FileText, Download, Share2, Pill, Check } from 'lucide-react'

export default function DemoPrescription() {
    return (
        <div className="w-100 h-100 rounded-4 overflow-hidden position-relative p-0 d-flex flex-column text-white" style={{ background: '#0b1120' }}>
            {/* Header - Fixed */}
            <div className="px-4 py-3 border-bottom border-white border-opacity-10 d-flex justify-content-between align-items-center flex-shrink-0" style={{ background: 'rgba(255,255,255,0.05)' }}>
                <div className="d-flex align-items-center gap-3">
                    <div className="p-2 text-indigo-400 rounded-2" style={{ background: 'rgba(99, 102, 241, 0.2)' }}>
                        <FileText size={18} />
                    </div>
                    <div>
                        <h6 className="fw-bold mb-0 text-sm">e-Prescription</h6>
                        <span className="text-white-50 text-xs font-monospace">#RX-889</span>
                    </div>
                </div>
                <span className="d-flex align-items-center gap-1 px-2 py-1 rounded text-emerald-400 text-xs fw-bold border border-emerald-500 border-opacity-20" style={{ background: 'rgba(16, 185, 129, 0.1)' }}>
                    <Check size={12} /> Valid
                </span>
            </div>

            {/* Doctor Section - Fixed */}
            <div className="p-4 border-bottom border-white border-opacity-05 flex-shrink-0">
                <div className="d-flex align-items-center gap-3">
                    <div className="w-10 h-10 rounded-circle d-flex align-items-center justify-content-center border border-white border-opacity-10" style={{ background: 'rgba(255,255,255,0.1)' }}>
                        <span className="fw-bold text-white-50">DH</span>
                    </div>
                    <div>
                        <h6 className="fw-bold text-sm mb-0">Dr. Sarah Jensen, MD</h6>
                        <div className="text-white-50 text-xs">Cardiology Specialist</div>
                    </div>
                </div>
            </div>

            {/* Meds - Scrollable */}
            <div className="flex-grow-1 p-4 overflow-y-auto custom-scrollbar">
                <div className="text-white-50 text-xs text-uppercase tracking-wider mb-3">Prescribed Medications</div>
                <div className="d-flex flex-column gap-2">
                    {[
                        { name: 'Amoxicillin', dose: '500mg', freq: '3x daily', days: '7 days' },
                        { name: 'Paracetamol', dose: '650mg', freq: 'As needed', days: '5 days' },
                        { name: 'Cetirizine', dose: '10mg', freq: '1x daily', days: '14 days' },
                        { name: 'Vitamin D3', dose: '60000 IU', freq: '1x weekly', days: '8 weeks' }
                    ].map((med, i) => (
                        <div key={i} className="p-3 rounded-3 border border-white border-opacity-05 hover-bg-shine transition-all" style={{ background: 'rgba(255,255,255,0.05)' }}>
                            <div className="d-flex justify-content-between mb-2">
                                <span className="fw-bold text-white text-sm">{med.name}</span>
                                <span className="px-2 py-0.5 rounded text-white-50 text-xs" style={{ background: 'rgba(255,255,255,0.1)' }}>{med.dose}</span>
                            </div>
                            <div className="d-flex align-items-center gap-2 text-white-50 text-xs">
                                <Pill size={12} />
                                <span>Take {med.freq} • {med.days}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Actions - Fixed */}
            <div className="p-3 border-top border-white border-opacity-10 d-flex gap-2 flex-shrink-0" style={{ background: 'rgba(255,255,255,0.05)' }}>
                <button className="flex-grow-1 py-2 rounded-2 bg-danger text-white text-sm fw-bold border-0 hover-brightness transition-all d-flex align-items-center justify-content-center gap-2">
                    <Download size={14} /> Download PDF
                </button>
                <button className="px-3 py-2 rounded-2 text-white border border-white border-opacity-10 hover-bg-opacity-10 transition-all" style={{ background: 'rgba(255,255,255,0.05)' }}>
                    <Share2 size={16} />
                </button>
            </div>

            <style jsx>{`
                .custom-scrollbar::-webkit-scrollbar { width: 4px; }
                .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 4px; }
            `}</style>
        </div>
    )
}
