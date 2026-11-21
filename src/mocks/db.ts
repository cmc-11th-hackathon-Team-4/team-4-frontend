import type { Chore } from '@/types/chore';
import type { Group } from '@/types/group';
import type { AppNotification } from '@/types/notification';
import type { CycleInfo } from '@/types/cycle';
import type { ChoreRequest } from '@/types/request';

/**
 * 시연용 목데이터 (서버 연동 전)
 * localStorage에 저장해서 같은 브라우저의 다른 탭(?devMember=m2)과 공유됨
 */
interface MockDb {
  /** 부탁은 requests에 따로 저장 (getGroup에서 합침) */
  group: Omit<Group, 'requests'>;
  notifications: AppNotification[];
  requests: ChoreRequest[];
  cycle: CycleInfo;
}

const STORAGE_KEY = 'mock-db-v7';

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
    // 피그마 ② 디자인 시안과 같은 값: 수아(보라 · 쌩쌩 · 짐 5개), 민지(주황 · 지침 · 짐 5개)
    members: [
      { id: 'm1', nickname: '수아', status: 'relaxed', isHost: true, character: '5' },
      { id: 'm2', nickname: '민지', status: 'unwilling', isHost: false, character: '2' },
    ],
    chores: [
      chore('c1', '빨래 널기', 'm1'),
      chore('c2', '설거지', 'm1'),
      chore('c3', '분리수거', 'm1'),
      chore('c4', '일반쓰레기 버리기', 'm1'),
      chore('c5', '욕실 청소', 'm1'),
      chore('c6', '빨래 개기', 'm2'),
      chore('c7', '청소기 돌리기', 'm2'),
      chore('c8', '바닥 닦기', 'm2'),
      chore('c9', '세탁기 돌리기', 'm2'),
      chore('c10', '음식물쓰레기 버리기', 'm2'),
    ],
  },
  notifications: [],
  requests: [],
  // 피그마 V5-14 예시 값
  cycle: { period: 'weekly', endDate: '2026-11-30' },
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

/** 알림 하나 추가 */
export function pushNotification(db: MockDb, n: Omit<AppNotification, 'id' | 'createdAt'>) {
  db.notifications.push({ ...n, id: newId('n'), createdAt: new Date().toISOString() });
}

export const newId = (prefix: string) =>
  `${prefix}${Date.now()}${Math.random().toString(36).slice(2, 6)}`;

/** 네트워크 흉내 */
export const delay = (ms = 200) => new Promise((resolve) => setTimeout(resolve, ms));
