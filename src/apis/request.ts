import { delay, readDb } from '@/mocks/db';
import type { Id } from '@/types/common';
import type { ChoreRequest } from '@/types/request';
import { USE_MOCK } from './config';
import { instance } from './instance';

// TODO: 스웨거 확정되면 경로 맞추기
/** 아직 응답 안 한 짐 올리기 요청 (내가 보냈거나 받은 것) */
export async function getPendingRequests(memberId: Id): Promise<ChoreRequest[]> {
  if (USE_MOCK) {
    await delay(100);
    return readDb().requests.filter(
      (r) => r.status === 'pending' && (r.fromId === memberId || r.toId === memberId),
    );
  }
  const { data } = await instance.get<ChoreRequest[]>(`/members/${memberId}/chore-requests`, {
    params: { status: 'pending' },
  });
  return data;
}
