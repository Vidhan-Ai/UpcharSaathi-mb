'use server'

import { stackServerApp } from "@/stack/server";
import { prisma } from "@/lib/db";

async function refreshFitbitToken(tokenRecord) {
    const clientId = process.env.FITBIT_CLIENT_ID;
    const clientSecret = process.env.FITBIT_CLIENT_SECRET;

    if (!clientId || !clientSecret) return null;

    try {
        const response = await fetch('https://api.fitbit.com/oauth2/token', {
            method: 'POST',
            headers: {
                'Authorization': 'Basic ' + Buffer.from(clientId + ':' + clientSecret).toString('base64'),
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: new URLSearchParams({
                grant_type: 'refresh_token',
                refresh_token: tokenRecord.refreshToken
            })
        });

        const data = await response.json();

        if (data.errors || !data.access_token) {
            console.error("Failed to refresh token", data);
            return null;
        }

        const expiresAt = new Date(Date.now() + data.expires_in * 1000);

        const updated = await prisma.fitbitToken.update({
            where: { id: tokenRecord.id },
            data: {
                accessToken: data.access_token,
                refreshToken: data.refresh_token,
                expiresAt: expiresAt
            }
        });

        return updated.accessToken;

    } catch (e) {
        console.error("Refresh token exception", e);
        return null;
    }
}

const fetchWithTimeout = async (resource, options = {}) => {
    const { timeout = 8000 } = options;

    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), timeout);
    const response = await fetch(resource, {
        ...options,
        signal: controller.signal
    });
    clearTimeout(id);
    return response;
}

export async function getFitbitData() {
    console.log("Starting getFitbitData...");
    const user = await stackServerApp.getUser();
    if (!user) {
        console.log("User not found via Stack");
        return { isConnected: false, error: 'User not logged in' };
    }

    let tokenRecord = await prisma.fitbitToken.findUnique({
        where: { userId: user.id }
    });

    if (!tokenRecord) {
        console.log("No Fitbit token found in DB");
        return { isConnected: false };
    }

    console.log("Fitbit token found, checking expiry...");

    // Check expiry
    let accessToken = tokenRecord.accessToken;
    // Buffer of 5 minutes
    if (new Date(new Date().getTime() + 5 * 60000) > tokenRecord.expiresAt) {
        console.log("Token expired, refreshing...");
        accessToken = await refreshFitbitToken(tokenRecord);
        if (!accessToken) {
            console.error("Token refresh failed");
            return { isConnected: true, error: "Session expired. Please reconnect." };
        }
    }

    try {
        const headers = { 'Authorization': `Bearer ${accessToken}` };

        console.log("Fetching Fitbit activity data...");

        // Fetch 7 days data (including today)
        const stepsRes = await fetchWithTimeout('https://api.fitbit.com/1/user/-/activities/steps/date/today/7d.json', { headers });
        const stepsData = await stepsRes.json();

        const caloriesRes = await fetchWithTimeout('https://api.fitbit.com/1/user/-/activities/calories/date/today/7d.json', { headers });
        const caloriesData = await caloriesRes.json();

        const hrRes = await fetchWithTimeout('https://api.fitbit.com/1/user/-/activities/heart/date/today/1d.json', { headers });
        const hrData = await hrRes.json();

        const sleepRes = await fetchWithTimeout('https://api.fitbit.com/1.2/user/-/sleep/date/today.json', { headers });
        const sleepData = await sleepRes.json();


        let activityData = [];
        let stepsToday = 0;
        let caloriesToday = 0;

        if (stepsData.errors || caloriesData.errors) {
            console.error("Fitbit Data Errors:", stepsData.errors || caloriesData.errors);
            throw new Error("API returned errors");
        }

        if (stepsData['activities-steps'] && caloriesData['activities-calories']) {
            activityData = stepsData['activities-steps'].map((stepDay) => {
                const calDay = caloriesData['activities-calories'].find(c => c.dateTime === stepDay.dateTime);
                // Date string is YYYY-MM-DD
                const date = new Date(stepDay.dateTime + 'T00:00:00');
                const name = date.toLocaleDateString('en-US', { weekday: 'short' });
                const steps = parseInt(stepDay.value);
                const calories = calDay ? parseInt(calDay.value) : 0;
                return { name, steps, calories };
            });

            // Rest of processing...
        } else {
            // Handle missing data gracefully
            console.warn("Fitbit data missing expected fields", stepsData, caloriesData);
        }

        let heartRateAvg = 0;
        if (hrData['activities-heart'] && hrData['activities-heart'].length > 0) {
            const todayHr = hrData['activities-heart'][0].value;
            heartRateAvg = todayHr.restingHeartRate || 0;
        }

        let sleepDuration = '0h 0m';
        if (sleepData.sleep && sleepData.sleep.length > 0) {
            // Find main sleep
            const mainSleep = sleepData.sleep.find(s => s.isMainSleep) || sleepData.sleep[0];
            const minutes = mainSleep.minutesAsleep;
            const h = Math.floor(minutes / 60);
            const m = minutes % 60;
            sleepDuration = `${h}h ${m}m`;
        }

        const summaryRes = await fetchWithTimeout('https://api.fitbit.com/1/user/-/activities/date/today.json', { headers });
        const summaryData = await summaryRes.json();

        let activityDistribution = [];
        if (summaryData.summary) {
            activityDistribution = [
                { name: 'Sedentary', value: summaryData.summary.sedentaryMinutes, color: '#94a3b8' },
                { name: 'Lightly Active', value: summaryData.summary.lightlyActiveMinutes, color: '#3b82f6' },
                { name: 'Fairly Active', value: summaryData.summary.fairlyActiveMinutes, color: '#f59e0b' },
                { name: 'Very Active', value: summaryData.summary.veryActiveMinutes, color: '#10b981' },
            ].filter(x => x.value > 0);
        }

        console.log("Fitbit data fetched successfully");

        return {
            isConnected: true,
            data: {
                activityData,
                stepsToday,
                caloriesToday,
                heartRateAvg,
                sleepDuration,
                activityDistribution
            }
        };

    } catch (err) {
        console.error("Error fetching Fitbit data", err);
        return { isConnected: true, error: "Failed to fetch data from Fitbit" };
    }
}

export async function disconnectFitbit() {
    const user = await stackServerApp.getUser();
    if (user) {
        await prisma.fitbitToken.delete({
            where: { userId: user.id }
        });
    }
    return true;
}
