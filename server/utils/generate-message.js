import { parseTime } from "./parse-date.js"

export const generateMessage = value => {
  return {
    value,
    createdAt: parseTime(),
  }
}
