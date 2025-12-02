import React from 'react';

export default function Custom404() {
    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100vh',
            textAlign: 'center',
            fontFamily: 'sans-serif'
        }}>
            <h1 style={{ fontSize: '3rem', color: '#dc2626' }}>404</h1>
            <h2>Page Not Found</h2>
            <p>The page you are looking for does not exist.</p>
            <a href="/" style={{
                marginTop: '1rem',
                padding: '0.5rem 1rem',
                backgroundColor: '#dc2626',
                color: 'white',
                textDecoration: 'none',
                borderRadius: '0.25rem'
            }}>
                Return Home
            </a>
        </div>
    );
}
