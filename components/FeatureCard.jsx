'use client'
import { Card, Button } from "react-bootstrap"
import { motion } from "framer-motion"
import { Activity, HeartPulse, Stethoscope, Pill, TrendingUp, Lightbulb, Brain, Calculator } from "lucide-react"
import { useRouter } from "next/navigation"
import { styles } from "../app/constants/homeConstants"
import { useState } from "react"

const iconComponents = {
    Activity,
    HeartPulse,
    Stethoscope,
    Pill,
    TrendingUp,
    Lightbulb,
    Brain,
    Calculator
};

const hexToRgba = (hex, alpha) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

export default function FeatureCard({ feature, delay = 0 }) {
    const router = useRouter();
    const [isButtonHovered, setIsButtonHovered] = useState(false);
    const IconComponent = iconComponents[feature.icon];
    const themeColor = feature.themeColor || '#dc2626'; // Default to red if missing

    return (
        <motion.div
            className="card h-100 custom-card"
            style={{
                ...styles.cardStyle,
                border: `1px solid ${hexToRgba(themeColor, 0.3)}`,
            }}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay }}
            viewport={{ once: true }}
            whileHover={{
                scale: 1.02,
                boxShadow: `0 20px 25px -5px ${hexToRgba(themeColor, 0.2)}, 0 10px 10px -5px ${hexToRgba(themeColor, 0.1)}`
            }}
        >
            <Card.Body className="d-flex flex-column p-4">
                <motion.div
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    style={{
                        ...styles.iconContainerStyle,
                        background: hexToRgba(themeColor, 0.1),
                        color: themeColor
                    }}
                >
                    <IconComponent size={28} />
                </motion.div>

                <h4 className="fw-bold mb-4 text-dark">{feature.title}</h4>

                <ul className="list-unstyled flex-grow-1 text-muted">
                    {feature.description.map((item, index) => (
                        <li key={index} className="mb-3 d-flex align-items-center gap-2">
                            <span
                                className="d-inline-block rounded-circle"
                                style={{
                                    width: '6px',
                                    height: '6px',
                                    backgroundColor: themeColor
                                }}
                            />
                            {item}
                        </li>
                    ))}
                </ul>
            </Card.Body>

            <Card.Footer
                style={{
                    background: 'transparent',
                    borderTop: '1px solid #e2e8f0',
                    padding: '1.5rem'
                }}
            >
                <Button
                    variant="outline-light" // Use outline-light as base to avoid default Bootstrap colors interfering
                    size="lg"
                    className="w-100 fw-bold"
                    style={{
                        borderColor: themeColor,
                        color: isButtonHovered ? '#ffffff' : themeColor,
                        backgroundColor: isButtonHovered ? themeColor : 'transparent',
                        transition: 'all 0.3s ease'
                    }}
                    onMouseEnter={() => setIsButtonHovered(true)}
                    onMouseLeave={() => setIsButtonHovered(false)}
                    onClick={() => feature.route !== '#' && router.push(feature.route)}
                >
                    {feature.buttonText}
                </Button>
            </Card.Footer>
        </motion.div>
    );
}
