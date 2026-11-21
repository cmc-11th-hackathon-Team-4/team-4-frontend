import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { CharacterId } from '@/types/member';

/** P-01에서 만드는 내 프로필 (캐릭터 + 이름) */
export interface Profile {
  nickname: string;
  character: CharacterId;
}

interface ProfileState {
  /** 아직 안 만들었으면 null (M-01 빈 프로필) */
  profile: Profile | null;
  setProfile: (profile: Profile) => void;
  clearProfile: () => void;
}

/**
 * 내 프로필 (공용: ① P-01 만들기, ④ M-01·P-01 수정)
 * 집에 들어간 뒤에는 그룹 구성원 정보가 우선. TODO(API): 서버 저장 후 서버 값 사용
 */
export const useProfileStore = create<ProfileState>()(
  persist(
    (set) => ({
      profile: null,
      setProfile: (profile) => set({ profile }),
      clearProfile: () => set({ profile: null }),
    }),
    { name: 'profile' },
  ),
);
