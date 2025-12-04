'use client'
import { Button, Container } from "react-bootstrap"
import { motion } from "framer-motion"
import { useRouter } from "next/navigation"
import { styles, animations } from "../app/constants/homeConstants"
import { Activity, Stethoscope } from "lucide-react"

export default function HeroSection({ isLoaded }) {
    const router = useRouter();

    return (
        <motion.section
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="position-relative overflow-hidden"
            style={{
                background: 'linear-gradient(to right, #fef2f2, #ffe4e6, #fef2f2)',
                paddingTop: '5rem',
                paddingBottom: '5rem'
            }}
        >
            {/* Background Elements */}
            <div className="position-absolute w-100 h-100 top-0 start-0" style={{ zIndex: 0, opacity: 0.05, pointerEvents: 'none' }}>
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
                    style={{ position: 'absolute', top: '10%', left: '5%' }}
                >
                    <Activity size={180} className="text-danger" />
                </motion.div>
                <motion.div
                    animate={{
                        y: [0, -40, 0],
                        rotate: -10
                    }}
                    transition={{
                        duration: 12,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                    style={{ position: 'absolute', bottom: '20%', right: '5%' }}
                >
                    <Stethoscope size={220} className="text-primary" />
                </motion.div>
            </div>

            <Container className="position-relative" style={{ zIndex: 1 }}>
                <motion.div
                    initial="hidden"
                    animate={isLoaded ? "visible" : "hidden"}
                    variants={animations.fadeIn}
                    className="text-center"
                >
                    <h1 className="display-3 fw-bold text-dark mb-4">
                        Advanced Healthcare <br />
                        <span style={styles.headerGradient}>At Your Fingertips</span>
                    </h1>

                    <motion.p
                        variants={animations.fadeIn}
                        className="fs-5 text-muted mb-5 mx-auto"
                        style={{ maxWidth: '700px' }}
                    >
                        Seamlessly connect with top-tier medical professionals, access life-saving first aid protocols, and manage your health journey with our intelligent ecosystem.
                    </motion.p>

                    <motion.div className="d-flex justify-content-center gap-3 flex-wrap">
                        <motion.div variants={animations.fadeIn} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                            <Button
                                variant="danger"
                                size="lg"
                                onClick={() => router.push('/find-care')}
                                className="px-5 py-3 rounded-pill shadow-lg"
                                style={{ background: 'linear-gradient(to right, #dc2626, #fb7185)', border: 'none' }}
                            >
                                Find Specialists
                            </Button>
                        </motion.div>

                        <motion.div variants={animations.fadeIn} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                            <Button
                                variant="outline-danger"
                                size="lg"
                                onClick={() => router.push('/first-aid')}
                                className="px-5 py-3 rounded-pill"
                                style={{ borderColor: '#dc2626', color: '#dc2626', borderWidth: '2px' }}
                            >
                                Emergency Guide
                            </Button>
                        </motion.div>
                    </motion.div>
                </motion.div>
            </Container>
        </motion.section>
    );
}
