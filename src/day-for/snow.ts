import { Router, load, Redis } from "../../deps.ts";

const env = await load();
const PIRATE_WEATER_API_KEY = env.PIRATE_WEATER_API_KEY;
const PIRATE_WEATHER_API_URL = env.PIRATE_WEATHER_API_URL;
const UPSTASH_TOKEN = env.UPSTASH_TOKEN;
const UPSTASH_URL = env.UPSTASH_URL;

interface DayForSnow {
  isSnowDay: boolean;
  icon: string;
}

export const dayForSnowRouter = new Router().get("/", async (ctx) => {
  const redis = new Redis({
    url: UPSTASH_URL,
    token: UPSTASH_TOKEN,
  })
  const lat = ctx.request.url.searchParams.get('lat');
  const long = ctx.request.url.searchParams.get('long');
  const redisKey = `isSnowDay:${lat}:${long}`;
  const isCached = await redis.exists(redisKey);

  if (isCached) {
    const cachedValue: string | null = await redis.get(redisKey);
    ctx.response.body = JSON.parse(cachedValue ?? '');
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

    await redis.set(redisKey, JSON.stringify(returnBody));

    ctx.response.body = returnBody;
  } catch (err) {
    ctx.response.body = { isSnowDay: false, error: err.toString() };
  }
})