const Redis = require("ioredis");

const redis = new Redis();

const generateKey = (key) => {
  return key.replace(/\s/g, "").toLowerCase();
};

const get = async (req, res, next) => {
  const key = generateKey(req.originalUrl);
  const data = await redis.get(key);

  if (data) {
    return res.status(200).json(JSON.parse(data));
  }

  next();
};

const set = async (req, data) => {
  const key = generateKey(req.originalUrl);
  // 15 minutes of ttl
  await redis.set(key, JSON.stringify(data), "EX", 900);
};

module.exports = {
  get,
  set,
};
