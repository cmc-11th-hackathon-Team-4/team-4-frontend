import type { Id } from '@/types/common';

/** TanStack Query 키 (공용) */
export const queryKeys = {
  group: (groupId: Id) => ['group', groupId] as const,
  notifications: (memberId: Id) => ['notifications', memberId] as const,
};
