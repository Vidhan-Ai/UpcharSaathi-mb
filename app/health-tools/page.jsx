'use client'

import { useState } from 'react'
import { Container, Row, Col, Card, Form, Button, ProgressBar } from 'react-bootstrap'
import { motion } from 'framer-motion'
import {
    Calculator,
    Scale,
    GlassWater,
    Leaf,
    Droplets
} from 'lucide-react'

const soothingStyles = {
    glassCard: {
        background: 'rgba(255, 255, 255, 0.85)',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(255, 255, 255, 0.8)',
        boxShadow: '0 10px 40px -10px rgba(0, 0, 0, 0.05)',
        borderRadius: '2rem',
        overflow: 'hidden',
        transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
    },
    gradientText: {
        background: 'linear-gradient(135deg, #059669 0%, #10b981 100%)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent'
    },
    inputStyle: {
        background: '#f8fafc',
        border: '1px solid #e2e8f0',
        borderRadius: '1rem',
        padding: '0.75rem 1rem',
        fontSize: '1rem',
        transition: 'all 0.3s ease'
    }
}

export default function HealthTools() {
    // BMI State
    const [height, setHeight] = useState('')
    const [weight, setWeight] = useState('')
    const [bmi, setBmi] = useState(null)
    const [bmiCategory, setBmiCategory] = useState('')

    // Water Intake State
    const [waterWeight, setWaterWeight] = useState('')
    const [activityLevel, setActivityLevel] = useState('moderate')
    const [waterIntake, setWaterIntake] = useState(null)

    const calculateBMI = () => {
        if (height && weight) {
            const heightInMeters = height / 100
            const bmiValue = (weight / (heightInMeters * heightInMeters)).toFixed(1)
            setBmi(bmiValue)

            if (bmiValue < 18.5) setBmiCategory({ text: 'Underweight', color: '#3b82f6', variant: 'info' })
            else if (bmiValue < 25) setBmiCategory({ text: 'Healthy Weight', color: '#10b981', variant: 'success' })
            else if (bmiValue < 30) setBmiCategory({ text: 'Overweight', color: '#f59e0b', variant: 'warning' })
            else setBmiCategory({ text: 'Obese', color: '#ef4444', variant: 'danger' })
        }
    }

    const calculateWater = () => {
        if (waterWeight) {
            let baseIntake = waterWeight * 0.033
            if (activityLevel === 'high') baseIntake += 0.5
            if (activityLevel === 'very_high') baseIntake += 1.0
            setWaterIntake(baseIntake.toFixed(1))
        }
    }

    return (
        <Container className="py-5" style={{ maxWidth: '1000px' }}>
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="mb-5 text-center"
            >
                <div className="d-inline-flex align-items-center justify-content-center p-4 rounded-circle mb-4 shadow-sm" style={{ background: 'linear-gradient(135deg, #ecfdf5 0%, #ffffff 100%)' }}>
                    <Leaf size={48} className="text-success" />
                </div>
                <h1 className="fw-bold mb-3 display-4" style={soothingStyles.gradientText}>Wellness Tools</h1>
                <p className="text-muted fs-5" style={{ maxWidth: '600px', margin: '0 auto' }}>
                    Simple, intelligent calculators to help you maintain balance and vitality.
                </p>
            </motion.div>

            <Row className="g-5">
                {/* BMI Calculator */}
                <Col lg={6}>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1, duration: 0.5 }}
                        whileHover={{ y: -5 }}
                    >
                        <Card style={soothingStyles.glassCard} className="h-100 border-0">
                            <Card.Body className="p-5">
                                <div className="d-flex align-items-center gap-3 mb-4">
                                    <div className="p-3 rounded-2xl bg-emerald-50 text-emerald-600" style={{ background: '#ecfdf5', borderRadius: '1rem' }}>
                                        <Scale size={28} className="text-success" />
                                    </div>
                                    <div>
                                        <h4 className="fw-bold mb-1 text-dark">Body Mass Index</h4>
                                        <small className="text-muted">Check your health status</small>
                                    </div>
                                </div>

                                <Form>
                                    <Row className="g-4 mb-4">
                                        <Col xs={6}>
                                            <Form.Group>
                                                <Form.Label className="small text-muted fw-bold text-uppercase tracking-wider">Height (cm)</Form.Label>
                                                <Form.Control
                                                    type="number"
                                                    placeholder="170"
                                                    value={height}
                                                    onChange={(e) => setHeight(e.target.value)}
                                                    style={soothingStyles.inputStyle}
                                                    className="shadow-none focus:ring-2 focus:ring-emerald-500"
                                                />
                                            </Form.Group>
                                        </Col>
                                        <Col xs={6}>
                                            <Form.Group>
                                                <Form.Label className="small text-muted fw-bold text-uppercase tracking-wider">Weight (kg)</Form.Label>
                                                <Form.Control
                                                    type="number"
                                                    placeholder="70"
                                                    value={weight}
                                                    onChange={(e) => setWeight(e.target.value)}
                                                    style={soothingStyles.inputStyle}
                                                    className="shadow-none"
                                                />
                                            </Form.Group>
                                        </Col>
                                    </Row>
                                    <Button
                                        variant="success"
                                        className="w-100 text-white fw-bold py-3 rounded-4 shadow-sm"
                                        style={{ background: '#10b981', border: 'none' }}
                                        onClick={calculateBMI}
                                    >
                                        Calculate BMI
                                    </Button>
                                </Form>

                                {bmi && (
                                    <motion.div
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                        className="mt-4 pt-4 border-top"
                                    >
                                        <div className="d-flex justify-content-between align-items-end mb-3">
                                            <div>
                                                <span className="text-muted small d-block mb-1">Your Result</span>
                                                <span className="display-4 fw-bold" style={{ color: bmiCategory.color }}>{bmi}</span>
                                            </div>
                                            <div className="text-end">
                                                <span className="d-inline-block px-3 py-1 rounded-pill small fw-bold"
                                                    style={{ background: `${bmiCategory.color}20`, color: bmiCategory.color }}>
                                                    {bmiCategory.text}
                                                </span>
                                            </div>
                                        </div>
                                        <ProgressBar
                                            now={Math.min((bmi / 40) * 100, 100)}
                                            variant={bmiCategory.variant}
                                            style={{ height: '8px', borderRadius: '4px', backgroundColor: '#f1f5f9' }}
                                        />
                                    </motion.div>
                                )}
                            </Card.Body>
                        </Card>
                    </motion.div>
                </Col>

                {/* Water Intake Calculator */}
                <Col lg={6}>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2, duration: 0.5 }}
                        whileHover={{ y: -5 }}
                    >
                        <Card style={soothingStyles.glassCard} className="h-100 border-0">
                            <Card.Body className="p-5">
                                <div className="d-flex align-items-center gap-3 mb-4">
                                    <div className="p-3 rounded-2xl" style={{ background: '#eff6ff', borderRadius: '1rem' }}>
                                        <Droplets size={28} className="text-primary" />
                                    </div>
                                    <div>
                                        <h4 className="fw-bold mb-1 text-dark">Hydration Goal</h4>
                                        <small className="text-muted">Daily water intake</small>
                                    </div>
                                </div>

                                <Form>
                                    <Row className="g-4 mb-4">
                                        <Col xs={6}>
                                            <Form.Group>
                                                <Form.Label className="small text-muted fw-bold text-uppercase tracking-wider">Weight (kg)</Form.Label>
                                                <Form.Control
                                                    type="number"
                                                    placeholder="70"
                                                    value={waterWeight}
                                                    onChange={(e) => setWaterWeight(e.target.value)}
                                                    style={soothingStyles.inputStyle}
                                                    className="shadow-none"
                                                />
                                            </Form.Group>
                                        </Col>
                                        <Col xs={6}>
                                            <Form.Group>
                                                <Form.Label className="small text-muted fw-bold text-uppercase tracking-wider">Activity</Form.Label>
                                                <Form.Select
                                                    value={activityLevel}
                                                    onChange={(e) => setActivityLevel(e.target.value)}
                                                    style={soothingStyles.inputStyle}
                                                    className="shadow-none"
                                                >
                                                    <option value="low">Low</option>
                                                    <option value="moderate">Moderate</option>
                                                    <option value="high">High</option>
                                                    <option value="very_high">Very High</option>
                                                </Form.Select>
                                            </Form.Group>
                                        </Col>
                                    </Row>
                                    <Button
                                        variant="primary"
                                        className="w-100 text-white fw-bold py-3 rounded-4 shadow-sm"
                                        style={{ background: '#3b82f6', border: 'none' }}
                                        onClick={calculateWater}
                                    >
                                        Calculate Intake
                                    </Button>
                                </Form>

                                {waterIntake && (
                                    <motion.div
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                        className="mt-4 pt-4 border-top text-center"
                                    >
                                        <div className="text-muted small mb-2">Recommended Daily Intake</div>
                                        <div className="display-4 fw-bold text-primary mb-3">
                                            {waterIntake} <span className="fs-4 text-muted fw-normal">L</span>
                                        </div>
                                        <div className="d-flex justify-content-center gap-2 flex-wrap">
                                            {[...Array(Math.ceil(waterIntake))].map((_, i) => (
                                                <motion.div
                                                    key={i}
                                                    initial={{ scale: 0 }}
                                                    animate={{ scale: 1 }}
                                                    transition={{ delay: i * 0.1 }}
                                                >
                                                    <GlassWater size={24} className="text-primary opacity-75" />
                                                </motion.div>
                                            ))}
                                        </div>
                                    </motion.div>
                                )}
                            </Card.Body>
                        </Card>
                    </motion.div>
                </Col>
            </Row>
        </Container>
    )
}
