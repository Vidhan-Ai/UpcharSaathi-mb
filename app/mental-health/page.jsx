'use client'

import { useState } from 'react'
import { Container, Row, Col, Card, Button, ProgressBar, Form, Badge } from 'react-bootstrap'
import { motion, AnimatePresence } from 'framer-motion'
import {
    Brain,
    Heart,
    Smile,
    Sun,
    ClipboardList,
    Headphones,
    BookOpen,
    Phone,
    Play,
    Pause,
    RotateCcw,
    CheckCircle2,
    Frown,
    Meh,
    AlertCircle
} from 'lucide-react'

const soothingStyles = {
    gradientText: {
        background: 'linear-gradient(135deg, #7c3aed 0%, #db2777 100%)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent'
    },
    glassCard: {
        background: 'rgba(255, 255, 255, 0.85)',
        backdropFilter: 'blur(12px)',
        border: '1px solid rgba(255, 255, 255, 0.5)',
        boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.05)',
        borderRadius: '1.5rem',
        overflow: 'hidden',
        transition: 'all 0.3s ease'
    },
    activeTab: {
        background: 'linear-gradient(135deg, #7c3aed 0%, #db2777 100%)',
        color: 'white',
        border: 'none'
    },
    inactiveTab: {
        background: 'white',
        color: '#64748b',
        border: '1px solid #e2e8f0'
    }
}

// --- Components ---

const AssessmentTool = () => {
    const [step, setStep] = useState(0)
    const [score, setScore] = useState(0)
    const [showResult, setShowResult] = useState(false)
    const [started, setStarted] = useState(false)

    const questions = [
        "Little interest or pleasure in doing things?",
        "Feeling down, depressed, or hopeless?",
        "Trouble falling or staying asleep, or sleeping too much?",
        "Feeling tired or having little energy?",
        "Poor appetite or overeating?"
    ]

    const handleAnswer = (value) => {
        const newScore = score + value
        if (step < questions.length - 1) {
            setScore(newScore)
            setStep(step + 1)
        } else {
            setScore(newScore)
            setShowResult(true)
        }
    }

    const resetAssessment = () => {
        setStep(0)
        setScore(0)
        setShowResult(false)
        setStarted(false)
    }

    const getResult = () => {
        if (score <= 4) return { text: "Minimal Depression", color: "success", advice: "You seem to be doing well. Keep maintaining your mental hygiene." }
        if (score <= 9) return { text: "Mild Depression", color: "warning", advice: "Consider monitoring your mood and practicing self-care." }
        if (score <= 14) return { text: "Moderate Depression", color: "orange", advice: "It might be helpful to talk to a professional counselor." }
        return { text: "Moderately Severe Depression", color: "danger", advice: "Please seek professional help. You don't have to go through this alone." }
    }

    return (
        <Card style={soothingStyles.glassCard} className="p-4 h-100">
            <Card.Body>
                <div className="d-flex align-items-center gap-3 mb-4">
                    <div className="p-3 rounded-circle bg-primary bg-opacity-10 text-primary">
                        <ClipboardList size={24} />
                    </div>
                    <h4 className="fw-bold mb-0">Mental Health Assessment</h4>
                </div>

                {!started ? (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center py-5"
                    >
                        <div className="mb-4">
                            <ClipboardList size={64} className="text-primary opacity-50" />
                        </div>
                        <h4 className="fw-bold mb-3">PHQ-9 Depression Screening</h4>
                        <p className="text-muted mb-4 px-4">
                            This brief, confidential assessment helps you track your mood and understand your mental well-being. It takes less than a minute to complete.
                        </p>
                        <Button
                            variant="primary"
                            size="lg"
                            className="rounded-pill px-5 shadow-sm fw-bold"
                            onClick={() => setStarted(true)}
                        >
                            Start Assessment
                        </Button>
                    </motion.div>
                ) : !showResult ? (
                    <motion.div
                        key="question"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                    >
                        <div className="mb-4">
                            <div className="d-flex justify-content-between text-muted small mb-2">
                                <span>Question {step + 1} of {questions.length}</span>
                                <span>{Math.round(((step + 1) / questions.length) * 100)}%</span>
                            </div>
                            <ProgressBar now={((step + 1) / questions.length) * 100} variant="primary" className="mb-4" style={{ height: '6px' }} />
                            <h5 className="mb-4 fw-medium text-dark">{questions[step]}</h5>
                        </div>
                        <div className="d-grid gap-3">
                            <Button variant="outline-light" className="text-dark border text-start p-3 hover-bg-light" onClick={() => handleAnswer(0)}>Not at all</Button>
                            <Button variant="outline-light" className="text-dark border text-start p-3 hover-bg-light" onClick={() => handleAnswer(1)}>Several days</Button>
                            <Button variant="outline-light" className="text-dark border text-start p-3 hover-bg-light" onClick={() => handleAnswer(2)}>More than half the days</Button>
                            <Button variant="outline-light" className="text-dark border text-start p-3 hover-bg-light" onClick={() => handleAnswer(3)}>Nearly every day</Button>
                        </div>
                    </motion.div>
                ) : (
                    <motion.div
                        key="result"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="text-center py-4"
                    >
                        <div className={`d-inline-flex p-4 rounded-circle bg-${getResult().color} bg-opacity-10 text-${getResult().color} mb-4`}>
                            <CheckCircle2 size={48} />
                        </div>
                        <h3 className="fw-bold mb-2">{getResult().text}</h3>
                        <p className="text-muted mb-4">{getResult().advice}</p>
                        <Button variant="primary" className="rounded-pill px-4" onClick={resetAssessment}>Retake Assessment</Button>
                    </motion.div>
                )}
            </Card.Body>
        </Card>
    )
}

