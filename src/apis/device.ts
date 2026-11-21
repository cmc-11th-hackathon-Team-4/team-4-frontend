/**
 * 기기 식별값 (로그인 없음: "이 기기 = 이 사용자")
 * - 처음 한 번 UUID를 만들어 기기에 저장하고, 모든 API 요청의 X-Device-Id 헤더로 보낸다
 * - 프로필 만들기(POST /api/v1/users)는 헤더 대신 본문 deviceId 로 같은 값을 보낸다
 * - 앱을 지우거나 브라우저 데이터를 지우면 새 기기로 취급된다
 */
const STORAGE_KEY = 'device-id';

function createUuid() {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) return crypto.randomUUID();
  // randomUUID 를 지원하지 않는 오래된 웹뷰 대비
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    return (c === 'x' ? r : (r & 0x3) | 0x8).toString(16);
  });
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
