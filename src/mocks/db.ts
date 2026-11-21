import type { Chore } from '@/types/chore';
import type { Group } from '@/types/group';

/** 시연용 목데이터 (서버 연동 전). 메모리에만 있어서 새로고침하면 초기화 */
const initialGroup = (): Group => ({
  id: 'g1',
  name: '우리 집',
  inviteCode: 'ABCD12',
  members: [
    { id: 'm1', nickname: '수아', status: 'relaxed', isHost: true, character: '1' },
    { id: 'm2', nickname: '민지', status: 'unwilling', isHost: false, character: '2' },
    { id: 'm3', nickname: '준호', status: 'relaxed', isHost: false, character: '3' },
    { id: 'm4', nickname: '엄마', status: 'relaxed', isHost: false, character: '4' },
  ],
  chores: [
    chore('c1', '빨래 널기', 'm1'),
    chore('c2', '설거지', 'm1'),
    chore('c3', '분리수거', 'm2'),
    chore('c4', '화장실 청소', 'm2'),
    chore('c5', '장보기', 'm2'),
    chore('c6', '이불 털기', 'm2'),
    chore('c7', '빨래 개기', 'm2'),
    chore('c8', '청소기 돌리기', 'm3'),
    chore('c9', '음식물 쓰레기', 'm3'),
    chore('c10', '냉장고 정리', 'm3'),
    chore('c11', '화분 물 주기', 'm4'),
  ],
});

function chore(id: string, name: string, ownerId: string): Chore {
  return { id, name, ownerId, done: false };
}

export const mockDb = { group: initialGroup() };

/** 네트워크 흉내 */
export const delay = (ms = 200) => new Promise((resolve) => setTimeout(resolve, ms));