const MeditationPlayer = () => {
    const [isPlaying, setIsPlaying] = useState(false)
    const [timeLeft, setTimeLeft] = useState(300) // 5 minutes
    const [activeSession, setActiveSession] = useState('Breathing')

    const togglePlay = () => setIsPlaying(!isPlaying)

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60)
        const secs = seconds % 60
        return `${mins}:${secs < 10 ? '0' : ''}${secs}`
    }

    return (
        <Card style={soothingStyles.glassCard} className="p-4 h-100">
            <Card.Body>
                <div className="d-flex align-items-center gap-3 mb-4">
                    <div className="p-3 rounded-circle bg-info bg-opacity-10 text-info">
                        <Headphones size={24} />
                    </div>
                    <h4 className="fw-bold mb-0">Guided Meditation</h4>
                </div>

                <div className="text-center py-4 mb-4 rounded-4 bg-light">
                    <div className="mb-3 text-muted text-uppercase tracking-wider small">{activeSession}</div>
                    <div className="display-1 fw-bold text-dark mb-4 font-monospace">{formatTime(timeLeft)}</div>
                    <div className="d-flex justify-content-center gap-3">
                        <Button
                            variant={isPlaying ? "warning" : "success"}
                            className="rounded-circle p-3 d-flex align-items-center justify-content-center"
                            style={{ width: '64px', height: '64px' }}
                            onClick={togglePlay}
                        >
                            {isPlaying ? <Pause size={28} /> : <Play size={28} className="ms-1" />}
                        </Button>
                        <Button
                            variant="outline-secondary"
                            className="rounded-circle p-3 d-flex align-items-center justify-content-center"
                            style={{ width: '64px', height: '64px' }}
                            onClick={() => { setIsPlaying(false); setTimeLeft(300); }}
                        >
                            <RotateCcw size={24} />
                        </Button>
                    </div>
                </div>

                <div className="d-flex gap-2 overflow-auto pb-2">
                    {['Breathing', 'Anxiety Release', 'Sleep', 'Focus'].map((session) => (
                        <Button
                            key={session}
                            variant={activeSession === session ? "primary" : "outline-light"}
                            className={`rounded-pill px-4 py-2 ${activeSession !== session ? 'text-dark border' : ''}`}
                            onClick={() => setActiveSession(session)}
                        >
                            {session}
                        </Button>
                    ))}
                </div>
            </Card.Body>
        </Card>
    )
}

const MoodTracker = () => {
    const [selectedMood, setSelectedMood] = useState(null)
    const [history, setHistory] = useState([])

    const moods = [
        { icon: Sun, label: 'Great', color: '#fbbf24' },
        { icon: Smile, label: 'Good', color: '#4ade80' },
        { icon: Meh, label: 'Okay', color: '#94a3b8' },
        { icon: Frown, label: 'Bad', color: '#f87171' },
        { icon: AlertCircle, label: 'Awful', color: '#ef4444' }
    ]

    const handleMoodSelect = (mood) => {
        setSelectedMood(mood)
        setHistory([{ ...mood, date: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }, ...history].slice(0, 5))
    }

    return (
        <Card style={soothingStyles.glassCard} className="p-4 h-100">
            <Card.Body>
                <div className="d-flex align-items-center gap-3 mb-4">
                    <div className="p-3 rounded-circle bg-warning bg-opacity-10 text-warning">
                        <Heart size={24} />
                    </div>
                    <h4 className="fw-bold mb-0">Mood Tracker</h4>
                </div>

                <div className="d-flex justify-content-between mb-5">
                    {moods.map((mood, idx) => (
                        <motion.div key={idx} whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
                            <div
                                className="d-flex flex-column align-items-center cursor-pointer"
                                onClick={() => handleMoodSelect(mood)}
                            >
                                <div
                                    className="p-3 rounded-circle mb-2 transition-all"
                                    style={{
                                        backgroundColor: selectedMood?.label === mood.label ? mood.color : '#f1f5f9',
                                        color: selectedMood?.label === mood.label ? 'white' : '#64748b'
                                    }}
                                >
                                    <mood.icon size={24} />
                                </div>
                                <span className="small text-muted">{mood.label}</span>
                            </div>
                        </motion.div>
                    ))}
                </div>

                <h6 className="text-muted text-uppercase tracking-wider small mb-3">Recent Entries</h6>
                <div className="d-flex flex-column gap-3">
                    {history.length > 0 ? history.map((entry, idx) => (
                        <div key={idx} className="d-flex align-items-center justify-content-between p-3 rounded-3 bg-light">
                            <div className="d-flex align-items-center gap-3">
                                <entry.icon size={20} style={{ color: entry.color }} />
                                <span className="fw-medium">{entry.label}</span>
                            </div>
                            <span className="text-muted small">{entry.date}</span>
                        </div>
                    )) : (
                        <div className="text-center text-muted py-4 small">No mood entries yet today.</div>
                    )}
                </div>
            </Card.Body>
        </Card>
    )
}

