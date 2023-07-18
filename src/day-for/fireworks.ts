import { Router } from "../../deps.ts";

export const dayForFireworksRouter = new Router().get("/", (ctx) => {
  ctx.response.body = "Fireworks!";
})