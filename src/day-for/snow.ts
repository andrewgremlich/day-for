import { Router, load } from "../../deps.ts";

const env = await load();
const PIRATE_WEATER_API_KEY = env.PIRATE_WEATER_API_KEY;
const PIRATE_WEATHER_API_URL = env.PIRATE_WEATHER_API_URL;

export const dayForSnowRouter = new Router().get("/", async (ctx) => {
  const lat = ctx.request.url.searchParams.get('lat')
  const long = ctx.request.url.searchParams.get('long')

  const fetchWeather = await fetch(`${PIRATE_WEATHER_API_URL}/${PIRATE_WEATER_API_KEY}/${lat},${long}`)
  const weather = await fetchWeather.json();

  ctx.response.body = { isSnowDay: weather.minutely.icon === 'snow', icon: weather.minutely.icon };
})