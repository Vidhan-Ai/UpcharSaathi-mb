import { NextResponse } from 'next/server';
import { searchLocation } from '@/lib/geocoding';
import { getSpecialtyFromSymptom } from '@/lib/specialtyMapper';

export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        const query = searchParams.get('q');

        if (!query) {
            return NextResponse.json({ error: 'Query parameter "q" is required' }, { status: 400 });
        }

        // 1. Check if query implies a specialty/symptom
        const specialty = getSpecialtyFromSymptom(query);

        // 2. Geocode the query (assuming it contains a location)
        // If the query is just "Cardiologist", this might fail to find a location.
        // Ideally, the frontend should send user's location or a specific location string.
        // For this implementation, we'll try to geocode the whole string.
        const location = await searchLocation(query);

        if (!location) {
            return NextResponse.json({ error: 'Could not determine location from query' }, { status: 404 });
        }

        // 3. Redirect to /nearby with the found coordinates
        // We construct the URL for the nearby endpoint
        const url = new URL('/api/doctors/nearby', request.url);
        url.searchParams.set('lat', location.lat);
        url.searchParams.set('lon', location.lon);
        url.searchParams.set('radius', '5000'); // Default 5km

        // Internal fetch to reuse logic
        const nearbyResponse = await fetch(url);
        const nearbyData = await nearbyResponse.json();

        // 4. Filter by specialty if applicable
        let results = nearbyData.results || [];
        if (specialty) {
            results = results.filter(doc =>
                (doc.specialty && doc.specialty.toLowerCase().includes(specialty.toLowerCase())) ||
                (doc.name && doc.name.toLowerCase().includes(specialty.toLowerCase()))
            );
        }

        return NextResponse.json({
            query,
            detectedLocation: location.display_name,
            detectedSpecialty: specialty,
            count: results.length,
            results
        });

    } catch (error) {
        console.error('Error in search API:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
