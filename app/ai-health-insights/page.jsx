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
    TrendingUp
} from 'lucide-react'
import Link from 'next/link'

// Weather Code Mapping with Lucide Icons
const getWeatherConfig = (code) => {
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
    return codes[code] || { text: 'Unknown', icon: HelpCircle, color: '#9ca3af' }
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
        background: 'rgba(255, 255, 255, 0.7)',
        backdropFilter: 'blur(12px)',
        border: '1px solid rgba(255, 255, 255, 0.5)',
        boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.05)',
        borderRadius: '1.5rem',
        overflow: 'hidden',
        transition: 'transform 0.3s ease, box-shadow 0.3s ease'
    },
    gradientText: {
        background: 'linear-gradient(135deg, #dc2626 0%, #db2777 100%)',
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

            // Fetch Weather
            const weatherRes = await fetch(
                `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m&daily=temperature_2m_max,temperature_2m_min&timezone=auto`
            )
            const weather = await weatherRes.json()
            setWeatherData(weather)

            // Fetch AQI
            const aqiRes = await fetch(
                `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${lat}&longitude=${lon}&current=us_aqi,pm10,pm2_5,carbon_monoxide,nitrogen_dioxide,sulphur_dioxide,ozone&timezone=auto`
            )
            const aqi = await aqiRes.json()
            setAqiData(aqi)

            // Fetch Health News from Internal API (Google News RSS)
            const searchQuery = `healthcare ${city !== 'New Delhi' ? city : ''}`.trim()
            const newsRes = await fetch(`/api/health-news?q=${encodeURIComponent(searchQuery)}`)
            const newsData = await newsRes.json()

            if (newsData.articles) {
                const processedNews = newsData.articles.map((article, index) => ({
                    id: index,
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
            }

            setLoading(false)
        } catch (err) {
            console.error(err)
            setError('Failed to fetch data. Please try again later.')
            setLoading(false)
        }
    }

    if (loading) {
        return (
            <div className="d-flex justify-content-center align-items-center min-vh-100 bg-light">
                <Spinner animation="border" variant="danger" />
                <span className="ms-3 text-muted">Analyzing local health data...</span>
            </div>
        )
    }

    const aqiStatus = aqiData ? getAQIStatus(aqiData.current.us_aqi) : { text: 'Unknown', color: '#ccc', icon: HelpCircle }
    const weatherConfig = weatherData ? getWeatherConfig(weatherData.current.weather_code) : { text: 'Unknown', icon: HelpCircle, color: '#9ca3af' }
    const WeatherIcon = weatherConfig.icon
    const AqiIcon = aqiStatus.icon

    return (
        <Container className="py-5">
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="mb-5 text-center"
            >
                <div className="d-inline-flex align-items-center justify-content-center p-3 rounded-circle mb-3 shadow-sm" style={{ background: 'linear-gradient(135deg, #fff0f0 0%, #fff 100%)' }}>
                    <Brain size={40} className="text-danger" />
                </div>
                <h1 className="fw-bold mb-2 display-5" style={modernStyles.gradientText}>AI Health Insights</h1>
                <p className="text-muted fs-5">Real-time environmental health analysis for your location</p>
            </motion.div>

            {error && (
                <div className="alert alert-warning d-flex align-items-center gap-2 mb-4 rounded-4 border-0 shadow-sm">
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
                                    <div>
                                        <h6 className="text-uppercase tracking-wider text-muted mb-2" style={{ fontSize: '0.75rem', letterSpacing: '1px' }}>Air Quality</h6>
                                        <div className="d-flex align-items-center gap-3">
                                            <Gauge size={48} strokeWidth={1.5} style={{ color: aqiStatus.color }} />
                                            <h2 className="display-3 fw-bold mb-0" style={{ color: aqiStatus.color }}>
                                                {aqiData?.current.us_aqi}
                                            </h2>
                                        </div>
                                    </div>
                                    <Badge
                                        bg="light"
                                        className="px-3 py-2 rounded-pill shadow-sm"
                                        style={{ color: aqiStatus.color, fontSize: '0.85rem' }}
                                    >
                                        <AqiIcon size={14} className="me-1" />
                                        {aqiStatus.text}
                                    </Badge>
                                </div>

                                <div className="mt-4 p-3 rounded-4 bg-white bg-opacity-50">
                                    <div className="d-flex justify-content-between mb-2 text-muted small">
                                        <span>PM2.5</span>
                                        <span className="fw-bold text-dark">{aqiData?.current.pm2_5} µg/m³</span>
                                    </div>
                                    <div className="progress mb-3" style={{ height: '6px', backgroundColor: '#e5e7eb' }}>
                                        <div
                                            className="progress-bar rounded-pill"
                                            style={{
                                                width: `${Math.min((aqiData?.current.pm2_5 / 100) * 100, 100)}%`,
                                                backgroundColor: aqiStatus.color
                                            }}
                                        />
                                    </div>
                                    <div className="d-flex justify-content-between mb-2 text-muted small">
                                        <span>PM10</span>
                                        <span className="fw-bold text-dark">{aqiData?.current.pm10} µg/m³</span>
                                    </div>
                                    <div className="progress" style={{ height: '6px', backgroundColor: '#e5e7eb' }}>
                                        <div
                                            className="progress-bar rounded-pill"
                                            style={{
                                                width: `${Math.min((aqiData?.current.pm10 / 200) * 100, 100)}%`,
                                                backgroundColor: aqiStatus.color
                                            }}
                                        />
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
                                <h6 className="text-uppercase tracking-wider text-muted mb-2" style={{ fontSize: '0.75rem', letterSpacing: '1px' }}>Local Weather</h6>
                                <div className="d-flex align-items-center mb-4">
                                    <WeatherIcon size={48} strokeWidth={1.5} className="me-3" style={{ color: weatherConfig.color }} />
                                    <h2 className="display-3 fw-bold mb-0 text-dark">
                                        {weatherData?.current.temperature_2m}°
                                    </h2>
                                    <div className="ms-3">
                                        <div className="fs-5 fw-bold" style={{ color: weatherConfig.color }}>{weatherConfig.text}</div>
                                        <div className="text-muted small">
                                            H: {weatherData?.daily.temperature_2m_max[0]}° L: {weatherData?.daily.temperature_2m_min[0]}°
                                        </div>
                                    </div>
                                </div>

                                <div className="row g-3 mt-2">
                                    <div className="col-6">
                                        <div className="p-3 rounded-4 bg-white bg-opacity-60 border border-light shadow-sm">
                                            <div className="d-flex align-items-center gap-2 text-muted mb-1">
                                                <Wind size={16} className="text-primary" />
                                                <small>Wind</small>
                                            </div>
                                            <div className="fw-bold text-dark">{weatherData?.current.wind_speed_10m} <span className="small text-muted fw-normal">km/h</span></div>
                                        </div>
                                    </div>
                                    <div className="col-6">
                                        <div className="p-3 rounded-4 bg-white bg-opacity-60 border border-light shadow-sm">
                                            <div className="d-flex align-items-center gap-2 text-muted mb-1">
                                                <Droplets size={16} className="text-info" />
                                                <small>Humidity</small>
                                            </div>
                                            <div className="fw-bold text-dark">{weatherData?.current.relative_humidity_2m}<span className="small text-muted fw-normal">%</span></div>
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
                        <Card style={{
                            ...modernStyles.glassCard,
                            background: 'linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(254,242,242,0.9) 100%)'
                        }} className="h-100">
                            <Card.Body className="p-4">
                                <div className="d-flex align-items-center gap-2 mb-4">
                                    <div className="p-2 rounded-circle bg-danger bg-opacity-10 text-danger">
                                        <Heart size={20} />
                                    </div>
                                    <h5 className="fw-bold mb-0 text-dark">AI Recommendations</h5>
                                </div>

                                <div className="d-flex flex-column gap-3">
                                    {aqiData?.current.us_aqi > 100 && (
                                        <div className="d-flex gap-3 p-3 rounded-4 bg-white shadow-sm border-start border-4 border-warning">
                                            <AlertTriangle className="text-warning flex-shrink-0 mt-1" size={20} />
                                            <div>
                                                <div className="fw-bold text-dark small mb-1">Poor Air Quality</div>
                                                <p className="mb-0 small text-muted">Wear a mask outdoors and use air purifiers indoors if available.</p>
                                            </div>
                                        </div>
                                    )}

                                    {weatherData?.current.temperature_2m > 35 && (
                                        <div className="d-flex gap-3 p-3 rounded-4 bg-white shadow-sm border-start border-4 border-danger">
                                            <Thermometer className="text-danger flex-shrink-0 mt-1" size={20} />
                                            <div>
                                                <div className="fw-bold text-dark small mb-1">High Heat Alert</div>
                                                <p className="mb-0 small text-muted">Stay hydrated and avoid direct sunlight during peak hours.</p>
                                            </div>
                                        </div>
                                    )}

                                    <div className="d-flex gap-3 p-3 rounded-4 bg-white shadow-sm border-start border-4 border-success">
                                        <Activity className="text-success flex-shrink-0 mt-1" size={20} />
                                        <div>
                                            <div className="fw-bold text-dark small mb-1">General Advice</div>
                                            <p className="mb-0 small text-muted">Maintain regular physical activity indoors. Yoga or light stretching recommended.</p>
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
                <div className="d-flex align-items-center justify-content-between mb-4">
                    <h3 className="fw-bold text-dark m-0 d-flex align-items-center gap-2">
                        <TrendingUp className="text-danger" size={24} />
                        Local Health Updates
                    </h3>

                </div>

                <Row className="g-4">
                    {healthNews.map((news, index) => (
                        <Col key={news.id} md={4}>
                            <motion.div whileHover={{ y: -5 }}>
                                <Card style={modernStyles.glassCard} className="h-100">
                                    <Card.Body className="p-4">
                                        <div className="d-flex align-items-center gap-2 text-muted small mb-3">
                                            <Badge bg="light" text="dark" className="border">
                                                <Newspaper size={12} className="me-1" />
                                                News
                                            </Badge>
                                            <span>•</span>
                                            <span>{news.source}</span>
                                            <span>•</span>
                                            <span>{news.date}</span>
                                        </div>
                                        <h5 className="fw-bold text-dark mb-3 line-clamp-2">{news.title}</h5>
                                        <p className="text-muted small mb-0 line-clamp-3">{news.summary}</p>
                                        <Link href={news.url} target="_blank" className="stretched-link" />
                                    </Card.Body>
                                </Card>
                            </motion.div>
                        </Col>
                    ))}
                </Row>
            </motion.div>
        </Container>
    )
}
