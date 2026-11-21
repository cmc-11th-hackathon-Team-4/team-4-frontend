import { useQuery, useQueryClient } from '@tanstack/react-query';
import { isApiError } from '@/apis/error';
import { ME_QUERY_KEY } from '@/hooks/useProfile';
import { getHouse, getMe } from '@/apis/onboarding';
import { onboardingKeys } from './queryKeys';

/** 서버에 프로필이 없음 (등록되지 않은 기기, USER-404) */
export const isNoProfile = (error: unknown) => isApiError(error, 'USER-404');

/**
 * 프로필 · 집 상태가 바뀐 뒤 내 정보를 새로 받게 함
 * - ① 캐시(['onboarding','me'])는 다시 불러오고, ②·④ 가 쓰는 ['me'] 캐시는 지움
 *   (예전 "프로필 없음 · 집 없음" 값이 남아 있으면 ② 메인이 /welcome 으로 보낼 수 있음)
 */
export function useRefreshMe() {
  const queryClient = useQueryClient();
  return () => {
    queryClient.invalidateQueries({ queryKey: onboardingKeys.me });
    queryClient.removeQueries({ queryKey: ME_QUERY_KEY });
  };
}

/** 내 정보 + 소속 집 (GET /users/me). 플로우 ① 화면은 집 id 와 "프로필 있음?" 을 서버 기준으로 쓴다 */
export function useMe() {
  return useQuery({ queryKey: onboardingKeys.me, queryFn: getMe, retry: false });
}

/**
 * 내 집 정보 · 구성원 (GET /houses/{id})
 * - 공용 세션(useSessionStore)은 ② 목 데이터와 맞물려 있어 건드리지 않고, 집 id 는 /users/me 로 받는다
 * - TODO: ②가 실서버로 바뀌면 세션도 /users/me 결과로 채우도록 팀과 맞추기
 */
export function useMyHouse(options?: { refetchInterval?: number }) {
  const me = useMe();
  const houseId = me.data?.house ? String(me.data.house.id) : null;
  const house = useQuery({
    queryKey: onboardingKeys.house(houseId ?? ''),
    queryFn: () => getHouse(houseId!),
    enabled: houseId !== null,
    refetchInterval: options?.refetchInterval,
  });
  return {
    me: me.data,
    houseId,
    house: house.data,
    isLoading: me.isLoading || (houseId !== null && house.isLoading),
    isError: me.isError || house.isError,
    isFetching: me.isFetching || house.isFetching,
    refetch: () => (me.isError ? me.refetch() : house.refetch()),
  };
}
