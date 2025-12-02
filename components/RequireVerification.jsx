'use client'
import { useAuth } from '@/contexts/AuthContext'
import { Alert, Button } from 'react-bootstrap'
import { ShieldAlert, Mail } from 'lucide-react'
import { useState } from 'react'

export default function RequireVerification({ children, feature = "this feature" }) {
    const { user } = useAuth()
    const [resending, setResending] = useState(false)
    const [message, setMessage] = useState('')

    // If user is verified, show the content
    if (user?.email_verified) {
        return <>{children}</>
    }

    // If user is not verified, show verification required message
    const handleResendEmail = async () => {
        setResending(true)
        setMessage('')

        try {
            const response = await fetch('/api/auth/resend-verification', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
            })

            const data = await response.json()

            if (response.ok) {
                setMessage('Verification email sent! Please check your inbox.')
            } else {
                setMessage(data.message || 'Failed to send verification email')
            }
        } catch (error) {
            setMessage('An error occurred. Please try again.')
        } finally {
            setResending(false)
        }
    }

    return (
        <div className="container py-5">
            <div className="row justify-content-center">
                <div className="col-md-8 col-lg-6">
                    <Alert variant="warning" className="text-center p-4 border-0 shadow-sm" style={{ borderRadius: '1rem' }}>
                        <ShieldAlert size={64} className="text-warning mb-3" />
                        <h3 className="fw-bold mb-3">Email Verification Required</h3>
                        <p className="mb-4">
                            You need to verify your email address to access {feature}.
                            We've sent a verification link to <strong>{user?.email}</strong>.
                        </p>

                        {message && (
                            <Alert variant={message.includes('sent') ? 'success' : 'danger'} className="mb-3">
                                {message}
                            </Alert>
                        )}

                        <div className="d-flex gap-3 justify-content-center flex-wrap">
                            <Button
                                variant="warning"
                                onClick={handleResendEmail}
                                disabled={resending}
                                className="d-flex align-items-center gap-2"
                            >
                                <Mail size={18} />
                                {resending ? 'Sending...' : 'Resend Verification Email'}
                            </Button>
                        </div>

                        <p className="text-muted mt-4 mb-0 small">
                            Please check your spam folder if you don't see the email in your inbox.
                        </p>
                    </Alert>
                </div>
            </div>
        </div>
    )
}
