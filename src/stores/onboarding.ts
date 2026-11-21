import { create } from 'zustand';
import type { CharacterId } from '@/types/member';

/** 결산 주기 (S-06: 매주 / 2주 / 한 달) */
export type SettlementCycle = 'weekly' | 'biweekly' | 'monthly';

/**
 * 플로우 ① 진행 중 화면 입력값 (사용자 입력만 보관, 서버 데이터 아님)
 * - role: 들어온 경로로 구분 (S-01 경유 = 방장, S-13 경유 = 참여자)
 *   TODO(API): 서버의 방장 여부로 교체
 * - 새로고침 시 초기화 (persist 안 함)
 */
interface OnboardingState {
  role: 'host' | 'guest' | null;
  /** P-01에서 고른 캐릭터 (S-02·S-03 "나" 아바타). TODO(API): 서버 프로필 값으로 교체 */
  character: CharacterId | null;
  houseName: string;
  selectedChores: string[];
  cycle: SettlementCycle;
  /** 시작 날짜 YYYY-MM-DD, 비어 있으면 오늘 */
  startDate: string;

  setRole: (role: 'host' | 'guest') => void;
  setCharacter: (character: CharacterId) => void;
  setHouseName: (name: string) => void;
  setSelectedChores: (chores: string[]) => void;
  setCycle: (cycle: SettlementCycle) => void;
  setStartDate: (date: string) => void;
  reset: () => void;
}

const initialState = {
  role: null,
  character: null,
  houseName: '',
  selectedChores: [],
  cycle: 'weekly' as const,
  startDate: '',
};

export const useOnboardingStore = create<OnboardingState>()((set) => ({
  ...initialState,
  setRole: (role) => set({ role }),
  setCharacter: (character) => set({ character }),
  setHouseName: (houseName) => set({ houseName }),
  setSelectedChores: (selectedChores) => set({ selectedChores }),
  setCycle: (cycle) => set({ cycle }),
  setStartDate: (startDate) => set({ startDate }),
  reset: () => set(initialState),
}));
