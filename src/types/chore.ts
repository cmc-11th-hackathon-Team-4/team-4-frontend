import type { Id } from './common';

export interface Chore {
  /** 실서버: 짐(assignment) id. 덜어가기 · 부탁 · 완료에 씀 */
  id: Id;
  /** 집안일(chore) id. 집안일 삭제에 씀 (id는 짐(assignment) id) */
  choreId?: Id;
  name: string;
  /** 현재 담당자. 덜어가면 바뀜 */
  ownerId: Id;
  /** 결산의 한 일 / 못 한 일 */
  done: boolean;
}
