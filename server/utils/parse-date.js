import { numberToTwoDigits as format } from "./number-to-two-digits.js";

export const parseDate = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth() + 1;
  const date = now.getDate();
  const hours = now.getHours();
  const min = now.getMinutes();
  return `${format(hours)}:${format(min)} ${year}-${format(month)}-${format(date)}`;
}

export const parseTime = () => {
  const now = new Date();
  const hours = now.getHours();
  const min = now.getMinutes();
  const sec = format(now.getSeconds());
  return `${format(hours)}:${format(min)}:${sec}`;
}
