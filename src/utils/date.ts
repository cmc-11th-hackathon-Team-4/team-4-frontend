const WEEKDAYS = ['일', '월', '화', '수', '목', '금', '토'];

/** 'YYYY-MM-DD' → Date (시간대 영향 없이 로컬 날짜로) */
export function parseDate(value: string) {
  const [y, m, d] = value.split('-').map(Number);
  return new Date(y, m - 1, d);
}

/** Date → 'YYYY-MM-DD' */
export function toDateString(date: Date) {
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

/** 'YYYY-MM-DD' + n일 → 'YYYY-MM-DD' */
export function addDays(value: string, days: number) {
  const date = parseDate(value);
  date.setDate(date.getDate() + days);
  return toDateString(date);
}

/** '2026-11-30' → '11월 30일' */
export function formatMonthDay(value: string) {
  const date = parseDate(value);
  return `${date.getMonth() + 1}월 ${date.getDate()}일`;
}

/** '2026-11-30' → '11월 30일 (일)' */
export function formatMonthDayWeek(value: string) {
  return `${formatMonthDay(value)} (${WEEKDAYS[parseDate(value).getDay()]})`;
}
