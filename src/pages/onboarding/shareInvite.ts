import { ONBOARDING_PATHS } from '@/routes/onboardingPaths';

/**
 * 초대장 보내기 (S-02): 휴대폰 기본 공유창으로 초대 코드와 링크를 보낸다 (명세: 카카오톡 연동 불필요)
 * - 공유창이 없는 환경(안드로이드 웹뷰 등)에서는 초대 코드를 클립보드에 복사한다
 * - 반환: 'shared' 보냄 · 'copied' 복사함 · 'cancelled' 사용자가 닫음 · 'failed' 둘 다 실패
 */
export async function shareInvite(inviteCode: string) {
  const url = `${window.location.origin}${ONBOARDING_PATHS.welcome}`;
  const text = `초대 코드: ${inviteCode}`;

  if (typeof navigator.share === 'function') {
    try {
      await navigator.share({ text, url });
      return 'shared' as const;
    } catch (error) {
      if (error instanceof DOMException && error.name === 'AbortError') return 'cancelled' as const;
      // 공유 실패 시 아래 복사로 대체
    }
  }
  try {
    await navigator.clipboard.writeText(inviteCode);
    return 'copied' as const;
  } catch {
    return 'failed' as const;
  }
}
