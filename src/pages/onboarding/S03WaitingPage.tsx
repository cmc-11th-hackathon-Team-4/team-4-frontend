import { useNavigate } from 'react-router';
import { ONBOARDING_PATHS } from '@/routes/onboardingPaths';
import { useOnboardingStore } from '@/stores/onboarding';
import { MAX_MEMBERS } from '@/types/group';
import BottomButton from './components/BottomButton';
import InfoText from './components/InfoText';
import OnboardingLayout from './components/OnboardingLayout';

/** 구성원 이름 목록(첫 번째 = 나)에 따른 제목 · 설명 (명세 규칙) */
function getWaitingCopy(names: string[]) {
  if (names.length <= 1) {
    return { heading: '구성원을 기다리고 있어요', description: undefined };
  }
  return {
    heading: `${names[names.length - 1]}님이 들어왔어요`,
    description: `구성원 ${names.length}명이 모였어요. (최대 ${MAX_MEMBERS}명)`,
  };
}

/**
 * S-03 대기실 (권한: 공통 · 시작은 방장)
 * - [집안일 고르러 가기]는 방장에게만, 참여자에게는 "방장이 시작하길 기다리는 중"
 * - TODO(API): 구성원 목록 · 방장 시작 여부 조회 (화면 진입 시, 당겨서 새로고침 시)
 */
function S03WaitingPage() {
  const navigate = useNavigate();
  const isHost = useOnboardingStore((s) => s.role) === 'host';
  const memberLabels = ['나'];
  const { heading, description } = getWaitingCopy(memberLabels);

  return (
    <OnboardingLayout
      title="대기실"
      heading={heading}
      description={description}
      footer={
        isHost ? (
          <BottomButton onClick={() => navigate(ONBOARDING_PATHS.chores)}>
            집안일 고르러 가기
          </BottomButton>
        ) : (
          <p className="py-4 text-center text-sm text-neutral-500">방장이 시작하길 기다리는 중</p>
        )
      }
    >
      <ul className="mt-10 flex flex-wrap justify-center gap-6">
        {memberLabels.map((label) => (
          <li key={label} className="flex flex-col items-center gap-2">
            <div aria-hidden className="size-28 rounded-full bg-neutral-200" />
            <span className="text-sm">{label}</span>
          </li>
        ))}
      </ul>
      <InfoText className="mt-8">더 기다리거나, 지금 바로 시작할 수 있어요.</InfoText>
    </OnboardingLayout>
  );
}

export default S03WaitingPage;
