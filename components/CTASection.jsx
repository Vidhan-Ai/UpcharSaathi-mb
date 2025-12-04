'use client'
import { Button, Container } from "react-bootstrap"
import { motion } from "framer-motion"
import Link from "next/link"
import { useRouter } from "next/navigation"

export default function CTASection({ isAuthenticated }) {
    const router = useRouter();

    return (
        <motion.section
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            style={{
                background: 'linear-gradient(to right, #dc2626, #fb7185)',
                paddingTop: '3rem',
                paddingBottom: '3rem'
            }}
        >
            <Container>
                <div className="text-center">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        viewport={{ once: true }}
                        className="mb-4 text-white display-5 fw-bold"
                    >
                        Ready to take control of your health?
                    </motion.h2>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        viewport={{ once: true }}
                        className="mb-5 fs-5 text-white"
                    >
                        Create an account to save your health data and get personalized recommendations.
                    </motion.p>

                    {!isAuthenticated ? (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.4 }}
                            viewport={{ once: true }}
                            className="d-flex justify-content-center gap-3 flex-wrap"
                        >
                            <Link href="/auth/signup">
                                <Button variant="light" size="lg" className="px-5">
                                    Sign Up
                                </Button>
                            </Link>
                            <Link href="/auth/login">
                                <Button variant="outline-light" size="lg" className="px-5">
                                    Log In
                                </Button>
                            </Link>
                        </motion.div>
                    ) : (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.4 }}
                            viewport={{ once: true }}
                        >
                            <Button
                                variant="light"
                                size="lg"
                                className="px-5"
                                onClick={() => router.push('/find-care')}
                            >
                                Find Doctors
                            </Button>
                        </motion.div>
                    )}
                </div>
            </Container>
        </motion.section>
    );
}
