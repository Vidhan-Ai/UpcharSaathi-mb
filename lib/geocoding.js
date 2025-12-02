/**
 * Geocodes a location query using Nominatim.
 * @param {string} query - The location to search for
 * @returns {Promise<Object|null>} - The best matching location or null
 */
export async function searchLocation(query) {
    if (!query) return null;

    try {
        const params = new URLSearchParams({
            q: query,
            format: 'json',
            limit: 1,
            addressdetails: 1
        });

        // Nominatim requires a User-Agent
        const response = await fetch(`https://nominatim.openstreetmap.org/search?${params}`, {
            headers: {
                'User-Agent': 'UpcharSaathi/1.0 (Educational Project)'
            }
        });

        if (!response.ok) {
            throw new Error(`Nominatim API error: ${response.status}`);
        }

        const data = await response.json();
        return data.length > 0 ? data[0] : null;
    } catch (error) {
        console.error('Error fetching from Nominatim:', error);
        return null;
    }
}

/**
 * Reverse geocoding to get address from lat/lon
 */
export async function reverseGeocode(lat, lon) {
    try {
        const params = new URLSearchParams({
            lat,
            lon,
            format: 'json',
        });

        const response = await fetch(`https://nominatim.openstreetmap.org/reverse?${params}`, {
            headers: {
                'User-Agent': 'UpcharSaathi/1.0 (Educational Project)'
            }
        });

        if (!response.ok) return null;
        return await response.json();
    } catch (error) {
        console.error('Error reverse geocoding:', error);
        return null;
    }
}
