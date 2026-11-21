import { delay, newId, updateDb } from '@/mocks/db';
import type { Id } from '@/types/common';
import type { ExtendDays, HouseCycle } from '@/types/houseSettings';
import { addDays } from '@/utils/date';
import { USE_MOCK } from './config';
import { instance } from './instance';

// TODO(API): 경로 확정되면 맞추기

const CYCLE_KEY = 'mock-cycle';
/** ③ 결산 목데이터(11.17 – 11.23)와 같은 기간 */
const DEFAULT_CYCLE: HouseCycle = { cycle: 'weekly', endDate: '2026-11-23' };

function readCycle(): HouseCycle {
  try {
    const saved = localStorage.getItem(CYCLE_KEY);
    if (saved) return JSON.parse(saved) as HouseCycle;
  } catch {
    // 시연용: 읽기 실패 시 기본값
  }
  return DEFAULT_CYCLE;
}

/** V5-12 결산 주기 · 이번 기간 결산일 */
export async function getHouseCycle(groupId: Id): Promise<HouseCycle> {
  if (USE_MOCK) {
    await delay();
    return readCycle();
  }
  const { data } = await instance.get<HouseCycle>(`/groups/${groupId}/cycle`);
  return data;
}

/** V5-14 이번 기간 늘리기 (방장) */
export async function extendHouseCycle(groupId: Id, days: ExtendDays): Promise<HouseCycle> {
  if (USE_MOCK) {
    await delay();
    const current = readCycle();
    const next = { ...current, endDate: addDays(current.endDate, days) };
    localStorage.setItem(CYCLE_KEY, JSON.stringify(next));
    return next;
  }
  const { data } = await instance.patch<HouseCycle>(`/groups/${groupId}/cycle`, { days });
  return data;
}

/** V5-13 집안일 추가: 담당자는 추가한 사람 */
export async function addChore(groupId: Id, memberId: Id, name: string) {
  if (USE_MOCK) {
    await delay();
    updateDb((db) => {
      db.group.chores.push({ id: newId('c'), name, ownerId: memberId, done: false });
    });
    return;
  }
  await instance.post(`/groups/${groupId}/chores`, { name, ownerId: memberId });
}
