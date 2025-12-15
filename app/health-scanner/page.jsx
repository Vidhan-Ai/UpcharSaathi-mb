'use client'

import { useState, useRef, useEffect } from 'react'
import { Container, Row, Col, Card, Button, ProgressBar, Form, Badge, Alert } from 'react-bootstrap'
import { motion, AnimatePresence } from 'framer-motion'
import { Upload, Camera, ChevronRight, CheckCircle2, AlertTriangle, Eye, Activity, RotateCcw } from 'lucide-react'
import { analyzeHealthImage } from '@/utils/analyzers'
import { saveHealthScreening } from '@/app/actions/health-scanner'
import { useRouter } from 'next/navigation'
import CameraCapture from '@/components/CameraCapture'

export default function HealthScannerPage() {
    const [step, setStep] = useState('intro') // intro, eye, tongue, nails, processing, result
    const [results, setResults] = useState({
        eye: null,
        tongue: null,
        nails: null
    })
    const [images, setImages] = useState({
        eye: null,
        tongue: null,
        nails: null
    })
    const [isAnalyzing, setIsAnalyzing] = useState(false)
    const [showCamera, setShowCamera] = useState(false)
    const [cameraType, setCameraType] = useState(null)
    const fileInputRef = useRef(null)

    const handleImageUpload = (e, type) => {
        const file = e.target.files[0]
        if (!file) return

        const reader = new FileReader()
        reader.onload = (event) => {
            const img = new Image()
            img.onload = () => {
                const canvas = document.createElement('canvas')
                canvas.width = img.width
                canvas.height = img.height
                const ctx = canvas.getContext('2d')
                ctx.drawImage(img, 0, 0)
                const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)

                const analysis = analyzeHealthImage(imageData, type)
                setResults(prev => ({ ...prev, [type]: analysis }))
                setImages(prev => ({ ...prev, [type]: event.target.result }))
            }
            img.src = event.target.result
        }
        reader.readAsDataURL(file)
    }

    const handleCameraCapture = (dataUrl) => {
        setImages(prev => ({ ...prev, [cameraType]: dataUrl }))
        setShowCamera(false)

        const img = new Image()
        img.onload = () => {
            const canvas = document.createElement('canvas')
            canvas.width = img.width
            canvas.height = img.height
            const ctx = canvas.getContext('2d')
            ctx.drawImage(img, 0, 0)
            const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)

            const analysis = analyzeHealthImage(imageData, cameraType)
            setResults(prev => ({ ...prev, [cameraType]: analysis }))
        }
        img.src = dataUrl
    }

    const nextStep = () => {
        if (step === 'intro') setStep('eye')
        else if (step === 'eye') setStep('tongue')
        else if (step === 'tongue') setStep('nails')
        else if (step === 'nails') finishAndSave()
    }

    const finishAndSave = async () => {
        setStep('processing')

        const deficiencies = []
        if (results.eye?.anemiaRisk === 'High') deficiencies.push("Possible Iron Efficiency (Anemia)")
        if (results.eye?.jaundiceRisk === 'Possible') deficiencies.push("Possible Vitamin B12 Deficiency / Liver Issue")
        if (results.tongue?.vitaminBRisk === 'High') deficiencies.push("Possible Vitamin B Complex Deficiency")
        if (results.nails?.anemiaRisk === 'High') deficiencies.push("Possible Iron Deficiency (Nail signs)")
        if (results.nails?.zincRisk === 'Possible') deficiencies.push("Possible Zinc Deficiency")

        await saveHealthScreening({
            deficienciesDetected: deficiencies,
            analysisData: results,
            images: { eye: !!images.eye, tongue: !!images.tongue, nails: !!images.nails }
        })

        setStep('result')
    }

    const renderScanStep = (type, title, instruction, icon) => (
        <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="text-center"
        >
            <div className="d-inline-flex align-items-center justify-content-center p-3 rounded-circle mb-4 text-white" style={{ background: 'rgba(59, 130, 246, 0.2)' }}>
                {icon}
            </div>
            <h2 className="fw-bold mb-3 text-white">{title}</h2>
            <p className="text-white-50 mb-4" style={{ maxWidth: '400px', margin: '0 auto' }}>{instruction}</p>

            <div
                className="mx-auto mb-4 rounded-4 d-flex align-items-center justify-content-center border overflow-hidden position-relative"
                style={{ width: '300px', height: '300px', borderStyle: 'dashed', borderColor: 'rgba(255,255,255,0.2)', background: 'rgba(0,0,0,0.2)' }}
            >
                {images[type] ? (
                    <>
                        <img src={images[type]} alt="Preview" className="w-100 h-100 object-fit-cover" />
                        <div className="position-absolute bottom-0 w-100 p-2 text-white small" style={{ background: 'rgba(0,0,0,0.7)' }}>
                            ✓ Image captured
                        </div>
                    </>
                ) : (
                    <div className="text-white-50 text-center p-3">
                        <Upload size={40} className="mb-2 opacity-50" />
                        <p className="small mb-0">Tap to Upload or Take Photo</p>
                    </div>
                )}

                <input
                    type="file"
                    accept="image/*"
                    className="position-absolute top-0 start-0 w-100 h-100 opacity-0 cursor-pointer"
                    onChange={(e) => handleImageUpload(e, type)}
                />
            </div>

            <div className="d-flex justify-content-center gap-3 mb-4">
                <Button
                    variant="outline-light"
                    className="rounded-pill border-white border-opacity-25"
                    onClick={() => {
                        setCameraType(type)
                        setShowCamera(true)
                    }}
                >
                    <Camera size={18} className="me-2" /> Use Camera
                </Button>
            </div>

            <Button
                size="lg"
                className="px-5 rounded-pill border-0"
                onClick={nextStep}
                disabled={!images[type]}
                style={{ background: '#ef4444' }}
            >
                Next Step <ChevronRight size={18} className="ms-2" />
            </Button>
        </motion.div>
    )

    return (
        <Container className="py-5">
            <Row className="justify-content-center">
                <Col lg={8}>
                    <Card className="p-4 p-md-5 border-0 rounded-4" style={{ background: 'rgba(30, 41, 59, 0.4)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.1)' }}>
                        <div className="position-absolute top-0 start-0 w-100 p-3">
                            <ProgressBar
                                now={step === 'intro' ? 0 : step === 'eye' ? 25 : step === 'tongue' ? 50 : step === 'nails' ? 75 : 100}
                                variant="danger"
                                style={{ height: '4px', background: 'rgba(255,255,255,0.1)' }}
                            />
                        </div>

                        <AnimatePresence mode="wait">
                            {step === 'intro' && (
                                <motion.div
                                    key="intro"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="text-center py-4"
                                >
                                    <h1 className="display-5 fw-bold mb-4 text-white">AI Health Scanner</h1>
                                    <p className="lead text-white-50 mb-5">
                                        Use our advanced computer vision algorithms to detect visible signs of nutritional deficiencies.
                                    </p>

                                    <Row className="g-4 mb-5 text-start">
                                        {[
                                            { icon: Eye, title: "Anemia Detection", desc: "Checks eye conjunctiva for pallor (Iron Deficiency)." },
                                            { icon: Activity, title: "Vitamin Profiling", desc: "Analyzes tongue and nails for B-Vitamins and Zinc signs." },
                                        ].map((feat, i) => (
                                            <Col md={6} key={i}>
                                                <div className="d-flex gap-3 p-3 rounded-3" style={{ background: 'rgba(255,255,255,0.05)' }}>
                                                    <div className="p-2 rounded-3 h-100" style={{ background: 'rgba(59, 130, 246, 0.2)' }}>
                                                        <feat.icon size={24} className="text-primary" />
                                                    </div>
                                                    <div>
                                                        <h6 className="fw-bold mb-1 text-white">{feat.title}</h6>
                                                        <p className="text-white-50 small mb-0">{feat.desc}</p>
                                                    </div>
                                                </div>
                                            </Col>
                                        ))}
                                    </Row>

                                    <Button size="lg" className="rounded-pill px-5 border-0" onClick={nextStep} style={{ background: '#ef4444' }}>
                                        Start Scan
                                    </Button>
                                    <p className="mt-4 small text-white-50">
                                        * Not a medical diagnosis. For screening purposes only.
                                    </p>
                                </motion.div>
                            )}

                            {step === 'eye' && renderScanStep('eye', 'Eye Analysis', 'Pull down your lower eyelid to reveal the inner pink area (conjunctiva). Ensure good lighting.', <Eye size={32} />)}

                            {step === 'tongue' && renderScanStep('tongue', 'Tongue Analysis', 'Stick out your tongue comfortably. Avoid shadows.', <Activity size={32} />)}

                            {step === 'nails' && renderScanStep('nails', 'Nail Analysis', 'Place your hand flat on a surface or hold it up. Focus on the fingernails.', <CheckCircle2 size={32} />)}

                            {step === 'result' && (
                                <motion.div
                                    key="result"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="text-center"
                                >
                                    <div className="d-inline-flex align-items-center justify-content-center p-4 rounded-circle mb-4 text-emerald-400" style={{ background: 'rgba(16, 185, 129, 0.2)' }}>
                                        <CheckCircle2 size={48} />
                                    </div>
                                    <h2 className="fw-bold mb-4 text-white">Analysis Complete</h2>

                                    <Card className="border-0 mb-4 text-start rounded-3" style={{ background: 'rgba(255,255,255,0.05)' }}>
                                        <Card.Body className="p-4">
                                            <h5 className="fw-bold mb-3 text-white">Detected Risk Factors</h5>
                                            {['eye', 'tongue', 'nails'].map(part => {
                                                const res = results[part]
                                                if (!res) return null
                                                return (
                                                    <div key={part} className="mb-2">
                                                        {res.anemiaRisk === 'High' && <Alert variant="danger" className="py-2 small mb-1"><AlertTriangle size={14} className="me-2" /> High Risk of Anemia detected (Eye Palor)</Alert>}
                                                        {res.jaundiceRisk === 'Possible' && <Alert variant="warning" className="py-2 small mb-1">Possible Jaundice signs detected</Alert>}
                                                        {res.vitaminBRisk === 'High' && <Alert variant="warning" className="py-2 small mb-1">Signs of Vitamin B Deficiency (Glossitis)</Alert>}
                                                        {res.zincRisk === 'Possible' && <Alert variant="info" className="py-2 small mb-1">Possible Zinc Deficiency (Nail Spots)</Alert>}
                                                    </div>
                                                )
                                            })}
                                            {Object.values(results).every(r => r && Object.values(r).every(v => v !== 'High' && v !== 'Possible')) && (
                                                <div className="text-success fw-bold">
                                                    No significant visual deficiency signs detected!
                                                </div>
                                            )}
                                        </Card.Body>
                                    </Card>

                                    <Button variant="outline-light" className="rounded-pill border-white border-opacity-25" onClick={() => setStep('intro')}>
                                        <RotateCcw size={16} className="me-2" /> Start New Scan
                                    </Button>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </Card>
                </Col>
            </Row>

            {showCamera && (
                <CameraCapture
                    onCapture={handleCameraCapture}
                    onClose={() => setShowCamera(false)}
                />
            )}
        </Container>
    )
}
