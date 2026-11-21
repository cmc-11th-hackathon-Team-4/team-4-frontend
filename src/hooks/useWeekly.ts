import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  getNextCycle,
  getSettlement,
  postCarryOver,
  postReassign,
  postStartNextCycle,
} from '@/apis/weekly';
import { MOCK_GROUP_ID, MOCK_MEMBER_ID } from '@/apis/weeklyMock';
import { useSessionStore } from '@/stores/session';
import type { CarryOverItem } from '@/types/weekly';

const weeklyKeys = {
  settlement: (groupId: string) => ['weekly', 'settlement', groupId] as const,
  next: (groupId: string) => ['weekly', 'next', groupId] as const,
};

/**
 * 내 세션. 개발 중엔 각 페이지에서 useDevSession을 한 번 호출해 주입 (?devMember=m2 → 민지)
 * TODO(API): 세션 없을 때 목 값 대신 S-14로 보내기
 */
export function useWeeklySession() {
  const groupId = useSessionStore((s) => s.groupId) ?? MOCK_GROUP_ID;
  const memberId = useSessionStore((s) => s.memberId) ?? MOCK_MEMBER_ID;
  return { groupId, memberId };
}

export function useWeeklySettlement() {
  const { groupId } = useWeeklySession();
  return useQuery({
    queryKey: weeklyKeys.settlement(groupId),
    queryFn: () => getSettlement(groupId),
  });
}

export function useCarryOver() {
  const { groupId, memberId } = useWeeklySession();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (items: CarryOverItem[]) => postCarryOver(groupId, memberId, items),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: weeklyKeys.next(groupId) }),
  });
}

/** 방장이 시작하기 전까지 3초마다 폴링 (구성원 폰 반영) */
export function useNextCycle() {
  const { groupId } = useWeeklySession();
  return useQuery({
    queryKey: weeklyKeys.next(groupId),
    queryFn: () => getNextCycle(groupId),
    refetchInterval: (query) => (query.state.data?.started ? false : 3000),
  });
}

export function useReassign() {
  const { groupId } = useWeeklySession();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => postReassign(groupId),
    onSuccess: (data) => queryClient.setQueryData(weeklyKeys.next(groupId), data),
  });
}

export function useStartNextCycle() {
  const { groupId } = useWeeklySession();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => postStartNextCycle(groupId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: weeklyKeys.next(groupId) }),
  });
}
