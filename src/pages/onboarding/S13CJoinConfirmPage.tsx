import { useMutation, useQuery } from '@tanstack/react-query';
import { Navigate, useNavigate, useSearchParams } from 'react-router';
import { ApiError } from '@/apis/error';
import { getInvitePreview, joinHouse } from '@/apis/onboarding';
import StateView from '@/components/common/StateView';
import { CHARACTER_IMAGES } from '@/constants/character';
import { ONBOARDING_PATHS } from '@/routes/onboardingPaths';
import { useToastStore } from '@/stores/toast';
import { LOAD_ERROR, RETRY_LABEL } from './apiMessages';
import BottomButton from './components/BottomButton';
import OnboardingLayout from './components/OnboardingLayout';
import { toCodeErrorMessage } from './inviteErrors';
import { onboardingKeys } from './queryKeys';
import { isNoProfile, useRefreshMe } from './useMyHouse';
import { INVITE_CODE_LENGTH, normalizeInviteCode } from './validation';

/**
 * S-13-C 이 집이 맞나요? (권한: 참여자) — 피그마 2-5 디자인 기준
 * - GET /api/v1/houses/invite/{code}: 집 이름 · 구성원 수 · 방장 이름 (S-13 에서 미리 불러온 값을 그대로 씀)
 * - [이 집에 들어가기]: POST /api/v1/houses/join → S-13-W. 그사이 정원이 찼거나 배분이 시작되면 토스트
 * - 프로필이 없으면(USER-404) 참여 전에 P-01 → 만든 뒤 이 화면으로 돌아옴 (?next=confirm&code=)
 * - [다른 초대 코드 입력]: S-13 으로 돌아감
 * - 카드 캐릭터는 시안 그대로(주황 캐릭터). 미리보기 API 는 방장 캐릭터를 주지 않음
 */
function S13CJoinConfirmPage() {
  const [searchParams] = useSearchParams();
  const code = normalizeInviteCode(searchParams.get('code') ?? '');
  const navigate = useNavigate();
  const refreshMe = useRefreshMe();
  const showToast = useToastStore((s) => s.show);
  const goProfile = () => navigate(`${ONBOARDING_PATHS.profileNew}?next=confirm&code=${code}`);

  const preview = useQuery({
    queryKey: onboardingKeys.invitePreview(code),
    queryFn: () => getInvitePreview(code),
    enabled: code.length === INVITE_CODE_LENGTH,
    retry: false,
  });

  const goWaiting = () => {
    refreshMe();
    navigate(ONBOARDING_PATHS.joinWaiting, { replace: true });
  };

  const join = useMutation({
    mutationFn: () => joinHouse(code),
    onSuccess: goWaiting,
    onError: (e) => {
      if (e instanceof ApiError && e.code === 'HOUSE-409') return goWaiting();
      if (isNoProfile(e)) return goProfile();
      showToast(toCodeErrorMessage(e));
    },
  });

  const backToCode = () => navigate(ONBOARDING_PATHS.join, { replace: true });

  if (code.length !== INVITE_CODE_LENGTH) return <Navigate to={ONBOARDING_PATHS.join} replace />;
  if (preview.isLoading) return <StateView type="loading" />;
  if (preview.isError || !preview.data) {
    return (
      <StateView
        type="error"
        message={preview.error ? toCodeErrorMessage(preview.error) : LOAD_ERROR}
        retryLabel={RETRY_LABEL}
        onRetry={() => preview.refetch()}
      />
    );
  }

  const house = preview.data;

  return (
    <OnboardingLayout
      title="초대 코드 입력"
      heading={
        <>
          들어갈 집이
          <br />
          맞는지 확인해 주세요
        </>
      }
      description="들어가면 함께 집안일을 나눠요."
      footer={
        <div className="flex flex-col items-center gap-6">
          <button
            type="button"
            onClick={backToCode}
            className="py-1 text-base leading-[normal] font-medium text-gray-500"
          >
            다른 초대 코드 입력
          </button>
          <BottomButton disabled={join.isPending} onClick={() => join.mutate()}>
            이 집에 들어가기
          </BottomButton>
        </div>
      }
    >
      {/* 피그마 2-5 S-13-C: 300px 집 카드 — 캐릭터 120 · 집 이름 22 · 구성원 수 16 · 방장 칩 */}
      <section className="mt-10 flex h-[300px] flex-col items-center rounded-3xl bg-line-400 pt-7 leading-[normal]">
        <img src={CHARACTER_IMAGES['2']} alt="" width={120} height={120} className="size-30" />
        <h3 className="mt-[18px] text-[22px] font-semibold text-gray-800">{house.name}</h3>
        <p className="mt-3 text-base font-medium text-gray-500">구성원 {house.memberCount}명</p>
        <p className="mt-5 flex h-8 items-center rounded-2xl border border-line-600 bg-white px-[18px] text-sm font-medium text-primary-500">
          방장 · {house.ownerName}
        </p>
      </section>
    </OnboardingLayout>
  );
}

export default S13CJoinConfirmPage;
