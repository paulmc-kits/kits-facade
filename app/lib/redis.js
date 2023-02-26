const Redis = require("ioredis");

const redis = new Redis(6379, "CKAN_REDIS_URL");

module.exports = redis;
