"use client"

import React from 'react';
import Link from 'next/link';
import { Container, Row, Col } from 'react-bootstrap';

export default function Footer() {
  const footerStyle = {
    backgroundColor: 'rgba(15, 23, 42, 0.4)',
    backdropFilter: 'blur(10px)',
    borderTop: '1px solid rgba(255, 255, 255, 0.05)',
    padding: '3rem 0 2rem 0',
    marginTop: 'auto'
  }

  const brandStyle = {
    background: 'linear-gradient(to right, #ef4444, #f87171)',
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
            <p className="small text-white-50">&copy; 2025 UpcharSaathi. All rights reserved.</p>
          </Col>

          <Col md={3}>
            <h4 className="h5 fw-bold mb-3 text-white">Quick Links</h4>
            <ul className="list-unstyled">
              <li className="mb-2">
                <Link
                  href="/contact-us"
                  className="text-white-50 text-decoration-none hover-link"
                  style={{ transition: 'all 0.3s' }}
                >
                  Contact Us
                </Link>
              </li>
              <li className="mb-2">
                <Link
                  href="/about-us"
                  className="text-white-50 text-decoration-none hover-link"
                  style={{ transition: 'all 0.3s' }}
                >
                  About Us
                </Link>
              </li>
              <li className="mb-2">
                <Link
                  href="/privacy-policy"
                  className="text-white-50 text-decoration-none hover-link"
                  style={{ transition: 'all 0.3s' }}
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/terms-of-service"
                  className="text-white-50 text-decoration-none hover-link"
                  style={{ transition: 'all 0.3s' }}
                >
                  Terms of Service
                </Link>
              </li>
            </ul>
          </Col>

          <Col md={3}>
            <h4 className="h5 fw-bold mb-3 text-white">Services</h4>
            <ul className="list-unstyled">

              <li className="mb-2">
                <Link
                  href="/doctors"
                  className="text-white-50 text-decoration-none hover-link"
                >
                  Doctors
                </Link>
              </li>
              <li>
                <Link
                  href="/first-aid"
                  className="text-white-50 text-decoration-none hover-link"
                >
                  First Aid
                </Link>
              </li>
            </ul>
          </Col>

          <Col md={3}>
            <h4 className="h5 fw-bold mb-3 text-white">Follow Us</h4>
            <div className="d-flex gap-3">
              {[
                { label: 'Twitter', href: '#' },
                { label: 'Facebook', href: '#' },
                { label: 'Instagram', href: 'https://www.instagram.com/v.idhansingh' }
              ].map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  className="text-white-50 text-decoration-none hover-link"
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
          color: #ef4444 !important;
          transform: translateX(3px);
          display: inline-block;
        }
      `}</style>
    </footer>
  );
}
