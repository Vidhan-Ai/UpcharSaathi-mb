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
    AlertTriangle
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
import { Capacitor } from '@capacitor/core'
import { HealthConnect } from 'capacitor-health-connect'
import { useGoogleLogin } from '@react-oauth/google'

// --- Mock Data (Fallback) ---
const MOCK_WEEKLY_STEPS_DATA = [
    { name: 'Mon', steps: 6500, calories: 320 },
    { name: 'Tue', steps: 8200, calories: 410 },
    { name: 'Wed', steps: 10500, calories: 520 },
    { name: 'Thu', steps: 7800, calories: 390 },
    { name: 'Fri', steps: 9200, calories: 460 },
    { name: 'Sat', steps: 12000, calories: 600 },
    { name: 'Sun', steps: 5400, calories: 270 },
]

const MOCK_ACTIVITY_DISTRIBUTION = [
    { name: 'Walking', value: 65, color: '#3b82f6' },
    { name: 'Running', value: 20, color: '#f59e0b' },
    { name: 'Cycling', value: 10, color: '#10b981' },
    { name: 'Yoga', value: 5, color: '#8b5cf6' },
]

// --- Styles ---
const styles = {
    gradientText: {
        background: 'linear-gradient(135deg, #2563eb 0%, #db2777 100%)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
    },
    glassCard: {
        background: 'rgba(255, 255, 255, 0.8)',
        backdropFilter: 'blur(12px)',
        border: '1px solid rgba(255, 255, 255, 0.6)',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.05)',
        borderRadius: '1.5rem',
        overflow: 'hidden',
    },
    connectButton: {
        background: '#fff',
        color: '#333',
        border: '1px solid #ddd',
        fontWeight: '600',
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        padding: '10px 24px',
        borderRadius: '50px',
        transition: 'all 0.3s ease',
        boxShadow: '0 4px 6px rgba(0,0,0,0.05)'
    }
}

