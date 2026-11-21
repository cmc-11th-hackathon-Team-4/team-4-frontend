import { useEffect } from 'react';
import { resetDb } from '@/mocks/db';
import { useSessionStore } from '@/stores/session';

/**
 * 개발·시연용: 그룹 생성(①) 없이 세션 주입
 * - 세션이 없으면 수아(m1)로 시작
 * - 주소에 ?devMember=m2 를 붙이면 민지로 전환 (두 번째 폰 시연용)
 * - ?resetMock 을 붙이면 목데이터 초기화
 * TODO: ① 연결되면 USE_MOCK일 때만 동작하도록 정리
 */
export function useDevSession() {
  const { memberId, setSession } = useSessionStore();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.has('resetMock')) resetDb();
    const devMember = params.get('devMember');
    if (devMember) setSession({ memberId: devMember, groupId: 'g1' });
    else if (!memberId) setSession({ memberId: 'm1', groupId: 'g1' });

    // 뒤로가기 때 다시 초기화되지 않도록 개발용 파라미터는 주소에서 제거
    if (params.has('resetMock') || devMember) {
      params.delete('resetMock');
      params.delete('devMember');
      const query = params.toString();
      window.history.replaceState(
        window.history.state,
        '',
        window.location.pathname + (query ? `?${query}` : ''),
      );
    }
  }, [memberId, setSession]);
}
