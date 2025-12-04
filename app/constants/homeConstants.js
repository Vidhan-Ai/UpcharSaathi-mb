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
        themeColor: '#ef4444', // Red
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
        themeColor: '#2563eb', // Blue
        route: '/find-care?tab=doctors',
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
        themeColor: '#db2777', // Pink
        route: '/find-care?tab=blood-banks',
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
        themeColor: '#059669', // Emerald
        route: '#',
        buttonText: 'Track Health'
    },
    {
        id: 'ai-insights',
        icon: 'Brain',
        title: 'AI Health Insights',
        description: [
            'Real-time AQI Analysis',
            'Local Disease Outbreaks',
            'Personalized Health News'
        ],
        themeColor: '#7c3aed', // Violet
        route: '/ai-health-insights',
        buttonText: 'View Insights'
    },
    {
        id: 'health-tools',
        icon: 'Calculator',
        title: 'Smart Health Tools',
        description: [
            'BMI & BMR Calculators',
            'Hydration Tracker',
            'Health Metrics Analysis'
        ],
        themeColor: '#f97316', // Orange
        route: '/health-tools',
        buttonText: 'Use Tools'
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
        border: '1px solid #dc2626',
        borderRadius: '1rem',
        minHeight: '380px',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        boxShadow: '0 10px 25px -5px rgba(220, 38, 38, 0.15), 0 8px 10px -6px rgba(220, 38, 38, 0.1)'
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
