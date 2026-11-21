import { create } from 'zustand';
import type { Id } from '@/types/common';

/** 마지막 덜어가기 기록 (상대 말풍선 '고마워' + 되돌리기용) */
interface LastTake {
  choreId: Id;
  fromId: Id;
}

interface TakeState {
  lastTake: LastTake | null;
  setLastTake: (lastTake: LastTake | null) => void;
}

export const useTakeStore = create<TakeState>((set) => ({
  lastTake: null,
  setLastTake: (lastTake) => set({ lastTake }),
}));
