import type { Id } from './common';

export interface Chore {
  id: Id;
  name: string;
  /** 현재 담당자. 덜어가면 바뀜 */
  ownerId: Id;
  /** 결산의 한 일 / 못 한 일 */
  done: boolean;
}
