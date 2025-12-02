'use client'
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Button } from 'react-bootstrap';
import { Pill } from "lucide-react";

import { usePathname } from 'next/navigation';

export default function HelpButton() {
  const pathname = usePathname();
  const [isFooterVisible, setIsFooterVisible] = useState(false);

  useEffect(() => {
    const footer = document.getElementById('footer');
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsFooterVisible(entry.isIntersecting);
      },
      { threshold: 0.1 }
    );

    if (footer) {
      observer.observe(footer);
    }

    return () => {
      if (footer) {
        observer.unobserve(footer);
      }
    };
  }, []);

  // Only show on home page
  if (pathname !== '/') {
    return null;
  }

  return (
    <div style={{
      position: 'fixed',
      bottom: '24px',
      right: '24px',
      zIndex: 100,
      opacity: isFooterVisible ? 0 : 1,
      transition: 'opacity 0.3s'
    }}>
      <Link href="/contact-us">
        <Button
          style={{
            background: 'linear-gradient(to right, #2563eb, #0d9488)',
            border: 'none',
            color: '#fff',
            padding: '12px 24px',
            borderRadius: '0.75rem',
            boxShadow: '0 0 25px rgba(66, 153, 225, 0.5)',
            display: 'flex',
            alignItems: 'center',
            gap: '12px'
          }}
        >
          <Pill size={24} />
          <div>
            <div style={{ fontSize: '16px', fontWeight: 'bold' }}>Medical Assistance?</div>
            <div style={{ fontSize: '12px', color: '#e0f2fe' }}>Get expert healthcare support now</div>
          </div>
        </Button>
      </Link>
    </div>
  );
}
