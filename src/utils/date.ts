const WEEKDAYS = ['일', '월', '화', '수', '목', '금', '토'];

/** YYYY-MM-DD → 로컬 Date */
export function parseYmd(value: string) {
  const [y, m, d] = value.split('-').map(Number);
  return new Date(y, m - 1, d);
}

/** Date → YYYY-MM-DD */
export function toYmd(date: Date) {
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

/** YYYY-MM-DD에 n일 더하기 */
export function addDays(value: string, days: number) {
  const date = parseYmd(value);
  date.setDate(date.getDate() + days);
  return toYmd(date);
}

/** YYYY-MM-DD → "11월 30일" */
export function formatMonthDay(value: string) {
  const date = parseYmd(value);
  return `${date.getMonth() + 1}월 ${date.getDate()}일`;
}

/** YYYY-MM-DD → "11월 30일 (일)" */
export function formatMonthDayWeekday(value: string) {
  return `${formatMonthDay(value)} (${WEEKDAYS[parseYmd(value).getDay()]})`;
}

/** 오늘(로컬)부터 YYYY-MM-DD까지 남은 날 수 (오늘 0, 내일 1, 지난 날은 음수) */
export function daysFromToday(value: string) {
  const today = parseYmd(toYmd(new Date()));
  return Math.round((parseYmd(value).getTime() - today.getTime()) / 86_400_000);
}
