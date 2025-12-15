'use client'
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion'
import { useRef, useState } from 'react'
import { Container, Row, Col, Button } from 'react-bootstrap'
import { Zap, Activity, CheckCircle2, UserCheck, ArrowRight, MousePointer2, Stethoscope, HeartPulse, Shield, Video, Users, FileText, PieChart, Lock, MapPin, Brain } from 'lucide-react'
import Link from 'next/link'
import { styles } from '../app/constants/homeConstants'
import { getLandingStats } from '../app/actions/getLandingStats'
import { useEffect } from 'react'

import DemoProfile from './demo/DemoProfile'
import DemoChatbot from './demo/DemoChatbot'
import DemoPrescription from './demo/DemoPrescription'

export default function LandingPage() {
    const targetRef = useRef(null)
    const { scrollYProgress } = useScroll({
        target: targetRef,
        offset: ["start start", "end end"]
    })


    const [activeStep, setActiveStep] = useState(0)
    const [stats, setStats] = useState({ doctors: 500, scans: 12000, users: 10000, precision: 99.8 })

    useEffect(() => {
        getLandingStats().then(setStats)
    }, [])

    // Smooth fade out for hero content as cards scroll over
    const heroOpacity = useTransform(scrollYProgress, [0, 0.2], [1, 0])

    return (
        <div ref={targetRef} className="position-relative bg-slate-900" style={{ minHeight: '100vh' }}>
            {/* Fixed Background - Keeping it consistent */}
            <div className="position-fixed top-0 start-0 w-100 h-100 overflow-hidden" style={{ zIndex: 0, background: '#0f172a' }}>
                <div className="grid-background opacity-20 w-100 h-100"></div>
                <motion.div
                    animate={{ x: [0, 100, 0], y: [0, -50, 0], opacity: [0.3, 0.5, 0.3] }}
                    transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
                    className="position-absolute bg-primary rounded-circle blur-3xl opacity-20"
                    style={{ top: '20%', left: '10%', width: '500px', height: '500px', filter: 'blur(100px)' }}
                />
                <motion.div
                    animate={{ x: [0, -100, 0], y: [0, 50, 0], opacity: [0.2, 0.4, 0.2] }}
                    transition={{ duration: 15, repeat: Infinity, ease: "easeInOut", delay: 2 }}
                    className="position-absolute bg-danger rounded-circle blur-3xl opacity-20"
                    style={{ bottom: '10%', right: '10%', width: '600px', height: '600px', filter: 'blur(120px)' }}
                />
            </div>

            {/* Static Hero Section - Stays fixed while content scrolls over */}
            <motion.section
                style={{
                    height: '100vh',
                    width: '100%',
                    position: 'fixed', // Fixed position for true static bg feel
                    top: 0,
                    left: 0,
                    zIndex: 1, // Lower z-index
                    opacity: heroOpacity, // Fade out as it gets covered
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}
            >
                <Container className="position-relative z-index-2">
                    <Row className="justify-content-center text-center">
                        <Col lg={12} xl={10}>
                            <motion.div
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.8, ease: "easeOut" }}
                            >
                                <div className="d-inline-flex align-items-center px-4 py-2 rounded-pill mb-5 glass-pill border-glow">
                                    <span className="position-relative d-flex h-3 w-3 me-3">
                                        <span className="animate-ping position-absolute d-inline-flex w-100 h-100 rounded-circle bg-success opacity-75"></span>
                                        <span className="position-relative d-inline-flex rounded-circle h-3 w-3 bg-success"></span>
                                    </span>
                                    <span className="text-white small fw-medium tracking-wide text-uppercase">UpcharSaathi AI 2.0 is Live</span>
                                </div>
                                <h1 className="display-1 fw-bold mb-4 text-white tracking-tighter" style={{ fontSize: '5.5rem', lineHeight: '1' }}>
                                    The Future of <br />
                                    <span className="text-gradient-primary">Digital Medicine</span>
                                </h1>
                                <p className="lead text-white-50 mb-5 mx-auto fw-light" style={{ maxWidth: '650px', fontSize: '1.4rem' }}>
                                    Connect with world-class diagnostics and instant care networks through a unified, intelligent operating system for your health.
                                </p>
                                <div className="d-flex justify-content-center gap-4 mb-5">
                                    <Link href="/auth/signup">
                                        <Button size="lg" className="rounded-pill px-5 py-3 fw-bold border-0 btn-glow" style={{ background: '#ef4444' }}>
                                            Start Diagnostics <ArrowRight size={20} className="ms-2" />
                                        </Button>
                                    </Link>
                                    <Link href="/auth/login">
                                        <div className="glass-button rounded-pill px-5 py-3 fw-bold text-white d-flex align-items-center cursor-pointer">
                                            Member Access
                                        </div>
                                    </Link>
                                </div>

                                {/* Trust Badges - HUD Style */}
                                <div className="d-flex flex-wrap justify-content-center gap-4 pt-5" style={{ maxWidth: '900px', margin: '0 auto' }}>
                                    {[
                                        { label: 'Verified Doctors', value: `${stats.doctors}+`, icon: UserCheck },
                                        { label: 'Daily Scans', value: `${stats.scans}+`, icon: Activity },
                                        { label: 'Precision', value: `${stats.precision}%`, icon: CheckCircle2 }
                                    ].map((stat, idx) => (
                                        <div key={idx} className="d-flex align-items-center px-4 py-3 glass-hud rounded-3">
                                            <stat.icon size={20} className="text-danger me-3" />
                                            <div className="text-start lh-1">
                                                <div className="fw-bold text-white h5 mb-1">{stat.value}</div>
                                                <div className="text-white-50 small text-uppercase tracking-wider" style={{ fontSize: '0.7rem' }}>{stat.label}</div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </motion.div>
                        </Col>
                    </Row>
                </Container>
            </motion.section>

            {/* Content Overlay */}
            <div className="position-relative" style={{ zIndex: 20, background: '#0f172a', marginTop: '100vh', paddingTop: '10vh', borderRadius: '4rem 4rem 0 0', borderTop: '1px solid rgba(255,255,255,0.08)', minHeight: '100vh' }}>

                {/* Tools Section */}
                <Container className="py-5 my-5">
                    <Row className="mb-5 text-center">
                        <Col lg={8} className="mx-auto">
                            <h2 className="display-4 fw-bold text-white mb-3">Explore Our Tools</h2>
                            <p className="text-white-50 lead">Powerful AI-driven tools designed to give you complete control over your health journey.</p>
                        </Col>
                    </Row>
                    <Row className="g-4">
                        {[
                            {
                                title: "Health Scanner",
                                desc: "Analyze your symptoms instantly with advanced AI. Get preliminary diagnosis and actionable advice in seconds.",
                                icon: Stethoscope,
                                href: "/health-scanner",
                                tag: "Core",
                                color: '#3b82f6'
                            },
                            {
                                title: "Track Health",
                                desc: "Monitor vital signs, log daily activity, and visualize your long-term health trends with interactive charts.",
                                icon: Activity,
                                href: "/track-health",
                                tag: "Popular",
                                color: '#10b981'
                            },
                            {
                                title: "Find Care",
                                desc: "Locate top-rated specialists, hospitals, and emergency blood banks near you with real-time availability.",
                                icon: MapPin,
                                href: "/find-care",
                                color: '#ef4444'
                            },
                            {
                                title: "AI Insights",
                                desc: "Understand how your environment affects your health. Get personalized alerts and wellness recommendations.",
                                icon: Brain,
                                href: "/ai-health-insights",
                                tag: "New",
                                color: '#06b6d4'
                            },
                            {
                                title: "First Aid",
                                desc: "Quick access to life-saving emergency protocols and step-by-step guides for critical situations.",
                                icon: HeartPulse,
                                href: "/first-aid",
                                color: '#f59e0b'
                            },
                            {
                                title: "Medical Profile",
                                desc: "Securely store and manage your medical records, prescriptions, and history in one centralized vault.",
                                icon: FileText,
                                href: "/profile",
                                color: '#8b5cf6'
                            }
                        ].map((feature, index) => (
                            <Col key={index} xs={12} sm={6} lg={4}>
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: index * 0.1 }}
                                    whileHover={{ y: -5 }}
                                >
                                    <Link href={feature.href} className="text-decoration-none">
                                        <div className="h-100 rounded-4 p-4 position-relative overflow-hidden feature-tool-card" style={{
                                            background: 'rgba(30, 41, 59, 0.4)',
                                            backdropFilter: 'blur(10px)',
                                            border: '1px solid rgba(255, 255, 255, 0.05)'
                                        }}>
                                            <div className="d-flex justify-content-between align-items-start mb-3">
                                                <div className="d-inline-flex align-items-center justify-content-center p-3 rounded-3" style={{ background: `${feature.color}20` }}>
                                                    <feature.icon size={28} style={{ color: feature.color }} />
                                                </div>
                                                {feature.tag && (
                                                    <span className="badge bg-white bg-opacity-10 text-white small px-2 py-1 rounded-pill">
                                                        {feature.tag}
                                                    </span>
                                                )}
                                            </div>

                                            <h5 className="fw-bold text-white mb-2">{feature.title}</h5>
                                            <p className="text-white-50 small mb-4" style={{ lineHeight: '1.6' }}>{feature.desc}</p>

                                            <div className="d-flex align-items-center text-white fw-medium small mt-auto p-2 rounded-3" style={{ background: 'rgba(255, 255, 255, 0.05)', width: 'fit-content' }}>
                                                <span className="me-2">Launch Tool</span>
                                                <ArrowRight size={14} className="text-white-50" />
                                            </div>
                                        </div>
                                    </Link>
                                </motion.div>
                            </Col>
                        ))}
                    </Row>
                </Container>

                {/* Interactive Process Visualization */}
                <Container className="py-5 my-5">
                    <div className="glass-panel p-5 rounded-5 border border-white border-opacity-10 position-relative overflow-hidden">
                        <div className="position-absolute top-0 start-0 w-100 h-1 border-top border-danger opacity-50"></div>
                        <Row className="align-items-center g-5">
                            <Col lg={5}>
                                <div className="d-flex align-items-center gap-2 mb-4">
                                    <div className="w-2 h-2 rounded-circle bg-danger"></div>
                                    <span className="text-danger fw-bold text-uppercase small tracking-widest">Workflow</span>
                                </div>
                                <h2 className="display-5 fw-bold text-white mb-5">Seamless Consultation Loop.</h2>
                                <div className="process-steps">
                                    {[
                                        { step: '01', title: 'Profile Activation', desc: 'Secure biometric onboarding.' },
                                        { step: '02', title: 'AI Triage', desc: 'Instant symptom vector analysis.' },
                                        { step: '03', title: 'Treatment Protocol', desc: 'Digital prescription & recovery.' }
                                    ].map((item, idx) => (
                                        <div
                                            key={idx}
                                            className={`process-step d-flex gap-4 p-4 rounded-4 mb-3 transition-all cursor-pointer ${activeStep === idx ? 'bg-white bg-opacity-10 border border-white border-opacity-10' : ''}`}
                                            onClick={() => setActiveStep(idx)}
                                        >
                                            <span className={`display-6 fw-bold ${activeStep === idx ? 'text-danger' : 'text-white-opacity-20'}`}>{item.step}</span>
                                            <div>
                                                <h4 className={`fw-bold h5 mb-1 ${activeStep === idx ? 'text-white' : 'text-white-50'}`}>{item.title}</h4>
                                                <p className="text-white-50 mb-0 small">{item.desc}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </Col>
                            <Col lg={7}>
                                <div className="rounded-4 overflow-hidden border border-white border-opacity-10 shadow-2xl position-relative box-shadow-glow d-flex flex-column" style={{ background: '#020617', height: '700px' }}>

                                    {/* Browser Chrome */}
                                    <div className="border-bottom border-white border-opacity-05 px-4 py-3 d-flex align-items-center gap-3" style={{ background: 'rgba(255,255,255,0.03)' }}>
                                        <div className="d-flex gap-2">
                                            <div className="rounded-circle bg-danger opacity-50" style={{ width: '10px', height: '10px' }}></div>
                                            <div className="rounded-circle bg-warning opacity-50" style={{ width: '10px', height: '10px' }}></div>
                                            <div className="rounded-circle bg-success opacity-50" style={{ width: '10px', height: '10px' }}></div>
                                        </div>
                                        <div className="flex-grow-1 rounded-pill px-3 py-1 text-center text-white-50 text-xs font-monospace d-flex align-items-center justify-content-center gap-2 border border-white border-opacity-05" style={{ background: 'rgba(0,0,0,0.2)' }}>
                                            <Lock size={10} />
                                            <span>secure.upcharsaathi.ai/patient-portal</span>
                                        </div>
                                    </div>

                                    <div className="flex-grow-1 position-relative bg-slate-950 p-0">
                                        <AnimatePresence mode="wait">
                                            <motion.div
                                                key={activeStep}
                                                initial={{ opacity: 0, x: 20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                exit={{ opacity: 0, x: -20 }}
                                                transition={{ duration: 0.3 }}
                                                className="w-100 h-100"
                                            >
                                                {activeStep === 0 && <DemoProfile />}
                                                {activeStep === 1 && <DemoChatbot />}
                                                {activeStep === 2 && <DemoPrescription />}
                                            </motion.div>
                                        </AnimatePresence>
                                    </div>
                                </div>
                            </Col>
                        </Row>
                    </div>
                </Container>

                {/* Coming Soon Section */}
                <Container className="py-5 my-5">
                    <Row className="mb-5 text-center">
                        <Col lg={8} className="mx-auto">
                            <h2 className="display-4 fw-bold text-white mb-3">Coming Soon</h2>
                            <p className="text-white-50 lead">Next-generation capabilities currently in development for UpcharSaathi Pro.</p>
                        </Col>
                    </Row>
                    <Row className="g-4">
                        {[
                            { title: 'Neural Diagnostics', desc: 'Deep learning models analyze symptoms with clinical precision in milliseconds.', icon: Zap, color: '#f59e0b' },
                            { title: 'Geospatial Care', desc: 'Instant triangulation of nearest emergency services and specialist availability.', icon: Stethoscope, color: '#ef4444' },
                            { title: 'Biometric Sync', desc: 'Real-time telemetry from your wearable devices for continuous monitoring.', icon: Activity, color: '#10b981' },
                            { title: 'Secure Vault', desc: 'Military-grade encryption for your complete medical history and reports.', icon: Shield, color: '#3b82f6' },
                            { title: 'Virtual Triage', desc: 'On-demand video consultations with certified specialists 24/7.', icon: Video, color: '#8b5cf6' },
                            { title: 'Family Health', desc: 'Unified dashboard to manage health profiles for your entire family.', icon: Users, color: '#ec4899' },
                        ].map((item, idx) => (
                            <Col key={idx} md={4}>
                                <div className="p-5 rounded-5 h-100 feature-card-advanced position-relative overflow-hidden group">
                                    <div className="position-absolute top-0 end-0 p-4 opacity-10">
                                        <item.icon size={100} strokeWidth={1} style={{ color: item.color }} />
                                    </div>
                                    <div className="mb-5 d-inline-flex p-3 rounded-2xl glass-icon" style={{ border: `1px solid ${item.color}40`, background: `${item.color}10` }}>
                                        <item.icon size={32} style={{ color: item.color }} />
                                    </div>
                                    <h3 className="h3 fw-bold text-white mb-3">{item.title}</h3>
                                    <p className="text-white-50 mb-4" style={{ lineHeight: '1.7' }}>{item.desc}</p>
                                    <div className="d-flex align-items-center text-white-50 small fw-bold tracking-wide text-uppercase feature-link">
                                        In Development <ArrowRight size={14} className="ms-2" />
                                    </div>
                                </div>
                            </Col>
                        ))}
                    </Row>
                </Container>
            </div>

            <style jsx global>{`
                    .bg-dark-gradient { background: #0b1120; }
                    .bg-dark-surface { background: #0f172a; }
                    
                    .grid-background {
                        background-image: linear-gradient(rgba(255, 255, 255, 0.03) 1px, transparent 1px),
                        linear-gradient(90deg, rgba(255, 255, 255, 0.03) 1px, transparent 1px);
                        background-size: 50px 50px;
                    }
                    
                    .text-gradient-primary {
                        background: linear-gradient(135deg, #ffffff 0%, #94a3b8 100%);
                        -webkit-background-clip: text;
                        -webkit-text-fill-color: transparent;
                    }

                    .glass-pill {
                        background: rgba(255, 255, 255, 0.03);
                        backdrop-filter: blur(10px);
                        border: 1px solid rgba(255, 255, 255, 0.1);
                    }

                    .glass-button {
                        background: rgba(255, 255, 255, 0.05);
                        backdrop-filter: blur(10px);
                        border: 1px solid rgba(255, 255, 255, 0.1);
                        transition: all 0.3s ease;
                    }
                    .glass-button:hover {
                        background: rgba(255, 255, 255, 0.1);
                        border-color: rgba(255, 255, 255, 0.3);
                        transform: translateY(-2px);
                    }

                    .btn-glow {
                        box-shadow: 0 0 20px rgba(239, 68, 68, 0.4);
                        transition: all 0.3s ease;
                    }
                    .btn-glow:hover {
                        box-shadow: 0 0 40px rgba(239, 68, 68, 0.6);
                        transform: translateY(-2px);
                    }

                    .glass-hud {
                        background: rgba(15, 23, 42, 0.6);
                        border: 1px solid rgba(255, 255, 255, 0.05);
                        backdrop-filter: blur(12px);
                    }

                    .feature-card-advanced {
                        background: rgba(30, 41, 59, 0.3);
                        border: 1px solid rgba(255, 255, 255, 0.03);
                        backdrop-filter: blur(20px);
                        transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
                    }
                    .feature-card-advanced:hover {
                        background: rgba(30, 41, 59, 0.5);
                        border-color: rgba(255, 255, 255, 0.1);
                        transform: translateY(-10px);
                        box-shadow: 0 20px 40px -10px rgba(0,0,0,0.5);
                    }
                    .feature-card-advanced:hover .feature-link {
                        color: #ef4444 !important;
                    }

                    .glass-panel {
                        background: rgba(30, 41, 59, 0.2);
                        backdrop-filter: blur(30px);
                    }

                    .process-step:hover {
                        background: rgba(255, 255, 255, 0.03);
                    }
                    .text-white-opacity-20 { color: rgba(255,255,255,0.2); }
                    
                    .box-shadow-glow {
                        box-shadow: 0 0 50px -10px rgba(239, 68, 68, 0.1);
                    }
                    
                    .pulse-ring {
                        animation: pulse-ring 2s infinite;
                    }
                    @keyframes pulse-ring {
                        0% { box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.4); }
                        70% { box-shadow: 0 0 0 15px rgba(239, 68, 68, 0); }
                        100% { box-shadow: 0 0 0 0 rgba(239, 68, 68, 0); }
                    }

                    .h-3 { height: 0.75rem; }
                    .w-3 { width: 0.75rem; }
                    .tracking-wider { letter-spacing: 0.1em; }
                    .tracking-widest { letter-spacing: 0.2em; }
                    
                    .feature-tool-card {
                        transition: all 0.3s ease;
                    }
                    .feature-tool-card:hover {
                        background: rgba(30, 41, 59, 0.6) !important;
                        border-color: rgba(255, 255, 255, 0.1) !important;
                        transform: translateY(-5px);
                        box-shadow: 0 10px 40px -10px rgba(0,0,0,0.5) !important;
                    }
                `}</style>
        </div>
    )
}
