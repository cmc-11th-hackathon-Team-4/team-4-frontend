import { getDeviceId } from '@/utils/deviceId';
import { instance } from './instance';

/**
 * 플로우 ① 그룹 생성 API (Swagger: https://niturnnaeturn.duckdns.org/swagger-ui)
 * - 공용 axios 인스턴스가 X-Device-Id 헤더를 붙이고, 응답의 data 만 꺼내 준다
 * - 실패하면 ApiError(code, message) (@/apis/error). 연결 실패는 NETWORK
 */

const call = <T>(request: Promise<{ data: T }>): Promise<T> => request.then(({ data }) => data);

/* ── 서버 값 ── */
export type HouseStatus = 'WAITING' | 'DISTRIBUTING' | 'ACTIVE';
export type HouseRole = 'OWNER' | 'MEMBER';
/** 결산 주기(일): 1 · 3 · 7 (Swagger settlementCycle, 숫자) */
export type ServerSettlementCycle = 1 | 3 | 7;

export interface UserResponse {
  id: number;
  name: string;
  characterType: string;
  mood: string;
}

export interface UserMeResponse extends UserResponse {
  /** 소속 집이 없으면 null */
  house: { id: number; name: string; status: HouseStatus; role: HouseRole } | null;
}

export interface HouseMemberResponse {
  userId: number;
  name: string;
  characterType: string;
  role: HouseRole;
  isMe: boolean;
}

export interface HouseDetailResponse {
  id: number;
  name: string;
  inviteCode: string;
  status: HouseStatus;
  settlementCycle: ServerSettlementCycle | null;
  memberCount: number;
  maxMemberCount: number;
  choreCount: number;
  members: HouseMemberResponse[];
  /** WAITING 이면 null, ACTIVE 면 READY 를 뺀 최신 기간 */
  currentPeriod: {
    id: number;
    round: number;
    startDate: string;
    endDate: string;
    status: string;
  } | null;
}

/* ── 사용자 ── */

/** P-01 프로필 만들기 (헤더 대신 본문 deviceId). 이미 등록된 기기면 USER-409 */
export const createUser = (body: { name: string; characterType: string }) =>
  call<UserResponse>(instance.post('/api/v1/users', { deviceId: getDeviceId(), ...body }));

/** 내 정보 + 소속 집. 프로필이 없으면 USER-404 */
export const getMe = () => call<UserMeResponse>(instance.get('/api/v1/users/me'));

/* ── 집 ── */

/** S-01 집 만들기 (만든 사람이 방장, WAITING 으로 시작) */
export const createHouse = (name: string) =>
  call<{ id: number; name: string; inviteCode: string; status: HouseStatus }>(
    instance.post('/api/v1/houses', { name }),
  );

/** S-13 초대 코드로 참여. 틀린 코드 HOUSE-404-1, 정원 초과 HOUSE-409-1, 배분 진행 중 HOUSE-409-2 */
export const joinHouse = (inviteCode: string) =>
  call<{ id: number; name: string; status: HouseStatus }>(
    instance.post('/api/v1/houses/join', { inviteCode }),
  );

/** 집 정보 · 구성원 (S-02 · S-03 · S-13-W). 대기실은 이 API 를 주기적으로 다시 부른다 */
export const getHouse = (houseId: string) =>
  call<HouseDetailResponse>(instance.get(`/api/v1/houses/${houseId}`));

/* ── 집안일 ── */

/** S-04 기본 집안일 목록 (서버 상수) */
export const getChorePresets = () =>
  call<{ presets: string[] }>(instance.get('/api/v1/chore-presets')).then((d) => d.presets);

/** S-04 고른 집안일 저장 (방장, WAITING 에서만. 보낸 목록이 최종 목록) */
export const saveChores = (houseId: string, names: string[]) =>
  call<{ chores: { id: number; name: string }[] }>(
    instance.put(`/api/v1/houses/${houseId}/chores`, { names }),
  );

/* ── 배분 ── */

export interface DistributionMember {
  userId: number;
  name: string;
  characterType: string;
  role: HouseRole;
  isMe: boolean;
  chores: { choreId: number; name: string; carriedOver: boolean }[];
}

export interface DistributionResponse {
  houseStatus: HouseStatus;
  settlementCycle: ServerSettlementCycle;
  period: { id: number; round: number; startDate: string; endDate: string; status: string };
  totalCount: number;
  members: DistributionMember[];
}

/** S-06 결산 주기 · 시작 날짜로 첫 배분 만들기 (방장만). 집 상태가 DISTRIBUTING 으로 바뀐다 */
export const createDistribution = (
  houseId: string,
  body: { settlementCycle: ServerSettlementCycle; startDate: string },
) => call<DistributionResponse>(instance.post(`/api/v1/houses/${houseId}/distribution`, body));

/** S-05 배분 결과 (DISTRIBUTING 에서만, 아니면 HOUSE-409-3) */
export const getDistribution = (houseId: string) =>
  call<DistributionResponse>(instance.get(`/api/v1/houses/${houseId}/distribution`));

/** S-05 [다시 섞기] (방장만, 몇 번이든) */
export const shuffleDistribution = (houseId: string) =>
  call<DistributionResponse>(instance.post(`/api/v1/houses/${houseId}/distribution/shuffle`));

/** S-05 [확정하기] 집 시작 (방장만). 집 상태가 ACTIVE 로 바뀐다 */
export const startHouse = (houseId: string) =>
  call<{ houseId: number; status: HouseStatus; period: DistributionResponse['period'] }>(
    instance.post(`/api/v1/houses/${houseId}/start`),
  );

/** S-02 구성원 빼기 (방장만, WAITING 에서만). 빠진 사람은 집 없는 상태로 돌아간다 */
export const removeMember = (houseId: string, userId: number) =>
  call<null>(instance.delete(`/api/v1/houses/${houseId}/members/${userId}`));

export interface HouseInvitePreviewResponse {
  name: string;
  memberCount: number;
  maxMemberCount: number;
  ownerName: string;
  status: HouseStatus;
}

/** S-13-C 참여 전 초대 코드로 집 미리보기. 참여할 수 없는 집이면 참여 API 와 같은 에러 (HOUSE-404-1 · 409-1 · 409-2) */
export const getInvitePreview = (inviteCode: string) =>
  call<HouseInvitePreviewResponse>(instance.get(`/api/v1/houses/invite/${inviteCode}`));
