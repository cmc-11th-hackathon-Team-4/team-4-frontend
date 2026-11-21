import { josa } from '@/utils/josa';

/** 덜어주기 · 짐 올리기 · 완료 플로우(V5) 문구 모음 */
export const MAIN_TEXT = {
  homeTitle: '우리집',
  settings: '설정',
  preparing: '준비 중이에요',
  meLabel: '나',
  moodButton: (label: string) => `기분 · ${label}`,
  moodTitle: '오늘 기분 어때?',

  // 내 메인 (V5-01)
  myChoresTitle: '오늘 내 집안일',
  myChoresHint: '카드를 누르면 짐 올리기 · X를 누르면 완료',
  thisWeek: '이번 주',
  requesting: (name: string) => `${name}에게 요청 중`,
  emptyMyChores: '오늘 할 일을 다 했어요',

  // 상대 상세 (V5-07)
  memberChores: (name: string) => `${name}의 짐`,
  memberChoresHint: '카드를 누르면 내 짐으로 가져와요',
  emptyMemberChores: '덜어갈 짐이 없어요',

  // A · 덜어주기 (V5-08, V5-09)
  takeTitle: '정말 가져갈까요?',
  takeDesc: (name: string, chore: string) =>
    `${name}의 ${josa(chore, '을/를')} 내 짐으로 가져와요.`,
  takeOk: '가져가기',
  cancel: '취소',
  takenToast: (chore: string) => `${josa(chore, '을/를')} 덜어왔어요`,

  // 하트 (V5-11)
  takenBy: (name: string, chore: string) =>
    `${josa(name, '이/가')} ${josa(chore, '을/를')} 덜어갔어요`,
  heartHint: '하트로 고마움을 전해요',
  sendHeart: '하트 보내기',
  heartSent: (name: string) => `${name}에게 하트를 보냈어요`,
  heartReceived: (name: string) => `${josa(name, '이/가')} 하트를 보냈어요 ♥`,
  heartCount: (count: number) => `♥ ${count}`,

  // B · 짐 올리기 (V5-05, V5-06, V5-10)
  requestTitle: '누구에게 올릴까요?',
  requestDesc: (chore: string) => `${josa(chore, '을/를')} 부탁해요. 상대가 받으면 넘어가요.`,
  requestMemberInfo: (status: string, count: number) => `${status} · 짐 ${count}개`,
  requestTip: '짐이 적거나 여유 있는 사람에게 부탁하면 좋아요.',
  requestOk: '부탁하기',
  requestNoMember: '아직 부탁할 사람이 없어요',
  requestedToast: '짐 올리기를 요청했어요',
  requestedBy: (name: string, chore: string) =>
    `${josa(name, '이/가')} ${josa(chore, '을/를')} 부탁했어요`,
  requestHint: '받으면 내 짐으로 들어와요',
  requestAccept: '받을게요',
  requestDecline: '다음에',
  acceptedToast: (chore: string) => `${josa(chore, '을/를')} 받았어요`,
  declinedToast: '다음에 하기로 했어요',
  acceptedBy: (name: string, chore: string) =>
    `${josa(name, '이/가')} ${josa(chore, '을/를')} 받았어요`,
  declinedBy: (name: string, chore: string) =>
    `${josa(name, '이/가')} ${josa(chore, '은/는')} 다음에 할게요`,

  // C · 완료 (V5-03, V5-04)
  doneTitle: '완료하셨나요?',
  doneDesc: (chore: string) => `${josa(chore, '을/를')} 목록에서 뺄게요.`,
  doneOk: '완료했어요',
  doneNo: '아니요',
  doneToast: (chore: string) => `${chore} 완료!`,

  close: '닫기',
  error: '잠시 후 다시 시도해 주세요',
  loadError: '정보를 불러오지 못했어요',
  retry: '다시 시도',
} as const;

/** 게이지 기준: 내가 맡은 짐 개수 / 한 집당 짐 최대 10개 */
export const MAX_LOAD = 10;
