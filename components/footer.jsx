"use client"

import React from 'react';
import Link from 'next/link';
import { Container, Row, Col } from 'react-bootstrap';

export default function Footer() {
  const footerStyle = {
    backgroundColor: '#ffffff',
    borderTop: '1px solid #fecaca',
    padding: '3rem 0 2rem 0',
    marginTop: 'auto'
  }

  const brandStyle = {
    background: 'linear-gradient(to right, #dc2626, #fb7185)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
    fontWeight: 'bold'
  }

  return (
    <footer style={footerStyle}>
      <Container>
        <Row className="gy-4">
          <Col md={3}>
            <h4 className="h5 fw-bold mb-3" style={brandStyle}>UpcharSaathi</h4>
            <p className="small text-muted">&copy; 2025 UpcharSaathi. All rights reserved.</p>
          </Col>

          <Col md={3}>
            <h4 className="h5 fw-bold mb-3 text-dark">Quick Links</h4>
            <ul className="list-unstyled">
              <li className="mb-2">
                <Link
                  href="/contact-us"
                  className="text-muted text-decoration-none hover-link"
                  style={{ transition: 'all 0.3s' }}
                >
                  Contact Us
                </Link>
              </li>
              <li>
                <Link
                  href="/about-us"
                  className="text-muted text-decoration-none hover-link"
                  style={{ transition: 'all 0.3s' }}
                >
                  About Us
                </Link>
              </li>
            </ul>
          </Col>

          <Col md={3}>
            <h4 className="h5 fw-bold mb-3 text-dark">Services</h4>
            <ul className="list-unstyled">

              <li className="mb-2">
                <Link
                  href="/doctors"
                  className="text-muted text-decoration-none hover-link"
                >
                  Doctors
                </Link>
              </li>
              <li>
                <Link
                  href="/first-aid"
                  className="text-muted text-decoration-none hover-link"
                >
                  First Aid
                </Link>
              </li>
            </ul>
          </Col>

          <Col md={3}>
            <h4 className="h5 fw-bold mb-3 text-dark">Follow Us</h4>
            <div className="d-flex gap-3">
              {[
                { label: 'Twitter', href: '#' },
                { label: 'Facebook', href: '#' },
                { label: 'Instagram', href: 'https://www.instagram.com/v.idhansingh' }
              ].map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  className="text-muted text-decoration-none hover-link"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {social.label}
                </a>
              ))}
            </div>
          </Col>
        </Row>
      </Container>
      <style jsx global>{`
        .hover-link:hover {
          color: #dc2626 !important;
          transform: translateX(3px);
          display: inline-block;
        }
      `}</style>
    </footer>
  );
}
