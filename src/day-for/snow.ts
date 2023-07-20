import { Router, load, Redis } from "../../deps.ts";

const env = await load();
const PIRATE_WEATER_API_KEY = env.PIRATE_WEATER_API_KEY;
const PIRATE_WEATHER_API_URL = env.PIRATE_WEATHER_API_URL;
const UPSTASH_USER = env.UPSTASH_USER;
const UPSTASH_PASSWORD = env.UPSTASH_PASSWORD;
const UPSTASH_ENDPOINT = env.UPSTASH_ENDPOINT;
const UPSTASH_PORT = env.UPSTASH_PORT;

export const dayForSnowRouter = new Router().get("/", async (ctx) => {
  const client = new Redis(`rediss://${UPSTASH_USER}:${UPSTASH_PASSWORD}@${UPSTASH_ENDPOINT}:${UPSTASH_PORT}`);
  const lat = ctx.request.url.searchParams.get('lat');
  const long = ctx.request.url.searchParams.get('long');
  const redisKey = `isSnowDay:${lat}:${long}`;
  const isCached = await client.exists(redisKey);

  if (isCached) {
    const cachedValue = await client.get(redisKey);
    ctx.response.body = JSON.parse(cachedValue);
    return;
  }

  try {
    const fetchWeather = await fetch(`${PIRATE_WEATHER_API_URL}/${PIRATE_WEATER_API_KEY}/${lat},${long}?units=si&exclude=hourly,minutely,daily,alerts`);
    const weather = await fetchWeather.json();

    if (fetchWeather.ok === false) {
      ctx.response.status = 500;
      ctx.response.body = { isSnowDay: false, error: weather.error };
      return;
    }

    const returnBody = { isSnowDay: weather.currently.icon === 'snow', icon: weather.currently.icon };

    await client.set(redisKey, JSON.stringify(returnBody));

    ctx.response.body = returnBody;
  } catch (err) {
    ctx.response.body = { isSnowDay: false, error: err.toString() };
  }
})