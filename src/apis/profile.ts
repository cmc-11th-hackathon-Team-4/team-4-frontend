import type { Profile } from '@/stores/profile';
import type { Id } from '@/types/common';
import type { CharacterId } from '@/types/member';
import { getDeviceId } from '@/utils/deviceId';
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
  await instance.post(`${BASE}/users`, {
    deviceId: getDeviceId(),
    name: profile.nickname,
    characterType: toServerCharacter(profile.character),
  });
}

/** P-01 프로필 수정 (PATCH /users/me, 보낸 필드만 수정) */
export async function updateProfile(profile: Profile) {
  await instance.patch(`${BASE}/users/me`, {
    name: profile.nickname,
    characterType: toServerCharacter(profile.character),
  });
}

/** M-01 집 이름 · 구성원 (GET /houses/{houseId}) */
export async function getMyHouse(houseId: Id): Promise<MyHouse> {
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
