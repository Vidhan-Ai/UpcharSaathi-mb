'use client'

import { useState, useEffect } from 'react'
import { Container, Row, Col, Card, Badge, Spinner, Button } from 'react-bootstrap'
import { motion } from 'framer-motion'
import {
    Wind,
    Thermometer,
    Droplets,
    Activity,
    MapPin,
    AlertTriangle,
    Newspaper,
    ArrowRight,
    Brain,
    ShieldCheck,
    CloudRain,
    Sun,
    Cloud,
    CloudSun,
    CloudFog,
    CloudDrizzle,
    CloudSnow,
    CloudLightning,
    HelpCircle,
    Gauge,
    Zap,
    Heart,
    Info,
    TrendingUp,
    ChevronLeft,
    ChevronRight,
    ArrowLeft
} from 'lucide-react'
import Link from 'next/link'

// Weather Code Mapping helper (since we might get text from Google now)
const getCodeFromCondition = (cond) => {
    if (!cond) return 0;
    const c = cond.toLowerCase();
    if (c.includes('rain')) return 63;
    if (c.includes('cloud')) return 3;
    if (c.includes('clear') || c.includes('sun')) return 0;
    if (c.includes('snow')) return 73;
    if (c.includes('storm')) return 95;
    if (c.includes('fog') || c.includes('haze') || c.includes('mist')) return 45;
    return 0; // Default clear
}

// Weather Code Mapping with Lucide Icons (Existing config)
const getWeatherConfig = (code, textOverride) => {
    const codes = {
        0: { text: 'Clear sky', icon: Sun, color: '#f59e0b' },
        1: { text: 'Mainly clear', icon: CloudSun, color: '#fbbf24' },
        2: { text: 'Partly cloudy', icon: Cloud, color: '#94a3b8' },
        3: { text: 'Overcast', icon: Cloud, color: '#64748b' },
        45: { text: 'Fog', icon: CloudFog, color: '#94a3b8' },
        48: { text: 'Depositing rime fog', icon: CloudFog, color: '#94a3b8' },
        51: { text: 'Light drizzle', icon: CloudDrizzle, color: '#3b82f6' },
        53: { text: 'Moderate drizzle', icon: CloudDrizzle, color: '#3b82f6' },
        55: { text: 'Dense drizzle', icon: CloudDrizzle, color: '#3b82f6' },
        61: { text: 'Slight rain', icon: CloudRain, color: '#2563eb' },
        63: { text: 'Moderate rain', icon: CloudRain, color: '#2563eb' },
        65: { text: 'Heavy rain', icon: CloudRain, color: '#1d4ed8' },
        71: { text: 'Slight snow', icon: CloudSnow, color: '#06b6d4' },
        73: { text: 'Moderate snow', icon: CloudSnow, color: '#06b6d4' },
        75: { text: 'Heavy snow', icon: CloudSnow, color: '#06b6d4' },
        95: { text: 'Thunderstorm', icon: CloudLightning, color: '#7c3aed' },
    }
    const config = codes[code] || { text: 'Unknown', icon: HelpCircle, color: '#9ca3af' };
    if (textOverride) config.text = textOverride;
    return config;
}

// AQI Color Mapping
const getAQIStatus = (aqi) => {
    if (aqi <= 50) return { text: 'Good', color: '#10b981', variant: 'success', icon: ShieldCheck }
    if (aqi <= 100) return { text: 'Moderate', color: '#f59e0b', variant: 'warning', icon: Info }
    if (aqi <= 150) return { text: 'Sensitive', color: '#f97316', variant: 'warning', icon: AlertTriangle }
    if (aqi <= 200) return { text: 'Unhealthy', color: '#ef4444', variant: 'danger', icon: AlertTriangle }
    if (aqi <= 300) return { text: 'Very Unhealthy', color: '#a855f7', variant: 'danger', icon: Zap }
    return { text: 'Hazardous', color: '#7e22ce', variant: 'dark', icon: Activity }
}

