'use client'
import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter, useSearchParams } from 'next/navigation'
import { Button, Container, Row, Col, Form, Alert } from "react-bootstrap"
import Link from 'next/link'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const { login, isAuthenticated, user } = useAuth()
  const router = useRouter()
  const searchParams = useSearchParams()
  const verified = searchParams.get('verified')

  useEffect(() => {
    if (isAuthenticated && user) {
      router.push('/')
    }
  }, [isAuthenticated, user, router])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      await login(email, password)
      router.push('/')
    } catch (error) {
      setError(error.message || 'Invalid email or password')
      console.error('Login failed:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center" style={{ background: 'linear-gradient(to right, #fef2f2, #ffe4e6, #fef2f2)' }}>
      <Container>
        <Row className="justify-content-center">
          <Col md={6} lg={5}>
            <div style={{
              background: '#ffffff',
              border: '1px solid #fecaca',
              borderRadius: '1rem',
              padding: '2rem',
              boxShadow: '0 4px 20px rgba(220, 38, 38, 0.05)'
            }}>
              <h2 className="text-2xl fw-bold text-center mb-4 text-dark">Login to UpcharSaathi</h2>

              {verified && (
                <Alert variant="success">
                  Email verified successfully! You can now login.
                </Alert>
              )}

              {error && (
                <Alert variant="danger" dismissible onClose={() => setError('')}>
                  {error}
                </Alert>
              )}

              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label className="text-muted">Email</Form.Label>
                  <Form.Control
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="bg-light text-dark border-light"
                    style={{ border: '1px solid #fecaca' }}
                    required
                    autoComplete="email"
                  />
                </Form.Group>

                <Form.Group className="mb-4">
                  <Form.Label className="text-muted">Password</Form.Label>
                  <Form.Control
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="bg-light text-dark border-light"
                    style={{ border: '1px solid #fecaca' }}
                    required
                    autoComplete="current-password"
                  />
                </Form.Group>

                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-100 border-0 fw-bold"
                  style={{
                    background: 'linear-gradient(to right, #dc2626, #fb7185)',
                    transition: 'all 0.3s',
                    boxShadow: '0 4px 12px rgba(220, 38, 38, 0.2)'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.transform = 'translateY(-2px)'
                    e.target.style.boxShadow = '0 6px 16px rgba(220, 38, 38, 0.3)'
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.transform = 'translateY(0)'
                    e.target.style.boxShadow = '0 4px 12px rgba(220, 38, 38, 0.2)'
                  }}
                >
                  {isLoading ? 'Logging in...' : 'Login'}
                </Button>
              </Form>

              <p className="mt-4 text-center text-muted">
                Don't have an account?{' '}
                <Link href="/auth/signup" className="text-decoration-none" style={{ color: '#dc2626', fontWeight: '600' }}>
                  Sign up
                </Link>
              </p>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  )
}