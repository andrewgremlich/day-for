import { kv, Router } from "../../deps.ts";

import { isTimestamp } from "../date-utils.ts";

const isFireworkDay = (
  month: number,
  date: number,
): { fireworks: boolean; holiday: string } => {
  const fireworkHolidays = [
    { month: 11, date: 31, name: "New Year's Eve" },
    { month: 0, date: 1, name: "New Year's Day" },
    { month: 6, date: 3, name: "Independence Day" },
    { month: 10, date: 11, name: "Veterans Day" },
  ];
  const holiday = fireworkHolidays.find((holiday) =>
    holiday.month === month && holiday.date === date
  );

  if (holiday) {
    return { fireworks: true, holiday: holiday.name };
  } else {
    return { fireworks: false, holiday: "" };
  }
};

export const dayForFireworksRouter = new Router().get(
  "/:timestamp",
  async (ctx) => {
    const timeStampNumber = Number(ctx.params.timestamp);
    const cachedValue = await kv.get(["fireworks", ctx.params.timestamp]);

    if (cachedValue.value) {
      ctx.response.body = cachedValue.value;
      return;
    }

    if (!isTimestamp(timeStampNumber)) {
      ctx.response.status = 400;
      ctx.response.body = { fireworkDay: false, message: "Invalid timestamp" };
      return;
    }

    const dateToAnalyze = new Date(timeStampNumber);
    const month = dateToAnalyze.getMonth();
    const date = dateToAnalyze.getDate();
    const { fireworks, holiday } = isFireworkDay(month, date);

    await kv.set(["fireworks", ctx.params.timestamp], { fireworks, holiday });

    ctx.response.body = { fireworks, holiday };
  },
);
