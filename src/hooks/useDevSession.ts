import { useEffect } from 'react';
import { useNavigate } from 'react-router';
import { useMe } from '@/hooks/useProfile';
import { ONBOARDING_PATHS } from '@/routes/onboardingPaths';
import { useSessionStore } from '@/stores/session';

/**
 * 세션 확인: GET /users/me 로 내 id · 집 id 를 세션에 맞춤
 * 프로필이나 집이 없으면 ① S-14 로 이동
 */
export function useDevSession() {
  const navigate = useNavigate();
  const { memberId, groupId, setSession } = useSessionStore();
  const me = useMe();

  useEffect(() => {
    if (me.isLoading || me.isError) return;
    const info = me.data;
    if (!info?.house) {
      navigate(ONBOARDING_PATHS.welcome, { replace: true });
      return;
    }
    if (memberId !== info.id || groupId !== info.house.id) {
      setSession({ memberId: info.id, groupId: info.house.id });
    }
  }, [me.data, me.isLoading, me.isError, memberId, groupId, setSession, navigate]);
}
