import type { Id } from '@/types/common';

/** TanStack Query 키 (공용) */
export const queryKeys = {
  group: (groupId: Id) => ['group', groupId] as const,
};
