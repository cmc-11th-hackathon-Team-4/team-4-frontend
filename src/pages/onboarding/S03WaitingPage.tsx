import type { ReactNode } from 'react';
import { useNavigate } from 'react-router';
import { ONBOARDING_PATHS } from '@/routes/onboardingPaths';
import { useOnboardingStore } from '@/stores/onboarding';
import { useProfileStore } from '@/stores/profile';
import { MAX_MEMBERS } from '@/types/group';
import BottomButton from './components/BottomButton';
import InfoText from './components/InfoText';
import MemberAvatar from './components/MemberAvatar';
import OnboardingLayout from './components/OnboardingLayout';
import { ONBOARDING_STEP_TOTAL } from './constants';

/** 구성원 이름 목록(첫 번째 = 나)에 따른 제목 · 설명 (명세 규칙, 비주얼 시안 줄바꿈) */
function getWaitingCopy(names: string[]): { heading: ReactNode; description?: string } {
  if (names.length <= 1) {
    return { heading: '구성원을 기다리고 있어요' };
  }
  return {
    heading: (
      <>
        {names[names.length - 1]}님이
        <br />
        들어왔어요
      </>
    ),
    description: `구성원 ${names.length}명이 모였어요. (최대 ${MAX_MEMBERS}명)`,
  };
}

/**
 * S-03 대기실 (권한: 공통 · 시작은 방장) — 피그마 비주얼 시안 기준
 * - [집안일 고르러 가기]는 방장에게만, 참여자에게는 "방장이 시작하길 기다리는 중"
 * - TODO(API): 구성원 목록 · 방장 시작 여부 조회 (화면 진입 시, 당겨서 새로고침 시)
 */
function S03WaitingPage() {
  const navigate = useNavigate();
  const isHost = useOnboardingStore((s) => s.role) === 'host';
  // 내 캐릭터: P-01에서 저장한 프로필 (④ 프로필 스토어 공용)
  const myCharacter = useProfileStore((s) => s.profile?.character);
  const memberLabels = ['나']; // TODO(API): 구성원 목록
  const { heading, description } = getWaitingCopy(memberLabels);

  return (
    <OnboardingLayout
      title="대기실"
      step={{ current: 4, total: ONBOARDING_STEP_TOTAL }}
      heading={heading}
      description={description}
      footer={
        isHost ? (
          <BottomButton onClick={() => navigate(ONBOARDING_PATHS.chores)}>
            집안일 고르러 가기
          </BottomButton>
        ) : (
          <p className="py-4 text-center text-sm font-medium text-gray-500">
            방장이 시작하길 기다리는 중
          </p>
        )
      }
    >
      <ul className="mt-8 flex flex-wrap gap-4">
        <li>
          <MemberAvatar label="나" character={myCharacter} isMe />
        </li>
      </ul>
      <InfoText size="sm" className="mt-10">
        더 기다리거나, 지금 바로 시작할 수 있어요.
      </InfoText>
    </OnboardingLayout>
  );
}

export default S03WaitingPage;
