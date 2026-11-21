/** 덜어오기 플로우(V3) 문구 모음 */
export const MAIN_TEXT = {
  homeTitle: '우리 집',
  invite: (count: number, max: number) => `초대 ${count}/${max}`,
  gaugeLight: '가벼움',
  gaugeHeavy: '무거움',
  meLabel: '나',
  gaugeCaption: (isMe: boolean, name: string, count: number) =>
    isMe ? `나 · ${name} · 짐 ${count}개` : `${name} · 짐 ${count}개`,
  noticeSub: (count: number) => `짐 ${count}개 · 하나만 덜어줄까요?`,
  noticeButton: '짐 보기',
  todayTitle: '내 오늘 하나',
  todayHidden: (count: number) => `외 ${count}개 숨김`,
  todayEmpty: '오늘 할 짐이 없어요',
  addChore: '+ 짐 올리기',
  memberChores: (name: string) => `${name}의 짐`,
  dragHint: '끌어서 내 짐으로 ↓',
  more: (count: number) => `+${count}개 더`,
  fold: '접기',
  moving: '옮기는 중…',
  emptyChores: '남은 짐이 없어요',
  dockTitle: (count: number) => `내 짐 ${count}개`,
  dockIdle: "여기나 오른쪽 '나'에 놓으면 덜어가기",
  dockActive: '놓으면 내 짐이 돼요',
  thanksBubble: '고마워, 조금 가벼워졌어',
  confirmTitle: '정말 가져갈까요?',
  confirmDesc: (chore: string, name: string) => `${name}의 '${chore}'가 내 짐이 돼요`,
  confirmOk: '가져가기',
  confirmCancel: '취소',
  takenToast: (chore: string) => `${chore}를 덜어왔어요`,
  undo: '되돌리기',
  addTitle: '어떤 짐을 올릴까요?',
  addPlaceholder: '예: 설거지',
  addOk: '올리기',
  error: '잠시 후 다시 시도해 주세요',
  loadError: '정보를 불러오지 못했어요',
  retry: '다시 시도',
} as const;

/** 게이지가 가득 차는 짐 개수 (TODO: 디자인 확인) */
export const MAX_LOAD = 6;

/** 상대 메인에서 처음 보여줄 카드 수 */
export const VISIBLE_CHORES = 4;
