const STORAGE_KEY = 'deviceId';
let memoryId: string | null = null;

/**
 * 기기 UUID (서버 사용자 구분용 X-Device-Id)
 * 처음 부를 때 만들어 localStorage에 저장하고, 이후엔 같은 값을 씀
 */
export function getDeviceId() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) return saved;
    const id = crypto.randomUUID();
    localStorage.setItem(STORAGE_KEY, id);
    return id;
  } catch {
    // 저장소를 못 쓰는 환경: 앱이 켜져 있는 동안만 같은 값
    memoryId ??= crypto.randomUUID();
    return memoryId;
  }
}

/** 시연용 초기화: 저장된 기기 UUID를 지움 → 다음 요청부터 새 사용자 */
export function clearDeviceId() {
  memoryId = null;
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // 저장소를 못 쓰는 환경: 메모리 값만 지움
  }
}
