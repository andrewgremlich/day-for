import { Router } from "../../deps.ts";

const fireworkHolidays = [
  { month: 1, day: 1, name: "New Year's Day" },
  { month: 2, day: 14, name: "Valentine's Day" },
  { month: 5, day: 5, name: "Cinco de Mayo" },
  { month: 7, day: 4, name: "Independence Day" },
  { month: 9, day: 2, name: "Labor Day" },
  { month: 10, day: 31, name: "Halloween" },
  { month: 11, day: 11, name: "Veterans Day" },
  { month: 12, day: 24, name: "Christmas Eve" },
  { month: 12, day: 25, name: "Christmas Day" },
  { month: 12, day: 31, name: "New Year's Eve" },
];

const getIsFireworkDay = (
  month: number,
  day: number,
): { isFireworkDay: boolean; holiday: string } => {
  const holiday = fireworkHolidays.find((holiday) =>
    holiday.month === month && holiday.day === day
  );

  if (holiday) {
    return { isFireworkDay: true, holiday: holiday.name };
  } else {
    return { isFireworkDay: false, holiday: "" };
  }
};

export const dayForFireworksRouter = new Router().get(
  "/",
  (ctx) => {
    const date = new Date();
    const month = ((date.getMonth() + 1) % 12) || 12;
    const day = date.getDate();

    const { isFireworkDay, holiday } = getIsFireworkDay(month, day);

    ctx.response.body = { isFireworkDay, holiday };
  },
);
