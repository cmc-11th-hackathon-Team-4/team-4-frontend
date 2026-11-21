import type { MemberStatus } from '@/types/member';
import { instance } from './instance';
import { API, toServerMood } from './mainServer';

/** 기분 변경. '지침'(unwilling)으로 바뀌면 다른 구성원에게 상태 알림 */
export async function updateStatus(status: MemberStatus): Promise<void> {
  // '고르기 싫음'(NO_CHOICE)으로 바뀌면 서버가 구성원에게 MOOD_NO_CHOICE 알림을 보냄
  await instance.patch(`${API}/users/me/mood`, { mood: toServerMood(status) });
}
