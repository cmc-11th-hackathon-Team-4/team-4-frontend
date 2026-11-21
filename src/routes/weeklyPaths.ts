/** 플로우 ③ 주간 결산 경로 (화면 ID는 피그마 IA와 동일) */
export const WEEKLY_PATHS = {
  /** S-08 주간 결산 */
  summary: '/weekly',
  /** S-09 한 일 · 못 한 일 */
  result: '/weekly/result',
  /** S-10 못 한 일 이월 */
  carryOver: '/weekly/carry-over',
  /** S-11 이번 주 배려왕 */
  best: '/weekly/best',
  /** S-12 다음 주기 · 재배분 */
  next: '/weekly/next',
} as const;
