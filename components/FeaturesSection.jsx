'use client'
import { Container, Row, Col } from "react-bootstrap"
import { motion } from "framer-motion"
import FeatureCard from "./FeatureCard"
import { healthFeatures } from "../app/constants/homeConstants"

export default function FeaturesSection() {
    return (
        <motion.section
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            style={{ paddingTop: '5rem', paddingBottom: '5rem' }}
        >
            <Container>
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    viewport={{ once: true }}
                    className="text-center mb-5"
                >
                    <h2 className="text-dark display-5 fw-bold mb-3">
                        Integrated Health Solutions
                    </h2>
                    <p className="text-muted fs-5 mx-auto" style={{ maxWidth: '700px' }}>
                        A comprehensive medical ecosystem designed to provide immediate care, expert consultations, and continuous health monitoring.
                    </p>
                </motion.div>

                <Row className="g-4">
                    {healthFeatures.map((feature, index) => (
                        <Col key={feature.id} md={6} lg={4}>
                            <FeatureCard feature={feature} delay={0.1 * (index + 1)} />
                        </Col>
                    ))}
                </Row>
            </Container>
        </motion.section>
    );
}
