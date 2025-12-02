import { NextResponse } from 'next/server';
import { searchLocation } from '@/lib/geocoding';

export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        const query = searchParams.get('q');

        if (!query) {
            return NextResponse.json({ error: 'Query parameter "q" is required' }, { status: 400 });
        }

        // 1. Geocode the query
        const location = await searchLocation(query);

        if (!location) {
            return NextResponse.json({ error: 'Could not determine location from query' }, { status: 404 });
        }

        // 2. Redirect to /nearby with the found coordinates
        const url = new URL('/api/blood-bank/nearby', request.url);
        url.searchParams.set('lat', location.lat);
        url.searchParams.set('lon', location.lon);
        url.searchParams.set('radius', '10000'); // 10km for blood banks

        const nearbyResponse = await fetch(url);
        const nearbyData = await nearbyResponse.json();

        return NextResponse.json({
            query,
            detectedLocation: location.display_name,
            count: nearbyData.results ? nearbyData.results.length : 0,
            results: nearbyData.results || []
        });

    } catch (error) {
        console.error('Error in blood bank search API:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
