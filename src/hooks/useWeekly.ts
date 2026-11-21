import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
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
import { getMe } from '@/apis/profile';
import { ME_QUERY_KEY, useMe } from '@/hooks/useProfile';
import type { CarryOverChoice, WeeklyState } from '@/types/weekly';

const weeklyKeys = {
  all: ['weekly'] as const,
  house: (houseId: string) => ['weekly', 'house', houseId] as const,
  next: (houseId: string) => ['weekly', 'next', houseId] as const,
};

/** 내 집 id: 서버 GET /users/me 기준 (집이 없으면 '') */
export function useHouseId() {
  const me = useMe();
  return { houseId: me.data?.house?.id ?? '', me };
}

/** 내 사용자 id (화면에서 "나" 구분) */
export function useMyId() {
  return useMe().data?.id ?? null;
}

/**
 * 결산 탭 상태: 최근 기간 + ENDED면 결산 (S-08 ~ S-11)
 * 집이 없으면 period · settlement 모두 null
 */
export function useWeeklySettlement() {
  const queryClient = useQueryClient();
  return useQuery({
    queryKey: ['weekly', 'state'],
    queryFn: async (): Promise<WeeklyState> => {
      // 내 정보(캐시 공유)로 집 id를 얻은 뒤 결산 조회
      const me = await queryClient.fetchQuery({ queryKey: ME_QUERY_KEY, queryFn: getMe });
      if (!me?.house) return { period: null, settlement: null };
      return getWeeklyState(me.house.id);
    },
  });
}

/** 방장 · 나 구분 (S-12) */
export function useWeeklyHouse() {
  const { houseId } = useHouseId();
  return useQuery({
    queryKey: weeklyKeys.house(houseId),
    queryFn: () => getHouseMembers(houseId),
    enabled: !!houseId,
  });
}

/** S-10 이월 선택 저장 */
export function useCarryOver(periodId: string) {
  const { houseId } = useHouseId();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (choices: CarryOverChoice[]) => putCarryOvers(periodId, choices),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['weekly', 'state'] });
      queryClient.invalidateQueries({ queryKey: weeklyKeys.next(houseId) });
    },
  });
}

/**
 * S-12 다음 주기 배분 조회
 * - 구성원: 3초마다 폴링 (방장이 만들거나 다시 나누면 반영)
 * - 다음 기간이 시작됐으면 PERIOD-409-2 → 화면에서 홈으로
 */
export function useNextPeriod({ poll }: { poll: boolean }) {
  const { houseId } = useHouseId();
  return useQuery({
    queryKey: weeklyKeys.next(houseId),
    queryFn: () => getNextPeriod(houseId),
    enabled: !!houseId,
    retry: (count, error) => !isApiError(error, 'PERIOD-409-2') && count < 1,
    refetchInterval: (query) =>
      poll && !isApiError(query.state.error, 'PERIOD-409-2') ? 3000 : false,
  });
}

/** S-12 다음 주기 배분 만들기 · 다시 나누기 (방장) */
export function useCreateNextPeriod() {
  const { houseId } = useHouseId();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => postNextPeriod(houseId),
    onSuccess: (data) => queryClient.setQueryData(weeklyKeys.next(houseId), data),
  });
}

/** S-12 이대로 시작하기 (방장) */
export function useStartNextPeriod() {
  const { houseId } = useHouseId();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => postStartNextPeriod(houseId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: weeklyKeys.all }),
  });
}

/** 시연용 기간 종료 (② V5-12 설정에서 사용) → 결산 다시 조회 */
export function useEndCycle() {
  const { houseId } = useHouseId();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => postEndPeriod(houseId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: weeklyKeys.all }),
  });
}
