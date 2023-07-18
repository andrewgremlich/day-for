import { Router } from "../../deps.ts";

export const dayForSnowRouter = new Router().get("/", (ctx) => {
  ctx.response.body = "Snow!";
})