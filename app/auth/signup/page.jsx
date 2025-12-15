'use client'
import { SignUp } from "@stackframe/stack";
import { Container, Row, Col } from "react-bootstrap";
import { motion } from 'framer-motion';
import { Activity, Stethoscope } from 'lucide-react';

export default function Signup() {
    return (
        <div className="flex-grow-1 d-flex align-items-center justify-content-center position-relative py-5 overflow-hidden" style={{ zIndex: 1 }}>
            {/* Background Elements */}
            <div className="position-absolute w-100 h-100" style={{ zIndex: -1, opacity: 0.05, top: 0, left: 0 }}>
                <motion.div
                    animate={{
                        rotate: 360,
                        scale: [1, 1.2, 1],
                    }}
                    transition={{
                        duration: 20,
                        repeat: Infinity,
                        ease: "linear"
                    }}
                    style={{ position: 'absolute', top: '10%', left: '10%' }}
                >
                    <Activity size={200} className="text-danger" />
                </motion.div>
                <motion.div
                    animate={{
                        y: [0, -50, 0],
                        rotate: -10
                    }}
                    transition={{
                        duration: 10,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                    style={{ position: 'absolute', bottom: '15%', right: '10%' }}
                >
                    <Stethoscope size={250} className="text-primary" />
                </motion.div>
            </div>

            <Container>
                <Row className="justify-content-center">
                    <Col md={8} lg={6}>
                        <div className="animate-fade-in">
                            <div className="stack-auth-wrapper">
                                <div className="d-flex justify-content-center mb-4">
                                    <div className="d-inline-flex justify-content-center align-items-center p-3 rounded-circle" style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)' }}>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="8.5" cy="7" r="4" /><line x1="20" y1="8" x2="20" y2="14" /><line x1="23" y1="11" x2="17" y2="11" /></svg>
                                    </div>
                                </div>
                                <SignUp fullPage={false} />
                            </div>
                        </div>
                    </Col>
                </Row>
            </Container>
        </div>
    )
}
