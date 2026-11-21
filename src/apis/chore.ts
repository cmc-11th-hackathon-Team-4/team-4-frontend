import type { Chore } from '@/types/chore';
import type { Id } from '@/types/common';
import { instance } from './instance';
import { API } from './mainServer';

// ② 짐 API. 실서버에서 choreId 인자는 짐(assignment) id, requestId는 부탁(transfer) id
/** A · 덜어주기: 상대 짐을 바로 내 짐으로 + 원래 담당자에게 덜어감 알림 */
export async function takeChore(choreId: Id): Promise<void> {
  await instance.post(`${API}/assignments/${choreId}/relieve`);
}

/** B · 짐 올리기: 내 짐을 상대에게 부탁 (상대가 받아야 넘어감) */
export async function requestChore(choreId: Id, toId: Id): Promise<void> {
  await instance.post(`${API}/assignments/${choreId}/requests`, { toUserId: Number(toId) });
}

/** B · 부탁 응답: 받을게요(accept) → 내 짐으로 / 다음에(decline) → 짐은 그대로 */
export async function respondChoreRequest(requestId: Id, accept: boolean): Promise<void> {
  await instance.post(`${API}/transfers/${requestId}/${accept ? 'accept' : 'decline'}`);
}

/** C · 완료: 목록에서 제거 (결산용으로 done 처리) */
export async function completeChore(choreId: Id): Promise<void> {
  await instance.post(`${API}/assignments/${choreId}/complete`);
}

/**
 * V5-12 집안일 목록: 삭제되지 않은 집안일 전체 (GET /houses/{id}/chores)
 * 완료했거나 아직 담당자가 없는 집안일도 포함. 담당자는 화면에서 메인 보드 짐과 맞춰 붙임
 */
export async function getChoreList(groupId: Id): Promise<Chore[]> {
  const { data } = await instance.get<{ chores: { id: number; name: string }[] }>(
    `${API}/houses/${groupId}/chores`,
  );
  return data.chores.map((c) => ({
    id: String(c.id),
    choreId: String(c.id),
    name: c.name,
    ownerId: '',
    done: false,
  }));
}

/** V5-12 집안일 목록 › 삭제 (부탁 중이던 요청도 함께 정리). 실서버는 집안일(chore) id */
export async function deleteChore(groupId: Id, chore: Chore): Promise<void> {
  await instance.delete(`${API}/houses/${groupId}/chores/${chore.choreId ?? chore.id}`);
}

/** V5-13 집안일 추가: 추가한 사람이 담당자 */
export async function createChore(groupId: Id, ownerId: Id, name: string): Promise<Chore> {
  const { data } = await instance.post<{
    chore: { id: number; name: string };
    assignment: { id: number } | null;
  }>(`${API}/houses/${groupId}/chores`, { name });
  return {
    id: String(data.assignment?.id ?? data.chore.id),
    choreId: String(data.chore.id),
    name: data.chore.name,
    ownerId,
    done: false,
  };
}

/** B · 부탁 취소: 요청 중 카드가 원래 카드로 돌아옴 */
export async function cancelChoreRequest(requestId: Id): Promise<void> {
  await instance.delete(`${API}/transfers/${requestId}`);
}
