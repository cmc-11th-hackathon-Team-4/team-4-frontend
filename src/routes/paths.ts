/** 피그마 IA 기준 경로. 각자 자기 플로우 키만 수정 */
export const PATHS = {
  home: '/',
  member: (id: string) => `/member/${id}`,
  onboarding: {
    create: '/onboarding/create',
    invite: '/onboarding/invite',
    join: '/onboarding/join',
    waiting: '/onboarding/waiting',
  },
  setup: { chores: '/setup/chores', assign: '/setup/assign', cycle: '/setup/cycle' },
  weekly: { root: '/weekly' },
} as const;
