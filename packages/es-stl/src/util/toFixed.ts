import { toSafeNumber } from './toSafeNumber';

/**
 * Formats a value with fixed-point precision and removes insignificant
 * trailing zeroes.
 *
 * @param num - Number to format.
 * @param fractionDigits - Number of digits to keep after the decimal point.
 * @returns Fixed-point string normalized through `Number()`.
 *
 * @example
 * ```ts
 * toFixed(0.101, 2);
 * // => '0.1'
 * ```
 */
export function toFixed(num: number, fractionDigits?: number): string {
  return Number(toSafeNumber(num).toFixed(fractionDigits)) + '';
}
