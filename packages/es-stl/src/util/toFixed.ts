import { toSafeNumber } from './toSafeNumber';

// toFixed(0.101, 2) => "0.1"
export function toFixed(num: number, fractionDigits?: number): string {
  return Number(toSafeNumber(num).toFixed(fractionDigits)) + '';
}
