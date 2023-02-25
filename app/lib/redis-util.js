const redis = require("./redis");

const getRedisCacheValue = (key) => redis.get(key);
const saveRedisValue = (key, value) => redis.set(key, value);
const deleteRedisValue = (key) => redis.del(key);

module.exports = { getRedisCacheValue, saveRedisValue, deleteRedisValue };
