/** 플로우 ① React Query 키 */
export const onboardingKeys = {
  me: ['onboarding', 'me'] as const,
  house: (houseId: string) => ['onboarding', 'house', houseId] as const,
  presets: ['onboarding', 'chore-presets'] as const,
  distribution: (houseId: string) => ['onboarding', 'distribution', houseId] as const,
};
