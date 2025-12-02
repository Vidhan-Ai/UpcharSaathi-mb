/**
 * Utility functions for map and navigation related operations.
 */

/**
 * Generates a navigation URL based on the user's platform.
 * 
 * @param {number} lat - Latitude of the destination
 * @param {number} lon - Longitude of the destination
 * @param {string} name - Name of the destination (for label)
 * @returns {string} The navigation URL
 */
export const getDirectionsUrl = (lat, lon, name) => {
    if (!lat || !lon) return null;

    const encodedName = encodeURIComponent(name || 'Destination');
    const isClient = typeof window !== 'undefined';

    if (!isClient) {
        // Server-side fallback
        return `https://www.google.com/maps/dir/?api=1&destination=${lat},${lon}`;
    }

    const userAgent = navigator.userAgent || navigator.vendor || window.opera;

    // iOS detection
    if (/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream) {
        // Apple Maps URL scheme
        return `maps://?daddr=${lat},${lon}&q=${encodedName}`;
    }

    // Android detection
    if (/android/i.test(userAgent)) {
        // Geo intent
        return `geo:${lat},${lon}?q=${lat},${lon}(${encodedName})`;
    }

    // Default Web Fallback (Google Maps)
    return `https://www.google.com/maps/dir/?api=1&destination=${lat},${lon}`;
};
