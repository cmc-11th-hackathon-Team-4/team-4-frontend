import type { Chore } from '@/types/chore';
import type { Group } from '@/types/group';
import type { AppNotification } from '@/types/notification';

/**
 * 시연용 목데이터 (서버 연동 전)
 * localStorage에 저장해서 같은 브라우저의 다른 탭(?devMember=m2)과 공유됨
 */
interface MockDb {
  group: Group;
  notifications: AppNotification[];
}

const STORAGE_KEY = 'mock-db';

const chore = (id: string, name: string, ownerId: string): Chore => ({
  id,
  name,
  ownerId,
  done: false,
});

const initialDb = (): MockDb => ({
  group: {
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
  },
  notifications: [],
});

export function readDb(): MockDb {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) return JSON.parse(saved) as MockDb;
  } catch {
    // 저장소 접근 불가 시 초기값 사용
  }
  return initialDb();
}

/** db를 읽고 → 수정하고 → 저장 */
export function updateDb<T>(mutate: (db: MockDb) => T): T {
  const db = readDb();
  const result = mutate(db);
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(db));
  } catch {
    // 저장 실패는 무시 (시연용)
  }
  return result;
}

/** 시연 초기화: 콘솔에서 localStorage.removeItem('mock-db') 또는 ?resetMock */
export function resetDb() {
  localStorage.removeItem(STORAGE_KEY);
}

export const newId = (prefix: string) =>
  `${prefix}${Date.now()}${Math.random().toString(36).slice(2, 6)}`;

/** 네트워크 흉내 */
export const delay = (ms = 200) => new Promise((resolve) => setTimeout(resolve, ms));