const TherapyResources = () => {
    const resources = [
        { title: "National Helpline", number: "1-800-273-8255", icon: Phone, color: "danger" },
        { title: "Crisis Text Line", number: "Text HOME to 741741", icon: AlertCircle, color: "warning" },
        { title: "Find a Therapist", number: "Psychology Today", icon: BookOpen, color: "primary" }
    ]

    return (
        <Card style={soothingStyles.glassCard} className="p-4 h-100">
            <Card.Body>
                <div className="d-flex align-items-center gap-3 mb-4">
                    <div className="p-3 rounded-circle bg-success bg-opacity-10 text-success">
                        <BookOpen size={24} />
                    </div>
                    <h4 className="fw-bold mb-0">Therapy Resources</h4>
                </div>

                <div className="d-grid gap-3">
                    {resources.map((res, idx) => (
                        <div key={idx} className="d-flex align-items-center p-3 rounded-4 bg-white border shadow-sm hover-shadow transition-all">
                            <div className={`p-3 rounded-circle bg-${res.color} bg-opacity-10 text-${res.color} me-3`}>
                                <res.icon size={24} />
                            </div>
                            <div>
                                <h6 className="fw-bold mb-1">{res.title}</h6>
                                <p className="mb-0 text-muted small">{res.number}</p>
                            </div>
                            <Button variant="link" className="ms-auto text-muted">
                                <RotateCcw size={16} className="opacity-0" /> {/* Spacer */}
                            </Button>
                        </div>
                    ))}
                </div>

                <div className="mt-4 p-3 rounded-4 bg-primary bg-opacity-10 text-primary small">
                    <strong>Note:</strong> If you are in immediate danger, please call your local emergency number (911) immediately.
                </div>
            </Card.Body>
        </Card>
    )
}

export default function MentalHealthPage() {
    const [activeTab, setActiveTab] = useState('assessment')

    const tabs = [
        { id: 'assessment', label: 'Assessment', icon: ClipboardList },
        { id: 'meditation', label: 'Meditation', icon: Headphones },
        { id: 'mood', label: 'Mood Tracker', icon: Heart },
        { id: 'resources', label: 'Resources', icon: BookOpen },
    ]

    return (
        <Container className="py-5">
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="text-center mb-5"
            >
                <div className="d-inline-flex align-items-center justify-content-center p-4 rounded-circle mb-4 shadow-sm" style={{ background: 'linear-gradient(135deg, #fdf4ff 0%, #ffffff 100%)' }}>
                    <Brain size={48} className="text-primary" style={{ color: '#9333ea' }} />
                </div>
                <h1 className="fw-bold mb-3 display-4" style={soothingStyles.gradientText}>Mental Wellness Hub</h1>
                <p className="text-muted fs-5" style={{ maxWidth: '600px', margin: '0 auto' }}>
                    A comprehensive toolkit for your mental well-being.
                </p>
            </motion.div>

            {/* Navigation Tabs */}
            <div className="d-flex justify-content-center gap-3 mb-5 flex-wrap">
                {tabs.map((tab) => (
                    <motion.button
                        key={tab.id}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setActiveTab(tab.id)}
                        className="btn px-4 py-3 rounded-pill d-flex align-items-center gap-2 fw-bold shadow-sm"
                        style={activeTab === tab.id ? soothingStyles.activeTab : soothingStyles.inactiveTab}
                    >
                        <tab.icon size={20} />
                        {tab.label}
                    </motion.button>
                ))}
            </div>

            {/* Content Area */}
            <Row className="justify-content-center">
                <Col lg={8}>
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeTab}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.3 }}
                        >
                            {activeTab === 'assessment' && <AssessmentTool />}
                            {activeTab === 'meditation' && <MeditationPlayer />}
                            {activeTab === 'mood' && <MoodTracker />}
                            {activeTab === 'resources' && <TherapyResources />}
                        </motion.div>
                    </AnimatePresence>
                </Col>
            </Row>
        </Container>
    )
}
