import { delay, mockDb } from '@/mocks/db';
import type { Id } from '@/types/common';
import type { MemberStatus } from '@/types/member';
import { USE_MOCK } from './config';
import { instance } from './instance';

// TODO: 스웨거 확정되면 경로 맞추기
export async function updateStatus(memberId: Id, status: MemberStatus): Promise<void> {
  if (USE_MOCK) {
    await delay();
    const member = mockDb.group.members.find((m) => m.id === memberId);
    if (member) member.status = status;
    return;
  }
  await instance.patch(`/members/${memberId}/status`, { status });
}
