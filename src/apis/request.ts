import { delay, readDb } from '@/mocks/db';
import type { Id } from '@/types/common';
import type { ChoreRequest } from '@/types/request';
import { USE_MOCK } from './config';
import { instance } from './instance';

// TODO: 스웨거 확정되면 경로 맞추기
/** 우리 집의 아직 응답 안 한 짐 올리기 요청 (상대 상세에서 부탁 중인 짐 표시에도 사용) */
export async function getPendingRequests(groupId: Id): Promise<ChoreRequest[]> {
  if (USE_MOCK) {
    await delay(100);
    return readDb().requests.filter((r) => r.status === 'pending');
  }
  const { data } = await instance.get<ChoreRequest[]>(`/groups/${groupId}/chore-requests`, {
    params: { status: 'pending' },
  });
  return data;
}
