'use client';

import React from 'react';
import { Container, Card } from 'react-bootstrap';

export default function PrivacyPolicy() {
    return (
        <div className="min-vh-100 py-5" style={{ background: '#f8fafc' }}>
            <Container size="md" style={{ maxWidth: '800px' }}>
                <Card className="border-0 shadow-sm rounded-4 overflow-hidden">
                    <div className="bg-primary p-5 text-white text-center" style={{ background: 'linear-gradient(to right, #dc2626, #ef4444)' }}>
                        <h1 className="fw-bold mb-0">Privacy Policy</h1>
                        <p className="opacity-75 mt-2 mb-0">Last Updated: December 2025</p>
                    </div>
                    <Card.Body className="p-5">
                        <section className="mb-4">
                            <h2 className="h4 fw-bold text-dark mb-3">1. Introduction</h2>
                            <p className="text-muted">
                                Welcome to UpcharSaathi ("we," "our," or "us"). We are committed to protecting your personal information and your right to privacy.
                                This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website and use our services.
                            </p>
                        </section>

                        <section className="mb-4">
                            <h2 className="h4 fw-bold text-dark mb-3">2. Information We Collect</h2>
                            <p className="text-muted">
                                We collect information that you strictly provide to us. This may include:
                            </p>
                            <ul className="text-muted">
                                <li>Personal identification information (Name, email address, phone number, etc.)</li>
                                <li>Health-related information you voluntarily provide for tracking purposes.</li>
                                <li>Location data, if you grant us permission, to find nearby healthcare services.</li>
                            </ul>
                        </section>

                        <section className="mb-4">
                            <h2 className="h4 fw-bold text-dark mb-3">3. How We Use Your Information</h2>
                            <p className="text-muted">
                                We use identifying information for the following purposes:
                            </p>
                            <ul className="text-muted">
                                <li>To provide and maintain our Service.</li>
                                <li>To manage your account and registration.</li>
                                <li>To contact you regarding updates or informative communications related to different functionalities.</li>
                                <li>To find and display healthcare providers near your location.</li>
                            </ul>
                        </section>

                        <section className="mb-4">
                            <h2 className="h4 fw-bold text-dark mb-3">4. Disclosure of Your Information</h2>
                            <p className="text-muted">
                                We do not sell, trade, or otherwise transfer to outside parties your Personally Identifiable Information.
                                This does not include website hosting partners and other parties who assist us in operating our website,
                                conducting our business, or serving our users, so long as those parties agree to keep this information confidential.
                            </p>
                        </section>

                        <section className="mb-4">
                            <h2 className="h4 fw-bold text-dark mb-3">5. Third-Party Services</h2>
                            <p className="text-muted">
                                Our application may integrate with third-party services such as Google Fit or Fitbit to provide health tracking features.
                                Please note that these third-party sites have separate and independent privacy policies. We have no responsibility or liability for the content and activities of these linked sites.
                            </p>
                        </section>

                        <section className="mb-4">
                            <h2 className="h4 fw-bold text-dark mb-3">6. Security of Your Information</h2>
                            <p className="text-muted">
                                We use administrative, technical, and physical security measures to help protect your personal information.
                                While we have taken reasonable steps to secure the personal information you provide to us, please be aware that despite our efforts,
                                no security measures are perfect or impenetrable, and no method of data transmission can be guaranteed against any interception or other type of misuse.
                            </p>
                        </section>

                        <section className="mb-0">
                            <h2 className="h4 fw-bold text-dark mb-3">7. Contact Us</h2>
                            <p className="text-muted mb-0">
                                If you have questions or comments about this policy, you may email us at <a href="mailto:support@upcharsaathi.com" className="text-primary text-decoration-none">support@upcharsaathi.com</a>.
                            </p>
                        </section>
                    </Card.Body>
                </Card>
            </Container>
        </div>
    );
}
