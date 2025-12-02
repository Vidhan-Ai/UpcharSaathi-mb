import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { fetchDoctorsFromOverpass } from '@/lib/overpass';

export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        const lat = parseFloat(searchParams.get('lat'));
        const lon = parseFloat(searchParams.get('lon'));
        const radius = parseInt(searchParams.get('radius') || '10000'); // Default 10km for blood banks

        if (!lat || !lon) {
            return NextResponse.json({ error: 'Latitude and Longitude are required' }, { status: 400 });
        }

        // 1. Calculate bounding box for DB cache check
        const latDelta = radius / 111320;
        const lonDelta = radius / (111320 * Math.cos(lat * (Math.PI / 180)));

        const minLat = lat - latDelta;
        const maxLat = lat + latDelta;
        const minLon = lon - lonDelta;
        const maxLon = lon + lonDelta;

        // 2. Check DB Cache for blood banks
        const cachedProviders = await prisma.cachedProvider.findMany({
            where: {
                latitude: { gte: minLat, lte: maxLat },
                longitude: { gte: minLon, lte: maxLon },
                OR: [
                    { type: 'blood_bank' },
                    { type: { contains: 'blood' } }
                ]
            }
        });

        // 3. Check Freshness (TTL: 24 hours)
        const now = Date.now();
        const isStale = cachedProviders.length === 0 || cachedProviders.some(p => {
            const age = now - new Date(p.lastFetched).getTime();
            return age > 24 * 60 * 60 * 1000;
        });

        let results = cachedProviders;

        // 4. If stale, fetch from Overpass and Update Cache
        if (isStale) {
            console.log('Cache stale or empty, fetching blood banks from Overpass...');
            // Note: fetchDoctorsFromOverpass now fetches blood banks too
            const overpassResults = await fetchDoctorsFromOverpass(lat, lon, radius);

            // Filter only blood banks from the mixed results
            const bloodBanks = overpassResults.filter(p =>
                p.type === 'blood_bank' ||
                (p.name && p.name.toLowerCase().includes('blood'))
            );

            if (bloodBanks.length > 0) {
                // Upsert logic - Wrapped in try/catch for resilience
                try {
                    await Promise.all(bloodBanks.map(provider =>
                        prisma.cachedProvider.upsert({
                            where: { osmId: provider.osmId },
                            update: {
                                ...provider,
                                lastFetched: new Date(),
                            },
                            create: {
                                ...provider,
                                lastFetched: new Date(),
                            }
                        })
                    ));

                    // If upsert succeeds, we could refetch, but using the fresh data is fine too.
                    // To be consistent with the other route, let's use the fresh data directly here 
                    // or refetch if we really need the DB IDs. 
                    // For simplicity and speed, let's just use the fresh data we have.
                    results = bloodBanks;
                } catch (dbError) {
                    console.error('Database caching failed (non-fatal):', dbError);
                    results = bloodBanks;
                }
            }
        }

        // 5. Sort by distance
        const resultsWithDistance = results.map(p => {
            const dist = getDistanceFromLatLonInKm(lat, lon, p.latitude, p.longitude);
            return { ...p, distance: dist.toFixed(2) };
        }).sort((a, b) => parseFloat(a.distance) - parseFloat(b.distance));

        return NextResponse.json({
            source: isStale ? 'live' : 'cache',
            count: resultsWithDistance.length,
            results: resultsWithDistance
        });

    } catch (error) {
        console.error('Error in nearby blood banks API:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

// Haversine Formula (reused)
function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
    var R = 6371;
    var dLat = deg2rad(lat2 - lat1);
    var dLon = deg2rad(lon2 - lon1);
    var a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    var d = R * c;
    return d;
}

function deg2rad(deg) {
    return deg * (Math.PI / 180);
}