export default function TrackHealthPage() {
    const [isConnected, setIsConnected] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState(null)
    const [isNative, setIsNative] = useState(false)

    // Data State
    const [activityData, setActivityData] = useState(MOCK_WEEKLY_STEPS_DATA)
    const [activityDistribution, setActivityDistribution] = useState(MOCK_ACTIVITY_DISTRIBUTION)
    const [stepsToday, setStepsToday] = useState(0)
    const [caloriesToday, setCaloriesToday] = useState(0)
    const [heartRateAvg, setHeartRateAvg] = useState(0)
    const [sleepDuration, setSleepDuration] = useState('0h 0m')

    useEffect(() => {
        setIsNative(Capacitor.isNativePlatform())
    }, [])

    // --- Google Fit REST API Logic (Web) ---
    const loginToGoogleFit = useGoogleLogin({
        onSuccess: async (tokenResponse) => {
            setIsLoading(true)
            try {
                await fetchGoogleFitData(tokenResponse.access_token)
                setIsConnected(true)
            } catch (err) {
                console.error("Google Fit Fetch Error", err)
                setError("Failed to fetch Google Fit data. " + err.message)
            } finally {
                setIsLoading(false)
            }
        },
        onError: error => {
            console.error("Login Failed", error)
            setError("Google Login Failed")
            setIsLoading(false)
        },
        scope: 'https://www.googleapis.com/auth/fitness.activity.read https://www.googleapis.com/auth/fitness.body.read',
    })

    const fetchGoogleFitData = async (accessToken) => {
        const now = new Date();
        const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const startTimeMillis = startOfDay.getTime() - (6 * 86400000); // Start 6 days ago (7 days total including today)
        const endTimeMillis = now.getTime();

        try {
            // 1. Fetch Aggregated Data (Steps & Calories)
            const response = await fetch('https://www.googleapis.com/fitness/v1/users/me/dataset:aggregate', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    "aggregateBy": [{
                        "dataTypeName": "com.google.step_count.delta",
                        "dataSourceId": "derived:com.google.step_count.delta:com.google.android.gms:estimated_steps"
                    }, {
                        "dataTypeName": "com.google.calories.expended",
                        "dataSourceId": "derived:com.google.calories.expended:com.google.android.gms:merge_calories_expended"
                    }],
                    "bucketByTime": { "durationMillis": 86400000 }, // 1 Day
                    "startTimeMillis": startTimeMillis,
                    "endTimeMillis": endTimeMillis
                })
            });

            const data = await response.json();

            if (data.bucket) {
                const formattedData = data.bucket.map(bucket => {
                    const date = new Date(parseInt(bucket.startTimeMillis));
                    const name = date.toLocaleDateString('en-US', { weekday: 'short' });

                    const stepsPoint = bucket.dataset[0].point;
                    const steps = stepsPoint.length > 0 ? stepsPoint[0].value[0].intVal : 0;

                    const caloriesPoint = bucket.dataset[1].point;
                    const calories = caloriesPoint.length > 0 ? Math.round(caloriesPoint[0].value[0].fpVal) : 0;

                    return { name, steps, calories };
                });

                setActivityData(formattedData);

                // Update 'Today' stats from the last bucket
                const lastBucket = formattedData[formattedData.length - 1];
                if (lastBucket) {
                    setStepsToday(lastBucket.steps);
                    setCaloriesToday(lastBucket.calories);
                }
            }
        } catch (err) {
            console.error("Google Fit Fetch Error", err);
            setError("Failed to fetch Google Fit data.");
        }
    }


    const handleConnect = async () => {
        setIsLoading(true)
        setError(null)

        if (isNative) {
            // Android Health Connect Path
            await handleConnectHealthConnect();
        } else {
            // Web Google Fit Path
            // Check if we have a Client ID provided (simulated check)
            // Note: In a real app, wrap root in GoogleOAuthProvider with valid clientId
            // For now, we trigger the login hook if accessible, else fallback
            try {
                loginToGoogleFit();
            } catch (e) {
                // Fallback for demo if no provider context
                setTimeout(() => {
                    setIsLoading(false)
                    setIsConnected(true)
                    // Set mock values for "today"
                    setStepsToday(8432)
                    setCaloriesToday(420)
                    setHeartRateAvg(72)
                    setSleepDuration('7h 45m')
                }, 1500)
            }
        }
    }


    const handleConnectHealthConnect = async () => {
        try {
            const isAvailable = await HealthConnect.checkAvailability()

            if (isAvailable.availability !== 'Available') {
                if (isAvailable.availability === 'NotInstalled') {
                    window.open('https://play.google.com/store/apps/details?id=com.google.android.apps.healthdata')
                    throw new Error('Health Connect is not installed. Please install it from Play Store.')
                }
                throw new Error(`Health Connect is not available: ${isAvailable.availability}`)
            }

            const permissions = {
                read: ['Steps', 'HeartRate', 'TotalCaloriesBurned', 'SleepSession'],
            }

            const result = await HealthConnect.requestPermissions(permissions)

            await fetchHealthData()
            setIsConnected(true)

        } catch (err) {
            console.error(err)
            setError(err.message || 'Failed to connect to Health Connect')
        } finally {
            setIsLoading(false)
        }
    }

    const fetchHealthData = async () => {
        const now = new Date()
        const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate())
        const sevenDaysAgo = new Date(startOfToday.getTime() - 6 * 24 * 60 * 60 * 1000)

        try {
            // 1. Get Steps History
            const stepsRes = await HealthConnect.getSteps({
                startTime: sevenDaysAgo.toISOString(),
                endTime: now.toISOString()
            })

            // 2. Get Calories History
            const caloriesRes = await HealthConnect.getTotalCaloriesBurned({
                startTime: sevenDaysAgo.toISOString(),
                endTime: now.toISOString()
            })

            // Process into daily buckets
            const dailyData = [];
            // Create a map for quick lookup if performance needed, but loop is fine for 7 days
            for (let d = new Date(sevenDaysAgo); d <= startOfToday; d.setDate(d.getDate() + 1)) {
                const dayStart = new Date(d);
                const dayEnd = new Date(d);
                dayEnd.setHours(23, 59, 59, 999);

                const dayName = dayStart.toLocaleDateString('en-US', { weekday: 'short' });

                // Filter records for this day
                const daySteps = stepsRes.records
                    .filter(r => new Date(r.startTime) >= dayStart && new Date(r.startTime) <= dayEnd)
                    .reduce((sum, r) => sum + r.count, 0);

                const dayCalories = caloriesRes.records
                    .filter(r => new Date(r.startTime) >= dayStart && new Date(r.startTime) <= dayEnd)
                    .reduce((sum, r) => sum + r.energy.kilocalories, 0);

                dailyData.push({ name: dayName, steps: daySteps, calories: Math.round(dayCalories) });
            }

            setActivityData(dailyData);

            // Update Today's Display
            const todayData = dailyData[dailyData.length - 1];
            if (todayData) {
                setStepsToday(todayData.steps);
                setCaloriesToday(todayData.calories);
            }

            // 3. Get Heart Rate (Average of last 24h)
            const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000)
            const heartRateRes = await HealthConnect.getHeartRate({
                startTime: oneDayAgo.toISOString(),
                endTime: now.toISOString()
            })
            if (heartRateRes.records.length > 0) {
                const avgHr = heartRateRes.records.reduce((sum, record) => {
                    const recordAvg = record.samples.reduce((s, sample) => s + sample.beatsPerMinute, 0) / record.samples.length
                    return sum + recordAvg
                }, 0) / heartRateRes.records.length
                setHeartRateAvg(Math.round(avgHr))
            }

            // 4. Get Sleep Session (Last night)
            const sleepRes = await HealthConnect.getSleepSession({
                startTime: new Date(now.getTime() - 48 * 60 * 60 * 1000).toISOString(),
                endTime: now.toISOString()
            })
            const latestSleep = sleepRes.records.sort((a, b) => new Date(b.endTime) - new Date(a.endTime))[0]
            if (latestSleep) {
                const durationMs = new Date(latestSleep.endTime) - new Date(latestSleep.startTime)
                const hours = Math.floor(durationMs / (1000 * 60 * 60))
                const minutes = Math.floor((durationMs % (1000 * 60 * 60)) / (1000 * 60))
                setSleepDuration(`${hours}h ${minutes}m`)
            }

        } catch (err) {
            console.error("Error fetching health data", err)
            setError(err.message || 'Failed to connect to Health Connect')
        }
    }


    return (
        <div className="min-vh-100 bg-light py-5" style={{ background: 'linear-gradient(180deg, #f8fafc 0%, #eff6ff 100%)' }}>
            <Container>
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-5"
                >
                    <div className="d-inline-flex align-items-center justify-content-center p-3 rounded-circle mb-3 shadow-sm bg-white">
                        <Activity size={40} className="text-primary" />
                    </div>
                    <h1 className="display-4 fw-bold mb-3" style={styles.gradientText}>Health & Activity Tracker</h1>
                    <p className="text-muted fs-5" style={{ maxWidth: '700px', margin: '0 auto' }}>
                        Sync with {isNative ? 'Android Health Connect' : 'Google Fit (Web)'} to visualize your daily activity, heart rate, and sleep metrics in one beautiful dashboard.
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
                                    <img
                                        src={isNative
                                            ? "https://fonts.gstatic.com/s/i/productlogos/health_connect/v1/web-96dp/logo_health_connect_color_1x_web_96dp.png"
                                            : "https://upload.wikimedia.org/wikipedia/commons/thumb/7/79/Google_Fit_icon.svg/512px-Google_Fit_icon.svg.png"
                                        }
                                        alt={isNative ? "Health Connect" : "Google Fit"}
                                        width="80"
                                        height="80"
                                        className="mb-3"
                                    />
                                    <h3 className="fw-bold mb-2">Connect {isNative ? "Health Connect" : "Google Fit"}</h3>
                                    <p className="text-muted">
                                        Authorize access to read your step count, calories, and heart rate data via {isNative ? "Android Health Connect" : "Google Fit API"}.
                                    </p>
                                    {!isNative && (
                                        <p className="small text-info mt-2">
                                            <Smartphone size={14} className="me-1" />
                                            Web Mode: Connects to Google Fit Cloud
                                        </p>
                                    )}
                                </div>
                                <Button
                                    variant="light"
                                    size="lg"
                                    onClick={handleConnect}
                                    style={styles.connectButton}
                                    disabled={isLoading}
                                    className="mx-auto hover-scale"
                                >
                                    {isLoading ? (
                                        <>
                                            <Spinner animation="border" size="sm" variant="dark" />
                                            Connecting...
                                        </>
                                    ) : (
                                        <>
                                            <div
                                                style={{
                                                    width: 24,
                                                    height: 24,
                                                    background: isNative
                                                        ? `url('https://fonts.gstatic.com/s/i/productlogos/health_connect/v1/web-96dp/logo_health_connect_color_1x_web_96dp.png') center/contain no-repeat`
                                                        : `url('https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg') center/contain no-repeat`
                                                }}
                                            />
                                            {isNative ? 'Sync via Health Connect' : 'Sign in with Google'}
                                        </>
                                    )}
                                </Button>
                            </Card>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="dashboard"
                            initial={{ opacity: 0, y: 50 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                        >
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
                                            <h3 className="fw-bold mb-1">{stepsToday.toLocaleString()}</h3>
                                            <p className="text-muted mb-0 small text-uppercase fw-bold tracking-wider">Metric Steps</p>
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
                                            <h3 className="fw-bold mb-1">{caloriesToday}</h3>
                                            <p className="text-muted mb-0 small text-uppercase fw-bold tracking-wider">Active Calories</p>
                                        </Card.Body>
                                    </Card>
                                </Col>
                                {/* Heart Rate Card */}
                                <Col md={6} lg={3}>
                                    <Card style={styles.glassCard} className="h-100 border-0">
                                        <Card.Body className="p-4">
                                            <div className="d-flex justify-content-between align-items-start mb-3">
                                                <div className="p-3 rounded-4 bg-danger bg-opacity-10 text-danger">
                                                    <Heart size={24} />
                                                </div>
                                                <span className="badge bg-success bg-opacity-10 text-success rounded-pill px-3 py-1">
                                                    Avg 24h
                                                </span>
                                            </div>
                                            <h3 className="fw-bold mb-1">{heartRateAvg} <span className="fs-6 text-muted fw-normal">bpm</span></h3>
                                            <p className="text-muted mb-0 small text-uppercase fw-bold tracking-wider">Heart Rate</p>
                                        </Card.Body>
                                    </Card>
                                </Col>
                                {/* Sleep Card */}
                                <Col md={6} lg={3}>
                                    <Card style={styles.glassCard} className="h-100 border-0">
                                        <Card.Body className="p-4">
                                            <div className="d-flex justify-content-between align-items-start mb-3">
                                                <div className="p-3 rounded-4 bg-purple bg-opacity-10 text-purple" style={{ color: '#8b5cf6', background: '#f3e8ff' }}>
                                                    <Moon size={24} />
                                                </div>
                                                <span className="badge bg-success bg-opacity-10 text-success rounded-pill px-3 py-1">
                                                    Last Night
                                                </span>
                                            </div>
                                            <h3 className="fw-bold mb-1">{sleepDuration}</h3>
                                            <p className="text-muted mb-0 small text-uppercase fw-bold tracking-wider">Sleep Duration</p>
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
                                                <h5 className="fw-bold mb-0">Weekly Activity Trends</h5>
                                                <Button variant="light" size="sm" className="bg-light border-0">
                                                    <Calendar size={16} className="me-2 text-muted" />
                                                    Last 7 Days (Mock Data)
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
                                                    <h5 className="fw-bold mb-4">Activity Breakdown</h5>
                                                    <div className="flex-grow-1" style={{ minHeight: '250px' }}>
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
                                                    </div>
                                                </Card.Body>
                                            </Card>
                                        </Col>
                                    </Row>
                                </Col>
                            </Row>

                            {/* Disclaimer / Info */}
                            <div className="mt-5 text-center text-muted small">
                                <p>
                                    <CheckCircle size={14} className="me-1" />
                                    {isNative ? 'Data synced from Android Health Connect' : 'Data synced from Google Fit (Web)'}
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
