'use client';

import React from 'react';
import { Container, Card } from 'react-bootstrap';

export default function TermsOfService() {
    return (
        <div className="min-vh-100 py-5" style={{ background: '#f8fafc' }}>
            <Container size="md" style={{ maxWidth: '800px' }}>
                <Card className="border-0 shadow-sm rounded-4 overflow-hidden">
                    <div className="bg-dark p-5 text-white text-center">
                        <h1 className="fw-bold mb-0">Terms of Service</h1>
                        <p className="opacity-75 mt-2 mb-0">Last Updated: December 2025</p>
                    </div>
                    <Card.Body className="p-5">
                        <section className="mb-4">
                            <h2 className="h4 fw-bold text-dark mb-3">1. Agreement to Terms</h2>
                            <p className="text-muted">
                                These Terms of Service constitute a legally binding agreement made between you, whether personally or on behalf of an entity (“you”) and UpcharSaathi
                                ("we," "us" or "our"), concerning your access to and use of the UpcharSaathi application and website.
                            </p>
                        </section>

                        <section className="mb-4">
                            <h2 className="h4 fw-bold text-dark mb-3">2. Medical Disclaimer</h2>
                            <p className="text-muted border-start border-4 border-danger ps-3">
                                <strong>Important:</strong> UpcharSaathi is not a substitute for professional medical advice, diagnosis, or treatment.
                                Always seek the advice of your physician or other qualified health provider with any questions you may have regarding a medical condition.
                                Never disregard professional medical advice or delay in seeking it because of something you have read on this Application.
                            </p>
                        </section>

                        <section className="mb-4">
                            <h2 className="h4 fw-bold text-dark mb-3">3. User Representations</h2>
                            <p className="text-muted">
                                By using the Site, you represent and warrant that:
                            </p>
                            <ul className="text-muted">
                                <li>All registration information you submit will be true, accurate, current, and complete.</li>
                                <li>You have the legal capacity and you agree to comply with these Terms of Service.</li>
                                <li>You will not access the Site through automated or non-human means, whether through a bot, script or otherwise.</li>
                                <li>You will not use the Site for any illegal or unauthorized purpose.</li>
                            </ul>
                        </section>

                        <section className="mb-4">
                            <h2 className="h4 fw-bold text-dark mb-3">4. User Registration</h2>
                            <p className="text-muted">
                                You may be required to register with the Site. You agree to keep your password confidential and will be responsible for all use of your account and password.
                                We reserve the right to remove, reclaim, or change a username you select if we determine, in our sole discretion, that such username is inappropriate, obscene, or otherwise objectionable.
                            </p>
                        </section>

                        <section className="mb-4">
                            <h2 className="h4 fw-bold text-dark mb-3">5. Intellectual Property Rights</h2>
                            <p className="text-muted">
                                Unless otherwise indicated, the Site is our proprietary property and all source code, databases, functionality, software, website designs, audio, video, text, photographs, and graphics on the Site (collectively, the “Content”) and the trademarks, service marks, and logos contained therein (the “Marks”) are owned or controlled by us or licensed to us, and are protected by copyright and trademark laws.
                            </p>
                        </section>

                        <section className="mb-4">
                            <h2 className="h4 fw-bold text-dark mb-3">6. Limitation of Liability</h2>
                            <p className="text-muted">
                                In no event will we or our directors, employees, or agents be liable to you or any third party for any direct, indirect, consequential, exemplary, incidental, special, or punitive damages, including lost profit, lost revenue, loss of data, or other damages arising from your use of the site, even if we have been advised of the possibility of such damages.
                            </p>
                        </section>

                        <section className="mb-0">
                            <h2 className="h4 fw-bold text-dark mb-3">7. Contact Us</h2>
                            <p className="text-muted mb-0">
                                In order to resolve a complaint regarding the Site or to receive further information regarding use of the Site, please contact us at: <a href="mailto:legal@upcharsaathi.com" className="text-primary text-decoration-none">legal@upcharsaathi.com</a>.
                            </p>
                        </section>
                    </Card.Body>
                </Card>
            </Container>
        </div>
    );
}
