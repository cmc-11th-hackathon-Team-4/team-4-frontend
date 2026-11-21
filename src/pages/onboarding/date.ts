const WEEKDAYS = ['일', '월', '화', '수', '목', '금', '토'];

/** 오늘 날짜 YYYY-MM-DD (기기 시간대 기준) */
export function todayString() {
  const d = new Date();
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

/** YYYY-MM-DD → 로컬 Date (UTC 해석으로 날짜가 밀리지 않게) */
export function parseDate(value: string) {
  const [y, m, d] = value.split('-').map(Number);
  return new Date(y, m - 1, d);
}

/** 요일 한 글자 (월, 화 ...) */
export function weekdayOf(value: string) {
  return WEEKDAYS[parseDate(value).getDay()];
}

/** YYYY-MM-DD → 2026.11.23 (월) */
export function formatDate(value: string) {
  return `${value.replaceAll('-', '.')} (${weekdayOf(value)})`;
}
