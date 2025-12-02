'use client'
import { Alert, Button } from 'react-bootstrap'
import { AlertCircle, Mail } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { useState } from 'react'

export default function VerificationBanner() {
    const { user } = useAuth()
    const [resending, setResending] = useState(false)
    const [message, setMessage] = useState('')

    if (!user || user.email_verified) {
        return null
    }

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
        <Alert
            variant="warning"
            className="mb-0 rounded-0 border-0 d-flex align-items-center justify-content-between"
            style={{
                background: 'linear-gradient(to right, #fef3c7, #fde68a)',
                borderBottom: '2px solid #f59e0b'
            }}
        >
            <div className="d-flex align-items-center gap-2">
                <AlertCircle size={20} className="text-warning" />
                <div>
                    <strong>Email Verification Required</strong>
                    <p className="mb-0 small">
                        Please verify your email to access all features. Check your inbox for the verification link.
                    </p>
                    {message && <p className="mb-0 small text-success mt-1">{message}</p>}
                </div>
            </div>
            <Button
                variant="outline-warning"
                size="sm"
                onClick={handleResendEmail}
                disabled={resending}
                className="d-flex align-items-center gap-2"
            >
                <Mail size={16} />
                {resending ? 'Sending...' : 'Resend Email'}
            </Button>
        </Alert>
    )
}
