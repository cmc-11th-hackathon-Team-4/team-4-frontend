import type { ReactNode } from 'react';
import { useNavigate } from 'react-router';
import StateView from '@/components/common/StateView';
import { fromServerCharacter } from '@/constants/character';
import { ONBOARDING_PATHS } from '@/routes/onboardingPaths';
import { MAX_MEMBERS } from '@/types/group';
import { LOAD_ERROR, RETRY_LABEL } from './apiMessages';
import BottomButton from './components/BottomButton';
import InfoText from './components/InfoText';
import MemberAvatar from './components/MemberAvatar';
import OnboardingLayout from './components/OnboardingLayout';
import { ONBOARDING_STEP_TOTAL } from './constants';
import { useMyHouse } from './useMyHouse';

/** 대기실 다시 불러오기 간격 (Swagger: "대기실은 이 API 를 폴링한다") */
const REFETCH_MS = 3000;

/** 구성원 수와 가장 최근에 들어온 사람에 따른 제목 · 설명 (명세 규칙, 비주얼 시안 줄바꿈) */
function getWaitingCopy(
  memberCount: number,
  lastJoinedName: string | undefined,
  maxMembers: number,
): { heading: ReactNode; description?: string } {
  if (memberCount <= 1 || !lastJoinedName) {
    return { heading: '구성원을 기다리고 있어요' };
  }
  return {
    heading: (
      <>
        {lastJoinedName}님이
        <br />
        들어왔어요
      </>
    ),
    description: `구성원 ${memberCount}명이 모였어요. (최대 ${maxMembers}명)`,
  };
}

/**
 * S-03 대기실 (권한: 공통 · 시작은 방장) — 피그마 비주얼 시안 기준
 * - GET /api/v1/houses/{id} 를 주기적으로 다시 불러와 들어온 구성원을 보여줌
 * - 방장 여부는 서버 역할(OWNER)로 판단. [집안일 고르러 가기]는 방장에게만, 참여자에게는 대기 문구
 */
function S03WaitingPage() {
  const navigate = useNavigate();
  const { house, isLoading, isError, refetch } = useMyHouse({ refetchInterval: REFETCH_MS });

  if (isLoading) return <StateView type="loading" />;
  if (isError || !house) {
    return (
      <StateView type="error" message={LOAD_ERROR} retryLabel={RETRY_LABEL} onRetry={refetch} />
    );
  }

  const maxMembers = house.maxMemberCount || MAX_MEMBERS;
  const isHost = house.members.some((m) => m.isMe && m.role === 'OWNER');
  // 나를 맨 앞에, 나머지는 서버 순서대로
  const members = [...house.members].sort((a, b) => Number(b.isMe) - Number(a.isMe));
  const others = house.members.filter((m) => !m.isMe);
  const { heading, description } = getWaitingCopy(
    house.memberCount,
    others.at(-1)?.name,
    maxMembers,
  );

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
        {members.map((m) => (
          <li key={m.userId}>
            <MemberAvatar
              label={m.isMe ? '나' : m.name}
              character={fromServerCharacter(m.characterType)}
              isMe={m.isMe}
            />
          </li>
        ))}
      </ul>
      <InfoText size="sm" className="mt-10">
        더 기다리거나, 지금 바로 시작할 수 있어요.
      </InfoText>
    </OnboardingLayout>
  );
}

export default S03WaitingPage;
