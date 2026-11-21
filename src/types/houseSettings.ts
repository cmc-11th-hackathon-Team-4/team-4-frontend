import type { SettlementCycle } from '@/stores/onboarding';

/** V5-12 결산 기간: 주기와 이번 기간 결산일 */
export interface HouseCycle {
  cycle: SettlementCycle;
  /** 이번 기간 결산일 YYYY-MM-DD */
  endDate: string;
}

/** V5-14 늘릴 기간 (일): +1일 / +3일 / +1주 */
export type ExtendDays = 1 | 3 | 7;
