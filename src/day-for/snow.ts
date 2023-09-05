import { kv, Router } from "../../deps.ts";

const PIRATE_WEATHER_API_KEY = Deno.env.get("PIRATE_WEATHER_API_KEY");
const PIRATE_WEATHER_API_URL = Deno.env.get("PIRATE_WEATHER_API_URL");

interface DayForSnow {
  isSnowDay: boolean;
  icon: string;
}

export const dayForSnowRouter = new Router().get("/", async (ctx) => {
  const lat = ctx.request.url.searchParams.get("lat");
  const long = ctx.request.url.searchParams.get("long");
  const cachedValue = await kv.get(["isSnowDay", lat, long]);

  if (cachedValue.value) {
    ctx.response.body = cachedValue.value;
    return;
  }

  try {
    const fetchWeather = await fetch(
      `${PIRATE_WEATHER_API_URL}/${PIRATE_WEATHER_API_KEY}/${lat},${long}?units=si&exclude=hourly,minutely,daily,alerts`,
    );
    const weather = await fetchWeather.json();

    if (fetchWeather.ok === false) {
      ctx.response.status = 500;
      ctx.response.body = { isSnowDay: false, error: weather.error };
      return;
    }

    const returnBody = {
      isSnowDay: weather.currently.icon === "snow",
      icon: weather.currently.icon,
    };

    await kv.set(["isSnowDay", lat, long], returnBody);

    ctx.response.body = returnBody;
  } catch (err) {
    ctx.response.body = { isSnowDay: false, error: err.toString() };
  }
});
