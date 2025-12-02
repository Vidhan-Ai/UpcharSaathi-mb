'use client'
import { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import { Button, Container, Row, Col, Form, Alert } from "react-bootstrap"
import Link from 'next/link'

export default function Signup() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    dob: '',
    gender: '',
    blood_group: ''
  })
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const { signup } = useAuth()
  const router = useRouter()

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      await signup(formData.name, formData.email, formData.password, formData.phone, formData.dob, formData.gender, formData.blood_group)
      router.push('/')
    } catch (error) {
      setError(error.message || 'Something went wrong during signup')
      console.error('Signup failed:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center py-5" style={{ background: 'linear-gradient(to right, #fef2f2, #ffe4e6, #fef2f2)' }}>
      <Container>
        <Row className="justify-content-center">
          <Col md={8} lg={6}>
            <div style={{
              background: '#ffffff',
              border: '1px solid #fecaca',
              borderRadius: '1rem',
              padding: '2rem',
              boxShadow: '0 4px 20px rgba(220, 38, 38, 0.05)'
            }}>
              <h2 className="text-2xl fw-bold text-center mb-4 text-dark">Create an Account</h2>

              {error && (
                <Alert variant="danger" dismissible onClose={() => setError('')}>
                  {error}
                </Alert>
              )}

              <Form onSubmit={handleSubmit}>
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label className="text-muted">Full Name *</Form.Label>
                      <Form.Control
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="bg-light text-dark border-light"
                        style={{ border: '1px solid #fecaca' }}
                        required
                      />
                    </Form.Group>
                  </Col>

                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label className="text-muted">Email *</Form.Label>
                      <Form.Control
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="bg-light text-dark border-light"
                        style={{ border: '1px solid #fecaca' }}
                        required
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label className="text-muted">Password *</Form.Label>
                      <Form.Control
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        className="bg-light text-dark border-light"
                        style={{ border: '1px solid #fecaca' }}
                        required
                      />
                    </Form.Group>
                  </Col>

                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label className="text-muted">Phone Number</Form.Label>
                      <Form.Control
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className="bg-light text-dark border-light"
                        style={{ border: '1px solid #fecaca' }}
                        placeholder="+91 1234567890"
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label className="text-muted">Date of Birth</Form.Label>
                      <Form.Control
                        type="date"
                        name="dob"
                        value={formData.dob}
                        onChange={handleChange}
                        className="bg-light text-dark border-light"
                        style={{ border: '1px solid #fecaca' }}
                      />
                    </Form.Group>
                  </Col>

                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label className="text-muted">Gender</Form.Label>
                      <Form.Select
                        name="gender"
                        value={formData.gender}
                        onChange={handleChange}
                        className="bg-light text-dark border-light"
                        style={{ border: '1px solid #fecaca' }}
                      >
                        <option value="">Select Gender</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other</option>
                      </Form.Select>
                    </Form.Group>
                  </Col>
                </Row>

                <Form.Group className="mb-4">
                  <Form.Label className="text-muted">Blood Group</Form.Label>
                  <Form.Select
                    name="blood_group"
                    value={formData.blood_group}
                    onChange={handleChange}
                    className="bg-light text-dark border-light"
                    style={{ border: '1px solid #fecaca' }}
                  >
                    <option value="">Select Blood Group</option>
                    <option value="A+">A+</option>
                    <option value="A-">A-</option>
                    <option value="B+">B+</option>
                    <option value="B-">B-</option>
                    <option value="AB+">AB+</option>
                    <option value="AB-">AB-</option>
                    <option value="O+">O+</option>
                    <option value="O-">O-</option>
                  </Form.Select>
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
                  {isLoading ? 'Signing up...' : 'Sign Up'}
                </Button>
              </Form>

              <p className="mt-4 text-center text-muted">
                Already have an account?{' '}
                <Link href="/auth/login" className="text-decoration-none" style={{ color: '#dc2626', fontWeight: '600' }}>
                  Login
                </Link>
              </p>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  )
}