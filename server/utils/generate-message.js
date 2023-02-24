import { parseDate } from "./parse-date.js"

export const generateMessage = value => {
  return {
    value,
    createdAt: parseDate(),
  }
}
