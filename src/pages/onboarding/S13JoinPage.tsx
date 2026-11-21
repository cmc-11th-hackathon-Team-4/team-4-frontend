import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { Navigate, useNavigate } from 'react-router';
import { joinHouse, OnboardingApiError } from '@/apis/onboarding';
import alertIcon from '@/assets/icons/alert.svg';
import { ONBOARDING_PATHS } from '@/routes/onboardingPaths';
import { useProfileStore } from '@/stores/profile';
import BottomButton from './components/BottomButton';
import OnboardingLayout from './components/OnboardingLayout';
import { onboardingKeys } from './queryKeys';
import { INVITE_CODE_LENGTH, normalizeInviteCode } from './validation';

/** S-13-E 에러 종류별 문구 (유저플로우 최신 UX 라이팅) */
const CODE_ERROR_MESSAGE = {
  notFound: '없는 초대 코드예요. 다시 확인해 주세요.',
  full: '이 집은 구성원이 다 찼어요.',
  network: '연결이 불안정해요. 다시 시도해 주세요.',
} as const;

/** 서버 에러 → 입력란 아래 문구 (명세 3종 외에는 서버 문구) */
function toCodeErrorMessage(error: unknown) {
  if (error instanceof OnboardingApiError) {
    if (error.code === 'HOUSE-404-1') return CODE_ERROR_MESSAGE.notFound;
    if (error.code === 'HOUSE-409-1') return CODE_ERROR_MESSAGE.full;
    if (error.code !== 'NETWORK' && error.message) return error.message;
  }
  return CODE_ERROR_MESSAGE.network;
}

/**
 * S-13 초대 코드 입력 (+ S-13-E 코드 에러) (권한: 참여자) — 기능명세서 · 와이어 기준
 * - 영문 대문자 · 숫자 6자리. 소문자로 쳐도 대문자로 바꿔 보여줌, [붙여넣기]로 한 번에 넣기
 * - 6자리가 다 차야 [입력 완료]가 눌림. 들어오면 키보드가 바로 열림 (입력란 자동 포커스)
 * - 프로필이 없으면 P-01을 먼저 거침
 * - S-13-E: 에러는 입력란 아래 한 줄, 입력값은 남기고 다시 입력하면 에러를 지움
 * - [입력 완료]: POST /api/v1/houses/join → 성공 시 S-13-W, 실패 시 에러 종류(틀린 코드 HOUSE-404-1 · 정원 초과 HOUSE-409-1 · 연결) 표시
 * - 이미 집이 있으면(HOUSE-409) 그 집의 S-13-W 로
 * - TODO(API): S-13-C 이 집이 맞나요? 는 참여 전에 코드로 집을 조회하는 API 가 없어 보류 (지금은 바로 참여)
 */
function S13JoinPage() {
  const hasProfile = useProfileStore((s) => s.profile !== null);
  const [code, setCode] = useState('');
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const goWaiting = () => {
    queryClient.invalidateQueries({ queryKey: onboardingKeys.me });
    navigate(ONBOARDING_PATHS.joinWaiting, { replace: true });
  };

  const join = useMutation({
    mutationFn: () => joinHouse(code),
    onSuccess: goWaiting,
    onError: (e) => {
      if (e instanceof OnboardingApiError && e.code === 'HOUSE-409') return goWaiting();
      setError(toCodeErrorMessage(e));
    },
  });

  if (!hasProfile) {
    return <Navigate to={`${ONBOARDING_PATHS.profileNew}?next=join`} replace />;
  }

  const changeCode = (value: string) => {
    setCode(normalizeInviteCode(value));
    setError(null);
  };

  const paste = async () => {
    try {
      changeCode(await navigator.clipboard.readText());
    } catch {
      // 클립보드 권한이 없으면 직접 입력
    }
  };

  const canSubmit = code.length === INVITE_CODE_LENGTH && !join.isPending;

  return (
    <OnboardingLayout
      title="초대 코드 입력"
      heading="받은 초대 코드를 입력해 주세요"
      description="방장에게 받은 6자리 코드"
      footer={
        <BottomButton disabled={!canSubmit} onClick={() => join.mutate()}>
          입력 완료
        </BottomButton>
      }
    >
      <div className="mt-8 flex h-15 items-center gap-2 rounded-[14px] border-2 border-gray-800 bg-white pr-2.5 pl-4">
        <input
          autoFocus
          value={code}
          onChange={(e) => changeCode(e.target.value)}
          maxLength={INVITE_CODE_LENGTH}
          aria-label="초대 코드"
          aria-invalid={error !== null}
          autoCapitalize="characters"
          autoComplete="off"
          autoCorrect="off"
          spellCheck={false}
          className="min-w-0 flex-1 bg-transparent text-[22px] leading-[normal] font-semibold tracking-[4px] text-gray-900 outline-none"
        />
        <button
          type="button"
          onClick={paste}
          className="h-8 shrink-0 rounded-lg border border-line-800 px-3 text-[13px] text-gray-800"
        >
          붙여넣기
        </button>
      </div>

      {error ? (
        <p
          role="alert"
          className="mt-3 flex items-center gap-1.5 text-sm font-medium text-gray-800"
        >
          <img src={alertIcon} alt="" width={18} height={18} />
          {error}
        </p>
      ) : (
        <p className="mt-3 text-[13px] text-gray-500">영문 대문자 · 숫자 6자리</p>
      )}
    </OnboardingLayout>
  );
}

export default S13JoinPage;
