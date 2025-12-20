/**
 * 값을 min과 max 사이로 제한합니다.
 */
export function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value))
}
