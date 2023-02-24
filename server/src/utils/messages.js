import { parseDate } from "./parse-date.js"

export const generateMessage = text => {
  return {
    text,
    createdAt: parseDate(),
  }
}
