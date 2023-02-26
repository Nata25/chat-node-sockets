export const numberToTwoDigits = (aNumber) => {
  return aNumber > 9 ? aNumber : `0${aNumber}`;
}
