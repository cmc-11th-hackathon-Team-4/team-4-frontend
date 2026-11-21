/** 플로우 ② 덜어오기 경로 (화면 ID는 피그마 IA와 동일) */
export const MAIN_PATHS = {
  /** V3-01 내 메인 */
  home: '/',
  /** V3-02 상대 메인 */
  member: (memberId: string) => `/member/${memberId}`,
  /** V5-12 우리 집 설정 */
  settings: '/settings',
  /** V5-12 › 집안일 목록 */
  choreList: '/settings/chores',
} as const;
