import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { Navigate, useNavigate } from 'react-router';
import { ApiError } from '@/apis/error';
import { joinHouse } from '@/apis/onboarding';
import { ONBOARDING_PATHS } from '@/routes/onboardingPaths';
import BottomButton from './components/BottomButton';
import OnboardingLayout from './components/OnboardingLayout';
import { onboardingKeys } from './queryKeys';
import { isNoProfile, useMe } from './useMyHouse';
import { INVITE_CODE_LENGTH, normalizeInviteCode } from './validation';

/** S-13-E 에러 종류별 문구 (유저플로우 최신 UX 라이팅) */
const CODE_ERROR_MESSAGE = {
  notFound: '없는 초대 코드예요. 다시 확인해 주세요.',
  full: '이 집은 구성원이 다 찼어요.',
  network: '연결이 불안정해요. 다시 시도해 주세요.',
} as const;

/** 서버 에러 → 입력란 아래 문구 (명세 3종 외에는 서버 문구) */
function toCodeErrorMessage(error: unknown) {
  if (error instanceof ApiError) {
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
 * - 서버에 프로필이 없으면(GET /users/me · USER-404) P-01을 먼저 거침
 * - S-13-E: 에러는 입력란 아래 한 줄, 입력값은 남기고 다시 입력하면 에러를 지움
 * - [입력 완료]: POST /api/v1/houses/join → 성공 시 S-13-W, 실패 시 에러 종류(틀린 코드 HOUSE-404-1 · 정원 초과 HOUSE-409-1 · 연결) 표시
 * - 이미 집이 있으면(HOUSE-409) 그 집의 S-13-W 로
 * - TODO(API): S-13-C 이 집이 맞나요? 는 참여 전에 코드로 집을 조회하는 API 가 없어 보류 (지금은 바로 참여)
 */
function S13JoinPage() {
  const me = useMe();
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
      if (e instanceof ApiError && e.code === 'HOUSE-409') return goWaiting();
      if (isNoProfile(e))
        return navigate(`${ONBOARDING_PATHS.profileNew}?next=join`, { replace: true });
      setError(toCodeErrorMessage(e));
    },
  });

  if (isNoProfile(me.error)) {
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
      heading={
        <>
          받은 초대 코드를
          <br />
          입력해 주세요
        </>
      }
      description="방장에게 받은 6자리 코드예요."
      footer={
        <BottomButton disabled={!canSubmit} onClick={() => join.mutate()}>
          입력 완료
        </BottomButton>
      }
    >
      {/* 피그마 2-5 S-13 · S-13-E: 56px 코드 칸(포커스 보라 · 에러 빨강), 붙여넣기 칩, 아래 12px 안내 */}
      <div
        className={`mt-10 flex h-14 items-center gap-2 rounded-xl border-2 bg-white pr-2.5 pl-3 ${
          error ? 'border-[#fe4543]' : 'border-line-800 focus-within:border-primary-500'
        }`}
      >
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
          className="min-w-0 flex-1 bg-transparent text-lg leading-[normal] font-bold text-[#222329] outline-none"
        />
        <button
          type="button"
          onClick={paste}
          className="shrink-0 rounded px-3 py-2 text-xs leading-[normal] font-medium text-primary-500 bg-primary-100"
        >
          붙여넣기
        </button>
      </div>

      <p
        role={error ? 'alert' : undefined}
        className={`mt-[13px] text-xs leading-[normal] ${error ? 'text-[#fe4543]' : 'text-[#878d99]'}`}
      >
        {error ?? '6자리 초대 코드를 입력해주세요.'}
      </p>
    </OnboardingLayout>
  );
}

export default S13JoinPage;
