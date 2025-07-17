import { createClient } from "redis";

let cache = null;

function createCache(logger) {
    if (cache) return cache;

    const client = createClient({
        url: 'redis://localhost:6379',
        socket: {
            reconnectStrategy: retries => {
                if (retries > 5) {
                    // после 5 попыток перестаем пытаться
                    return new Error('Redis reconnect retries exhausted');
                }
                return Math.min(100 * retries, 3000);
            }
        }
    });

    client.on("error", (err) => logger.error(err));
    client.on('connect', () => logger.info('Redis client connecting'));
    client.on('ready', () => logger.info('Redis client ready'));
    client.on('reconnecting', () => logger.warn('Redis client reconnecting'));
    client.on('end', () => logger.info('Redis client disconnected'));

    return client.connect();
}

export default createCache;
