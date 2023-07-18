import { Router } from "../../deps.ts";

import { isTimestamp } from "../date-utils.ts"

const isFireworkDay = (month: number, date: number): { fireworks: boolean, holiday: string } => {
  const fireworkHolidays = [
    { month: 11, date: 31, name: "New Year's Eve" },
    { month: 0, date: 1, name: "New Year's Day" },
    { month: 6, date: 3, name: "Independence Day" },
  ];
  const holiday = fireworkHolidays.find((holiday) => holiday.month === month && holiday.date === date)

  if (holiday) {
    return { fireworks: true, holiday: holiday.name };
  } else {
    return { fireworks: false, holiday: "" };
  }
}

export const dayForFireworksRouter = new Router().get("/:timestamp", (ctx) => {
  const timeStampNumber = Number(ctx.params.timestamp);

  if (!isTimestamp(timeStampNumber)) {
    ctx.response.status = 400;
    ctx.response.body = { fireworkDay: false, message: "Invalid timestamp" };
    return;
  }

  const dateToAnalyze = new Date(timeStampNumber);
  const month = dateToAnalyze.getMonth();
  const date = dateToAnalyze.getDate();
  const { fireworks, holiday } = isFireworkDay(month, date);

  ctx.response.body = { fireworks, holiday };
})