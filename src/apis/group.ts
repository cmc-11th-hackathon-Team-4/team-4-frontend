import { delay, mockDb } from '@/mocks/db';
import type { Id } from '@/types/common';
import type { Group } from '@/types/group';
import { USE_MOCK } from './config';
import { instance } from './instance';

// TODO: 스웨거 확정되면 경로 맞추기
export async function getGroup(groupId: Id): Promise<Group> {
  if (USE_MOCK) {
    await delay();
    return structuredClone(mockDb.group);
  }
  const { data } = await instance.get<Group>(`/groups/${groupId}`);
  return data;
}
