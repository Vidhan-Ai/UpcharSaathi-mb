'use client'

import { useState, useEffect } from 'react'
import { Container, Row, Col, Card, Button, Spinner, Alert } from 'react-bootstrap'
import { motion, AnimatePresence } from 'framer-motion'
import {
    Activity,
    Heart,
    Flame,
    Smartphone,
    CheckCircle,
    TrendingUp,
    Footprints,
    Moon,
    ArrowUpRight,
    Calendar,
    AlertTriangle,
    LogOut,
    MapPin
} from 'lucide-react'
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
    BarChart,
    Bar,
    Legend
} from 'recharts'
import { useUser } from '@stackframe/stack'
// import { getFitbitData, disconnectFitbit } from '../actions/fitbit' // Removed

// --- Mock Data (Fallback) ---
// --- Mock Data Removed ---


// --- Styles ---
const styles = {
    gradientText: {
        background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
    },
    glassCard: {
        background: 'rgba(30, 41, 59, 0.4)',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
        borderRadius: '1.5rem',
        overflow: 'hidden',
    },
    connectButton: {
        background: 'rgba(255, 255, 255, 0.1)',
        color: '#fff',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        fontWeight: '600',
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        padding: '10px 24px',
        borderRadius: '50px',
        transition: 'all 0.3s ease',
        boxShadow: '0 4px 6px rgba(0,0,0,0.2)'
    }
}

