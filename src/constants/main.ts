import { josa } from '@/utils/josa';

/** UX 라이팅 가이드: 문장 속 이름 뒤에는 '님' */
const nim = (name: string) => `${name}님`;

/** 덜어주기 · 짐 올리기 · 완료 플로우(V5) 문구 모음 */
export const MAIN_TEXT = {
  homeTitle: '우리 집',
  settings: '설정',
  meLabel: '나',
  moodTitle: '오늘 기분은 어때요?',
  // 위쪽 칩 (V5-01 '내 기분 · 쌩쌩', V5-07 '민지 기분 · 지침', '맡은 짐 5개')
  moodChipMine: '내 기분',
  moodChipOf: (name: string, mood: string) => `${name} 기분 · ${mood}`,
  loadChip: '맡은 짐 ',
  loadChipCount: (count: number) => `${count}개`,

  // 내 구성원 카드
  membersTitle: '내 구성원',
  membersHint: '구성원의 짐을 확인해 보세요.',

  // 내 메인 (V5-01)
  myChoresTitle: '오늘 내 짐',
  myChoresHint: '카드를 길게 눌러 내 짐을 나누고, 완료한 일은 X를 눌러 없애요.',
  completeChore: (chore: string) => `${chore} 완료`,
  // 카드 마감 표시 (결산일 기준)
  dueToday: '오늘까지',
  dueTomorrow: '내일까지',
  dueThisWeek: '이번 주까지',
  dueOn: (date: string) => `${date}까지`,
  requesting: (name: string) => `${nim(name)}에게 부탁 중`,
  requestingMe: '나에게 부탁 중',
  emptyMyChores: '오늘 할 일을 다 했어요',

  // 상대 상세 (V5-07)
  memberChores: (name: string) => `${nim(name)}의 짐`,
  memberChoresHint: '카드를 누르면 내 짐으로 가져와요.',
  emptyMemberChores: '덜어갈 짐이 없어요',

  // A · 덜어주기 (V5-08, V5-09)
  takeTitle: '정말 가져갈까요?',
  takeDesc: (name: string, chore: string) =>
    `${nim(name)}의 ${josa(chore, '을/를')} 내 짐으로 가져와요.`,
  takeOk: '가져가기',
  cancel: '취소',
  takenToast: (chore: string) => `${josa(chore, '을/를')} 덜어왔어요`,

  // 하트 (V5-11)
  takenBy: (name: string, chore: string) =>
    `${josa(nim(name), '이/가')} ${josa(chore, '을/를')} 덜어갔어요`,
  heartHint: '하트로 고마움을 전해 보세요.',
  sendHeart: '하트 보내기',
  heartSent: (name: string) => `${nim(name)}에게 하트를 보냈어요`,
  heartReceived: (name: string) => `${josa(nim(name), '이/가')} 하트를 보냈어요`,

  // B · 짐 올리기 (V5-05, V5-06, V5-10)
  requestTitle: '누구에게 짐을 올릴까요?',
  requestDesc: (chore: string) => `상대가 받아야 ${josa(chore, '이/가')} 넘어가요.`,
  requestMemberInfo: (status: string, count: number) => `${status} · 짐 ${count}개`,
  requestMemberFull: (count: number) => `짐 ${count}개 · 가득 찼어요`,
  requestMemberFullToast: (name: string) =>
    `${nim(name)}은 짐이 가득 찼어요. 다른 구성원에게 부탁해 주세요.`,
  requestOk: '부탁하기',
  requestNoMember: '아직 부탁할 사람이 없어요',
  requestedToast: '짐 올리기를 요청했어요',
  requestedBy: (name: string, chore: string) =>
    `${josa(nim(name), '이/가')} ${josa(chore, '을/를')} 부탁했어요`,
  requestHint: '받으면 내 짐으로 들어와요.',
  requestAccept: '받을게요',
  requestDecline: '다음에',
  acceptedToast: (chore: string) => `${josa(chore, '을/를')} 받았어요`,
  declinedToast: '다음에 하기로 했어요',
  acceptedBy: (name: string, chore: string) =>
    `${josa(nim(name), '이/가')} ${josa(chore, '을/를')} 받았어요`,
  declinedBy: (name: string, chore: string) =>
    `${josa(nim(name), '이/가')} ${josa(chore, '을/를')} 다음으로 미뤘어요`,
  declinedByDesc: (chore: string) => `${josa(chore, '은/는')} 내 짐에 그대로 있어요.`,
  canceledToast: '짐 올리기를 취소했어요',

  // C · 완료 (V5-03, V5-04)
  doneTitle: '다 끝냈나요?',
  doneDesc: (chore: string) => `${josa(chore, '을/를')} 목록에서 뺄게요.`,
  doneOk: '완료했어요',
  doneNo: '아니요',
  doneToast: (chore: string) => `${josa(chore, '을/를')} 끝냈어요`,

  // V5-12 우리 집 설정
  settingsTitle: '우리 집 설정',
  sectionChores: '집안일',
  addChore: '집안일 추가',
  choreList: '집안일 목록',
  choreCount: (count: number) => `${count}개`,
  sectionCycle: '결산 기간 · 방장',
  cycle: '결산 주기',
  cyclePeriod: { weekly: '매주', biweekly: '2주', monthly: '한 달' },
  cycleUntil: (date: string) => `${date}까지`,
  extendCycle: '이번 기간 늘리기',
  sectionMembers: '구성원',
  inviteCode: '초대 코드',
  members: '구성원',
  memberCount: (count: number, max: number) => `${count} / ${max}명`,
  sectionDemo: '시연',
  endCycle: '기간 종료하기',
  endCycleTag: '시연용',

  // V5-12 › 구성원 목록
  hostTag: '방장',

  // V5-14 이번 기간 늘리기 (피그마 문구)
  extendTitle: '이번 기간 늘리기',
  currentEnd: '지금 결산일',
  newEnd: '바뀐 결산일',
  extendOptions: [
    { label: '+1일', days: 1 },
    { label: '+3일', days: 3 },
    { label: '+1주', days: 7 },
  ],
  extendInfo: '방장만 바꿀 수 있어요. 구성원에게 알림이 가요.',
  extendOk: '늘리기',
  // TODO(문구 확정 필요): 기간 늘림 배너
  cycleExtended: (date: string) => `결산일이 ${date}로 늘었어요`,

  // 짐 5개 제한 · 부탁 취소
  memberFullToast: '짐은 한 사람당 5개까지 가질 수 있어요',
  houseFullToast: '집안일은 한 집에 10개까지 추가할 수 있어요',
  // TODO(문구 확정 필요): 서버 에러 코드별 토스트
  duplicateChoreToast: '이미 있는 집안일이에요',
  alreadyRequestedToast: '이미 부탁 중인 짐이에요',
  cancelRequestTitle: '부탁을 취소할까요?',
  cancelRequestDesc: (chore: string) => `${josa(chore, '은/는')} 다시 내 짐으로 돌아와요.`,
  cancelRequestOk: '부탁 취소', // UX 라이팅 확정

  // V5-12 › 집안일 목록
  deleteChore: (chore: string) => `${chore} 삭제`,
  deleteTitle: '집안일을 삭제할까요?',
  deleteDesc: (chore: string) => `${josa(chore, '을/를')} 목록에서 지워요.`,
  deleteOk: '삭제하기',
  deletedToast: (chore: string) => `${josa(chore, '을/를')} 삭제했어요`,
  doneTag: '완료',
  emptyChoreList: '아직 집안일이 없어요',

  // V5-13 집안일 추가
  addTitle: '집안일 추가',
  addLabel: '이름',
  addPlaceholder: '베란다 청소',
  addInfo: '추가한 일은 내 짐으로 들어가요. 힘들면 짐 올리기로 부탁할 수 있어요.',
  addOk: '추가하기',

  // 기간 종료 알림 (홈 배너 › S-08)
  cycleEnded: '이번 기간이 끝났어요. 결산을 확인해요',

  close: '닫기',
  error: '문제가 생겼어요. 잠시 후 다시 시도해 주세요.',
  loadError: '정보를 불러오지 못했어요. 다시 시도해 주세요.',
  retry: '다시 시도',
} as const;

/** 한 집당 짐 최대 10개 (완료한 짐은 빼고 셈) */
export const MAX_CHORES = 10;

/** 한 사람이 한 번에 가질 수 있는 짐 최대 5개 */
export const MAX_CHORES_PER_MEMBER = 5;

/** 게이지 기준: 내가 맡은 짐 / 1인당 최대 5개 (UX 라이팅: '짐 3/5'처럼 실제 값 표시) */
export const MAX_LOAD = MAX_CHORES_PER_MEMBER;
