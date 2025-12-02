'use client';

import React from 'react';
import { Button } from 'react-bootstrap';
import { Navigation } from 'lucide-react';
import { getDirectionsUrl } from '@/lib/maps';

/**
 * A reusable button component that opens directions to a specified location.
 * Dynamically adapts the URL based on the user's device (iOS, Android, Web).
 * 
 * @param {Object} props
 * @param {number} props.lat - Latitude of the destination
 * @param {number} props.lon - Longitude of the destination
 * @param {string} props.name - Name of the destination
 * @param {string} [props.variant='outline-primary'] - Bootstrap button variant
 * @param {string} [props.size='sm'] - Bootstrap button size
 * @param {string} [props.className] - Additional CSS classes
 * @param {React.ReactNode} [props.children] - Custom button text/content
 */
const GetDirectionsButton = ({
    lat,
    lon,
    name,
    variant = 'outline-primary',
    size = 'sm',
    className = '',
    children
}) => {
    const handleGetDirections = (e) => {
        // Prevent default if it's inside a link/form, though usually it's a standalone button
        e.preventDefault();
        e.stopPropagation();

        const url = getDirectionsUrl(lat, lon, name);
        if (url) {
            window.open(url, '_blank', 'noopener,noreferrer');
        } else {
            console.error('Invalid coordinates for directions');
            alert('Unable to get directions: Invalid coordinates.');
        }
    };

    if (!lat || !lon) return null;

    return (
        <Button
            variant={variant}
            size={size}
            className={`d-flex align-items-center justify-content-center ${className}`}
            onClick={handleGetDirections}
            style={{ borderRadius: '0.5rem' }}
        >
            <Navigation size={14} className="me-1" />
            {children || 'Directions'}
        </Button>
    );
};

export default GetDirectionsButton;
