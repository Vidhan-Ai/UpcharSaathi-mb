'use client'

import { useState, useEffect } from 'react'
import { Container, Row, Col, Card } from 'react-bootstrap'
import { motion } from 'framer-motion'
import {
    Activity,
    Stethoscope,
    MapPin,
    HeartPulse,
    Brain,
    FileText,
    Video,
    ArrowRight,
    Calculator
} from 'lucide-react'
import Link from 'next/link'

const Dashboard = ({ user }) => {

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    }

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: {
                type: "spring",
                stiffness: 100
            }
        }
    }

    const stats = [
        {
            label: 'Steps Today',
            value: '0',
            unit: 'steps',
            color: '#3b82f6' // Blue
        },
        {
            label: 'Distance',
            value: '0.00',
            unit: 'km',
            color: '#10b981' // Green
        },
        {
            label: 'Energy Burned',
            value: '0',
            unit: 'kcal',
            color: '#f59e0b' // Amber
        },
        {
            label: 'Weight',
            value: '--',
            unit: 'kg',
            color: '#8b5cf6' // Purple
        }
    ]

    const features = [
        {
            title: "Health Scanner",
            desc: "Analyze your symptoms instantly with advanced AI. Get preliminary diagnosis and actionable advice in seconds.",
            icon: Stethoscope,
            color: "text-primary",
            bg: "bg-primary",
            href: "/health-scanner",
            tag: "Core"
        },
        {
            title: "Track Health",
            desc: "Monitor vital signs, log daily activity, and visualize your long-term health trends with interactive charts.",
            icon: Activity,
            color: "text-success",
            bg: "bg-success",
            href: "/track-health",
            tag: "Popular"
        },
        {
            title: "Find Care",
            desc: "Locate top-rated specialists, hospitals, and emergency blood banks near you with real-time availability.",
            icon: MapPin,
            color: "text-danger",
            bg: "bg-danger",
            href: "/find-care"
        },
        {
            title: "AI Insights",
            desc: "Understand how your environment affects your health. Get personalized alerts and wellness recommendations.",
            icon: Brain,
            color: "text-info",
            bg: "bg-info",
            href: "/ai-health-insights",
            tag: "New"
        },
        {
            title: "Wellness Tools",
            desc: "Smart calculators for BMI, Hydration, and personalized health reports to keep you on track.",
            icon: Calculator,
            color: "text-primary",
            bg: "bg-primary",
            href: "/health-tools",
            tag: "Updated"
        },
        {
            title: "First Aid Guide",
            desc: "Quick access to life-saving emergency protocols and step-by-step guides for critical situations.",
            icon: HeartPulse,
            color: "text-warning",
            bg: "bg-warning",
            href: "/first-aid"
        },
        {
            title: "Video Consultation",
            desc: "Connect with certified medical specialists for instant video consultations from the comfort of home.",
            icon: Video,
            color: "text-purple",
            bg: "bg-purple",
            href: "/video-consultation",
            tag: "Beta"
        },
        {
            title: "My Medical Profile",
            desc: "Securely store and manage your medical records, prescriptions, and history in one centralized vault.",
            icon: FileText,
            color: "text-white",
            bg: "bg-dark",
            href: "/profile"
        }
    ]

    return (
        <Container className="py-5">
            <motion.div
                initial="hidden"
                animate="visible"
                variants={containerVariants}
            >
                {/* Header Section */}
                <div className="mb-5 d-flex flex-column flex-md-row justify-content-between align-items-md-end">
                    <div>
                        <motion.h1
                            className="display-5 fw-bold mb-2 text-white"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                        >
                            Welcome back{user?.displayName ? `, ${user.displayName}` : ''}
                        </motion.h1>
                        <p className="text-white-50 lead mb-0" style={{ maxWidth: '600px' }}>
                            Your health command center is ready. Here's your overview for today.
                        </p>
                    </div>
                    <div className="mt-4 mt-md-0 text-md-end">
                        <p className="text-white-50 small mb-1">{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                    </div>
                </div>

                {/* Quick Stats Widget */}
                <Row className="g-3 mb-5">
                    {stats.map((stat, idx) => (
                        <Col key={idx} xs={6} md={3}>
                            <motion.div
                                whileHover={{ scale: 1.02 }}
                                className="p-3 h-100 rounded-4 border border-secondary border-opacity-25"
                                style={{ background: 'rgba(30, 41, 59, 0.4)', backdropFilter: 'blur(10px)' }}
                            >
                                <p className="text-white-50 small mb-1">{stat.label}</p>
                                <div className="d-flex align-items-baseline">
                                    <h3 className="fw-bold text-white mb-0 me-1">{stat.value}</h3>
                                    <span className="small" style={{ color: stat.color }}>{stat.unit}</span>
                                </div>
                            </motion.div>
                        </Col>
                    ))}
                </Row>

                {/* Daily Tip Banner */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-4 rounded-4 mb-5 position-relative overflow-hidden border border-primary border-opacity-25"
                    style={{ background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.8) 0%, rgba(30, 41, 59, 0.8) 100%)' }}
                >
                    <div className="position-relative z-1">
                        <span className="badge bg-primary bg-opacity-25 text-primary mb-2">Daily Tip</span>
                        <h4 className="text-white mb-2">Hydration is Key!</h4>
                        <p className="text-white-50 mb-0" style={{ maxWidth: '700px' }}>
                            Drinking adequate water helps maintain the balance of body fluids. Your body is composed of about 60% water, and functions like digestion, absorption, circulation, and maintenance of body temperature rely on it.
                        </p>
                    </div>
                    <div className="position-absolute top-0 end-0 p-4 opacity-10">
                        <Activity size={120} className="text-primary" />
                    </div>
                </motion.div>

                <h4 className="text-white fw-bold mb-4">Your Tools</h4>
                <Row className="g-4 mb-5">
                    {features.map((feature, index) => (
                        <Col key={index} xs={12} sm={6} lg={4} xl={3}>
                            <motion.div variants={itemVariants} whileHover={{ y: -5 }}>
                                <Link href={feature.href} className="text-decoration-none">
                                    <Card className="h-100 border-0 shadow-sm overflow-hidden custom-card" style={{
                                        borderRadius: '24px',
                                        background: 'rgba(30, 41, 59, 0.4)',
                                        backdropFilter: 'blur(10px)',
                                        border: '1px solid rgba(255, 255, 255, 0.05)'
                                    }}>
                                        <Card.Body className="p-4 d-flex flex-column">
                                            <div className="d-flex justify-content-between align-items-start mb-3">
                                                <div className={`d-inline-flex align-items-center justify-content-center p-3 rounded-2xl bg-opacity-10 ${feature.bg} bg-opacity-10`} style={{ borderRadius: '16px' }}>
                                                    <feature.icon className={feature.color} size={28} />
                                                </div>
                                                {feature.tag && (
                                                    <span className={`badge ${feature.tag === 'New' ? 'bg-info' : feature.tag === 'Core' ? 'bg-primary' : 'bg-secondary'} bg-opacity-25 text-white small px-2 py-1 rounded-pill`}>
                                                        {feature.tag}
                                                    </span>
                                                )}
                                            </div>

                                            <h5 className="fw-bold text-white mb-2">{feature.title}</h5>
                                            <p className="text-white-50 small mb-4 flex-grow-1" style={{ lineHeight: '1.6' }}>{feature.desc}</p>

                                            <div className="d-flex align-items-center text-white fw-medium small mt-auto group-hover-arrow p-2 rounded-3" style={{ background: 'rgba(255, 255, 255, 0.05)', width: 'fit-content' }}>
                                                <span className="me-2">Launch Tool</span>
                                                <ArrowRight size={14} className="text-white-50" />
                                            </div>
                                        </Card.Body>
                                    </Card>
                                </Link>
                            </motion.div>
                        </Col>
                    ))}
                </Row>

                {/* Upgrade/Promo Banner */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center p-5 rounded-4 border border-secondary border-opacity-25 position-relative overflow-hidden"
                    style={{ background: 'rgba(15, 23, 42, 0.6)' }}
                >
                    <div className="position-relative z-1">
                        <h3 className="text-white fw-bold mb-3">Upgrade to UpcharSaathi Pro</h3>
                        <p className="text-white-50 mb-4 mx-auto" style={{ maxWidth: '600px' }}>
                            Unlock unlimited AI consultations, advanced health tracking analytics, and priority video support with verified specialists.
                        </p>
                        <button className="btn btn-primary px-4 py-2 rounded-pill fw-medium">
                            Explore Premium Plans
                        </button>
                    </div>
                </motion.div>
            </motion.div>

            <style jsx global>{`
                .bg-purple { background-color: #6f42c1 !important; }
                .text-purple { color: #6f42c1 !important; }
                .custom-card {
                    transition: all 0.3s ease;
                }
                .custom-card:hover {
                    background: rgba(30, 41, 59, 0.6) !important;
                    border-color: rgba(239, 68, 68, 0.3) !important;
                    transform: translateY(-5px);
                    box-shadow: 0 10px 40px -10px rgba(0,0,0,0.5) !important;
                }
            `}</style>
        </Container>
    )
}

export default Dashboard
