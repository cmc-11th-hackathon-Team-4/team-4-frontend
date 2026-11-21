import { MAIN_PATHS } from './mainPaths';

/** 플로우 ① 그룹 생성 경로 (화면 ID는 피그마 IA와 동일) */
export const ONBOARDING_PATHS = {
  /** S-14 홈 · 집 없음 */
  welcome: '/welcome',
  /** P-01 프로필 만들기 */
  profileNew: '/profile/new',
  /** S-01 집 만들기 */
  create: '/onboarding/create',
  /** S-02 초대장 만들기 */
  invite: '/onboarding/invite',
  /** S-13 초대 코드 입력 */
  join: '/onboarding/join',
  /** S-13-C 이 집이 맞나요? (?code=초대 코드) */
  joinConfirm: '/onboarding/join/confirm',
  /** S-13-W 방장 기다리는 중 (참여자) */
  joinWaiting: '/onboarding/join/waiting',
  /** S-03 대기실 */
  waiting: '/onboarding/waiting',
  /** S-04 집안일 고르기 */
  chores: '/setup/chores',
  /** S-05 랜덤 배분 */
  assign: '/setup/assign',
  /** S-06 결산 주기 */
  cycle: '/setup/cycle',
} as const;

/** 플로우 ① 종료 후 이동: V5-01 내 메인 (② 담당 경로를 그대로 사용) */
export const HOME_PATH = MAIN_PATHS.home;
