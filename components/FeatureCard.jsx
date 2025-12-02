'use client'
import { Card, Button } from "react-bootstrap"
import { motion } from "framer-motion"
import { Activity, HeartPulse, Stethoscope, Pill, TrendingUp, Lightbulb } from "lucide-react"
import { useRouter } from "next/navigation"
import { styles } from "../app/constants/homeConstants"

const iconComponents = {
    Activity,
    HeartPulse,
    Stethoscope,
    Pill,
    TrendingUp,
    Lightbulb
};

export default function FeatureCard({ feature, delay = 0 }) {
    const router = useRouter();
    const IconComponent = iconComponents[feature.icon];

    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay }}
            viewport={{ once: true }}
            whileHover={{ scale: 1.02 }}
        >
            <Card style={styles.cardStyle} className="h-100 custom-card border-0 shadow-sm">
                <Card.Body className="d-flex flex-column p-4">
                    <div
                        style={{
                            ...styles.iconContainerStyle,
                            background: feature.iconBg,
                            color: feature.iconColor
                        }}
                    >
                        <IconComponent size={24} />
                    </div>

                    <h4 className="fw-bold mb-4 text-dark">{feature.title}</h4>

                    <ul className="list-unstyled flex-grow-1 text-muted">
                        {feature.description.map((item, index) => (
                            <li key={index} className="mb-3 d-flex align-items-center gap-2">
                                <span
                                    className={`d-inline-block rounded-circle ${feature.bulletColor}`}
                                    style={{
                                        width: '6px',
                                        height: '6px',
                                        backgroundColor: typeof feature.bulletColor === 'string' && !feature.bulletColor.startsWith('bg-')
                                            ? feature.bulletColor
                                            : undefined
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
                        variant={feature.buttonVariant}
                        size="lg"
                        className="w-100 fw-bold"
                        style={feature.buttonStyle}
                        onClick={() => feature.route !== '#' && router.push(feature.route)}
                    >
                        {feature.buttonText}
                    </Button>
                </Card.Footer>
            </Card>
        </motion.div>
    );
}
