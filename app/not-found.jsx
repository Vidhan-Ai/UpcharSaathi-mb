'use client'

import Link from 'next/link'
import { Button, Container } from 'react-bootstrap'
import { motion } from 'framer-motion'
import { Activity, HeartPulse, Stethoscope, Home } from 'lucide-react'

export default function NotFound() {
    return (
        <Container className="d-flex flex-column align-items-center justify-content-center min-vh-100 text-center overflow-hidden position-relative">
            {/* Background Elements */}
            <div className="position-absolute w-100 h-100" style={{ zIndex: -1, opacity: 0.05 }}>
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

            {/* Main Content */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
            >
                <div className="d-flex align-items-center justify-content-center mb-4 position-relative">
                    <motion.h1
                        className="display-1 fw-bold mb-0"
                        style={{
                            fontSize: '10rem',
                            background: 'linear-gradient(135deg, #dc2626, #fb7185)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            lineHeight: 1
                        }}
                    >
                        4
                    </motion.h1>
                    <motion.div
                        animate={{ scale: [1, 1.1, 1] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                        className="mx-3"
                    >
                        <HeartPulse size={120} className="text-danger" />
                    </motion.div>
                    <motion.h1
                        className="display-1 fw-bold mb-0"
                        style={{
                            fontSize: '10rem',
                            background: 'linear-gradient(135deg, #dc2626, #fb7185)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            lineHeight: 1
                        }}
                    >
                        4
                    </motion.h1>
                </div>

                <motion.h2
                    className="h1 fw-bold mb-3 text-dark"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                >
                    Emergency! Page Not Found
                </motion.h2>

                <motion.p
                    className="lead text-muted mb-5 mx-auto"
                    style={{ maxWidth: '500px' }}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                >
                    The page you're looking for seems to have flatlined. Don't worry, our team is performing CPR on the link, but for now, let's get you back to safety.
                </motion.p>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7 }}
                >
                    <Link href="/" passHref>
                        <Button
                            variant="danger"
                            size="lg"
                            className="px-5 py-3 rounded-pill shadow-lg d-inline-flex align-items-center gap-2"
                            style={{
                                background: 'linear-gradient(to right, #dc2626, #fb7185)',
                                border: 'none',
                                transition: 'transform 0.2s'
                            }}
                            onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                            onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
                        >
                            <Home size={20} />
                            Return to Safety
                        </Button>
                    </Link>
                </motion.div>
            </motion.div>
        </Container>
    )
}
