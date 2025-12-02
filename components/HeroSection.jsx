'use client'
import { Button, Container } from "react-bootstrap"
import { motion } from "framer-motion"
import { useRouter } from "next/navigation"
import { styles, animations } from "../app/constants/homeConstants"

export default function HeroSection({ isLoaded }) {
    const router = useRouter();

    return (
        <motion.section
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            style={{
                background: 'linear-gradient(to right, #fef2f2, #ffe4e6, #fef2f2)',
                paddingTop: '3rem',
                paddingBottom: '3rem'
            }}
        >
            <Container>
                <motion.div
                    initial="hidden"
                    animate={isLoaded ? "visible" : "hidden"}
                    variants={animations.fadeIn}
                    className="text-center"
                >
                    <h1 className="display-3 fw-bold text-dark mb-4">
                        Welcome to <span style={styles.headerGradient}>UpcharSaathi</span>
                    </h1>

                    <motion.p
                        variants={animations.fadeIn}
                        className="fs-5 text-muted mb-5"
                    >
                        Your trusted healthcare companion for first aid guidance, blood bank location, and connecting with qualified doctors.
                    </motion.p>

                    <motion.div className="d-flex justify-content-center gap-3 flex-wrap">
                        <motion.div variants={animations.fadeIn}>
                            <Button
                                variant="danger"
                                size="lg"
                                onClick={() => router.push('/find-doctors')}
                                className="px-5"
                                style={{ background: 'linear-gradient(to right, #dc2626, #fb7185)', border: 'none' }}
                            >
                                Find Doctors
                            </Button>
                        </motion.div>

                        <motion.div variants={animations.fadeIn}>
                            <Button
                                variant="outline-danger"
                                size="lg"
                                onClick={() => router.push('/first-aid')}
                                className="px-5"
                                style={{ borderColor: '#dc2626', color: '#dc2626' }}
                            >
                                First Aid Guide
                            </Button>
                        </motion.div>
                    </motion.div>
                </motion.div>
            </Container>
        </motion.section>
    );
}