const modernStyles = {
    glassCard: {
        background: 'rgba(30, 41, 59, 0.4)',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.3)',
        borderRadius: '1.5rem',
        overflow: 'hidden',
        transition: 'transform 0.3s ease, box-shadow 0.3s ease'
    },
    gradientText: {
        background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent'
    }
}

export default function AIHealthInsights() {
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [location, setLocation] = useState(null)
    const [weatherData, setWeatherData] = useState(null)
    const [aqiData, setAqiData] = useState(null)
    const [healthNews, setHealthNews] = useState([])

    // News Pagination State
    const [viewAllNews, setViewAllNews] = useState(false)
    const [newsPage, setNewsPage] = useState(1)
    const [newsPagination, setNewsPagination] = useState(null)

    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setLocation({
                        lat: position.coords.latitude,
                        lon: position.coords.longitude
                    })
                    fetchData(position.coords.latitude, position.coords.longitude)
                },
                (err) => {
                    setError('Location access denied. Using default location (New Delhi).')
                    setLocation({ lat: 28.61, lon: 77.20 })
                    fetchData(28.61, 77.20)
                }
            )
        } else {
            setError('Geolocation is not supported by this browser.')
        }
    }, [])

    const getCityFromCoords = async (lat, lon) => {
        try {
            const res = await fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lon}&localityLanguage=en`)
            const data = await res.json()
            return data.city || data.locality || 'New Delhi'
        } catch (error) {
            console.error('Error fetching city:', error)
            return 'New Delhi'
        }
    }

    const fetchData = async (lat, lon) => {
        try {
            setLoading(true)

            // Fetch City for News Sorting
            const city = await getCityFromCoords(lat, lon)

            // Fetch Local Health Data (Weather + AQI from our new scraping API)
            const localDataRes = await fetch(`/api/local-health-data?lat=${lat}&lon=${lon}&city=${encodeURIComponent(city)}`)
            const localData = await localDataRes.json()

            // Store the enhanced data
            setWeatherData(localData.weather)
            setAqiData(localData.aqi)

            // Initial News Fetch handled by independent function or here?
            // Let's call fetchNews separately to keep pagination logic custom
            await fetchNews(1, 6)

            setLoading(false)
        } catch (err) {
            console.error(err)
            setError('Failed to fetch data. Please try again later.')
            setLoading(false)
        }
    }

    const fetchNews = async (page, limit) => {
        try {
            // Use generic query as requested
            const searchQuery = 'health news'
            const res = await fetch(`/api/health-news?q=${encodeURIComponent(searchQuery)}&page=${page}&limit=${limit}`)
            const data = await res.json()

            if (data.articles) {
                const processedNews = data.articles.map((article, index) => ({
                    id: index, // In real app use unique ID
                    title: article.title,
                    summary: article.snippet || 'Click to read full article.',
                    source: article.source,
                    date: new Date(article.pubDate).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                    }),
                    url: article.link
                }))
                setHealthNews(processedNews)
                setNewsPagination(data.pagination)
            }
        } catch (err) {
            console.error("Error fetching news page:", err)
        }
    }

    const handleViewAll = () => {
        setViewAllNews(true)
        setNewsPage(1)
        fetchNews(1, 12)
    }

    const handleBackToSummary = () => {
        setViewAllNews(false)
        setNewsPage(1)
        fetchNews(1, 6)
    }

    const handlePageChange = (newPage) => {
        setNewsPage(newPage)
        fetchNews(newPage, 12)
        // Scroll to news section
        const newsSection = document.getElementById('news-section')
        if (newsSection) newsSection.scrollIntoView({ behavior: 'smooth' })
    }

    if (loading) {
        return (
            <div className="d-flex justify-content-center align-items-center min-vh-100" style={{ background: '#0f172a' }}>
                <Spinner animation="border" variant="danger" />
                <span className="ms-3 text-white-50">Analyzing local health data...</span>
            </div>
        )
    }

    const aqiStatus = aqiData ? getAQIStatus(aqiData.indian_aqi || aqiData.us_aqi) : { text: 'Unknown', color: '#ccc', icon: HelpCircle }
    // Use weatherConfig with text override if available from Google
    const weatherConfig = weatherData ? getWeatherConfig(weatherData.weather_code || 0, weatherData.condition) : { text: 'Unknown', icon: HelpCircle, color: '#9ca3af' }
    const WeatherIcon = weatherConfig.icon
    const AqiIcon = aqiStatus.icon

    return (
        <div className="min-vh-100 py-5" style={{ background: '#0f172a' }}>
            <Container>
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="mb-5 text-center"
                >
                    <div className="d-inline-flex align-items-center justify-content-center p-3 rounded-circle mb-3 shadow-sm" style={{ background: 'rgba(239, 68, 68, 0.2)' }}>
                        <Brain size={40} className="text-danger" />
                    </div>
                    <h1 className="fw-bold mb-2 display-5" style={modernStyles.gradientText}>AI Health Insights</h1>
                    <p className="text-white-50 fs-5">Real-time environmental health analysis for your location</p>
                </motion.div>

                {error && (
                    <div className="alert alert-danger d-flex align-items-center gap-2 mb-4 rounded-4 border-0 shadow-sm bg-danger bg-opacity-10 text-white">
                        <AlertTriangle size={20} />
                        {error}
                    </div>
                )}

                <Row className="g-4 mb-5">
                    {/* AQI Card */}
                    <Col md={6} lg={4}>
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.1 }}
                            whileHover={{ y: -5 }}
                        >
                            <Card style={modernStyles.glassCard} className="h-100">
                                <Card.Body className="p-4 position-relative">
                                    <div className="d-flex justify-content-between align-items-start mb-4">
                                        <div className="w-100">
                                            <h6 className="text-uppercase tracking-wider text-white-50 mb-2" style={{ fontSize: '0.75rem', letterSpacing: '1px' }}>Air Quality</h6>

                                            <div className="d-flex justify-content-between align-items-end mb-3">
                                                <div>
                                                    <div className="small text-white-50 mb-1">Indian Standard</div>
                                                    <div className="d-flex align-items-center gap-3">
                                                        <Gauge size={32} strokeWidth={1.5} style={{ color: aqiStatus.color }} />
                                                        <h2 className="display-5 fw-bold mb-0" style={{ color: aqiStatus.color }}>
                                                            {aqiData?.indian_aqi || '--'}
                                                        </h2>
                                                    </div>
                                                </div>
                                                <div className="text-end border-start border-secondary ps-3">
                                                    <div className="small text-white-50 mb-1">US Standard</div>
                                                    <h3 className="fw-bold mb-0 text-white-50">
                                                        {aqiData?.us_aqi || '--'}
                                                    </h3>
                                                </div>
                                            </div>

                                        </div>
                                    </div>

                                    <Badge
                                        bg="dark"
                                        className="px-3 py-2 rounded-pill shadow-sm mb-3 w-100 d-flex align-items-center justify-content-center border border-secondary"
                                        style={{ color: aqiStatus.color, fontSize: '0.9rem', background: 'rgba(0,0,0,0.4)' }}
                                    >
                                        <AqiIcon size={16} className="me-2" />
                                        {aqiStatus.text}
                                    </Badge>

                                    <div className="mt-3 p-3 rounded-4 bg-white bg-opacity-10">
                                        <div className="d-flex justify-content-between mb-2 text-white-50 small">
                                            <span>PM2.5</span>
                                            <span className="fw-bold text-white">{aqiData?.pm2_5} µg/m³</span>
                                        </div>
                                        <div className="progress mb-3" style={{ height: '6px', backgroundColor: 'rgba(255,255,255,0.1)' }}>
                                            <div
                                                className="progress-bar rounded-pill"
                                                style={{
                                                    width: `${Math.min(((aqiData?.pm2_5 || 0) / 100) * 100, 100)}%`,
                                                    backgroundColor: aqiStatus.color
                                                }}
                                            />
                                        </div>
                                        <div className="d-flex justify-content-between mb-2 text-white-50 small">
                                            <span>PM10</span>
                                            <span className="fw-bold text-white">{aqiData?.pm10} µg/m³</span>
                                        </div>
                                        <div className="progress" style={{ height: '6px', backgroundColor: 'rgba(255,255,255,0.1)' }}>
                                            <div
                                                className="progress-bar rounded-pill"
                                                style={{
                                                    width: `${Math.min(((aqiData?.pm10 || 0) / 200) * 100, 100)}%`,
                                                    backgroundColor: aqiStatus.color
                                                }}
                                            />
                                        </div>
                                        <div className="text-end mt-2">
                                            <small className="text-white-50" style={{ fontSize: '0.7rem' }}>Source: {aqiData?.source || 'OpenMeteo'}</small>
                                        </div>
                                    </div>
                                </Card.Body>
                            </Card>
                        </motion.div>
                    </Col>

                    {/* Weather Card */}
                    <Col md={6} lg={4}>
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.2 }}
                            whileHover={{ y: -5 }}
                        >
                            <Card style={modernStyles.glassCard} className="h-100">
                                <Card.Body className="p-4 position-relative">
                                    <h6 className="text-uppercase tracking-wider text-white-50 mb-2" style={{ fontSize: '0.75rem', letterSpacing: '1px' }}>Local Weather</h6>
                                    <div className="d-flex align-items-center mb-4">
                                        <WeatherIcon size={48} strokeWidth={1.5} className="me-3" style={{ color: weatherConfig.color }} />
                                        <h2 className="display-3 fw-bold mb-0 text-white">
                                            {weatherData?.temp}°
                                        </h2>
                                        <div className="ms-3">
                                            <div className="fs-5 fw-bold" style={{ color: weatherConfig.color }}>{weatherData?.condition}</div>
                                            <div className="text-white-50 small">
                                                H: {weatherData?.high}° L: {weatherData?.low}°
                                            </div>
                                        </div>
                                    </div>

                                    <div className="row g-3 mt-2">
                                        <div className="col-6">
                                            <div className="p-3 rounded-4 bg-white bg-opacity-10 shadow-sm">
                                                <div className="d-flex align-items-center gap-2 text-white-50 mb-1">
                                                    <Wind size={16} className="text-primary" />
                                                    <small>Wind</small>
                                                </div>
                                                <div className="fw-bold text-white">{weatherData?.wind} <span className="small text-white-50 fw-normal"></span></div>
                                            </div>
                                        </div>
                                        <div className="col-6">
                                            <div className="p-3 rounded-4 bg-white bg-opacity-10 shadow-sm">
                                                <div className="d-flex align-items-center gap-2 text-white-50 mb-1">
                                                    <Droplets size={16} className="text-info" />
                                                    <small>Humidity</small>
                                                </div>
                                                <div className="fw-bold text-white">{weatherData?.humidity}<span className="small text-white-50 fw-normal"></span></div>
                                            </div>
                                        </div>
                                    </div>
                                </Card.Body>
                            </Card>
                        </motion.div>
                    </Col>

                    {/* Health Recommendation Card */}
                    <Col md={12} lg={4}>
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.3 }}
                            whileHover={{ y: -5 }}
                        >
                            <Card style={modernStyles.glassCard} className="h-100">
                                <Card.Body className="p-4 d-flex flex-column">
                                    <h6 className="text-uppercase tracking-wider text-white-50 mb-4" style={{ fontSize: '0.75rem', letterSpacing: '1px' }}>AI Analysis</h6>

                                    <div className="d-flex flex-column gap-3 flex-grow-1 justify-content-center">
                                        {aqiData?.indian_aqi > 200 && (
                                            <div className="d-flex gap-3 p-3 rounded-4 bg-white bg-opacity-10 shadow-sm border-start border-4 border-warning">
                                                <AlertTriangle className="text-warning flex-shrink-0 mt-1" size={20} />
                                                <div>
                                                    <div className="fw-bold text-white small mb-1">Poor Air Quality</div>
                                                    <p className="mb-0 small text-white-50">Wear a mask outdoors and use air purifiers indoors if available.</p>
                                                </div>
                                            </div>
                                        )}

                                        {weatherData?.temp > 35 && (
                                            <div className="d-flex gap-3 p-3 rounded-4 bg-white bg-opacity-10 shadow-sm border-start border-4 border-danger">
                                                <Thermometer className="text-danger flex-shrink-0 mt-1" size={20} />
                                                <div>
                                                    <div className="fw-bold text-white small mb-1">High Heat Alert</div>
                                                    <p className="mb-0 small text-white-50">Stay hydrated and avoid direct sunlight during peak hours.</p>
                                                </div>
                                            </div>
                                        )}

                                        <div className="d-flex gap-3 p-3 rounded-4 bg-white bg-opacity-10 shadow-sm border-start border-4 border-success">
                                            <Activity className="text-success flex-shrink-0 mt-1" size={20} />
                                            <div>
                                                <div className="fw-bold text-white small mb-1">General Advice</div>
                                                <p className="mb-0 small text-white-50">Maintain regular physical activity indoors. Yoga or light stretching recommended.</p>
                                            </div>
                                        </div>
                                    </div>
                                </Card.Body>
                            </Card>
                        </motion.div>
                    </Col>
                </Row>

                {/* Health News Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                >
                    <div className="d-flex align-items-center justify-content-between mb-4" id="news-section">
                        <h3 className="fw-bold text-white m-0 d-flex align-items-center gap-2">
                            <TrendingUp className="text-danger" size={24} />
                            {viewAllNews ? 'Global Health News Archive' : 'Latest Health Updates'}
                        </h3>
                        {viewAllNews ? (
                            <Button
                                variant="outline-secondary"
                                size="sm"
                                className="rounded-pill px-3 d-flex align-items-center gap-2"
                                onClick={handleBackToSummary}
                            >
                                <ArrowLeft size={16} /> Back to Summary
                            </Button>
                        ) : (
                            <Button
                                variant="link"
                                className="text-danger text-decoration-none fw-bold d-flex align-items-center gap-1"
                                onClick={handleViewAll}
                            >
                                View All <ArrowRight size={18} />
                            </Button>
                        )}
                    </div>

                    <Row className="g-4">
                        {healthNews.map((news, index) => (
                            <Col key={news.id} md={4}>
                                <motion.div whileHover={{ y: -5 }}>
                                    <Card style={modernStyles.glassCard} className="h-100">
                                        <Card.Body className="p-4 d-flex flex-column">
                                            <div className="d-flex align-items-center gap-2 text-white-50 small mb-3">
                                                <Badge className="bg-white bg-opacity-10 border border-secondary text-white fw-normal">
                                                    <Newspaper size={12} className="me-1" />
                                                    News
                                                </Badge>
                                                <span>•</span>
                                                <span>{news.source}</span>
                                                <span>•</span>
                                                <span>{news.date}</span>
                                            </div>
                                            <h5 className="fw-bold text-white mb-3 line-clamp-2">{news.title}</h5>
                                            <p className="text-white-50 small mb-0 line-clamp-3">{news.summary}</p>
                                            <Link href={news.url} target="_blank" className="stretched-link" />
                                        </Card.Body>
                                    </Card>
                                </motion.div>
                            </Col>
                        ))}
                    </Row>

                    {viewAllNews && newsPagination && (
                        <div className="d-flex justify-content-center align-items-center gap-3 mt-5">
                            <Button
                                variant="outline-light"
                                className="rounded-circle p-2 d-flex align-items-center justify-content-center"
                                style={{ width: '40px', height: '40px' }}
                                disabled={!newsPagination.hasPrevPage}
                                onClick={() => handlePageChange(newsPage - 1)}
                            >
                                <ChevronLeft size={20} />
                            </Button>
                            <span className="text-white-50 fw-medium small">
                                Page {newsPagination.currentPage} of {newsPagination.totalPages}
                            </span>
                            <Button
                                variant="outline-light"
                                className="rounded-circle p-2 d-flex align-items-center justify-content-center"
                                style={{ width: '40px', height: '40px' }}
                                disabled={!newsPagination.hasNextPage}
                                onClick={() => handlePageChange(newsPage + 1)}
                            >
                                <ChevronRight size={20} />
                            </Button>
                        </div>
                    )}
                </motion.div>
            </Container>
        </div>
    )
}
