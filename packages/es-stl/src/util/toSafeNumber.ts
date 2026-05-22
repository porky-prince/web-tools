export function toSafeNumber(param: unknown): number {
  return Number(param) || 0;
}
