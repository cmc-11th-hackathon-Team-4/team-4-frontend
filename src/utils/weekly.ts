// 한 일 · 못 한 일 개수, 배려왕은 서버(결산 상세)가 계산해서 내려줌

/** 1인당 집안일 수 = 총량 ÷ 인원 (S-10 안내 문구) */
export function getPerPerson(choreCount: number, memberCount: number) {
  return memberCount > 0 ? Math.ceil(choreCount / memberCount) : 0;
}

/** 종료일까지 남은 날 (S-08 "D-n") */
export function getDaysLeft(endDate: string, today = new Date()) {
  const [y, m, d] = endDate.split('-').map(Number);
  const end = new Date(y, m - 1, d);
  const start = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  return Math.max(0, Math.round((end.getTime() - start.getTime()) / 86_400_000));
}

/** "2026-11-17", "2026-11-23" → "11.17 – 11.23" */
export function formatPeriod(startDate: string, endDate: string) {
  const short = (date: string) => {
    const [, m, d] = date.split('-');
    return `${Number(m)}.${d}`;
  };
  return `${short(startDate)} – ${short(endDate)}`;
}

/** 이름 + 이/가 ("민지가", "지민이") */
export function withSubject(name: string) {
  const code = name.charCodeAt(name.length - 1) - 0xac00;
  const hasBatchim = code >= 0 && code <= 11171 && code % 28 !== 0;
  return `${name}${hasBatchim ? '이' : '가'}`;
}
