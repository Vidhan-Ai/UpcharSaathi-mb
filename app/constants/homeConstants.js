// Health ecosystem feature cards data
export const healthFeatures = [
    {
        id: 'first-aid',
        icon: 'HeartPulse',
        title: 'Emergency First Aid',
        description: [
            'Step-by-Step Guides',
            'CPR & Life Support',
            'Emergency Contacts'
        ],
        iconBg: 'rgba(239, 68, 68, 0.1)',
        iconColor: '#ef4444',
        bulletColor: 'bg-danger',
        buttonVariant: 'outline-danger',
        route: '/first-aid',
        buttonText: 'View Guides'
    },
    {
        id: 'consultation',
        icon: 'Stethoscope',
        title: 'Expert Consultation',
        description: [
            'Top Specialists',
            'Video Consultations',
            'Instant Booking'
        ],
        iconBg: 'rgba(244, 63, 94, 0.1)',
        iconColor: '#f43f5e',
        bulletColor: '#f43f5e',
        buttonVariant: 'outline-light',
        buttonStyle: { borderColor: '#f43f5e', color: '#f43f5e' },
        route: '/find-doctors',
        buttonText: 'Find Doctors'
    },
    {
        id: 'trending',
        icon: 'TrendingUp',
        title: 'Trending Health',
        description: [
            'Seasonal Flu',
            'Viral Outbreaks',
            'Local Health Alerts'
        ],
        iconBg: 'rgba(239, 68, 68, 0.1)',
        iconColor: '#ef4444',
        bulletColor: 'bg-danger',
        buttonVariant: 'outline-danger',
        route: '#',
        buttonText: 'View Trends'
    },
    {
        id: 'wellness',
        icon: 'Lightbulb',
        title: 'Daily Wellness',
        description: [
            'Hydration',
            'Movement',
            'Mindfulness'
        ],
        iconBg: 'rgba(252, 165, 165, 0.1)',
        iconColor: '#fca5a5',
        bulletColor: 'bg-danger',
        buttonVariant: 'outline-danger',
        route: '#',
        buttonText: 'Wellness Tips'
    }
];

// Animation variants
export const animations = {
    fadeIn: {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.6 }
        }
    },
    cardFadeIn: (delay = 0) => ({
        initial: { opacity: 0, y: 30 },
        whileInView: { opacity: 1, y: 0 },
        transition: { duration: 0.5, delay },
        viewport: { once: true },
        whileHover: { scale: 1.02 }
    })
};

// Style constants
export const styles = {
    headerGradient: {
        backgroundImage: 'linear-gradient(to right, #dc2626, #fb7185)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        backgroundClip: 'text'
    },
    cardStyle: {
        background: '#ffffff',
        border: '1px solid #fecaca',
        borderRadius: '1rem',
        minHeight: '380px',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        boxShadow: '0 1px 3px rgba(220, 38, 38, 0.1)'
    },
    iconContainerStyle: {
        width: '48px',
        height: '48px',
        borderRadius: '12px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: '1rem'
    }
};
