import { useEffect, useState, type ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router';
import type { UserMeResponse } from '@/apis/onboarding';
import SplashScreen from '@/components/common/SplashScreen';
import { ONBOARDING_PATHS } from '@/routes/onboardingPaths';
import { isNoProfile, useMe } from './useMyHouse';

/** 앱을 `/` 로 열었을 때 갈 화면. null 이면 그대로 (내 메인) */
function getStartPath(me: UserMeResponse | undefined, error: unknown): string | null {
  if (isNoProfile(error)) return ONBOARDING_PATHS.welcome;
  if (error) return null; // 서버 연결 실패 등은 그대로 둠
  const house = me?.house;
  if (!house) return ONBOARDING_PATHS.welcome;
  if (house.status === 'DISTRIBUTING') return ONBOARDING_PATHS.assign;
  if (house.status === 'WAITING') {
    return house.role === 'OWNER' ? ONBOARDING_PATHS.waiting : ONBOARDING_PATHS.joinWaiting;
  }
  return null;
}

/**
 * 앱 첫 화면 분기 (GET /api/v1/users/me, 앱을 `/` 로 열 때 한 번만)
 * - 프로필 없음 · 집 없음 → S-14 /welcome
 * - 집 WAITING: 방장 → S-03 대기실, 참여자 → S-13-W
 * - 집 DISTRIBUTING → S-05 랜덤 배분 / ACTIVE → 그대로 내 메인
 * - `/` 가 아닌 주소로 열었으면 건너뜀
 * - 확인하는 동안 스플래시(최소 1.2초)를 보여줌
 */
/** 스플래시 최소 노출 시간 (서버 응답이 빨라도 이만큼은 보여줌) */
const SPLASH_MIN_MS = 1200;

type GateState = { phase: 'checking' } | { phase: 'redirect'; to: string } | { phase: 'done' };

function isRootStart() {
  return window.location.pathname === '/';
}

function StartGate({ children }: { children: ReactNode }) {
  const location = useLocation();
  const me = useMe();
  const [startAtRoot] = useState(isRootStart);
  const [gate, setGate] = useState<GateState>(() =>
    startAtRoot ? { phase: 'checking' } : { phase: 'done' },
  );
  // `/` 로 열었을 때만 스플래시를 최소 SPLASH_MIN_MS 동안 보여줌
  const [splashDone, setSplashDone] = useState(!startAtRoot);
  useEffect(() => {
    if (splashDone) return;
    const timer = setTimeout(() => setSplashDone(true), SPLASH_MIN_MS);
    return () => clearTimeout(timer);
  }, [splashDone]);

  // 렌더 중 상태 조정 (React 문서의 "이전 렌더 정보 저장" 방식): 한 번 정하면 다시 분기하지 않음
  if (gate.phase === 'checking' && !me.isLoading) {
    const to = getStartPath(me.data, me.error);
    setGate(to ? { phase: 'redirect', to } : { phase: 'done' });
  }
  if (gate.phase === 'redirect' && location.pathname === gate.to) setGate({ phase: 'done' });

  if (gate.phase === 'checking' || !splashDone) return <SplashScreen />;
  if (gate.phase === 'redirect') return <Navigate to={gate.to} replace />;
  return children;
}

export default StartGate;
