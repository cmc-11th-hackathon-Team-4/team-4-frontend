import { useEffect } from 'react';
import { useNavigate } from 'react-router';
import { USE_MOCK } from '@/apis/config';
import { resetDb } from '@/mocks/db';
import { ONBOARDING_PATHS } from '@/routes/onboardingPaths';
import { useSessionStore } from '@/stores/session';

/**
 * 세션 확인
 * - 실서버: 세션(그룹 생성·참여 기록)이 없으면 ① S-14 홈·집 없음으로 이동
 * - 목데이터(개발·시연): ① 없이 세션 주입
 *   - 세션이 없으면 수아(m1)로 시작
 *   - 주소에 ?devMember=m2 를 붙이면 민지로 전환 (두 번째 폰 시연용)
 *   - ?resetMock 을 붙이면 목데이터 초기화
 */
export function useDevSession() {
  const navigate = useNavigate();
  const { memberId, setSession } = useSessionStore();

  useEffect(() => {
    if (!USE_MOCK) {
      if (!memberId) navigate(ONBOARDING_PATHS.welcome, { replace: true });
      return;
    }

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
  }, [memberId, setSession, navigate]);
}
