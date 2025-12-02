const SERVERS = [
    'https://overpass-api.de/api/interpreter',
    'https://overpass.kumi.systems/api/interpreter',
    'https://lz4.overpass-api.de/api/interpreter'
];

/**
 * Fetches healthcare providers from OpenStreetMap via Overpass API.
 * @param {number} lat - Latitude
 * @param {number} lon - Longitude
 * @param {number} radius - Radius in meters
 * @returns {Promise<Array>} - List of providers
 */
export async function fetchDoctorsFromOverpass(lat, lon, radius = 5000) {
    // Query for doctors, clinics, hospitals, or blood banks
    // Using 'out center' to get coordinates for ways/relations
    // Increased timeout to 20s as requested
    const query = `
    [out:json][timeout:20];
    (
      node["amenity"~"doctors|clinic|hospital|blood_bank"](around:${radius},${lat},${lon});
      way["amenity"~"doctors|clinic|hospital|blood_bank"](around:${radius},${lat},${lon});
      relation["amenity"~"doctors|clinic|hospital|blood_bank"](around:${radius},${lat},${lon});
      node["healthcare"~"doctor|blood_bank"](around:${radius},${lat},${lon});
    );
    out center;
  `;

    let lastError = null;

    for (const server of SERVERS) {
        try {
            console.log(`Fetching from Overpass server: ${server}`);

            // Create a fetch with a slightly longer timeout than the query itself
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 25000);

            const response = await fetch(server, {
                method: 'POST',
                body: query,
                signal: controller.signal,
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'User-Agent': 'UpcharSaathi/1.0 (Educational Project; contact: admin@example.com)' // Policy requirement
                }
            });

            clearTimeout(timeoutId);

            if (!response.ok) {
                console.warn(`Server ${server} returned status ${response.status}. Trying next...`);
                continue;
            }

            const data = await response.json();
            const results = parseOverpassResponse(data);

            // Smart Retry: If we get results, return them immediately.
            if (results.length > 0) {
                return results;
            }

            // If 0 results, log and try next server (in case of data inconsistency)
            console.warn(`Server ${server} returned 0 results. Retrying next server...`);

        } catch (error) {
            console.error(`Error fetching from ${server}:`, error.message);
            lastError = error;
        }
    }

    // If we tried all servers and found nothing (or all failed), return empty array
    console.log('All Overpass servers exhausted. Returning empty list.');
    return [];
}

function parseOverpassResponse(data) {
    if (!data || !data.elements) return [];

    return data.elements.map(element => {
        const tags = element.tags || {};

        // Determine coordinates (node has lat/lon, way/relation has center.lat/center.lon)
        const lat = element.lat || (element.center && element.center.lat);
        const lon = element.lon || (element.center && element.center.lon);

        if (!lat || !lon) return null;

        // Map OSM tags to our schema
        return {
            osmId: `${element.type}/${element.id}`,
            name: tags.name || tags['name:en'] || tags['name:hi'] || 'Healthcare Provider',
            type: tags.amenity || tags.healthcare || 'doctor',
            specialty: tags['healthcare:speciality'] || tags['speciality'] || tags['doctor:speciality'] || null,
            address: formatAddress(tags),
            phone: tags.phone || tags['contact:phone'] || null,
            website: tags.website || tags['contact:website'] || null,
            latitude: lat,
            longitude: lon,
            metadata: {
                opening_hours: tags.opening_hours,
                wheelchair: tags.wheelchair,
                emergency: tags.emergency
            }
        };
    }).filter(item => item !== null);
}

function formatAddress(tags) {
    const parts = [
        tags['addr:housenumber'],
        tags['addr:street'],
        tags['addr:suburb'],
        tags['addr:city'],
        tags['addr:postcode']
    ].filter(Boolean);

    return parts.length > 0 ? parts.join(', ') : null;
}
