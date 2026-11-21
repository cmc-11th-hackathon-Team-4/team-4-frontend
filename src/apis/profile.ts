import { delay, updateDb } from '@/mocks/db';
import type { Id } from '@/types/common';
import type { Profile } from '@/stores/profile';
import { USE_MOCK } from './config';
import { instance } from './instance';

/** P-01 프로필 수정: 집에 들어가 있으면 구성원 정보도 바꿈. TODO(API): 경로 확정 */
export async function updateProfile(memberId: Id, profile: Profile) {
  if (USE_MOCK) {
    await delay();
    updateDb((db) => {
      const member = db.group.members.find((m) => m.id === memberId);
      if (member) Object.assign(member, profile);
    });
    return;
  }
  await instance.patch(`/members/${memberId}`, profile);
}
