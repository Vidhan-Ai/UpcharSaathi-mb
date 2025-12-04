"use client"

import React, { useState } from 'react';
import { Container, Row, Col, Form, Button, Card, Alert, Spinner } from 'react-bootstrap';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Send, MessageSquare, Clock } from 'lucide-react';

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

export default function ContactUsClient() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        message: ''
    });
    const [status, setStatus] = useState({
        loading: false,
        success: false,
        error: null
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus({ loading: true, success: false, error: null });

        try {
            const response = await fetch('/api/contact', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Something went wrong');
            }

            setStatus({ loading: false, success: true, error: null });
            setFormData({ name: '', email: '', message: '' });
        } catch (error) {
            setStatus({ loading: false, success: false, error: error.message });
        }
    };

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
                        <MessageSquare size={40} className="text-danger" />
                    </div>
                    <h1 className="display-4 fw-bold mb-4" style={{
                        background: 'linear-gradient(to right, #dc2626, #fb7185)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent'
                    }}>
                        Get in Touch
                    </h1>
                    <p className="lead text-muted mx-auto" style={{ maxWidth: '700px' }}>
                        Have questions about your health or our platform? We're here to help you 24/7.
                    </p>
                </motion.div>

                <Row className="g-5 justify-content-center">
                    {/* Contact Info Column */}
                    <Col lg={5}>
                        <motion.div
                            variants={staggerContainer}
                            initial="hidden"
                            animate="visible"
                            className="d-flex flex-column gap-4"
                        >
                            <motion.div variants={fadeIn}>
                                <Card className="border-0 shadow-sm hover-shadow transition-all" style={{ borderRadius: '1rem' }}>
                                    <Card.Body className="p-4 d-flex align-items-center gap-4">
                                        <div className="p-3 rounded-circle bg-primary bg-opacity-10 text-primary">
                                            <Mail size={24} />
                                        </div>
                                        <div>
                                            <h6 className="fw-bold mb-1">Email Us</h6>
                                            <p className="text-muted mb-0">support@upcharsaathi.com</p>
                                        </div>
                                    </Card.Body>
                                </Card>
                            </motion.div>

                            <motion.div variants={fadeIn}>
                                <Card className="border-0 shadow-sm hover-shadow transition-all" style={{ borderRadius: '1rem' }}>
                                    <Card.Body className="p-4 d-flex align-items-center gap-4">
                                        <div className="p-3 rounded-circle bg-success bg-opacity-10 text-success">
                                            <Phone size={24} />
                                        </div>
                                        <div>
                                            <h6 className="fw-bold mb-1">Call Us</h6>
                                            <p className="text-muted mb-0">+91-6393172708</p>
                                        </div>
                                    </Card.Body>
                                </Card>
                            </motion.div>

                            <motion.div variants={fadeIn}>
                                <Card className="border-0 shadow-sm hover-shadow transition-all" style={{ borderRadius: '1rem' }}>
                                    <Card.Body className="p-4 d-flex align-items-center gap-4">
                                        <div className="p-3 rounded-circle bg-danger bg-opacity-10 text-danger">
                                            <MapPin size={24} />
                                        </div>
                                        <div>
                                            <h6 className="fw-bold mb-1">Visit Us</h6>
                                            <p className="text-muted mb-0">
                                                Galgotias College Of Engineering and Technology<br />
                                                Greater Noida, Uttar Pradesh, India
                                            </p>
                                        </div>
                                    </Card.Body>
                                </Card>
                            </motion.div>

                            <motion.div variants={fadeIn}>
                                <Card className="border-0 shadow-sm hover-shadow transition-all" style={{ borderRadius: '1rem' }}>
                                    <Card.Body className="p-4 d-flex align-items-center gap-4">
                                        <div className="p-3 rounded-circle bg-warning bg-opacity-10 text-warning">
                                            <Clock size={24} />
                                        </div>
                                        <div>
                                            <h6 className="fw-bold mb-1">Working Hours</h6>
                                            <p className="text-muted mb-0">
                                                Mon - Fri: 9:00 AM - 6:00 PM<br />
                                                24/7 Emergency Support
                                            </p>
                                        </div>
                                    </Card.Body>
                                </Card>
                            </motion.div>
                        </motion.div>
                    </Col>

                    {/* Contact Form Column */}
                    <Col lg={7}>
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                        >
                            <Card className="border-0 shadow-lg" style={{ borderRadius: '1.5rem', overflow: 'hidden' }}>
                                <div className="h-1 bg-danger" style={{ height: '4px', background: 'linear-gradient(to right, #dc2626, #fb7185)' }} />
                                <Card.Body className="p-5">
                                    <h3 className="fw-bold mb-4">Send us a Message</h3>

                                    {status.success && (
                                        <Alert variant="success" onClose={() => setStatus(prev => ({ ...prev, success: false }))} dismissible className="rounded-3 border-0 bg-success bg-opacity-10 text-success">
                                            Message sent successfully! We'll get back to you soon.
                                        </Alert>
                                    )}
                                    {status.error && (
                                        <Alert variant="danger" onClose={() => setStatus(prev => ({ ...prev, error: null }))} dismissible className="rounded-3 border-0 bg-danger bg-opacity-10 text-danger">
                                            {status.error}
                                        </Alert>
                                    )}

                                    <Form onSubmit={handleSubmit}>
                                        <Row>
                                            <Col md={6}>
                                                <Form.Group className="mb-4">
                                                    <Form.Label className="text-muted small fw-bold text-uppercase">Your Name</Form.Label>
                                                    <Form.Control
                                                        type="text"
                                                        name="name"
                                                        value={formData.name}
                                                        onChange={handleChange}
                                                        placeholder="John Doe"
                                                        required
                                                        className="bg-light border-0 p-3 rounded-3"
                                                    />
                                                </Form.Group>
                                            </Col>
                                            <Col md={6}>
                                                <Form.Group className="mb-4">
                                                    <Form.Label className="text-muted small fw-bold text-uppercase">Your Email</Form.Label>
                                                    <Form.Control
                                                        type="email"
                                                        name="email"
                                                        value={formData.email}
                                                        onChange={handleChange}
                                                        placeholder="john@example.com"
                                                        required
                                                        className="bg-light border-0 p-3 rounded-3"
                                                    />
                                                </Form.Group>
                                            </Col>
                                        </Row>

                                        <Form.Group className="mb-4">
                                            <Form.Label className="text-muted small fw-bold text-uppercase">Message</Form.Label>
                                            <Form.Control
                                                as="textarea"
                                                name="message"
                                                value={formData.message}
                                                onChange={handleChange}
                                                rows={5}
                                                placeholder="How can we help you?"
                                                required
                                                className="bg-light border-0 p-3 rounded-3"
                                                style={{ resize: 'none' }}
                                            />
                                        </Form.Group>

                                        <Button
                                            type="submit"
                                            disabled={status.loading}
                                            className="w-100 py-3 fw-bold border-0 rounded-3 d-flex align-items-center justify-content-center gap-2"
                                            style={{ background: 'linear-gradient(to right, #dc2626, #fb7185)', transition: 'transform 0.2s' }}
                                        >
                                            {status.loading ? (
                                                <>
                                                    <Spinner
                                                        as="span"
                                                        animation="border"
                                                        size="sm"
                                                        role="status"
                                                        aria-hidden="true"
                                                    />
                                                    Sending...
                                                </>
                                            ) : (
                                                <>
                                                    <Send size={18} />
                                                    Send Message
                                                </>
                                            )}
                                        </Button>
                                    </Form>
                                </Card.Body>
                            </Card>
                        </motion.div>
                    </Col>
                </Row>
            </Container>

            <style jsx global>{`
                .hover-shadow:hover {
                    transform: translateY(-5px);
                    box-shadow: 0 1rem 3rem rgba(0,0,0,.175)!important;
                }
                .form-control:focus {
                    box-shadow: none;
                    background-color: #fff;
                    border: 1px solid #fb7185;
                }
            `}</style>
        </div>
    );
}
