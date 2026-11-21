import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { USE_MOCK } from '@/apis/config';
import { isApiError } from '@/apis/error';
import {
  getHouseMembers,
  getNextPeriod,
  getWeeklyState,
  postEndPeriod,
  postNextPeriod,
  postStartNextPeriod,
  putCarryOvers,
} from '@/apis/weekly';
import { MOCK_GROUP_ID, MOCK_MEMBER_ID } from '@/apis/weeklyMock';
import { useSessionStore } from '@/stores/session';
import type { CarryOverChoice } from '@/types/weekly';

const weeklyKeys = {
  all: ['weekly'] as const,
  state: (houseId: string, memberId: string) => ['weekly', 'state', houseId, memberId] as const,
  house: (houseId: string, memberId: string) => ['weekly', 'house', houseId, memberId] as const,
  next: (houseId: string, memberId: string) => ['weekly', 'next', houseId, memberId] as const,
};

/**
 * 내 세션 (houseId = 세션 groupId). 목데이터일 땐 세션이 없으면 개발용 값
 * 개발 중엔 각 페이지에서 useDevSession을 한 번 호출 (?devMember=m2 → 민지)
 */
export function useWeeklySession() {
  const groupId = useSessionStore((s) => s.groupId);
  const memberId = useSessionStore((s) => s.memberId);
  return {
    groupId: groupId ?? (USE_MOCK ? MOCK_GROUP_ID : ''),
    memberId: memberId ?? (USE_MOCK ? MOCK_MEMBER_ID : ''),
  };
}

/** 결산 탭 상태: 최근 기간 + ENDED면 결산 (S-08 ~ S-11) */
export function useWeeklySettlement() {
  const { groupId, memberId } = useWeeklySession();
  return useQuery({
    queryKey: weeklyKeys.state(groupId, memberId),
    queryFn: () => getWeeklyState(groupId, memberId),
    enabled: !!groupId,
  });
}

/** 방장 · 나 구분 (S-12) */
export function useWeeklyHouse() {
  const { groupId, memberId } = useWeeklySession();
  return useQuery({
    queryKey: weeklyKeys.house(groupId, memberId),
    queryFn: () => getHouseMembers(groupId, memberId),
    enabled: !!groupId,
  });
}

/** S-10 이월 선택 저장 */
export function useCarryOver(periodId: string) {
  const { groupId, memberId } = useWeeklySession();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (choices: CarryOverChoice[]) => putCarryOvers(periodId, choices),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: weeklyKeys.state(groupId, memberId) });
      queryClient.invalidateQueries({ queryKey: weeklyKeys.next(groupId, memberId) });
    },
  });
}

/**
 * S-12 다음 주기 배분 조회
 * - 구성원: 3초마다 폴링 (방장이 만들거나 다시 나누면 반영)
 * - 다음 기간이 시작됐으면 PERIOD-409-2 → 화면에서 홈으로
 */
export function useNextPeriod({ poll }: { poll: boolean }) {
  const { groupId, memberId } = useWeeklySession();
  return useQuery({
    queryKey: weeklyKeys.next(groupId, memberId),
    queryFn: () => getNextPeriod(groupId, memberId),
    enabled: !!groupId,
    retry: (count, error) => !isApiError(error, 'PERIOD-409-2') && count < 1,
    refetchInterval: (query) =>
      poll && !isApiError(query.state.error, 'PERIOD-409-2') ? 3000 : false,
  });
}

/** S-12 다음 주기 배분 만들기 · 다시 나누기 (방장) */
export function useCreateNextPeriod() {
  const { groupId, memberId } = useWeeklySession();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => postNextPeriod(groupId, memberId),
    onSuccess: (data) => queryClient.setQueryData(weeklyKeys.next(groupId, memberId), data),
  });
}

/** S-12 이대로 시작하기 (방장) */
export function useStartNextPeriod() {
  const { groupId, memberId } = useWeeklySession();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => postStartNextPeriod(groupId, memberId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: weeklyKeys.all }),
  });
}

/** 시연용 기간 종료 (② V5-12 설정에서 사용) → 결산 다시 조회 */
export function useEndCycle() {
  const { groupId, memberId } = useWeeklySession();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => postEndPeriod(groupId, memberId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: weeklyKeys.all }),
  });
}
