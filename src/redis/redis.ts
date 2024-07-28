import RedisClient from "ioredis";

const redis = new RedisClient(process.env.REDIS_URL!);

export default redis;
