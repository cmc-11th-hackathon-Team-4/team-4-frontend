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
import { onboardingKeys } from './queryKeys';
import { useMe } from './useMyHouse';

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
 * S-05 랜덤 배분 (권한: 방장) — 명세 순서: S-04 → S-06 → S-05
 * - 결과: S-06 이 만든 배분(캐시), 없으면 GET /api/v1/houses/{id}/distribution
 * - [다시 섞기]: POST .../distribution/shuffle (몇 번이든, 섞는 동안 버튼 잠금)
 * - [확정하기]: POST /api/v1/houses/{id}/start → 진행 상태를 비우고 V5-01 내 메인
 * - 이미 시작된 집(ACTIVE)이면 내 메인으로
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
    const retry = () => (me.isError ? me.refetch() : distribution.refetch());
    return <StateView type="error" message={LOAD_ERROR} retryLabel={RETRY_LABEL} onRetry={retry} />;
  }

  const members = sortMembers(distribution.data.members);
  const isBusy = shuffle.isPending || start.isPending;

  return (
    <OnboardingLayout
      title="랜덤 배분"
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
      <ul className="mt-6 flex flex-col gap-6" aria-busy={shuffle.isPending}>
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
              {member.chores.map((chore) => (
                <li key={chore.choreId} className="text-sm">
                  {chore.name}
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </OnboardingLayout>
  );
}

export default S05AssignPage;
