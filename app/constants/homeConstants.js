// Health ecosystem feature cards data
export const healthFeatures = [
    {
        id: 'first-aid',
        icon: 'HeartPulse',
        title: 'Emergency Response',
        description: [
            'Instant CPR Protocols',
            'Trauma Management',
            'Emergency Hotlines'
        ],
        iconBg: 'rgba(239, 68, 68, 0.1)',
        iconColor: '#ef4444',
        bulletColor: 'bg-danger',
        buttonVariant: 'outline-danger',
        route: '/first-aid',
        buttonText: 'Access Protocols'
    },
    {
        id: 'consultation',
        icon: 'Stethoscope',
        title: 'Clinical Consultation',
        description: [
            'Board-Certified Specialists',
            'Telemedicine Integration',
            'Digital Prescriptions'
        ],
        iconBg: 'rgba(244, 63, 94, 0.1)',
        iconColor: '#f43f5e',
        bulletColor: '#f43f5e',
        buttonVariant: 'outline-light',
        buttonStyle: { borderColor: '#f43f5e', color: '#f43f5e' },
        route: '/find-doctors',
        buttonText: 'Consult Specialist'
    },
    {
        id: 'blood-bank',
        icon: 'Activity',
        title: 'Blood Network',
        description: [
            'Real-time Donor Matching',
            'Blood Type Availability',
            'Urgent Requests'
        ],
        iconBg: 'rgba(220, 38, 38, 0.1)',
        iconColor: '#dc2626',
        bulletColor: 'bg-danger',
        buttonVariant: 'outline-danger',
        route: '/blood-bank',
        buttonText: 'Find Donors'
    },
    {
        id: 'wellness',
        icon: 'Lightbulb',
        title: 'Preventive Care',
        description: [
            'Health Vitals Tracking',
            'Lifestyle Analytics',
            'Wellness Recommendations'
        ],
        iconBg: 'rgba(252, 165, 165, 0.1)',
        iconColor: '#fca5a5',
        bulletColor: 'bg-danger',
        buttonVariant: 'outline-danger',
        route: '#',
        buttonText: 'Track Health'
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
        boxShadow: '0 10px 25px -5px rgba(220, 38, 38, 0.15), 0 8px 10px -6px rgba(220, 38, 38, 0.1)',
        transition: 'all 0.3s ease'
    },
    iconContainerStyle: {
        width: '56px',
        height: '56px',
        borderRadius: '16px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: '1.5rem'
    }
};
