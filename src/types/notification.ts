import type { Id } from './common';
import type { MemberStatus } from './member';

/**
 * status: 상태 알림 / take: 덜어감 알림 / heart: 하트 알림
 * request: 부탁 알림 / accept: 수락 알림 / decline: 거절 알림 (짐 올리기)
 * cycleEnd: 기간 종료 알림 (V5-12 시연 › S-08 결산 홈 배너)
 * cycleExtend: 기간 늘림 알림 (V5-14)
 */
export type NotificationType =
  'status' | 'take' | 'heart' | 'request' | 'accept' | 'decline' | 'cycleEnd' | 'cycleExtend';

export interface AppNotification {
  id: Id;
  type: NotificationType;
  /** 보낸 사람 */
  fromId: Id;
  /** 받는 사람 */
  toId: Id;
  /** take·heart·request·accept·decline: 어떤 짐 때문인지 */
  choreId?: Id;
  /** status: 바뀐 상태 */
  status?: MemberStatus;
  /** cycleExtend: 바뀐 결산일 (YYYY-MM-DD) */
  endDate?: string;
  /** ISO 시간 */
  createdAt: string;
}
