import { MAIN_TEXT } from '@/constants/main';
import { daysFromToday, formatMonthDay } from '@/utils/date';
import { useCycle } from './useCycle';

/** 집안일 카드 마감 글씨 (결산일 기준): 오늘까지 · 내일까지 · 이번 주까지 · 11월 30일까지 */
export function useDueCaption() {
  const { data: cycle } = useCycle();
  if (!cycle?.endDate) return MAIN_TEXT.dueThisWeek;
  const days = daysFromToday(cycle.endDate);
  if (days <= 0) return MAIN_TEXT.dueToday;
  if (days === 1) return MAIN_TEXT.dueTomorrow;
  if (days < 7) return MAIN_TEXT.dueThisWeek;
  return MAIN_TEXT.dueOn(formatMonthDay(cycle.endDate));
}
