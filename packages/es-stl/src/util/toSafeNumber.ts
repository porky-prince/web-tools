/**
 * Converts an unknown value to a fallback-friendly number.
 *
 * @remarks
 * Falsy numeric results, including `NaN` and `0`, are normalized to `0`.
 *
 * @param param - Value to convert with `Number()`.
 * @returns Converted number, or `0` when conversion produces a falsy result.
 */
export function toSafeNumber(param: unknown): number {
  return Number(param) || 0;
}
