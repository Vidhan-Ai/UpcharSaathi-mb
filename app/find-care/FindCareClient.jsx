'use client'

import { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Form, Button, Spinner, Alert, Badge, Nav } from 'react-bootstrap';
import { Search, MapPin, Phone, Stethoscope, Droplet, Activity, Star } from 'lucide-react';
import dynamic from 'next/dynamic';
import { motion, AnimatePresence } from 'framer-motion';
import GetDirectionsButton from '@/components/GetDirectionsButton';
import { Geolocation } from '@capacitor/geolocation';
import { useSearchParams } from 'next/navigation';

// Dynamically import map to avoid SSR issues
const CareMap = dynamic(() => import('@/components/DoctorMap'), { ssr: false });

export default function FindCareClient() {
    const searchParams = useSearchParams();
    const initialTab = searchParams.get('tab') === 'blood-banks' ? 'blood-banks' : 'doctors';
    const [activeTab, setActiveTab] = useState(initialTab);
    const [query, setQuery] = useState('');
    const [loading, setLoading] = useState(false);
    const [results, setResults] = useState([]);
    const [error, setError] = useState(null);
    const [center, setCenter] = useState(null);
    const [hasSearched, setHasSearched] = useState(false);

    // Reset state when switching tabs
    useEffect(() => {
        setResults([]);
        setError(null);
        setQuery('');
        // Re-fetch location/nearby when tab changes if we haven't manually searched yet
        if (!hasSearched) {
            handleUseMyLocation();
        }
    }, [activeTab]);

    // Mock data for blood availability
    const getMockBloodAvailability = () => {
        const types = ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'];
        const availability = {};
        types.forEach(type => {
            availability[type] = Math.floor(Math.random() * 50);
        });
        return availability;
    };

    const handleSearch = async (e) => {
        if (e) e.preventDefault();
        if (!query) return;

        setLoading(true);
        setError(null);
        setResults([]);
        setHasSearched(true);

        const endpoint = activeTab === 'doctors'
            ? `/api/doctors/search?q=${encodeURIComponent(query)}`
            : `/api/blood-bank/search?q=${encodeURIComponent(query)}`;

        try {
            const res = await fetch(endpoint);
            const data = await res.json();

            if (data.error) {
                setError(data.error);
            } else {
                let processedResults = data.results;
                if (activeTab === 'blood-banks') {
                    processedResults = processedResults.map(bank => ({
                        ...bank,
                        availability: getMockBloodAvailability()
                    }));
                }
                setResults(processedResults);
                if (processedResults.length > 0) {
                    setCenter({ lat: processedResults[0].latitude, lon: processedResults[0].longitude });
                }
            }
        } catch (err) {
            setError(`Failed to fetch ${activeTab === 'doctors' ? 'doctors' : 'blood banks'}. Please try again.`);
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

            const endpoint = activeTab === 'doctors'
                ? `/api/doctors/nearby?lat=${latitude}&lon=${longitude}&radius=5000`
                : `/api/blood-bank/nearby?lat=${latitude}&lon=${longitude}&radius=10000`;

            const res = await fetch(endpoint);
            const data = await res.json();

            if (data.error) {
                setError(data.error);
            } else {
                let processedResults = data.results;
                if (activeTab === 'blood-banks') {
                    processedResults = processedResults.map(bank => ({
                        ...bank,
                        availability: getMockBloodAvailability()
                    }));
                }
                setResults(processedResults);
            }
        } catch (err) {
            console.error('Geolocation error:', err);
            let errorMessage = 'Unable to retrieve your location.';
            if (err.message) errorMessage = err.message;
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-vh-100 position-relative overflow-hidden">
            <Container className="position-relative py-5" style={{ zIndex: 1 }}>
                {/* Header Section */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-5"
                >
                    <div className="d-inline-flex align-items-center justify-content-center p-3 rounded-circle mb-3 shadow-sm bg-white text-danger">
                        <Activity size={32} />
                    </div>
                    <h1 className="display-4 fw-bold mb-3 text-dark">
                        Find <span className="text-danger">Medical Care</span>
                    </h1>
                    <p className="lead text-muted mx-auto" style={{ maxWidth: '600px' }}>
                        Connect with top-rated doctors, hospitals, and blood banks in your area instantly.
                    </p>
                </motion.div>

                {/* Search & Filter Card */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                >
                    <Card className="border-0 shadow-lg mb-5 overflow-visible" style={{ borderRadius: '24px', background: 'rgba(255, 255, 255, 0.9)', backdropFilter: 'blur(20px)' }}>
                        <Card.Body className="p-2">
                            <Nav variant="pills" className="nav-justified bg-light rounded-4 p-1 mb-3" activeKey={activeTab} onSelect={(k) => setActiveTab(k)}>
                                <Nav.Item>
                                    <Nav.Link eventKey="doctors" className="rounded-4 py-3 d-flex align-items-center justify-content-center gap-2 transition-all">
                                        <Stethoscope size={20} />
                                        <span className="fw-semibold">Doctors & Hospitals</span>
                                    </Nav.Link>
                                </Nav.Item>
                                <Nav.Item>
                                    <Nav.Link eventKey="blood-banks" className="rounded-4 py-3 d-flex align-items-center justify-content-center gap-2 transition-all">
                                        <Droplet size={20} />
                                        <span className="fw-semibold">Blood Banks</span>
                                    </Nav.Link>
                                </Nav.Item>
                            </Nav>

                            <Form onSubmit={handleSearch} className="px-3 pb-3">
                                <Row className="g-3">
                                    <Col md={10}>
                                        <div className="position-relative group">
                                            <Search className="position-absolute top-50 start-0 translate-middle-y ms-3 text-muted" size={20} />
                                            <Form.Control
                                                type="text"
                                                placeholder={activeTab === 'doctors' ? "Search for doctors, specialties, or hospitals..." : "Search for blood banks by location..."}
                                                value={query}
                                                onChange={(e) => setQuery(e.target.value)}
                                                className="ps-5 py-3 border-0 bg-light shadow-sm"
                                                style={{ borderRadius: '16px', fontSize: '1.05rem' }}
                                            />
                                        </div>
                                    </Col>
                                    <Col md={2}>
                                        <Button
                                            type="submit"
                                            className="w-100 py-3 fw-bold border-0 shadow hover-lift"
                                            disabled={loading}
                                            style={{
                                                background: 'linear-gradient(135deg, #dc2626, #ef4444)',
                                                borderRadius: '16px'
                                            }}
                                        >
                                            {loading ? <Spinner size="sm" animation="border" /> : 'Search'}
                                        </Button>
                                    </Col>
                                </Row>
                            </Form>
                        </Card.Body>
                    </Card>
                </motion.div>

                {error && (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                        <Alert variant="danger" className="border-0 shadow-sm mb-4 rounded-4 d-flex align-items-center gap-2">
                            <Activity size={20} /> {error}
                        </Alert>
                    </motion.div>
                )}

                <Row className="g-4">
                    {/* Results List */}
                    <Col lg={6} className="order-2 order-lg-1">
                        <div
                            className="d-flex flex-column gap-3 pe-2"
                            style={{
                                height: 'calc(100vh - 140px)',
                                overflowY: 'auto',
                                paddingBottom: '20px'
                            }}
                        >
                            <AnimatePresence mode="wait">
                                {results.length > 0 ? (
                                    results.map((item, index) => (
                                        <motion.div
                                            key={item.osmId || index}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, scale: 0.95 }}
                                            transition={{ delay: index * 0.05 }}
                                        >
                                            <Card className="border-0 shadow-sm hover-card transition-all overflow-hidden" style={{ borderRadius: '20px' }}>
                                                <Card.Body className="p-4">
                                                    <div className="d-flex justify-content-between align-items-start mb-3">
                                                        <div className="d-flex gap-3">
                                                            <div className={`d-flex align-items-center justify-content-center rounded-4 flex-shrink-0 ${activeTab === 'doctors' ? 'bg-primary bg-opacity-10 text-primary' : 'bg-danger bg-opacity-10 text-danger'}`}
                                                                style={{ width: '56px', height: '56px' }}>
                                                                {activeTab === 'doctors' ? <Stethoscope size={28} className="text-primary" /> : <Droplet size={28} className="text-danger" />}
                                                            </div>
                                                            <div>
                                                                <h5 className="fw-bold mb-1 text-dark">{item.name}</h5>
                                                                <div className="d-flex align-items-center gap-2 text-muted small">
                                                                    <span className="text-uppercase fw-semibold" style={{ fontSize: '0.75rem', letterSpacing: '0.5px' }}>
                                                                        {activeTab === 'doctors'
                                                                            ? (item.specialty ? item.specialty.replace(/_/g, ' ') : item.type)
                                                                            : 'Blood Bank'
                                                                        }
                                                                    </span>
                                                                    <span className="text-muted">•</span>
                                                                    <span className="d-flex align-items-center gap-1">
                                                                        <Star size={12} className="text-warning fill-warning" />
                                                                        4.8 (120+)
                                                                    </span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <Badge bg={activeTab === 'doctors' ? (item.type === 'hospital' ? 'danger' : 'primary') : 'danger'}
                                                            className="px-3 py-2 rounded-pill fw-medium shadow-sm"
                                                            style={{ fontSize: '0.75rem' }}>
                                                            {activeTab === 'doctors' ? item.type : 'Open 24/7'}
                                                        </Badge>
                                                    </div>

                                                    <div className="bg-light rounded-4 p-3 mb-3">
                                                        <div className="d-flex align-items-start gap-2 mb-2">
                                                            <MapPin size={16} className="text-danger mt-1 flex-shrink-0" />
                                                            <span className="text-muted small fw-medium">
                                                                {item.address || 'Address not available'}
                                                            </span>
                                                        </div>
                                                        {item.distance && (
                                                            <div className="d-flex align-items-center gap-2 ms-4">
                                                                <Badge bg="white" text="dark" className="border shadow-sm rounded-pill fw-normal">
                                                                    {item.distance} km away
                                                                </Badge>
                                                                <Badge bg="white" text="success" className="border shadow-sm rounded-pill fw-normal">
                                                                    ~15 min drive
                                                                </Badge>
                                                            </div>
                                                        )}
                                                    </div>

                                                    {activeTab === 'blood-banks' && item.availability && (
                                                        <div className="mb-4">
                                                            <h6 className="small fw-bold text-muted mb-2 text-uppercase" style={{ fontSize: '0.7rem', letterSpacing: '0.5px' }}>Blood Availability</h6>
                                                            <div className="d-flex flex-wrap gap-2">
                                                                {Object.entries(item.availability).slice(0, 5).map(([type, units]) => (
                                                                    <div key={type} className="d-flex align-items-center px-2 py-1 rounded-3 border bg-white" style={{ fontSize: '0.8rem' }}>
                                                                        <span className="fw-bold me-2 text-dark">{type}</span>
                                                                        <span className={`fw-medium ${units > 10 ? 'text-success' : 'text-warning'}`}>{units}u</span>
                                                                    </div>
                                                                ))}
                                                                <Badge bg="light" text="dark" className="fw-normal border">+3</Badge>
                                                            </div>
                                                        </div>
                                                    )}

                                                    <div className="d-flex gap-2 pt-2">
                                                        <GetDirectionsButton
                                                            lat={item.latitude}
                                                            lon={item.longitude}
                                                            name={item.name}
                                                            className="flex-grow-1 py-2 rounded-3 fw-semibold shadow-sm"
                                                        />
                                                        {item.phone && (
                                                            <a href={`tel:${item.phone}`} className="btn btn-outline-secondary flex-grow-1 rounded-3 py-2 fw-semibold d-flex align-items-center justify-content-center gap-2 hover-bg-light">
                                                                <Phone size={16} /> Call
                                                            </a>
                                                        )}
                                                    </div>
                                                </Card.Body>
                                            </Card>
                                        </motion.div>
                                    ))
                                ) : (
                                    !loading && (
                                        <motion.div
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            className="text-center py-5"
                                        >
                                            <div className="mb-4 p-4 rounded-circle bg-white shadow-sm d-inline-block">
                                                <Search size={48} className="text-muted opacity-50" />
                                            </div>
                                            <h4 className="text-dark fw-bold">Searching nearby...</h4>
                                            <p className="text-muted">Locating the best care options in your vicinity.</p>
                                        </motion.div>
                                    )
                                )}
                            </AnimatePresence>
                        </div>
                    </Col>

                    {/* Map Section */}
                    <Col lg={6} className="order-1 order-lg-2">
                        <div className="sticky-top" style={{ top: '20px', height: 'calc(100vh - 140px)', minHeight: '500px' }}>
                            <Card className="h-100 border-0 shadow-lg overflow-hidden position-relative" style={{ borderRadius: '24px' }}>
                                <div className="position-absolute top-0 start-0 w-100 h-100 bg-light d-flex align-items-center justify-content-center">
                                    <CareMap doctors={results} center={center} />
                                </div>
                                {/* Map Overlay Gradient */}
                                <div className="position-absolute bottom-0 start-0 w-100 p-4" style={{ background: 'linear-gradient(to top, rgba(255,255,255,0.9), transparent)', pointerEvents: 'none' }}></div>
                            </Card>
                        </div>
                    </Col>
                </Row>
            </Container>

            <style jsx global>{`
                .nav-pills .nav-link {
                    color: #64748b;
                    transition: all 0.3s ease;
                }
                .nav-pills .nav-link.active {
                    background-color: #fff !important;
                    color: #dc2626 !important;
                    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
                }
                .hover-card:hover {
                    transform: translateY(-4px);
                    box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04) !important;
                }
                .hover-lift:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 10px 15px -3px rgba(220, 38, 38, 0.3);
                }
                .form-control:focus {
                    box-shadow: none;
                    border: 2px solid #fecaca !important;
                }
                .hover-bg-light-danger:hover {
                    background-color: #fee2e2 !important;
                }
                .hover-bg-light:hover {
                    background-color: #f8f9fa !important;
                }
                /* Custom Scrollbar for results */
                ::-webkit-scrollbar {
                    width: 6px;
                }
                ::-webkit-scrollbar-track {
                    background: transparent;
                }
                ::-webkit-scrollbar-thumb {
                    background: #cbd5e1;
                    border-radius: 3px;
                }
                ::-webkit-scrollbar-thumb:hover {
                    background: #94a3b8;
                }
            `}</style>
        </div>
    );
}
