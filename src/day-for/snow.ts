import { kv, Router } from "../../deps.ts";

const PIRATE_WEATHER_API_KEY = Deno.env.get("PIRATE_WEATHER_API_KEY");
const PIRATE_WEATHER_API_URL = Deno.env.get("PIRATE_WEATHER_API_URL");

const coords = [
  { lat: 37.8651, long: -119.5383, name: "Yosemite National Park" },
];

export const dayForSnowRouter = new Router().get("/", async (ctx) => {
  const lat = +(ctx.request.url.searchParams.get("lat") ?? coords[0].lat);
  const long = +(ctx.request.url.searchParams.get("long") ?? coords[0].long);

  const latRounded = lat.toFixed(4);
  const longRounded = long.toFixed(4);

  const cachedValue = await kv.get(["isSnowDay", latRounded, longRounded]);

  if (cachedValue.value) {
    ctx.response.body = cachedValue.value;
    return;
  }

  try {
    const fetchWeather = await fetch(
      `${PIRATE_WEATHER_API_URL}/${PIRATE_WEATHER_API_KEY}/${latRounded},${longRounded}?units=si&exclude=hourly,minutely,daily,alerts`,
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

    await kv.set(["isSnowDay", latRounded, longRounded], returnBody);

    ctx.response.body = returnBody;
  } catch (err) {
    ctx.response.body = { isSnowDay: false, error: err.toString() };
  }
});
