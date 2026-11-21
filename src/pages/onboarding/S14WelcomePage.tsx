import { useNavigate } from 'react-router';
import { ONBOARDING_PATHS } from '@/routes/onboardingPaths';
import BottomButton from './components/BottomButton';
import OnboardingLayout from './components/OnboardingLayout';

/**
 * S-14 홈 · 집 없음 (권한: 모두)
 * - 집이 없을 때만 보이는 홈. 집 있음 → V5-01 분기는 가드에서 처리 (② 담당과 협의, API 필요)
 * - TODO(API): "프로필 있음?" 확인 후 있으면 P-01을 건너뛰고 S-01 / S-13으로 이동
 */
function S14WelcomePage() {
  const navigate = useNavigate();

  const goProfile = (next: 'create' | 'join') =>
    navigate(`${ONBOARDING_PATHS.profileNew}?next=${next}`);

  return (
    <OnboardingLayout
      showBack={false}
      heading="같이 사는 사람과 짐을 나눠볼까요?"
      description="집을 만들고 구성원을 초대해 보세요."
      footer={
        <>
          <BottomButton onClick={() => goProfile('create')}>집 만들기</BottomButton>
          <BottomButton variant="secondary" onClick={() => goProfile('join')}>
            초대 코드가 있어요
          </BottomButton>
        </>
      }
    >
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
