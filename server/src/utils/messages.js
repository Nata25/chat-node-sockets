import { parseTime } from "./parse-date.js"

export const generateMessage = text => {
  return {
    text,
    createdAt: parseTime(),
  }
}
