import type { Id } from './common';
import type { MemberStatus } from './member';

/** 상태 알림 / 덜어감 알림 / 하트 알림 */
export type NotificationType = 'status' | 'take' | 'heart';

export interface AppNotification {
  id: Id;
  type: NotificationType;
  /** 보낸 사람 */
  fromId: Id;
  /** 받는 사람 */
  toId: Id;
  /** take·heart: 어떤 짐 때문인지 */
  choreId?: Id;
  /** status: 바뀐 상태 */
  status?: MemberStatus;
  /** ISO 시간 */
  createdAt: string;
}
