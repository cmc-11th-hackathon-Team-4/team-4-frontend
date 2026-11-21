import { useEffect } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { isApiError } from '@/apis/error';
import { createProfile, getMe, getMyHouse, updateProfile } from '@/apis/profile';
import { type Profile, useProfileStore } from '@/stores/profile';

/** 내 정보 쿼리 키 (③ 결산에서도 공유) */
export const ME_QUERY_KEY = ['me'] as const;

const profileKeys = {
  me: ME_QUERY_KEY,
  house: (houseId: string) => ['myHouse', houseId] as const,
};

/** 내 정보 + 소속 집 (GET /users/me). 프로필이 없으면 data가 null */
export function useMe() {
  return useQuery({ queryKey: profileKeys.me, queryFn: getMe });
}

/**
 * 내 프로필 + 집 (M-01, P-01 수정)
 * - GET /users/me → 프로필 · 집 유무, 집이 있으면 GET /houses/{houseId} → 집 이름 · 구성원
 * - 서버 값을 프로필 스토어에도 맞춰 둠 (①의 S-02 · S-03 · S-13 · S-14가 스토어를 읽음)
 */
export function useMyProfile() {
  const setProfile = useProfileStore((s) => s.setProfile);
  const me = useMe();
  const houseId = me.data?.house?.id;
  const house = useQuery({
    queryKey: profileKeys.house(houseId ?? ''),
    queryFn: () => getMyHouse(houseId!),
    enabled: !!houseId,
  });

  const nickname = me.data?.nickname;
  const character = me.data?.character;
  useEffect(() => {
    if (nickname && character) setProfile({ nickname, character });
  }, [nickname, character, setProfile]);

  const profile: Profile | null = me.data
    ? { nickname: me.data.nickname, character: me.data.character }
    : null;

  return {
    profile,
    me: me.data ?? null,
    house: house.data ?? null,
    hasHouse: !!me.data?.house,
    isLoading: me.isLoading || house.isLoading,
    isError: me.isError || house.isError,
    refetch: () => {
      me.refetch();
      if (houseId) house.refetch();
    },
  };
}

/**
 * P-01 프로필 저장 (만들기 · 수정 공용)
 * - 프로필이 없으면 POST /users, 있으면 PATCH /users/me
 * - 이미 등록된 기기(USER-409)면 수정으로 저장
 */
export function useSaveProfile() {
  const setProfile = useProfileStore((s) => s.setProfile);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (profile: Profile) => {
      const me = await getMe();
      if (me) {
        await updateProfile(profile);
      } else {
        try {
          await createProfile(profile);
        } catch (error) {
          if (!isApiError(error, 'USER-409')) throw error;
          await updateProfile(profile);
        }
      }
      setProfile(profile);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: profileKeys.me });
      queryClient.invalidateQueries({ queryKey: ['myHouse'] });
      // ② 그룹 화면의 내 이름 · 캐릭터도 다시 조회
      queryClient.invalidateQueries({ queryKey: ['group'] });
    },
  });
}
