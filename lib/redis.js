import Redis from 'ioredis';

const redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379', {
    // Retry strategy to avoid crashing on connection failure
    retryStrategy(times) {
        if (times > 3) {
            return null; // Stop retrying after 3 attempts
        }
        const delay = Math.min(times * 50, 2000);
        return delay;
    },
    // Set max retries per request to avoid hanging
    maxRetriesPerRequest: 1,
    // Connection timeout
    connectTimeout: 1000,
    // Enable offline queue with limit
    enableOfflineQueue: false,
    // Lazy connect - don't block on startup
    lazyConnect: true
});

// Handle connection errors gracefully
redis.on('error', (err) => {
    // Log error but don't crash
    console.warn('Redis connection error (non-fatal):', err.message);
});

// Attempt to connect but don't wait for it
const isBuildStep = process.env.npm_lifecycle_event === 'build' || process.argv.some(arg => arg.includes('build'));

if (!isBuildStep) {
    redis.connect().catch(err => {
        console.warn('Redis initial connection failed (will continue without Redis):', err.message);
    });
}

export default redis;
