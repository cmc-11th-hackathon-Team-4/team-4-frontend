import { fromServerCharacter, toServerCharacter } from '@/constants/character';
import type { Profile } from '@/stores/profile';
import type { Id } from '@/types/common';
import type { CharacterId } from '@/types/member';
import { isApiError } from './error';
import { instance } from './instance';
import { createUser, getHouse, getMe as fetchMe } from './onboarding';

// ④ 프로필 · 내 정보 API (Swagger 기준)
// 서버 호출은 ①의 apis/onboarding을 재사용하고, 여기서는 화면용 모양으로만 바꿈

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

/** 내 정보 + 소속 집. 프로필이 없으면(USER-404) null */
export async function getMe(): Promise<MyInfo | null> {
  try {
    const data = await fetchMe();
    return {
      id: String(data.id),
      nickname: data.name,
      character: fromServerCharacter(data.characterType),
      house: data.house
        ? { id: String(data.house.id), name: data.house.name, isHost: data.house.role === 'OWNER' }
        : null,
    };
  } catch (error) {
    if (isApiError(error, 'USER-404')) return null;
    throw error;
  }
}

/** P-01 프로필 만들기 (POST /users) */
export async function createProfile(profile: Profile) {
  await createUser({
    name: profile.nickname,
    characterType: toServerCharacter(profile.character),
  });
}

/** P-01 프로필 수정 (PATCH /users/me, 보낸 필드만 수정) */
export async function updateProfile(profile: Profile) {
  await instance.patch('/api/v1/users/me', {
    name: profile.nickname,
    characterType: toServerCharacter(profile.character),
  });
}

/** M-01 집 이름 · 구성원 (GET /houses/{houseId}) */
export async function getMyHouse(houseId: Id): Promise<MyHouse> {
  const data = await getHouse(houseId);
  return {
    name: data.name,
    members: data.members.map((m) => ({
      id: String(m.userId),
      nickname: m.name,
      character: fromServerCharacter(m.characterType),
      isHost: m.role === 'OWNER',
      isMe: m.isMe,
    })),
  };
}
