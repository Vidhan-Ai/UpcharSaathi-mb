import { NextResponse } from 'next/server';
import * as cheerio from 'cheerio';

export const dynamic = 'force-dynamic';

export async function GET(request) {
    const { searchParams } = new URL(request.url);
    const lat = searchParams.get('lat') || '28.61';
    const lon = searchParams.get('lon') || '77.20';
    const city = searchParams.get('city') || 'New Delhi';

    try {
        const weatherPromise = scrapeGoogleWeather(lat, lon, city);

        // Prioritize fetching from aqi.in if city is available
        const aqiPromise = fetchAQIIn(city).then(data => {
            if (data && data.us_aqi) return data;
            // Fallback to OpenMeteo if scrape fails
            return fetchOpenMeteoAQI(lat, lon);
        });

        const [weather, aqi] = await Promise.all([weatherPromise, aqiPromise]);

        return NextResponse.json({
            weather,
            aqi
        });

    } catch (error) {
        console.error("Error in local-health-data:", error);
        return NextResponse.json({ error: "Failed to fetch data" }, { status: 500 });
    }
}

async function scrapeGoogleWeather(lat, lon, city) {
    let query = `weather`;
    if (lat && lon && lat !== '28.61') query = `weather loc:${lat},${lon}`;
    else query = `weather ${city}`;

    try {
        const res = await fetch(`https://www.google.com/search?q=${encodeURIComponent(query)}&hl=en&gl=IN&ceid=IN:en`, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                'Accept-Language': 'en-US,en;q=0.9'
            }
        });

        if (!res.ok) throw new Error('Google request failed');

        const html = await res.text();
        const $ = cheerio.load(html);

        const temp = $('#wob_tm').text();
        const condition = $('#wob_dc').text();
        const humidity = $('#wob_hm').text();
        const wind = $('#wob_ws').text();

        const high = $('.wob_df').first().find('.wob_t').first().text();
        const low = $('.wob_df').first().find('.wob_t').last().text();

        if (!temp || !condition) {
            throw new Error('Scraping returned partial data');
        }

        return {
            source: 'Google',
            temp: parseInt(temp),
            condition: condition,
            humidity: humidity,
            wind: wind,
            high: high ? parseInt(high) : null,
            low: low ? parseInt(low) : null
        };

    } catch (e) {
        console.log("Google Scrape failed, falling back to OpenMeteo:", e.message);
        return await fetchOpenMeteoWeather(lat, lon);
    }
}

async function fetchOpenMeteoWeather(lat, lon) {
    try {
        const res = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m&daily=temperature_2m_max,temperature_2m_min&timezone=auto`);
        const data = await res.json();

        return {
            source: 'OpenMeteo',
            temp: Math.round(data.current.temperature_2m),
            conditionCode: data.current.weather_code,
            condition: null,
            humidity: data.current.relative_humidity_2m + '%',
            wind: data.current.wind_speed_10m + ' km/h',
            high: Math.round(data.daily.temperature_2m_max[0]),
            low: Math.round(data.daily.temperature_2m_min[0])
        };
    } catch (err) {
        return null;
    }
}

async function fetchAQIIn(city) {
    try {
        // 1. Search Google for the specific aqi.in page to find the correct slug
        const searchRes = await fetch(`https://www.google.com/search?q=site:aqi.in+${encodeURIComponent(city)}+air+quality+dashboard&hl=en`, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
            }
        });
        const searchHtml = await searchRes.text();
        const $search = cheerio.load(searchHtml);

        let aqiLink = null;
        $search('a').each((i, el) => {
            const href = $search(el).attr('href');
            // Google search result links are usually /url?q=...
            if (href && href.startsWith('/url?q=https://www.aqi.in/in/dashboard/india/')) {
                aqiLink = href.split('/url?q=')[1].split('&')[0];
                return false; // break
            }
            // Sometimes direct links if not proxied
            if (href && href.includes('aqi.in/in/dashboard/india/')) {
                aqiLink = href;
                return false;
            }
        });

        if (!aqiLink) {
            console.log(`No aqi.in link found for ${city}`);
            return null;
        }

        // 2. Fetch the AQI.in page
        const pageRes = await fetch(aqiLink, {
            headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36' }
        });
        const html = await pageRes.text();
        const $ = cheerio.load(html);

        // 3. Parse PM2.5 and PM10
        // We look for text content matching "Particulate Matter(PM2.5) 109µg/m³" pattern
        let pm25 = 0;
        let pm10 = 0;

        // Scan text for values
        const bodyText = $('body').text();
        // Regex to find "Particulate Matter(PM2.5)" followed eventually by number and units
        // The text often comes as "Particulate Matter(PM2.5)109µg/m³" without spaces in some cheerio text dumps

        const pm25Match = bodyText.match(/Particulate Matter\(PM2\.5\)\s*(\d+)/);
        if (pm25Match) pm25 = parseInt(pm25Match[1]);

        const pm10Match = bodyText.match(/Particulate Matter\(PM10\)\s*(\d+)/);
        if (pm10Match) pm10 = parseInt(pm10Match[1]);

        if (pm25 === 0) {
            // Try searching just "PM2.5" context nearby
            // Fallback
            return null;
        }

        const usAQI = calculateUSAQI(pm25);
        const indAQI = calculateIndianAQI(pm25, pm10);

        return {
            source: 'aqi.in',
            city,
            pm2_5: pm25,
            pm10: pm10,
            us_aqi: usAQI,
            indian_aqi: indAQI,
            link: aqiLink
        };

    } catch (e) {
        console.error("AQI.in scrape failed:", e);
        return null; // Fallback will take over
    }
}

