import { useGroupBoard } from './useGroupBoard';

/** 진행 중인 짐 올리기 요청: 내가 보낸 것(요청 중 카드) / 받은 것(부탁 받음 카드) / 짐별 요청 */
export function useChoreRequests() {
  const { group, myId } = useGroupBoard();

  const all = group?.requests ?? [];
  return {
    sent: all.filter((r) => r.fromId === myId),
    received: all.filter((r) => r.toId === myId),
    /** 짐 id → 부탁받은 사람 id */
    toByChore: new Map(all.map((r) => [r.choreId, r.toId])),
  };
}
