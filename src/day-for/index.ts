import { Router } from "../../deps.ts";

import { dayForFireworksRouter } from "./fireworks.ts";
import { dayForSnowRouter } from "./snow.ts";

export const dayForRouter = new Router().use(
  "/fireworks",
  dayForFireworksRouter.routes(),
  dayForFireworksRouter.allowedMethods(),
).use(
  "/snow",
  dayForSnowRouter.routes(),
  dayForSnowRouter.allowedMethods(),
);

