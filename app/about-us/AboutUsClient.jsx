"use client"

import React from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';

export default function AboutUsClient() {
    return (
        <div className="min-vh-100 py-5" style={{ background: 'linear-gradient(to right, #fef2f2, #ffe4e6, #fef2f2)' }}>
            <Container>
                <div className="text-center mb-5">
                    <h1 className="display-4 fw-bold mb-4" style={{
                        background: 'linear-gradient(to right, #dc2626, #fb7185)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent'
                    }}>
                        About Us
                    </h1>
                    <div className="mx-auto" style={{
                        width: '128px',
                        height: '4px',
                        background: 'linear-gradient(to right, #dc2626, #fb7185)',
                        borderRadius: '2px'
                    }}></div>
                </div>

                <Row className="g-4 mt-4">
                    {[
                        {
                            title: "Our Mission",
                            content: "UpcharSaathi is an AI-powered symptom checker and doctor recommendation system. Our mission is to provide accessible and reliable healthcare information to everyone."
                        },
                        {
                            title: "Our Team",
                            content: "Our team consists of experienced healthcare professionals and technology experts who are dedicated to improving healthcare accessibility."
                        },
                        {
                            title: "Our Commitment",
                            content: "At UpcharSaathi, we are committed to maintaining the highest standards of accuracy and privacy. Your health information is secure with us."
                        },
                        {
                            title: "Technology",
                            content: "We use advanced AI algorithms to analyze symptoms and provide personalized recommendations, ensuring you get the most accurate information."
                        }
                    ].map((item, index) => (
                        <Col md={6} key={index}>
                            <Card className="h-100 border-0 shadow-sm" style={{
                                background: '#ffffff',
                                borderRadius: '1rem',
                                border: '1px solid #fecaca',
                                transition: 'all 0.3s ease'
                            }}>
                                <Card.Body className="p-4">
                                    <h2 className="h3 fw-bold mb-3" style={{
                                        background: 'linear-gradient(to right, #dc2626, #fb7185)',
                                        WebkitBackgroundClip: 'text',
                                        WebkitTextFillColor: 'transparent'
                                    }}>
                                        {item.title}
                                    </h2>
                                    <p className="text-muted mb-0">
                                        {item.content}
                                    </p>
                                </Card.Body>
                            </Card>
                        </Col>
                    ))}
                </Row>
            </Container>
        </div>
    );
}
