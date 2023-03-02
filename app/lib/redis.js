const { REDIS_HOST, REDIS_PORT } = require('../config');

const Redis = require("ioredis");

const redis = new Redis(REDIS_PORT, REDIS_HOST);

module.exports = redis;
