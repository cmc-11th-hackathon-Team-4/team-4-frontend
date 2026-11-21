/** 플로우 ② 덜어오기 경로 (화면 ID는 피그마 IA와 동일) */
export const MAIN_PATHS = {
  /** V3-01 내 메인 */
  home: '/',
  /** V3-02 상대 메인 */
  member: (memberId: string) => `/member/${memberId}`,
} as const;
