import { useProfileStore } from '@/stores/profile';
import { useSessionStore } from '@/stores/session';
import { clearDeviceId } from '@/utils/deviceId';

/**
 * 시연용 [처음부터 다시 하기]: 이 기기를 새 사용자로 되돌림
 * - 기기 UUID · 프로필 · 세션을 지우고 첫 화면으로 새로고침 (쿼리 캐시 · 진행 중 입력도 함께 초기화)
 * - 서버 데이터는 지우지 않음 (예전 사용자 · 집은 서버에 그대로 남음)
 */
export function resetDevice() {
  useProfileStore.getState().clearProfile();
  useSessionStore.getState().clearSession();
  try {
    localStorage.removeItem('profile');
    localStorage.removeItem('session');
  } catch {
    // 저장소를 못 쓰는 환경은 새로고침으로 충분
  }
  clearDeviceId();
  window.location.replace('/');
}
