import { useState, type ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router';
import type { UserMeResponse } from '@/apis/onboarding';
import StateView from '@/components/common/StateView';
import { ONBOARDING_PATHS } from '@/routes/onboardingPaths';
import { isNoProfile, useMe } from './useMyHouse';

/** ② 목데이터 시연용 주소 파라미터 (있으면 첫 화면 분기를 건너뜀) */
const DEMO_PARAMS = ['devMember', 'resetMock'];

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
 * - `/` 가 아닌 주소로 열었거나 ② 시연 파라미터가 있으면 건너뜀
 */
type GateState = { phase: 'checking' } | { phase: 'redirect'; to: string } | { phase: 'done' };

function isRootStart() {
  const params = new URLSearchParams(window.location.search);
  return window.location.pathname === '/' && !DEMO_PARAMS.some((p) => params.has(p));
}

function StartGate({ children }: { children: ReactNode }) {
  const location = useLocation();
  const me = useMe();
  const [gate, setGate] = useState<GateState>(() =>
    isRootStart() ? { phase: 'checking' } : { phase: 'done' },
  );

  // 렌더 중 상태 조정 (React 문서의 "이전 렌더 정보 저장" 방식): 한 번 정하면 다시 분기하지 않음
  if (gate.phase === 'checking' && !me.isLoading) {
    const to = getStartPath(me.data, me.error);
    setGate(to ? { phase: 'redirect', to } : { phase: 'done' });
  }
  if (gate.phase === 'redirect' && location.pathname === gate.to) setGate({ phase: 'done' });

  if (gate.phase === 'checking') return <StateView type="loading" />;
  if (gate.phase === 'redirect') return <Navigate to={gate.to} replace />;
  return children;
}

export default StartGate;
