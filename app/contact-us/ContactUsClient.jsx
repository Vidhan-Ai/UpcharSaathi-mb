"use client"

import React, { useState } from 'react';
import { Container, Row, Col, Form, Button, Card, Alert, Spinner } from 'react-bootstrap';

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
                <div className="text-center mb-5">
                    <h1 className="display-4 fw-bold mb-4" style={{
                        background: 'linear-gradient(to right, #dc2626, #fb7185)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent'
                    }}>
                        Contact Us
                    </h1>
                    <div className="mx-auto" style={{
                        width: '128px',
                        height: '4px',
                        background: 'linear-gradient(to right, #dc2626, #fb7185)',
                        borderRadius: '2px'
                    }}></div>
                </div>

                <Row className="g-4">
                    <Col md={6}>
                        <Card className="h-100 border-0 shadow-sm" style={{
                            background: '#ffffff',
                            borderRadius: '1rem'
                        }}>
                            <Card.Body className="p-4">
                                <h2 className="h3 fw-bold mb-4 text-dark">
                                    Get in Touch
                                </h2>
                                {status.success && (
                                    <Alert variant="success" onClose={() => setStatus(prev => ({ ...prev, success: false }))} dismissible>
                                        Message sent successfully! We'll get back to you soon.
                                    </Alert>
                                )}
                                {status.error && (
                                    <Alert variant="danger" onClose={() => setStatus(prev => ({ ...prev, error: null }))} dismissible>
                                        {status.error}
                                    </Alert>
                                )}
                                <Form onSubmit={handleSubmit}>
                                    <Form.Group className="mb-3">
                                        <Form.Label className="text-muted">Name</Form.Label>
                                        <Form.Control
                                            type="text"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleChange}
                                            placeholder="Your name"
                                            required
                                            className="bg-light text-dark border-light"
                                            style={{ border: '1px solid #e2e8f0' }}
                                        />
                                    </Form.Group>
                                    <Form.Group className="mb-3">
                                        <Form.Label className="text-muted">Email</Form.Label>
                                        <Form.Control
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            placeholder="your@email.com"
                                            required
                                            className="bg-light text-dark border-light"
                                            style={{ border: '1px solid #e2e8f0' }}
                                        />
                                    </Form.Group>
                                    <Form.Group className="mb-4">
                                        <Form.Label className="text-muted">Message</Form.Label>
                                        <Form.Control
                                            as="textarea"
                                            name="message"
                                            value={formData.message}
                                            onChange={handleChange}
                                            rows={4}
                                            placeholder="Your message"
                                            required
                                            className="bg-light text-dark border-light"
                                            style={{ border: '1px solid #e2e8f0' }}
                                        />
                                    </Form.Group>
                                    <Button
                                        type="submit"
                                        disabled={status.loading}
                                        className="w-100 fw-bold border-0"
                                        style={{ background: 'linear-gradient(to right, #dc2626, #fb7185)' }}
                                    >
                                        {status.loading ? (
                                            <>
                                                <Spinner
                                                    as="span"
                                                    animation="border"
                                                    size="sm"
                                                    role="status"
                                                    aria-hidden="true"
                                                    className="me-2"
                                                />
                                                Sending...
                                            </>
                                        ) : (
                                            'Send Message'
                                        )}
                                    </Button>
                                </Form>
                            </Card.Body>
                        </Card>
                    </Col>

                    <Col md={6}>
                        <Card className="h-100 border-0 shadow-sm" style={{
                            background: '#ffffff',
                            borderRadius: '1rem'
                        }}>
                            <Card.Body className="p-4">
                                <h2 className="h3 fw-bold mb-4 text-dark">
                                    Contact Information
                                </h2>
                                <div className="d-flex flex-column gap-4 text-muted">
                                    <div>
                                        <h3 className="h5 fw-bold text-dark mb-2">Email</h3>
                                        <p className="mb-0">support@upcharsaathi.com</p>
                                    </div>
                                    <div>
                                        <h3 className="h5 fw-bold text-dark mb-2">Phone</h3>
                                        <p className="mb-0">+91-6393172708</p>
                                    </div>
                                    <div>
                                        <h3 className="h5 fw-bold text-dark mb-2">Address</h3>
                                        <p className="mb-0">
                                            Galgotias College Of Engineering and Technology<br />
                                            Greater Noida, Uttar Pradesh, India
                                        </p>
                                    </div>
                                </div>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </div>
    );
}
