'use client'
import { useState } from 'react'
import { Container, Row, Col, Card, Form, Button, Alert, Badge, Spinner } from 'react-bootstrap'
import { Send, Youtube, CheckCircle, AlertTriangle, AlertOctagon, FileText, Info } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

export default function FactCheckPage() {
    const [url, setUrl] = useState('')
    const [loading, setLoading] = useState(false)
    const [result, setResult] = useState(null)
    const [error, setError] = useState(null)

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!url) return

        setLoading(true)
        setError(null)
        setResult(null)

        try {
            const res = await fetch('/api/fact-check', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ url })
            })

            const data = await res.json()
            if (!res.ok) throw new Error(data.error || 'Failed to analyze video')

            setResult(data)
        } catch (err) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    const getVerdictColor = (verdict) => {
        const v = verdict?.toLowerCase() || '';
        if (v.includes('true') || v.includes('accurate')) return 'success';
        if (v.includes('false') || v.includes('misleading') || v.includes('incorrect')) return 'danger';
        return 'warning';
    }

    const getVerdictIcon = (verdict) => {
        const v = verdict?.toLowerCase() || '';
        if (v.includes('true') || v.includes('accurate')) return <CheckCircle size={24} />;
        if (v.includes('false') || v.includes('misleading') || v.includes('incorrect')) return <AlertOctagon size={24} />;
        return <AlertTriangle size={24} />;
    }

    return (
        <Container className="py-5" style={{ minHeight: '100vh', marginTop: '70px' }}>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <div className="text-center mb-5">
                    <h1 className="fw-bold display-4 mb-3 text-gradient">AI Health Fact Checker</h1>
                    <p className="text-muted lead mx-auto" style={{ maxWidth: '600px' }}>
                        Paste a YouTube video link below to get an instant summary and fact-check analysis of the health claims made in the video.
                    </p>
                </div>

                <Row className="justify-content-center mb-5">
                    <Col md={8} lg={6}>
                        <Card className="border-0 shadow-lg rounded-4 overflow-hidden">
                            <Card.Body className="p-2">
                                <Form onSubmit={handleSubmit} className="d-flex gap-2">
                                    <div className="position-relative flex-grow-1">
                                        <div className="position-absolute top-50 start-0 translate-middle-y ps-3 text-muted">
                                            <Youtube size={20} />
                                        </div>
                                        <Form.Control
                                            type="url"
                                            placeholder="Paste YouTube Video URL here..."
                                            value={url}
                                            onChange={(e) => setUrl(e.target.value)}
                                            className="border-0 bg-light py-3 ps-5 rounded-pill shadow-none"
                                            style={{ fontSize: '1rem' }}
                                        />
                                    </div>
                                    <Button
                                        type="submit"
                                        variant="primary"
                                        disabled={loading || !url}
                                        className="rounded-pill px-4 d-flex align-items-center gap-2 shadow-sm"
                                        style={{ background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)', border: 'none' }}
                                    >
                                        {loading ? <Spinner size="sm" animation="border" /> : <Send size={18} />}
                                        <span className="d-none d-sm-inline">Analyze</span>
                                    </Button>
                                </Form>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>

                {error && (
                    <Row className="justify-content-center mb-4">
                        <Col md={8}>
                            <Alert variant="danger" className="rounded-4 border-0 shadow-sm d-flex align-items-center gap-3">
                                <AlertOctagon size={24} />
                                <div>{error}</div>
                            </Alert>
                        </Col>
                    </Row>
                )}

                <AnimatePresence>
                    {result && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            transition={{ duration: 0.4 }}
                        >
                            <Row className="justify-content-center g-4">
                                {/* Summary Section */}
                                <Col md={5}>
                                    <Card className="h-100 border-0 shadow-sm rounded-4 bg-white">
                                        <Card.Body className="p-4">
                                            <div className="d-flex align-items-center gap-2 mb-4 text-primary">
                                                <div className="p-2 bg-primary bg-opacity-10 rounded-circle">
                                                    <FileText size={20} />
                                                </div>
                                                <h5 className="fw-bold m-0">Video Summary</h5>
                                            </div>
                                            <div className="text-muted" style={{ lineHeight: '1.7' }}>
                                                {result.summary}
                                            </div>
                                        </Card.Body>
                                    </Card>
                                </Col>

                                {/* Fact Check Section */}
                                <Col md={7}>
                                    <Card className={`h-100 border-0 shadow-sm rounded-4 bg-white border-top border-4 border-${getVerdictColor(result.verdict)}`}>
                                        <Card.Body className="p-4">
                                            <div className="d-flex align-items-center justify-content-between mb-4">
                                                <div className="d-flex align-items-center gap-2">
                                                    <div className={`p-2 bg-${getVerdictColor(result.verdict)} bg-opacity-10 rounded-circle text-${getVerdictColor(result.verdict)}`}>
                                                        <Info size={20} />
                                                    </div>
                                                    <h5 className="fw-bold m-0 text-dark">Fact Check Analysis</h5>
                                                </div>
                                                <Badge bg={getVerdictColor(result.verdict)} className="px-3 py-2 rounded-pill d-flex align-items-center gap-2" style={{ fontSize: '0.9rem' }}>
                                                    {getVerdictIcon(result.verdict)}
                                                    {result.verdict}
                                                </Badge>
                                            </div>

                                            <div className="mb-4">
                                                <h6 className="text-uppercase text-muted small fw-bold mb-3" style={{ letterSpacing: '1px' }}>Key Findings & Analysis</h6>
                                                <div className="p-3 bg-light rounded-3 text-secondary" style={{ whiteSpace: 'pre-wrap', lineHeight: '1.7' }}>
                                                    {result.analysis}
                                                </div>
                                            </div>

                                            {result.claims && result.claims.length > 0 && (
                                                <div className="mb-4">
                                                    <h6 className="text-uppercase text-muted small fw-bold mb-3" style={{ letterSpacing: '1px' }}>Verified Claims Breakdown</h6>
                                                    <div className="d-flex flex-column gap-3">
                                                        {result.claims.map((claim, idx) => {
                                                            const status = claim.status?.toLowerCase() || 'unverified';
                                                            const isVerified = status.includes('verified') || status.includes('accurate');
                                                            const isDebunked = status.includes('debunked') || status.includes('false');
                                                            const isWarning = !isVerified && !isDebunked;

                                                            return (
                                                                <div key={idx} className="p-3 bg-light rounded-3 border-start border-4" style={{ borderColor: isVerified ? '#198754' : isDebunked ? '#dc3545' : '#ffc107' }}>
                                                                    <div className="d-flex justify-content-between align-items-start mb-2">
                                                                        <span className="fw-bold text-dark">{claim.claim}</span>
                                                                        <Badge bg={isVerified ? 'success' : isDebunked ? 'danger' : 'warning'} className="text-capitalize">
                                                                            {claim.status || 'Unverified'}
                                                                        </Badge>
                                                                    </div>
                                                                    <p className="mb-0 small text-muted">{claim.explanation}</p>
                                                                </div>
                                                            );
                                                        })}
                                                    </div>
                                                </div>
                                            )}

                                            <div className="small text-muted d-flex gap-2 align-items-center mt-3 pt-3 border-top">
                                                <Info size={14} />
                                                <span>AI-generated content. Proceed with discretion. Always consult a real doctor.</span>
                                            </div>
                                        </Card.Body>
                                    </Card>
                                </Col>
                            </Row>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>
        </Container>
    )
}
