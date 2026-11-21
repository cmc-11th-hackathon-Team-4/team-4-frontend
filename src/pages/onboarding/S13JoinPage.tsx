import { useState } from 'react';
import { Navigate } from 'react-router';
import alertIcon from '@/assets/icons/alert.svg';
import { ONBOARDING_PATHS } from '@/routes/onboardingPaths';
import { useProfileStore } from '@/stores/profile';
import BottomButton from './components/BottomButton';
import OnboardingLayout from './components/OnboardingLayout';
import { INVITE_CODE_LENGTH, normalizeInviteCode } from './validation';

/** S-13-E 에러 종류별 문구 (기능명세서) */
const CODE_ERROR_MESSAGE = {
  notFound: '없는 코드예요. 다시 확인해요',
  full: '이 집은 구성원이 다 찼어요',
  network: '연결이 불안정해요. 다시 시도해요',
} as const;
type CodeError = keyof typeof CODE_ERROR_MESSAGE;

/**
 * S-13 초대 코드 입력 (+ S-13-E 코드 에러) (권한: 참여자) — 기능명세서 · 와이어 기준
 * - 영문 대문자 · 숫자 6자리. 소문자로 쳐도 대문자로 바꿔 보여줌, [붙여넣기]로 한 번에 넣기
 * - 6자리가 다 차야 [입력 완료]가 눌림. 들어오면 키보드가 바로 열림 (입력란 자동 포커스)
 * - 프로필이 없으면 P-01을 먼저 거침
 * - S-13-E: 에러는 입력란 아래 한 줄, 입력값은 남기고 다시 입력하면 에러를 지움
 * - TODO(API): [입력 완료] → 코드 확인 (확인 중 버튼 로딩) → 성공 S-13-C / 실패 시 에러 종류(없는 코드 · 인원 초과 · 네트워크) 표시
 * - S-13-C · S-13-W · S-05(참여자)는 집 정보 API가 필요해 보류
 */
function S13JoinPage() {
  const hasProfile = useProfileStore((s) => s.profile !== null);
  const [code, setCode] = useState('');
  const [error, setError] = useState<CodeError | null>(null);

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

  const canSubmit = code.length === INVITE_CODE_LENGTH;

  return (
    <OnboardingLayout
      title="초대 코드 입력"
      heading="받은 초대 코드를 입력해요"
      description="방장에게 받은 6자리 코드"
      footer={
        // TODO(API): 코드 확인 후 S-13-C로 이동, 실패 시 setError(에러 종류)
        <BottomButton disabled={!canSubmit}>입력 완료</BottomButton>
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
          {CODE_ERROR_MESSAGE[error]}
        </p>
      ) : (
        <p className="mt-3 text-[13px] text-gray-500">영문 대문자 · 숫자 6자리</p>
      )}
    </OnboardingLayout>
  );
}

export default S13JoinPage;
