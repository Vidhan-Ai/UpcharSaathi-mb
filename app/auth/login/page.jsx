'use client'
import { SignIn } from "@stackframe/stack";
import { Container, Row, Col } from "react-bootstrap";
import { motion } from 'framer-motion';
import { Activity, Stethoscope } from 'lucide-react';

export default function Login() {
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
                    <Col md={6} lg={5}>
                        <div className="animate-fade-in" style={{
                            background: '#ffffff',
                            border: '1px solid #fecaca',
                            borderRadius: '1rem',
                            padding: '2rem',
                            boxShadow: '0 10px 30px rgba(220, 38, 38, 0.1)'
                        }}>
                            <div className="d-flex justify-content-center mb-4">
                                <div className="bg-danger bg-opacity-10 p-3 rounded-circle">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#dc2626" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" /><polyline points="10 17 15 12 10 7" /><line x1="15" y1="12" x2="3" y2="12" /></svg>
                                </div>
                            </div>

                            {/* Stack Auth Component */}
                            <div className="stack-auth-wrapper">
                                <SignIn fullPage={false} />
                            </div>
                        </div>
                    </Col>
                </Row>
            </Container>
        </div>
    )
}
