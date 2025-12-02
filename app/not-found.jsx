'use client'

import Link from 'next/link'
import { Button, Container } from 'react-bootstrap'

export default function NotFound() {
    return (
        <Container className="d-flex flex-column align-items-center justify-content-center min-vh-100 text-center">
            <h1 className="display-1 fw-bold text-danger">404</h1>
            <h2 className="mb-4">Page Not Found</h2>
            <p className="mb-4 text-muted">
                The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
            </p>
            <Link href="/" passHref>
                <Button variant="danger" size="lg">
                    Return Home
                </Button>
            </Link>
        </Container>
    )
}
