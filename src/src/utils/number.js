export function format(number) {
  return new Intl.NumberFormat(navigator.language, {
    maximumFractionDigits: 3,
  }).format(number);
}
