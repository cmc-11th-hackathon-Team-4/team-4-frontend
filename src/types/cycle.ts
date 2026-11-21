/** 결산 기간 정보 (V5-12 결산 주기 · V5-14 기간 늘리기) */
/** 결산 주기(일): 매주 7 · 3일 · 1일 (서버 settlementCycle 값 그대로) */
export type CyclePeriod = 7 | 3 | 1;

export interface CycleInfo {
  period: CyclePeriod;
  /** 이번 기간 결산일 (YYYY-MM-DD) */
  endDate: string;
}
