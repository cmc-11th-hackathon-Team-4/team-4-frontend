import { useNavigate } from 'react-router';
import { ONBOARDING_PATHS } from '@/routes/onboardingPaths';
import BottomButton from './components/BottomButton';
import OnboardingLayout from './components/OnboardingLayout';

/** P-01 프로필 만들기 */
function P01ProfilePage() {
  const navigate = useNavigate();

  return (
    <OnboardingLayout
      title="프로필 만들기"
      heading="어떤 캐릭터로 함께할까요?"
      description="같은 캐릭터여도 이름으로 구분돼요."
      footer={
        <BottomButton onClick={() => navigate(ONBOARDING_PATHS.create)}>
          프로필 만들고 계속하기
        </BottomButton>
      }
    />
  );
}

export default P01ProfilePage;
