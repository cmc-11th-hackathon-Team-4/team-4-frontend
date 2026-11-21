/**
 * 기기 식별값 (로그인 없음: "이 기기 = 이 사용자")
 * - 처음 한 번 UUID를 만들어 기기에 저장하고, 모든 API 요청의 X-Device-Id 헤더로 보낸다
 * - 프로필 만들기(POST /api/v1/users)는 헤더 대신 본문 deviceId 로 같은 값을 보낸다
 * - 앱을 지우거나 브라우저 데이터를 지우면 새 기기로 취급된다
 * - 로그인이 없어 이 값이 사실상 본인 확인 수단이므로 반드시 암호학적 난수로 만든다 (Math.random 사용 금지)
 */
const STORAGE_KEY = 'device-id';

function createUuid() {
  if (typeof crypto === 'undefined') throw new Error('crypto 를 쓸 수 없는 환경');
  if (typeof crypto.randomUUID === 'function') return crypto.randomUUID();
  // randomUUID 를 지원하지 않는 오래된 웹뷰 대비: 암호학적 난수(getRandomValues)로 UUID v4 생성
  const bytes = crypto.getRandomValues(new Uint8Array(16));
  bytes[6] = (bytes[6] & 0x0f) | 0x40;
  bytes[8] = (bytes[8] & 0x3f) | 0x80;
  const hex = [...bytes].map((b) => b.toString(16).padStart(2, '0')).join('');
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
}

export function getDeviceId() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) return saved;
    const id = createUuid();
    localStorage.setItem(STORAGE_KEY, id);
    return id;
  } catch {
    // 저장소를 쓸 수 없으면 이번 실행 동안만 쓰는 값
    return createUuid();
  }
}
