import { useNavigate } from 'react-router';
import { ONBOARDING_PATHS } from '@/routes/onboardingPaths';
import { useProfileStore } from '@/stores/profile';
import BottomButton from './components/BottomButton';
import OnboardingLayout from './components/OnboardingLayout';

/**
 * S-14 홈 · 집 없음 (권한: 모두)
 * - 집이 없을 때만 보이는 홈. 집 있음 → V5-01 분기는 가드에서 처리 (② 담당과 협의, API 필요)
 * - "프로필 있음?": 있으면 P-01을 건너뛰고 S-01 / S-13, 없으면 P-01을 먼저 거침
 *   (기기에 저장된 프로필 기준. TODO(API): GET /api/v1/users/me 결과로 교체)
 */
function S14WelcomePage() {
  const navigate = useNavigate();

  const hasProfile = useProfileStore((s) => s.profile !== null);

  const goProfile = (next: 'create' | 'join') => {
    if (hasProfile) {
      navigate(next === 'join' ? ONBOARDING_PATHS.join : ONBOARDING_PATHS.create);
      return;
    }
    navigate(`${ONBOARDING_PATHS.profileNew}?next=${next}`);
  };

  return (
    <OnboardingLayout
      showBack={false}
      footer={
        // 비주얼 시안: 밑줄 텍스트 링크가 주 버튼 위
        <div className="flex flex-col gap-3">
          <BottomButton variant="secondary" className="underline" onClick={() => goProfile('join')}>
            초대 코드가 있어요
          </BottomButton>
          <BottomButton onClick={() => goProfile('create')}>집 만들기</BottomButton>
        </div>
      }
    >
      {/* 비주얼 시안: 가운데 정렬 제목 (문구는 기능명세서 기준 유지) */}
      <div className="mt-10 flex flex-col items-center gap-8 text-center leading-[normal]">
        <h2 className="text-2xl font-semibold text-gray-800">같이 사는 사람과 짐을 나눠볼까요?</h2>
        <p className="text-base font-medium text-gray-700">집을 만들고 구성원을 초대해 보세요.</p>
      </div>
      {/* 캐릭터 확정 전까지 회색 박스 (명세) */}
      <div
        role="img"
        aria-label="캐릭터 일러스트"
        className="mx-auto mt-10 aspect-square w-48 rounded-3xl bg-neutral-200"
      />
    </OnboardingLayout>
  );
}

export default S14WelcomePage;
