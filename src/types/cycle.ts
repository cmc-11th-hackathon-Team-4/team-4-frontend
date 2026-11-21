/** 결산 기간 정보 (V5-12 결산 주기 · V5-14 기간 늘리기) */
export type CyclePeriod = 'weekly' | 'biweekly' | 'monthly';

export interface CycleInfo {
  period: CyclePeriod;
  /** 이번 기간 결산일 (YYYY-MM-DD) */
  endDate: string;
}
