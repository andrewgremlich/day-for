import { Router, load } from "../../deps.ts";

const env = await load();
const PIRATE_WEATER_API_KEY = env.PIRATE_WEATER_API_KEY;

export const dayForSnowRouter = new Router().get("/:timestamp", (ctx) => {
  ctx.response.body = { isSnowDay: false, API_KEY: PIRATE_WEATER_API_KEY };
})