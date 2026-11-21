import { MAX_CHORES, MAX_CHORES_PER_MEMBER } from '@/constants/main';
import type { Chore } from '@/types/chore';
import type { Id } from '@/types/common';

/** 아직 안 한 짐만 셈 (완료한 짐은 제한에서 빠짐) */
export const pendingChores = (chores: Chore[]) => chores.filter((c) => !c.done);

/** 한 집 짐이 10개 다 찼는지 */
export const isHouseFull = (chores: Chore[]) => pendingChores(chores).length >= MAX_CHORES;

/** 이 사람이 짐 5개를 다 가졌는지 */
export const isMemberFull = (chores: Chore[], memberId: Id) =>
  pendingChores(chores).filter((c) => c.ownerId === memberId).length >= MAX_CHORES_PER_MEMBER;
