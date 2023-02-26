import { parseTime } from "./parse-date-time.js"

export const generateMessage = text => {
  return {
    text,
    createdAt: parseTime(),
  }
}
