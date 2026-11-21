import { delay, readDb } from '@/mocks/db';
import type { Id } from '@/types/common';
import type { Group } from '@/types/group';
import { USE_MOCK } from './config';
import { fetchBoard } from './mainServer';

/** ② 메인 보드: 구성원 · 짐 · 진행 중인 부탁 */
export async function getGroup(groupId: Id): Promise<Group> {
  if (USE_MOCK) {
    await delay();
    const db = readDb();
    return { ...db.group, requests: db.requests.filter((r) => r.status === 'pending') };
  }
  return fetchBoard(groupId);
}
