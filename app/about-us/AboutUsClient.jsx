"use client"

import React from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import { motion } from 'framer-motion';
import { Heart, Users, Shield, Cpu, Activity, Globe, Stethoscope, Award } from 'lucide-react';

const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
};

const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.2
        }
    }
};

export default function AboutUsClient() {
    return (
        <div className="min-vh-100 py-5" style={{ background: 'linear-gradient(to right, #fef2f2, #ffe4e6, #fef2f2)' }}>
            <Container>
                {/* Hero Section */}
                <motion.div
                    initial="hidden"
                    animate="visible"
                    variants={fadeIn}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-5"
                >
                    <div className="d-inline-flex align-items-center justify-content-center p-3 rounded-circle mb-4 shadow-sm" style={{ background: 'white' }}>
                        <Heart size={40} className="text-danger" />
                    </div>
                    <h1 className="display-4 fw-bold mb-4" style={{
                        background: 'linear-gradient(to right, #dc2626, #fb7185)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent'
                    }}>
                        Revolutionizing Healthcare Access
                    </h1>
                    <p className="lead text-muted mx-auto" style={{ maxWidth: '700px' }}>
                        UpcharSaathi combines advanced AI technology with compassionate care to bring reliable medical guidance to your fingertips.
                    </p>
                </motion.div>

                {/* Core Values Grid */}
                <motion.div
                    variants={staggerContainer}
                    initial="hidden"
                    animate="visible"
                >
                    <Row className="g-4 mb-5">
                        {[
                            {
                                icon: Globe,
                                title: "Our Mission",
                                content: "To democratize healthcare by providing accessible, accurate, and instant medical insights to everyone, everywhere.",
                                color: "primary"
                            },
                            {
                                icon: Users,
                                title: "Expert Team",
                                content: "Built by a diverse team of medical professionals, data scientists, and engineers dedicated to your well-being.",
                                color: "success"
                            },
                            {
                                icon: Shield,
                                title: "Privacy First",
                                content: "Your health data is sacred. We employ state-of-the-art encryption to ensure your personal information remains private and secure.",
                                color: "info"
                            },
                            {
                                icon: Cpu,
                                title: "AI-Powered",
                                content: "Leveraging cutting-edge machine learning algorithms to analyze symptoms and provide personalized health recommendations.",
                                color: "warning"
                            }
                        ].map((item, index) => (
                            <Col md={6} lg={3} key={index}>
                                <motion.div variants={fadeIn} className="h-100">
                                    <Card className="h-100 border-0 shadow-sm hover-shadow transition-all" style={{ borderRadius: '1rem' }}>
                                        <Card.Body className="p-4 text-center">
                                            <div className={`d-inline-flex p-3 rounded-circle bg-${item.color} bg-opacity-10 text-${item.color} mb-3`}>
                                                <item.icon size={24} />
                                            </div>
                                            <h5 className="fw-bold mb-3">{item.title}</h5>
                                            <p className="text-muted small mb-0">
                                                {item.content}
                                            </p>
                                        </Card.Body>
                                    </Card>
                                </motion.div>
                            </Col>
                        ))}
                    </Row>
                </motion.div>

                {/* Stats Section */}
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    className="py-5 my-5 rounded-4 text-white position-relative overflow-hidden"
                    style={{ background: 'linear-gradient(135deg, #dc2626 0%, #be123c 100%)' }}
                >
                    <div className="position-absolute top-0 start-0 w-100 h-100" style={{ background: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'0.1\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")' }} />
                    <Container className="position-relative z-1">
                        <Row className="text-center g-4">
                            <Col md={4}>
                                <div className="display-4 fw-bold mb-2">24/7</div>
                                <div className="text-white-50">AI Availability</div>
                            </Col>
                            <Col md={4}>
                                <div className="display-4 fw-bold mb-2">100%</div>
                                <div className="text-white-50">Data Privacy</div>
                            </Col>
                            <Col md={4}>
                                <div className="display-4 fw-bold mb-2">50+</div>
                                <div className="text-white-50">Medical Conditions Covered</div>
                            </Col>
                        </Row>
                    </Container>
                </motion.div>

                {/* Story Section */}
                <Row className="justify-content-center">
                    <Col lg={10}>
                        <Card className="border-0 shadow-lg overflow-hidden" style={{ borderRadius: '1.5rem' }}>
                            <Row className="g-0">
                                <Col md={5} className="bg-light d-flex align-items-center justify-content-center p-5 text-center">
                                    <div>
                                        <Award size={64} className="text-danger mb-3" />
                                        <h3 className="fw-bold text-dark">Why Choose Us?</h3>
                                        <p className="text-muted">Because your health deserves the best technology and care.</p>
                                    </div>
                                </Col>
                                <Col md={7} className="p-5">
                                    <h4 className="fw-bold mb-4">Our Story</h4>
                                    <p className="text-muted mb-4">
                                        UpcharSaathi was born from a simple idea: that quality healthcare advice should be accessible to everyone, regardless of their location or time of day.
                                    </p>
                                    <p className="text-muted mb-4">
                                        We recognized that in emergency situations or for general health queries, people often struggle to find reliable information. By bridging the gap between medical expertise and artificial intelligence, we created a platform that empowers you to make informed decisions about your health.
                                    </p>
                                    <div className="d-flex align-items-center gap-3">
                                        <div className="d-flex align-items-center gap-2">
                                            <Activity className="text-danger" size={20} />
                                            <span className="fw-medium">Real-time Analysis</span>
                                        </div>
                                        <div className="vr" />
                                        <div className="d-flex align-items-center gap-2">
                                            <Stethoscope className="text-danger" size={20} />
                                            <span className="fw-medium">Doctor Verified</span>
                                        </div>
                                    </div>
                                </Col>
                            </Row>
                        </Card>
                    </Col>
                </Row>
            </Container>

            <style jsx global>{`
                .hover-shadow:hover {
                    transform: translateY(-5px);
                    box-shadow: 0 1rem 3rem rgba(0,0,0,.175)!important;
                }
            `}</style>
        </div>
    );
}
