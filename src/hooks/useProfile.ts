import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateProfile } from '@/apis/profile';
import { queryKeys } from '@/apis/queryKeys';
import { useGroupBoard } from '@/hooks/useGroupBoard';
import { type Profile, useProfileStore } from '@/stores/profile';
import { useSessionStore } from '@/stores/session';

/** 내 프로필 + 집 정보. 집에 들어가 있으면 구성원 정보, 아니면 P-01에서 저장한 값 */
export function useMyProfile() {
  const board = useGroupBoard();
  const stored = useProfileStore((s) => s.profile);
  const profile: Profile | null = board.me
    ? { nickname: board.me.nickname, character: board.me.character }
    : stored;
  return { ...board, profile, hasHouse: !!board.me };
}

/** P-01 프로필 저장 (만들기 · 수정 공용) */
export function useSaveProfile() {
  const { memberId, groupId } = useSessionStore();
  const setProfile = useProfileStore((s) => s.setProfile);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (profile: Profile) => {
      if (memberId && groupId) await updateProfile(memberId, profile);
      setProfile(profile);
    },
    onSuccess: () => {
      if (groupId) queryClient.invalidateQueries({ queryKey: queryKeys.group(groupId) });
    },
  });
}
