import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Navigate, useNavigate } from 'react-router';
import {
  type DistributionResponse,
  getDistribution,
  shuffleDistribution,
  startHouse,
} from '@/apis/onboarding';
import StateView from '@/components/common/StateView';
import { fromServerCharacter } from '@/constants/character';
import { HOME_PATH } from '@/routes/onboardingPaths';
import { useOnboardingStore } from '@/stores/onboarding';
import { useToastStore } from '@/stores/toast';
import { errorMessage, LOAD_ERROR, RETRY_LABEL } from './apiMessages';
import BottomButton from './components/BottomButton';
import CharacterImage from './components/CharacterImage';
import OnboardingLayout from './components/OnboardingLayout';
import { ONBOARDING_STEP_TOTAL } from './constants';
import { onboardingKeys } from './queryKeys';
import { useMe } from './useMyHouse';

/** 나를 맨 위로 */
function sortMembers(members: DistributionResponse['members']) {
  return [...members].sort((a, b) => Number(b.isMe) - Number(a.isMe));
}

/** 참여자 화면은 사람마다 앞의 몇 개만 보이고 나머지는 "외 N개" (와이어 S-05 · 참여자) */
const PARTICIPANT_PREVIEW_COUNT = 3;

/** 모두 같은 개수일 때만 "각자 N개씩" */
function getDescription(members: DistributionResponse['members']) {
  const counts = new Set(members.map((m) => m.chores.length));
  if (counts.size !== 1) return undefined;
  const [perPerson] = counts;
  return perPerson ? `각자 ${perPerson}개씩 맡아요. 언제든 서로 덜어줄 수 있어요.` : undefined;
}

/**
 * S-05 랜덤 배분 (권한: 방장 · 참여자 보기) — 명세 순서: S-04 → S-06 → S-05
 * - 결과: S-06 이 만든 배분(캐시), 없으면 GET /api/v1/houses/{id}/distribution
 * - [다시 섞기]: POST .../distribution/shuffle (몇 번이든, 섞는 동안 버튼 잠금)
 * - [확정하기]: POST /api/v1/houses/{id}/start → 진행 상태를 비우고 V5-01 내 메인
 * - 이미 시작된 집(ACTIVE)이면 내 메인으로
 * - 참여자(S-13-W 에서 DISTRIBUTING 일 때): 버튼 없이 결과만, 하단에 "○○님이 확정하면 시작해요"
 *   실시간 없음: 화면에 다시 돌아올 때 결과 · 집 상태를 다시 불러온다
 */
function S05AssignPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const showToast = useToastStore((s) => s.show);
  const reset = useOnboardingStore((s) => s.reset);

  const me = useMe();
  const houseId = me.data?.house ? String(me.data.house.id) : null;
  const isActive = me.data?.house?.status === 'ACTIVE';

  const distribution = useQuery({
    queryKey: onboardingKeys.distribution(houseId ?? ''),
    queryFn: () => getDistribution(houseId!),
    enabled: houseId !== null && !isActive,
    retry: false,
  });

  const shuffle = useMutation({
    mutationFn: () => shuffleDistribution(houseId!),
    onSuccess: (data) => queryClient.setQueryData(onboardingKeys.distribution(houseId!), data),
    onError: (error) => showToast(errorMessage(error)),
  });

  const start = useMutation({
    mutationFn: () => startHouse(houseId!),
    onSuccess: () => {
      reset();
      queryClient.invalidateQueries({ queryKey: onboardingKeys.me });
      navigate(HOME_PATH, { replace: true });
    },
    onError: (error) => showToast(errorMessage(error)),
  });

  if (isActive) return <Navigate to={HOME_PATH} replace />;
  if (me.isLoading || distribution.isLoading) return <StateView type="loading" />;
  if (me.isError || distribution.isError || !distribution.data) {
    const retry = () => {
      me.refetch();
      if (houseId) distribution.refetch();
    };
    return <StateView type="error" message={LOAD_ERROR} retryLabel={RETRY_LABEL} onRetry={retry} />;
  }

  const members = sortMembers(distribution.data.members);
  const isOwner = members.some((m) => m.isMe && m.role === 'OWNER');
  const ownerName = members.find((m) => m.role === 'OWNER')?.name;
  const isBusy = shuffle.isPending || start.isPending;

  if (!isOwner) {
    return (
      <OnboardingLayout
        title="랜덤 배분"
        heading={
          <>
            우리 집 집안일을
            <br />
            나눴어요
          </>
        }
        description="각자 맡은 집안일을 언제든 서로 덜어줄 수 있어요."
        footer={
          ownerName && (
            <p className="flex h-[54px] items-center justify-center rounded-[14px] bg-line-400 text-base font-medium text-gray-500">
              {ownerName}님이 확정하면 시작해요
            </p>
          )
        }
      >
        <MemberChoreList members={members} previewCount={PARTICIPANT_PREVIEW_COUNT} />
      </OnboardingLayout>
    );
  }

  return (
    <OnboardingLayout
      title="집안일 배분하기"
      step={{ current: 7, total: ONBOARDING_STEP_TOTAL }}
      heading={
        <>
          집안일을
          <br />
          공평하게 나눴어요
        </>
      }
      description={getDescription(members)}
      footer={
        <div className="flex gap-2">
          <BottomButton
            variant="secondary"
            disabled={isBusy}
            className="flex-1"
            onClick={() => shuffle.mutate()}
          >
            다시 섞기
          </BottomButton>
          <BottomButton disabled={isBusy} className="flex-1" onClick={() => start.mutate()}>
            확정하기
          </BottomButton>
        </div>
      }
    >
      <div aria-busy={shuffle.isPending}>
        <MemberChoreList members={members} />
      </div>
    </OnboardingLayout>
  );
}

/** 사람별 배분 결과. previewCount 를 주면 그만큼만 보이고 나머지는 "외 N개" */
function MemberChoreList({
  members,
  previewCount,
}: {
  members: DistributionResponse['members'];
  previewCount?: number;
}) {
  return (
    <ul className="mt-6 flex flex-col gap-6">
      {members.map((member) => (
        <li key={member.userId}>
          <div className="flex items-center gap-3">
            <CharacterImage
              id={fromServerCharacter(member.characterType)}
              size={36}
              scale={1.8}
              offset={0.21}
              shape="square"
            />
            <span className="flex-1 font-semibold">
              {member.name}
              {member.isMe && ' (나)'}
            </span>
            <span className="text-sm text-neutral-500">{member.chores.length}개</span>
          </div>
          <ul className="mt-3 flex flex-col gap-3 pl-1">
            {member.chores.slice(0, previewCount).map((chore) => (
              <li key={chore.choreId} className="text-sm">
                {chore.name}
              </li>
            ))}
            {previewCount !== undefined && member.chores.length > previewCount && (
              <li className="text-sm text-neutral-500">
                외 {member.chores.length - previewCount}개
              </li>
            )}
          </ul>
        </li>
      ))}
    </ul>
  );
}

export default S05AssignPage;
