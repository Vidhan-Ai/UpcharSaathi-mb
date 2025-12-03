'use client'
import { useState, useEffect } from 'react';
import { Container, Row, Col, Form, Button, Card, Spinner, Alert, Badge } from 'react-bootstrap';
import { Search, MapPin, Navigation, Phone, Globe, Stethoscope } from 'lucide-react';
import dynamic from 'next/dynamic';
import { motion } from 'framer-motion';
import GetDirectionsButton from '@/components/GetDirectionsButton';
import { Geolocation } from '@capacitor/geolocation';

// Dynamically import map to avoid SSR issues
const DoctorMap = dynamic(() => import('@/components/DoctorMap'), { ssr: false });

export default function FindDoctorsPage() {
    const [query, setQuery] = useState('');
    const [loading, setLoading] = useState(false);
    const [results, setResults] = useState([]);
    const [error, setError] = useState(null);
    const [center, setCenter] = useState(null);

    useEffect(() => {
        // Initial location check (optional, or we can just wait for user action)
        // For now, let's just try to get it silently if possible, or default to India center
    }, []);

    const handleSearch = async (e) => {
        e.preventDefault();
        if (!query) return;

        setLoading(true);
        setError(null);
        setResults([]);

        try {
            const res = await fetch(`/api/doctors/search?q=${encodeURIComponent(query)}`);
            const data = await res.json();

            if (data.error) {
                setError(data.error);
            } else {
                setResults(data.results);
                if (data.results.length > 0) {
                    setCenter({ lat: data.results[0].latitude, lon: data.results[0].longitude });
                }
            }
        } catch (err) {
            setError('Failed to fetch doctors. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleUseMyLocation = async () => {
        setLoading(true);
        setError(null);

        try {
            try {
                const permissionStatus = await Geolocation.checkPermissions();
                if (permissionStatus.location !== 'granted') {
                    const requestStatus = await Geolocation.requestPermissions();
                    if (requestStatus.location !== 'granted') {
                        throw new Error('Location permission denied. Please enable it in settings.');
                    }
                }
            } catch (permErr) {
                // Ignore 'Not implemented on web' error as browser handles permissions automatically on getCurrentPosition
                if (permErr.message !== 'Not implemented on web.') {
                    console.warn("Permission request failed or not needed:", permErr);
                }
            }

            const position = await Geolocation.getCurrentPosition({
                enableHighAccuracy: true,
                timeout: 10000,
                maximumAge: 0
            });

            const { latitude, longitude } = position.coords;
            setCenter({ lat: latitude, lon: longitude });

            const res = await fetch(`/api/doctors/nearby?lat=${latitude}&lon=${longitude}&radius=5000`);
            const data = await res.json();

            if (data.error) setError(data.error);
            else setResults(data.results);

        } catch (err) {
            console.error('Geolocation error:', err);
            let errorMessage = 'Unable to retrieve your location.';

            if (err.message) {
                errorMessage = err.message;
            } else if (err.code) {
                switch (err.code) {
                    case 1: // PERMISSION_DENIED
                        errorMessage = 'Location permission denied.';
                        break;
                    case 2: // POSITION_UNAVAILABLE
                        errorMessage = 'Location information is unavailable.';
                        break;
                    case 3: // TIMEOUT
                        errorMessage = 'The request to get user location timed out.';
                        break;
                }
            }

            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-vh-100 py-5" style={{ backgroundColor: '#fef2f2' }}>
            <Container>
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-5"
                >
                    <h1 className="display-4 fw-bold mb-3" style={{
                        background: 'linear-gradient(to right, #dc2626, #fb7185)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent'
                    }}>
                        Find Healthcare Nearby
                    </h1>
                    <p className="lead text-muted mx-auto" style={{ maxWidth: '700px' }}>
                        Locate doctors, clinics, and hospitals instantly using our live discovery system.
                    </p>
                </motion.div>

                <Card className="shadow-lg border-0 mb-5" style={{ borderRadius: '1rem', overflow: 'hidden' }}>
                    <Card.Body className="p-4 p-lg-5 bg-white">
                        <Form onSubmit={handleSearch}>
                            <Row className="g-3">
                                <Col md={8}>
                                    <div className="position-relative">
                                        <Search className="position-absolute top-50 start-0 translate-middle-y ms-3 text-muted" size={20} />
                                        <Form.Control
                                            type="text"
                                            placeholder="e.g., Hospitals in Delhi, or just Delhi"
                                            value={query}
                                            onChange={(e) => setQuery(e.target.value)}
                                            className="ps-5 py-3 border-light bg-light"
                                            style={{ borderRadius: '0.75rem', fontSize: '1.1rem' }}
                                        />
                                    </div>
                                </Col>
                                <Col md={2}>
                                    <Button
                                        type="submit"
                                        className="w-100 py-3 fw-bold border-0"
                                        disabled={loading}
                                        style={{
                                            background: 'linear-gradient(to right, #dc2626, #fb7185)',
                                            borderRadius: '0.75rem',
                                            transition: 'transform 0.2s'
                                        }}
                                        onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.02)'}
                                        onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
                                    >
                                        {loading ? <Spinner size="sm" animation="border" /> : 'Search'}
                                    </Button>
                                </Col>
                                <Col md={2}>
                                    <Button
                                        variant="outline-danger"
                                        className="w-100 py-3 fw-bold"
                                        onClick={handleUseMyLocation}
                                        disabled={loading}
                                        style={{ borderRadius: '0.75rem', borderColor: '#fb7185', color: '#dc2626' }}
                                    >
                                        <Navigation size={18} className="me-2" /> Near Me
                                    </Button>
                                    {center && center.lat && (
                                        <div className="text-center mt-1">
                                            <small className="text-muted" style={{ fontSize: '0.7rem' }}>
                                                {center.lat.toFixed(4)}, {center.lon.toFixed(4)}
                                            </small>
                                        </div>
                                    )}
                                </Col>
                            </Row>
                        </Form>
                    </Card.Body>
                </Card>

                {error && (
                    <Alert variant="danger" className="border-0 shadow-sm mb-4" style={{ borderRadius: '0.75rem', backgroundColor: '#fee2e2', color: '#991b1b' }}>
                        {error}
                    </Alert>
                )}

                <Row className="g-4">
                    {/* Results List */}
                    <Col lg={6} className="order-2 order-lg-1">
                        <div className="d-flex flex-column gap-3">
                            {results.length > 0 ? (
                                results.map((doctor, index) => (
                                    <motion.div
                                        key={doctor.osmId}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: index * 0.05 }}
                                    >
                                        <Card className="border-0 shadow-sm custom-card h-100" style={{ borderRadius: '1rem' }}>
                                            <Card.Body className="p-4">
                                                <div className="d-flex justify-content-between align-items-start mb-2">
                                                    <div className="d-flex align-items-center gap-3">
                                                        <div className="d-flex align-items-center justify-content-center rounded-circle"
                                                            style={{ width: '48px', height: '48px', background: 'linear-gradient(135deg, #fee2e2, #ffedd5)' }}>
                                                            <Stethoscope size={24} className="text-danger" />
                                                        </div>
                                                        <div>
                                                            <h5 className="fw-bold mb-0 text-dark">{doctor.name}</h5>
                                                            <p className="text-muted small mb-0">{doctor.specialty ? doctor.specialty.replace(/_/g, ' ') : doctor.type}</p>
                                                        </div>
                                                    </div>
                                                    <Badge bg={doctor.type === 'hospital' ? 'danger' : 'info'} className="text-uppercase px-3 py-2 rounded-pill" style={{ fontSize: '0.7rem', letterSpacing: '0.5px' }}>
                                                        {doctor.type}
                                                    </Badge>
                                                </div>

                                                <hr className="my-3" style={{ borderColor: '#fecaca', opacity: 0.3 }} />

                                                <p className="text-muted small mb-3 d-flex align-items-start">
                                                    <MapPin size={16} className="me-2 mt-1 flex-shrink-0 text-danger" />
                                                    <span>
                                                        {doctor.address || 'Address not available'}
                                                        {doctor.distance && <span className="d-block mt-1 text-primary fw-medium">{doctor.distance} km away</span>}
                                                    </span>
                                                </p>

                                                <div className="d-flex gap-2 mt-auto">
                                                    <GetDirectionsButton
                                                        lat={doctor.latitude}
                                                        lon={doctor.longitude}
                                                        name={doctor.name}
                                                        className="flex-grow-1"
                                                    />
                                                    {doctor.phone && (
                                                        <a href={`tel:${doctor.phone}`} className="btn btn-sm btn-outline-danger flex-grow-1" style={{ borderRadius: '0.5rem' }}>
                                                            <Phone size={14} className="me-1" /> Call
                                                        </a>
                                                    )}
                                                    {doctor.website && (
                                                        <a href={doctor.website} target="_blank" rel="noopener noreferrer" className="btn btn-sm btn-outline-secondary flex-grow-1" style={{ borderRadius: '0.5rem' }}>
                                                            <Globe size={14} className="me-1" /> Website
                                                        </a>
                                                    )}
                                                </div>
                                            </Card.Body>
                                        </Card>
                                    </motion.div>
                                ))
                            ) : (
                                !loading && (
                                    <div className="text-center py-5">
                                        <div className="mb-3 text-muted opacity-25">
                                            <Search size={64} />
                                        </div>
                                        <h5 className="text-muted">No results found</h5>
                                        <p className="text-muted small">Try a different search term or location.</p>
                                    </div>
                                )
                            )}
                        </div>
                    </Col>

                    {/* Map View */}
                    <Col lg={6} className="order-1 order-lg-2">
                        <div className="sticky-top" style={{ top: '100px', height: 'calc(100vh - 140px)', minHeight: '500px' }}>
                            <Card className="h-100 overflow-hidden" style={{
                                borderRadius: '1.5rem',
                                border: '1px solid #fecaca',
                                boxShadow: '0 20px 40px -10px rgba(220, 38, 38, 0.2)'
                            }}>
                                <DoctorMap doctors={results} center={center} />
                            </Card>
                        </div>
                    </Col>
                </Row>
            </Container>
        </div>
    );
}
