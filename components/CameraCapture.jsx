'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { Button } from 'react-bootstrap'
import { Camera, RefreshCw, X } from 'lucide-react'

export default function CameraCapture({ onCapture, onClose }) {
    const videoRef = useRef(null)
    const [stream, setStream] = useState(null)
    const [error, setError] = useState(null)
    const [facingMode, setFacingMode] = useState('user') // 'user' (front) or 'environment' (back)

    const startCamera = useCallback(async () => {
        try {
            if (stream) {
                stream.getTracks().forEach(track => track.stop())
            }

            const newStream = await navigator.mediaDevices.getUserMedia({
                video: { facingMode: facingMode }
            })

            setStream(newStream)
            if (videoRef.current) {
                videoRef.current.srcObject = newStream
            }
            setError(null)
        } catch (err) {
            console.error("Camera error:", err)
            setError("Unable to access camera. Please allow permissions.")
        }
    }, [facingMode])

    useEffect(() => {
        startCamera()
        return () => {
            if (stream) {
                stream.getTracks().forEach(track => track.stop())
            }
        }
    }, [startCamera])

    const capturePhoto = () => {
        if (!videoRef.current) return

        const canvas = document.createElement('canvas')
        canvas.width = videoRef.current.videoWidth
        canvas.height = videoRef.current.videoHeight
        const ctx = canvas.getContext('2d')
        ctx.drawImage(videoRef.current, 0, 0)

        const dataUrl = canvas.toDataURL('image/jpeg')
        onCapture(dataUrl)
        onClose() // Stop camera and close
    }

    const toggleCamera = () => {
        setFacingMode(prev => prev === 'user' ? 'environment' : 'user')
    }

    return (
        <div className="position-fixed top-0 start-0 w-100 h-100 d-flex flex-column align-items-center justify-content-center" style={{ zIndex: 2000, backgroundColor: 'black' }}>
            {/* Close Button */}
            <Button
                variant="link"
                className="position-absolute top-0 end-0 m-3 text-white"
                onClick={onClose}
            >
                <X size={32} />
            </Button>

            {/* Error Message */}
            {error && (
                <div className="text-danger mb-4 text-center px-3">
                    {error}
                </div>
            )}

            {/* Viewfinder */}
            <div className="position-relative w-100 h-100 d-flex align-items-center justify-content-center overflow-hidden" style={{ backgroundColor: 'black' }}>
                <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    className="w-100 h-100"
                    style={{ objectFit: 'cover', maxHeight: '100vh', maxWidth: '100vw' }}
                />
            </div>

            {/* Controls */}
            <div
                className="position-absolute bottom-0 w-100 p-4 d-flex justify-content-center align-items-center gap-4"
                style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.8), transparent)' }}
            >
                <Button
                    variant="outline-light"
                    className="rounded-circle p-3 border-0 bg-white bg-opacity-10"
                    onClick={toggleCamera}
                >
                    <RefreshCw size={24} />
                </Button>

                <Button
                    variant="light"
                    className="rounded-circle p-1"
                    style={{ width: '80px', height: '80px' }}
                    onClick={capturePhoto}
                >
                    <div className="w-100 h-100 rounded-circle border border-4 border-white bg-white"></div>
                </Button>

                <div style={{ width: '50px' }}></div> {/* Spacer for balance */}
            </div>
        </div>
    )
}
