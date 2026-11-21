import { delay, readDb, updateDb } from '@/mocks/db';
import { type Profile, useProfileStore } from '@/stores/profile';
import { useSessionStore } from '@/stores/session';
import type { Id } from '@/types/common';
import type { CharacterId } from '@/types/member';
import { getDeviceId } from '@/utils/deviceId';
import { USE_MOCK } from './config';
import { isApiError } from './error';
import { instance } from './instance';

// ④ 프로필 · 내 정보 API (Swagger 기준, 경로 앞 /api/v1)
// characterType 'CHARACTER_1' ↔ CharacterId '1', 서버 id(number) → Id(string)

const BASE = '/api/v1';

/** 내 정보 + 소속 집 (GET /users/me) */
export interface MyInfo extends Profile {
  id: Id;
  /** 집이 없으면 null */
  house: { id: Id; name: string; isHost: boolean } | null;
}

/** M-01 우리 집 구성원 (GET /houses/{houseId}) */
export interface MyHouse {
  name: string;
  members: { id: Id; nickname: string; character: CharacterId; isHost: boolean; isMe: boolean }[];
}

interface ServerUser {
  id: number;
  name: string;
  characterType: string;
}

const toCharacter = (type: string): CharacterId => type.replace('CHARACTER_', '');
const toServerCharacter = (id: CharacterId) => `CHARACTER_${id}`;

/** 내 정보 + 소속 집. 프로필이 없으면(USER-404) null */
export async function getMe(): Promise<MyInfo | null> {
  if (USE_MOCK) {
    await delay();
    return mockMe();
  }
  try {
    const { data } = await instance.get<
      ServerUser & { house: { id: number; name: string; role: 'OWNER' | 'MEMBER' } | null }
    >(`${BASE}/users/me`);
    return {
      id: String(data.id),
      nickname: data.name,
      character: toCharacter(data.characterType),
      house: data.house
        ? { id: String(data.house.id), name: data.house.name, isHost: data.house.role === 'OWNER' }
        : null,
    };
  } catch (error) {
    if (isApiError(error, 'USER-404')) return null;
    throw error;
  }
}

/** P-01 프로필 만들기 (POST /users, 헤더 없이 본문 deviceId로 기기 등록) */
export async function createProfile(profile: Profile) {
  if (USE_MOCK) {
    await delay();
    return;
  }
  await instance.post(`${BASE}/users`, {
    deviceId: getDeviceId(),
    name: profile.nickname,
    characterType: toServerCharacter(profile.character),
  });
}

/** P-01 프로필 수정 (PATCH /users/me, 보낸 필드만 수정) */
export async function updateProfile(profile: Profile) {
  if (USE_MOCK) {
    await delay();
    // 집에 들어가 있으면 목데이터 구성원 정보도 함께 바꿈
    const { memberId } = useSessionStore.getState();
    updateDb((db) => {
      const member = db.group.members.find((m) => m.id === memberId);
      if (member) Object.assign(member, profile);
    });
    return;
  }
  await instance.patch(`${BASE}/users/me`, {
    name: profile.nickname,
    characterType: toServerCharacter(profile.character),
  });
}

/** M-01 집 이름 · 구성원 (GET /houses/{houseId}) */
export async function getMyHouse(houseId: Id): Promise<MyHouse> {
  if (USE_MOCK) {
    await delay();
    const { group } = readDb();
    const { memberId } = useSessionStore.getState();
    return {
      name: group.name,
      members: group.members.map((m) => ({
        id: m.id,
        nickname: m.nickname,
        character: m.character,
        isHost: m.isHost,
        isMe: m.id === memberId,
      })),
    };
  }
  const { data } = await instance.get<{
    name: string;
    members: { userId: number; name: string; characterType: string; role: string; isMe: boolean }[];
  }>(`${BASE}/houses/${houseId}`);
  return {
    name: data.name,
    members: data.members.map((m) => ({
      id: String(m.userId),
      nickname: m.name,
      character: toCharacter(m.characterType),
      isHost: m.role === 'OWNER',
      isMe: m.isMe,
    })),
  };
}

/** 목데이터: 세션 구성원이 그룹에 있으면 집 있음, 아니면 저장된 프로필만 */
function mockMe(): MyInfo | null {
  const { memberId, groupId } = useSessionStore.getState();
  const { group } = readDb();
  const member = group.members.find((m) => m.id === memberId);
  if (member && groupId) {
    return {
      id: member.id,
      nickname: member.nickname,
      character: member.character,
      house: { id: groupId, name: group.name, isHost: member.isHost },
    };
  }
  const stored = useProfileStore.getState().profile;
  return stored ? { id: 'me', ...stored, house: null } : null;
}
