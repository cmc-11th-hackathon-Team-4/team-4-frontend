import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Id } from '@/types/common';
import type { Session } from '@/types/session';

interface SessionState {
  memberId: Id | null;
  groupId: Id | null;
  /** 그룹 생성·참여 완료 시 호출. 개발 중 임시 값 주입에도 사용 */
  setSession: (session: Session) => void;
  clearSession: () => void;
}

export const useSessionStore = create<SessionState>()(
  persist(
    (set) => ({
      memberId: null,
      groupId: null,
      setSession: ({ memberId, groupId }) => set({ memberId, groupId }),
      clearSession: () => set({ memberId: null, groupId: null }),
    }),
    { name: 'session' },
  ),
);
