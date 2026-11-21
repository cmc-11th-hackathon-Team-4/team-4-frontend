import type { Id } from './common';

/** 짐 올리기 요청 상태 (B 플로우) */
export type ChoreRequestStatus = 'pending' | 'accepted' | 'declined';

/** 짐 올리기: fromId가 자기 짐을 toId에게 부탁. toId가 받아야 넘어감 */
export interface ChoreRequest {
  id: Id;
  choreId: Id;
  fromId: Id;
  toId: Id;
  status: ChoreRequestStatus;
  createdAt: string;
}
