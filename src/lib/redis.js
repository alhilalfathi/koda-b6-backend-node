import { createClient } from 'redis'

const redisHost = process.env.REDIS_HOST || '127.0.0.1'
const redisPort = process.env.REDIS_PORT || '6379'

const redisClient = createClient({
    url: `redis://${redisHost}:${redisPort}`
})

redisClient.on('error', (err) => console.error('Redis Client Error:', err))

try {
    await redisClient.connect()
    console.log('Connected to Redis')
} catch (err) {
    console.error('Could not connect to Redis:', err)
}

export default redisClient