function calculateUSAQI(pm25) {
    // US EPA Breakpoints for PM2.5
    const calc = (Cp, Ih, Il, BPh, BPl) => Math.round(((Ih - Il) / (BPh - BPl)) * (Cp - BPl) + Il);

    if (pm25 <= 12.0) return calc(pm25, 50, 0, 12, 0);
    if (pm25 <= 35.4) return calc(pm25, 100, 51, 35.4, 12.1);
    if (pm25 <= 55.4) return calc(pm25, 150, 101, 55.4, 35.5);
    if (pm25 <= 150.4) return calc(pm25, 200, 151, 150.4, 55.5);
    if (pm25 <= 250.4) return calc(pm25, 300, 201, 250.4, 150.5);
    if (pm25 <= 350.4) return calc(pm25, 400, 301, 350.4, 250.5);
    return calc(pm25, 500, 401, 500.4, 350.5);
}

function calculateIndianAQI(pm25, pm10) {
    // Indian CPCB Breakpoints
    const calc = (C, Ih, Il, BPh, BPl) => Math.round(((Ih - Il) / (BPh - BPl)) * (C - BPl) + Il);

    const getSubIndexPM25 = (c) => {
        if (c <= 30) return calc(c, 50, 0, 30, 0);
        if (c <= 60) return calc(c, 100, 51, 60, 31);
        if (c <= 90) return calc(c, 200, 101, 90, 61);
        if (c <= 120) return calc(c, 300, 201, 120, 91);
        if (c <= 250) return calc(c, 400, 301, 250, 121);
        return calc(c, 500, 401, 500, 250);
    }

    const getSubIndexPM10 = (c) => {
        if (c <= 50) return calc(c, 50, 0, 50, 0);
        if (c <= 100) return calc(c, 100, 51, 100, 51);
        if (c <= 250) return calc(c, 200, 101, 250, 101);
        if (c <= 350) return calc(c, 300, 201, 350, 251);
        if (c <= 430) return calc(c, 400, 301, 430, 351);
        return calc(c, 500, 401, 500, 430);
    }

    // Indian AQI takes the MAX of the sub-indices
    return Math.max(getSubIndexPM25(pm25), getSubIndexPM10(pm10));
}

async function fetchOpenMeteoAQI(lat, lon) {
    try {
        const res = await fetch(`https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${lat}&longitude=${lon}&current=us_aqi,pm10,pm2_5`);
        const data = await res.json();
        const ind = calculateIndianAQI(data.current.pm2_5, data.current.pm10);
        return {
            source: 'OpenMeteo',
            us_aqi: data.current.us_aqi,
            indian_aqi: ind,
            pm10: data.current.pm10,
            pm2_5: data.current.pm2_5
        };
    } catch (err) {
        return null;
    }
}
