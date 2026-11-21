import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Id } from '@/types/common';

/** 배너로 이미 보여준 알림 id (기기별 저장) */
interface SeenState {
  seenIds: Id[];
  markSeen: (ids: Id[]) => void;
}

export const useSeenNotificationStore = create<SeenState>()(
  persist(
    (set) => ({
      seenIds: [],
      markSeen: (ids) =>
        set((state) => ({ seenIds: [...new Set([...state.seenIds, ...ids])].slice(-200) })),
    }),
    { name: 'seen-notifications' },
  ),
);
