import { useEffect } from 'react';
import { useSessionStore } from '@/stores/session';

/**
 * 개발·시연용: 그룹 생성(①) 없이 세션 주입
 * - 세션이 없으면 수아(m1)로 시작
 * - 주소에 ?devMember=m2 를 붙이면 민지로 전환 (두 번째 폰 시연용)
 * TODO: ① 연결되면 USE_MOCK일 때만 동작하도록 정리
 */
export function useDevSession() {
  const { memberId, setSession } = useSessionStore();

  useEffect(() => {
    const devMember = new URLSearchParams(window.location.search).get('devMember');
    if (devMember) setSession({ memberId: devMember, groupId: 'g1' });
    else if (!memberId) setSession({ memberId: 'm1', groupId: 'g1' });
  }, [memberId, setSession]);
}
