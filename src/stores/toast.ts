import { create } from 'zustand';

interface ToastAction {
  label: string;
  onClick: () => void;
}

interface ToastState {
  message: string | null;
  action: ToastAction | null;
  show: (message: string, action?: ToastAction) => void;
  hide: () => void;
}

/** 전역 토스트 (어느 플로우에서든 useToastStore().show 로 사용) */
export const useToastStore = create<ToastState>((set) => ({
  message: null,
  action: null,
  show: (message, action) => set({ message, action: action ?? null }),
  hide: () => set({ message: null, action: null }),
}));
