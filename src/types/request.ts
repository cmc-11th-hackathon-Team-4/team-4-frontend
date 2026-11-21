import type { Id } from './common';

/** 짐 올리기 요청 상태 (B 플로우) */
/** canceled: 부탁한 사람이 취소 (카드가 원래대로 돌아옴) */
export type ChoreRequestStatus = 'pending' | 'accepted' | 'declined' | 'canceled';

/** 짐 올리기: fromId가 자기 짐을 toId에게 부탁. toId가 받아야 넘어감 */
export interface ChoreRequest {
  id: Id;
  choreId: Id;
  fromId: Id;
  toId: Id;
  status: ChoreRequestStatus;
  createdAt: string;
  /** 실서버: 받은 부탁의 짐 이름 (상대 짐 목록에 없을 때 대비) */
  choreName?: string;
}