export default function TrackHealthPage() {
    const [isConnected, setIsConnected] = useState(false) // Logic state: Has data?
    const [isLoading, setIsLoading] = useState(false)
    const [syncStatus, setSyncStatus] = useState('idle') // idle, requesting, polling, synced
    const [error, setError] = useState(null)
    const [lastUpdated, setLastUpdated] = useState(null)

    // Data State
    const [activityData, setActivityData] = useState([])
    const [activityDistribution, setActivityDistribution] = useState([])
    const [stepsToday, setStepsToday] = useState(0)
    const [caloriesToday, setCaloriesToday] = useState(0)
    const [distanceToday, setDistanceToday] = useState(0)
    const [weightCurrent, setWeightCurrent] = useState(0)
    const [heartRateAvg, setHeartRateAvg] = useState(0)
    const [sleepDuration, setSleepDuration] = useState('0h 0m')

    const user = useUser();

    // Poll for updates if expecting sync
    useEffect(() => {
        let interval;
        if (syncStatus === 'polling') {
            interval = setInterval(fetchRemoteHealthData, 3000);
        }
        return () => clearInterval(interval);
    }, [syncStatus]);

    // Initial fetch on load
    useEffect(() => {
        if (user) {
            fetchRemoteHealthData();
        }
    }, [user]);

    const handleRequestSync = async () => {
        if (!user) return;
        setIsLoading(true);
        setSyncStatus('requesting');

        try {
            const res = await fetch('/api/health/request-sync', {
                method: 'POST',
            });

            if (res.ok) {
                setSyncStatus('polling');
                // Poll for 30 seconds then stop if no new data? 
                // For now, let's just let the user see status.
                setTimeout(() => {
                    if (syncStatus === 'polling') setSyncStatus('timeout');
                    setIsLoading(false);
                }, 30000); // 30s timeout
            } else {
                throw new Error("Failed to request sync");
            }
        } catch (err) {
            console.error(err);
            setError("Could not initiate sync. Ensure server is reachable.");
            setSyncStatus('idle');
            setIsLoading(false);
        }
    };

    const fetchRemoteHealthData = async () => {
        try {
            const res = await fetch('/api/health/records');
            if (res.ok) {
                const data = await res.json();
                if (Array.isArray(data) && data.length > 0) {
                    processHealthData(data);
                    setIsConnected(true);
                    if (syncStatus === 'polling') {
                        setSyncStatus('synced');
                        setIsLoading(false);
                    }
                }
            }
        } catch (e) {
            console.error("Error fetching records", e);
        }
    };

    const processHealthData = (data) => {
        let steps = 0;
        let cals = 0;
        let dist = 0;

        const dayMap = new Map();
        const todayDate = new Date().toISOString().split('T')[0];

        data.forEach(item => {
            if (!item.date) return;
            const dateObj = new Date(item.date);
            const dateStr = dateObj.toISOString().split('T')[0];
            const dayName = dateObj.toLocaleDateString('en-US', { weekday: 'short' });

            if (!dayMap.has(dateStr)) {
                dayMap.set(dateStr, { name: dayName, steps: 0, calories: 0, distance: 0, date: dateStr });
            }

            const dayEntry = dayMap.get(dateStr);
            const val = item.value || 0;
            const count = item.count || 0;

            if (item.type === 'Steps') {
                dayEntry.steps += count;
            } else if (item.type === 'Calories' || item.type === 'TotalCaloriesBurned') {
                dayEntry.calories += val;
            } else if (item.type === 'Distance') {
                dayEntry.distance += val;
            }

            // Accumulate Today's stats
            if (dateStr === todayDate) {
                if (item.type === 'Steps') steps += count;
                if (item.type === 'Calories' || item.type === 'TotalCaloriesBurned') cals += val;
                if (item.type === 'Distance') dist += val;
            }
        });

        // Convert to array and sort by date ascending for the chart
        const sortedData = Array.from(dayMap.values()).sort((a, b) => new Date(a.date) - new Date(b.date));

        setActivityData(sortedData);
        setStepsToday(steps);
        setCaloriesToday(Math.round(cals));
        setDistanceToday(dist / 1000); // Convert meters to km
        setLastUpdated(new Date());

        // Simple distribution if we have activity
        if (steps > 0 || cals > 0) {
            setActivityDistribution([
                { name: 'Active', value: 100, color: '#3b82f6' }
            ]);
        }
    };

    const handleConnect = handleRequestSync; // Map button to sync request



    return (
        <div className="min-vh-100 py-5" style={{ background: '#0f172a' }}>
            <Container>
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-5"
                >
                    <div className="d-inline-flex align-items-center justify-content-center p-3 rounded-circle mb-3 shadow-sm" style={{ background: 'rgba(239, 68, 68, 0.2)' }}>
                        <Activity size={40} className="text-danger" />
                    </div>
                    <h1 className="display-4 fw-bold mb-3" style={styles.gradientText}>Health & Activity Tracker</h1>
                    <p className="text-white-50 fs-5" style={{ maxWidth: '700px', margin: '0 auto' }}>
                        Download our Android app to sync your health data and visualize daily activity metrics.
                    </p>
                </motion.div>

                {error && (
                    <Alert variant="danger" onClose={() => setError(null)} dismissible className="mb-4 mx-auto" style={{ maxWidth: '600px' }}>
                        <AlertTriangle size={18} className="me-2" />
                        {error}
                    </Alert>
                )}

                {/* Connection Section */}
                <AnimatePresence mode='wait'>
                    {!isConnected ? (
                        <motion.div
                            key="connect-screen"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="d-flex justify-content-center"
                        >
                            <Card style={styles.glassCard} className="p-5 text-center border-0" sx={{ maxWidth: '500px' }}>


                                <div className="mb-4">
                                    <h3 className="fw-bold mb-2 text-white">
                                        Sync Health Data
                                    </h3>
                                    <p className="text-white-50">
                                        Request your Android device to upload the latest health records (Steps, Heart Rate) to this dashboard.
                                    </p>
                                </div>

                                <Button
                                    variant="primary"
                                    size="lg"
                                    onClick={handleRequestSync}
                                    style={styles.connectButton}
                                    disabled={isLoading || syncStatus === 'polling'}
                                    className="mx-auto hover-scale"
                                >
                                    {syncStatus === 'requesting' ? (
                                        <>
                                            <Spinner animation="border" size="sm" variant="light" className="me-2" />
                                            Requesting...
                                        </>
                                    ) : syncStatus === 'polling' ? (
                                        <>
                                            <Spinner animation="grow" size="sm" variant="light" className="me-2" />
                                            Waiting for App Upload...
                                        </>
                                    ) : (
                                        <>
                                            <Smartphone size={20} className="me-2" />
                                            Request Sync Now
                                        </>
                                    )}
                                </Button>

                                {syncStatus === 'timeout' && (
                                    <p className="text-warning mt-3 small">
                                        Sync timed out. Please open the UpcharSaathi Android App to sync manually.
                                    </p>
                                )}
                            </Card>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="dashboard"
                            initial={{ opacity: 0, y: 50 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                        >
                            <div className="d-flex justify-content-end mb-3">
                                <Button
                                    variant="outline-light"
                                    size="sm"
                                    onClick={handleRequestSync}
                                    disabled={isLoading || syncStatus === 'polling' || syncStatus === 'requesting'}
                                    className="d-flex align-items-center gap-2"
                                    style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}
                                >
                                    {(isLoading || syncStatus === 'polling' || syncStatus === 'requesting') ? (
                                        <Spinner size="sm" animation="border" />
                                    ) : (
                                        <Smartphone size={16} />
                                    )}
                                    {syncStatus === 'polling' ? 'Syncing...' : 'Sync Now'}
                                </Button>
                            </div>

                            {/* Stats Grid */}
                            <Row className="g-4 mb-5">
                                {/* Steps Card */}
                                <Col md={6} lg={3}>
                                    <Card style={styles.glassCard} className="h-100 border-0">
                                        <Card.Body className="p-4">
                                            <div className="d-flex justify-content-between align-items-start mb-3">
                                                <div className="p-3 rounded-4 bg-primary bg-opacity-10 text-primary">
                                                    <Footprints size={24} />
                                                </div>
                                                <span className="badge bg-success bg-opacity-10 text-success rounded-pill px-3 py-1">
                                                    Today
                                                </span>
                                            </div>
                                            <h3 className="fw-bold mb-1 text-white">{stepsToday.toLocaleString()}</h3>
                                            <p className="text-white-50 mb-0 small text-uppercase fw-bold tracking-wider">Steps</p>
                                        </Card.Body>
                                    </Card>
                                </Col>

                                {/* Distance Card */}
                                <Col md={6} lg={3}>
                                    <Card style={styles.glassCard} className="h-100 border-0">
                                        <Card.Body className="p-4">
                                            <div className="d-flex justify-content-between align-items-start mb-3">
                                                <div className="p-3 rounded-4 bg-success bg-opacity-10 text-success">
                                                    <MapPin size={24} />
                                                </div>
                                                <span className="badge bg-success bg-opacity-10 text-success rounded-pill px-3 py-1">
                                                    Today
                                                </span>
                                            </div>
                                            <h3 className="fw-bold mb-1 text-white">{distanceToday ? distanceToday.toFixed(2) : '0.00'} <span className="fs-6 text-white-50 fw-normal">km</span></h3>
                                            <p className="text-white-50 mb-0 small text-uppercase fw-bold tracking-wider">Distance</p>
                                        </Card.Body>
                                    </Card>
                                </Col>

                                {/* Calories Card */}
                                <Col md={6} lg={3}>
                                    <Card style={styles.glassCard} className="h-100 border-0">
                                        <Card.Body className="p-4">
                                            <div className="d-flex justify-content-between align-items-start mb-3">
                                                <div className="p-3 rounded-4 bg-warning bg-opacity-10 text-warning">
                                                    <Flame size={24} />
                                                </div>
                                                <span className="badge bg-success bg-opacity-10 text-success rounded-pill px-3 py-1">
                                                    Today
                                                </span>
                                            </div>
                                            <h3 className="fw-bold mb-1 text-white">{caloriesToday.toLocaleString()}</h3>
                                            <p className="text-white-50 mb-0 small text-uppercase fw-bold tracking-wider">Energy Burned (kcal)</p>
                                        </Card.Body>
                                    </Card>
                                </Col>

                                {/* Weight Card */}
                                <Col md={6} lg={3}>
                                    <Card style={styles.glassCard} className="h-100 border-0">
                                        <Card.Body className="p-4">
                                            <div className="d-flex justify-content-between align-items-start mb-3">
                                                <div className="p-3 rounded-4 bg-purple bg-opacity-10 text-purple" style={{ color: '#8b5cf6', background: '#f3e8ff' }}>
                                                    <Activity size={24} />
                                                </div>
                                                <span className="badge bg-success bg-opacity-10 text-success rounded-pill px-3 py-1">
                                                    Current
                                                </span>
                                            </div>
                                            <h3 className="fw-bold mb-1 text-white">{weightCurrent ? weightCurrent.toFixed(1) : '--'} <span className="fs-6 text-white-50 fw-normal">kg</span></h3>
                                            <p className="text-white-50 mb-0 small text-uppercase fw-bold tracking-wider">Weight</p>
                                        </Card.Body>
                                    </Card>
                                </Col>
                            </Row>

                            {/* Main Charts Section */}
                            <Row className="g-4">
                                {/* Activity Area Chart */}
                                <Col lg={8}>
                                    <Card style={styles.glassCard} className="h-100 border-0">
                                        <Card.Body className="p-4">
                                            <div className="d-flex justify-content-between align-items-center mb-4">
                                                <h5 className="fw-bold mb-0 text-white">Weekly Activity Trends</h5>
                                                <Button variant="light" size="sm" className="bg-light border-0">
                                                    <Calendar size={16} className="me-2 text-muted" />
                                                    Last 7 Days
                                                </Button>
                                            </div>
                                            <div style={{ width: '100%', height: 350 }}>
                                                <ResponsiveContainer>
                                                    <AreaChart data={activityData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                                                        <defs>
                                                            <linearGradient id="colorSteps" x1="0" y1="0" x2="0" y2="1">
                                                                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                                                                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                                                            </linearGradient>
                                                            <linearGradient id="colorCals" x1="0" y1="0" x2="0" y2="1">
                                                                <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3} />
                                                                <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                                                            </linearGradient>
                                                        </defs>
                                                        <XAxis dataKey="name" stroke="#94a3b8" tickLine={false} axisLine={false} />
                                                        <YAxis stroke="#94a3b8" tickLine={false} axisLine={false} />
                                                        <Tooltip
                                                            contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                                                        />
                                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                                                        <Area
                                                            type="monotone"
                                                            dataKey="steps"
                                                            stroke="#3b82f6"
                                                            strokeWidth={3}
                                                            fillOpacity={1}
                                                            fill="url(#colorSteps)"
                                                            name="Steps"
                                                        />
                                                        <Area
                                                            type="monotone"
                                                            dataKey="calories"
                                                            stroke="#f59e0b"
                                                            strokeWidth={3}
                                                            fillOpacity={1}
                                                            fill="url(#colorCals)"
                                                            name="Calories (kcal)"
                                                        />
                                                    </AreaChart>
                                                </ResponsiveContainer>
                                            </div>
                                        </Card.Body>
                                    </Card>
                                </Col>

                                {/* Activity Type Distribution */}
                                <Col lg={4}>
                                    <Row className="h-100 g-4">
                                        {/* Pie Chart */}
                                        <Col xs={12}>
                                            <Card style={styles.glassCard} className="h-100 border-0">
                                                <Card.Body className="p-4 d-flex flex-column">
                                                    <h5 className="fw-bold mb-4 text-white">Activity Levels (Today)</h5>
                                                    <div className="flex-grow-1" style={{ minHeight: '250px' }}>
                                                        {activityDistribution.length > 0 ? (
                                                            <ResponsiveContainer width="100%" height="100%">
                                                                <PieChart>
                                                                    <Pie
                                                                        data={activityDistribution}
                                                                        cx="50%"
                                                                        cy="50%"
                                                                        innerRadius={60}
                                                                        outerRadius={80}
                                                                        paddingAngle={5}
                                                                        dataKey="value"
                                                                    >
                                                                        {activityDistribution.map((entry, index) => (
                                                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                                                        ))}
                                                                    </Pie>
                                                                    <Tooltip />
                                                                    <Legend verticalAlign="bottom" height={36} iconType="circle" />
                                                                </PieChart>
                                                            </ResponsiveContainer>
                                                        ) : (
                                                            <div className="d-flex align-items-center justify-content-center h-100 text-muted">
                                                                No activity data yet
                                                            </div>
                                                        )}
                                                    </div>
                                                </Card.Body>
                                            </Card>
                                        </Col>
                                    </Row>
                                </Col>
                            </Row>

                            {/* Disclaimer / Info */}
                            <div className="mt-5 text-center text-white-50 small">
                                <p>
                                    <CheckCircle size={14} className="me-1" />
                                    Data synced from Android Health Connect via UpcharSaathi Mobile App
                                </p>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </Container>

            <style jsx global>{`
                .hover-scale {
                    transition: transform 0.2s ease;
                }
                .hover-scale:hover {
                    transform: scale(1.02);
                }
            `}</style>
        </div>
    )
}
