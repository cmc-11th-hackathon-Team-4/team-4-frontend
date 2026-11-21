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
import ChoreIcon from './components/ChoreIcon';
import OnboardingLayout from './components/OnboardingLayout';
import { ONBOARDING_STEP_TOTAL } from './constants';
import { onboardingKeys } from './queryKeys';
import { useMe, useRefreshMe } from './useMyHouse';

/** 나를 맨 위로 */
function sortMembers(members: DistributionResponse['members']) {
  return [...members].sort((a, b) => Number(b.isMe) - Number(a.isMe));
}

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
 * - 참여자(S-13-W 에서 DISTRIBUTING 일 때): 방장과 같은 화면에서 버튼 대신 하단 "○○님이 확정하면 시작해요" (피그마 2-5)
 *   실시간 없음: 화면에 다시 돌아올 때 결과 · 집 상태를 다시 불러온다
 */
function S05AssignPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const refreshMe = useRefreshMe();
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
      refreshMe();
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
        title="집안일 배분하기"
        heading={
          <>
            집안일을
            <br />
            공평하게 나눴어요
          </>
        }
        description={getDescription(members)}
        footer={
          ownerName && (
            <p className="flex h-[54px] items-center justify-center rounded-[14px] bg-line-400 text-base font-medium text-gray-500">
              {ownerName}님이 확정하면 시작해요
            </p>
          )
        }
      >
        <MemberChoreList members={members} />
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

/**
 * 사람별 배분 결과 (피그마 2-5 S-05: 40px 아바타 · 24px 이름 · 개수, 아이콘 48 · 18px 집안일, 구분선)
 * - 내 이름은 "나" (방장 · 참여자 화면 같음)
 */
function MemberChoreList({ members }: { members: DistributionResponse['members'] }) {
  return (
    <ul className="mt-6 flex flex-col gap-6">
      {members.map((member) => (
        <li key={member.userId} className="flex flex-col gap-[7px]">
          <div className="flex items-center justify-between leading-[normal]">
            <div className="flex items-center gap-3">
              <CharacterImage
                id={fromServerCharacter(member.characterType)}
                size={40}
                scale={1.8}
                offset={0.21}
                shape="square"
                radius={14}
              />
              <span className="text-2xl font-medium text-gray-800">
                {member.isMe ? '나' : member.name}
              </span>
            </div>
            <span className="text-lg font-bold text-[#787878]">{member.chores.length}개</span>
          </div>
          <ul className="flex flex-col gap-3.5 p-2.5">
            {member.chores.map((chore) => (
              <li key={chore.choreId} className="flex flex-col gap-1">
                <span className="flex items-center gap-0.5 text-lg leading-[normal] font-semibold text-gray-600">
                  <ChoreIcon name={chore.name} />
                  {chore.name}
                </span>
                <span aria-hidden className="h-px bg-line-400" />
              </li>
            ))}
          </ul>
        </li>
      ))}
    </ul>
  );
}

export default S05AssignPage;
