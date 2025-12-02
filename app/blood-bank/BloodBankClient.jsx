'use client'
import { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Form, Button, Spinner, Alert, Badge } from 'react-bootstrap';
import { Droplet, MapPin, Navigation, Phone, Globe, Search } from 'lucide-react';
import dynamic from 'next/dynamic';
import { motion } from 'framer-motion';
import GetDirectionsButton from '@/components/GetDirectionsButton';
import { Geolocation } from '@capacitor/geolocation';

// Dynamically import map to avoid SSR issues
// We can reuse the DoctorMap component as it just renders markers
const BloodBankMap = dynamic(() => import('@/components/DoctorMap'), { ssr: false });

export default function BloodBankClient() {
    const [query, setQuery] = useState('');
    const [loading, setLoading] = useState(false);
    const [results, setResults] = useState([]);
    const [error, setError] = useState(null);
    const [center, setCenter] = useState(null);

    useEffect(() => {
        // Initial check logic if needed
    }, []);

    // Mock data for blood availability (since OSM doesn't provide real-time stock)
    // In a real app, this would come from a separate inventory API
    const getMockBloodAvailability = () => {
        const types = ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'];
        const availability = {};
        types.forEach(type => {
            availability[type] = Math.floor(Math.random() * 50); // Random units 0-50
        });
        return availability;
    };

    const handleSearch = async (e) => {
        e.preventDefault();
        if (!query) return;

        setLoading(true);
        setError(null);
        setResults([]);

        try {
            const res = await fetch(`/api/blood-bank/search?q=${encodeURIComponent(query)}`);
            const data = await res.json();

            if (data.error) {
                setError(data.error);
            } else {
                // Enrich results with mock availability
                const enrichedResults = data.results.map(bank => ({
                    ...bank,
                    availability: getMockBloodAvailability()
                }));
                setResults(enrichedResults);

                if (enrichedResults.length > 0) {
                    setCenter({ lat: enrichedResults[0].latitude, lon: enrichedResults[0].longitude });
                }
            }
        } catch (err) {
            setError('Failed to fetch blood banks. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleUseMyLocation = async () => {
        setLoading(true);
        setError(null);

        try {
            const permissionStatus = await Geolocation.checkPermissions();

            if (permissionStatus.location !== 'granted') {
                const requestStatus = await Geolocation.requestPermissions();
                if (requestStatus.location !== 'granted') {
                    throw new Error('Location permission denied. Please enable it in settings.');
                }
            }

            const position = await Geolocation.getCurrentPosition({
                enableHighAccuracy: true,
                timeout: 10000,
                maximumAge: 0
            });

            const { latitude, longitude } = position.coords;
            setCenter({ lat: latitude, lon: longitude });

            const res = await fetch(`/api/blood-bank/nearby?lat=${latitude}&lon=${longitude}&radius=10000`);
            const data = await res.json();

            if (data.error) {
                setError(data.error);
            } else {
                // Enrich results with mock availability
                const enrichedResults = data.results.map(bank => ({
                    ...bank,
                    availability: getMockBloodAvailability()
                }));
                setResults(enrichedResults);
            }
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
                        Find Blood Banks
                    </h1>
                    <p className="lead text-muted mx-auto" style={{ maxWidth: '700px' }}>
                        Locate nearby blood banks and check real-time availability.
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
                                            placeholder="e.g., Blood Bank in Delhi, or just Delhi"
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
                                results.map((bank, index) => (
                                    <motion.div
                                        key={bank.osmId}
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
                                                            <Droplet size={24} className="text-danger" />
                                                        </div>
                                                        <div>
                                                            <h5 className="fw-bold mb-0 text-dark">{bank.name}</h5>
                                                            <p className="text-muted small mb-0">Blood Bank</p>
                                                        </div>
                                                    </div>
                                                    <Badge bg="danger" className="text-uppercase px-3 py-2 rounded-pill" style={{ fontSize: '0.7rem', letterSpacing: '0.5px' }}>
                                                        Open
                                                    </Badge>
                                                </div>

                                                <hr className="my-3" style={{ borderColor: '#fecaca', opacity: 0.3 }} />

                                                <p className="text-muted small mb-3 d-flex align-items-start">
                                                    <MapPin size={16} className="me-2 mt-1 flex-shrink-0 text-danger" />
                                                    <span>
                                                        {bank.address || 'Address not available'}
                                                        {bank.distance && <span className="d-block mt-1 text-primary fw-medium">{bank.distance} km away</span>}
                                                    </span>
                                                </p>

                                                {/* Mock Availability Display */}
                                                <div className="mb-3 p-3 bg-light rounded-3">
                                                    <h6 className="small fw-bold text-muted mb-2">Estimated Availability (Units)</h6>
                                                    <div className="d-flex flex-wrap gap-2">
                                                        {Object.entries(bank.availability).slice(0, 4).map(([type, units]) => (
                                                            <Badge key={type} bg={units > 10 ? 'success' : 'warning'} text={units > 10 ? 'white' : 'dark'} className="fw-normal">
                                                                {type}: {units}
                                                            </Badge>
                                                        ))}
                                                        <Badge bg="secondary" className="fw-normal">+4 more</Badge>
                                                    </div>
                                                </div>

                                                <div className="d-flex gap-2 mt-auto">
                                                    <GetDirectionsButton
                                                        lat={bank.latitude}
                                                        lon={bank.longitude}
                                                        name={bank.name}
                                                        className="flex-grow-1"
                                                    />
                                                    {bank.phone && (
                                                        <a href={`tel:${bank.phone}`} className="btn btn-sm btn-outline-danger flex-grow-1" style={{ borderRadius: '0.5rem' }}>
                                                            <Phone size={14} className="me-1" /> Call
                                                        </a>
                                                    )}
                                                    {bank.website && (
                                                        <a href={bank.website} target="_blank" rel="noopener noreferrer" className="btn btn-sm btn-outline-secondary flex-grow-1" style={{ borderRadius: '0.5rem' }}>
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
                                        <h5 className="text-muted">No blood banks found</h5>
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
                                <BloodBankMap doctors={results} center={center} />
                            </Card>
                        </div>
                    </Col>
                </Row>
            </Container>
        </div>
    );
}