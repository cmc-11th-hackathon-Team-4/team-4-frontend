import type { Id } from '@/types/common';
import type { Group } from '@/types/group';
import { fetchBoard } from './mainServer';

/** ② 메인 보드: 구성원 · 짐 · 진행 중인 부탁 */
export async function getGroup(groupId: Id): Promise<Group> {
  return fetchBoard(groupId);
}
