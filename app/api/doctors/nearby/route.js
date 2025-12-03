import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { fetchDoctorsFromOverpass } from '@/lib/overpass';

export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        const lat = parseFloat(searchParams.get('lat'));
        const lon = parseFloat(searchParams.get('lon'));
        const radius = parseInt(searchParams.get('radius') || '5000'); // meters

        if (!lat || !lon) {
            return NextResponse.json({ error: 'Latitude and Longitude are required' }, { status: 400 });
        }

        // 1. Calculate bounding box for DB cache check
        // 1 degree lat ~= 111km
        const latDelta = radius / 111320;
        const lonDelta = radius / (111320 * Math.cos(lat * (Math.PI / 180)));

        const minLat = lat - latDelta;
        const maxLat = lat + latDelta;
        const minLon = lon - lonDelta;
        const maxLon = lon + lonDelta;

        // 2. Check DB Cache
        let cachedProviders = [];
        try {
            cachedProviders = await prisma.cachedProvider.findMany({
                where: {
                    latitude: { gte: minLat, lte: maxLat },
                    longitude: { gte: minLon, lte: maxLon },
                }
            });
        } catch (dbReadError) {
            console.warn('Database read failed, skipping cache check:', dbReadError.message);
            // Continue with empty cache (will trigger live fetch)
        }

        // 3. Check Freshness (TTL: 24 hours)
        const now = Date.now();
        const isStale = cachedProviders.length === 0 || cachedProviders.some(p => {
            const age = now - new Date(p.lastFetched).getTime();
            return age > 24 * 60 * 60 * 1000;
        });

        let results = cachedProviders;

        // 4. If stale, fetch from Overpass and Update Cache
        if (isStale) {
            console.log('Cache stale or empty, fetching from Overpass...');
            const overpassResults = await fetchDoctorsFromOverpass(lat, lon, radius);

            if (overpassResults.length > 0) {
                // Upsert logic - Wrapped in try/catch to prevent DB write failures from blocking the response
                // This handles cases like read-only filesystems (Vercel) or DB connection issues
                try {
                    await Promise.all(overpassResults.map(provider =>
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

                    // Refetch from DB to ensure consistency and get IDs
                    results = await prisma.cachedProvider.findMany({
                        where: {
                            latitude: { gte: minLat, lte: maxLat },
                            longitude: { gte: minLon, lte: maxLon },
                        }
                    });
                } catch (dbError) {
                    console.error('Database caching failed (non-fatal):', dbError);
                    // Fallback: Use the results directly from Overpass if DB write fails
                    results = overpassResults;
                }
            }
        }

        // 5. Client-side filtering/sorting (optional, but good for "nearby")
        // We already filtered by bounding box, but let's sort by exact distance
        const resultsWithDistance = results.map(p => {
            const dist = getDistanceFromLatLonInKm(lat, lon, p.latitude, p.longitude);
            return { ...p, distance: dist.toFixed(2) }; // Distance in km
        }).sort((a, b) => parseFloat(a.distance) - parseFloat(b.distance));

        return NextResponse.json({
            source: isStale ? 'live' : 'cache',
            count: resultsWithDistance.length,
            results: resultsWithDistance
        });

    } catch (error) {
        console.error('Error in nearby doctors API:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

// Haversine Formula
function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
    var R = 6371; // Radius of the earth in km
    var dLat = deg2rad(lat2 - lat1);
    var dLon = deg2rad(lon2 - lon1);
    var a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    var d = R * c; // Distance in km
    return d;
}

function deg2rad(deg) {
    return deg * (Math.PI / 180);
}
