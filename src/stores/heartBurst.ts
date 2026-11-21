import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Id } from '@/types/common';

/** 하트 뿅뿅을 이미 보여준 하트 알림 id (1회성, 기기별 저장) */
interface HeartBurstState {
  playedIds: Id[];
  markPlayed: (ids: Id[]) => void;
}

export const useHeartBurstStore = create<HeartBurstState>()(
  persist(
    (set) => ({
      playedIds: [],
      markPlayed: (ids) =>
        set((state) => ({ playedIds: [...new Set([...state.playedIds, ...ids])].slice(-200) })),
    }),
    { name: 'heart-burst' },
  ),
);
