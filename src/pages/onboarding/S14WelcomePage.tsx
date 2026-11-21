import { useNavigate } from 'react-router';
import { ONBOARDING_PATHS } from '@/routes/onboardingPaths';
import BottomButton from './components/BottomButton';
import OnboardingLayout from './components/OnboardingLayout';

/** S-14 홈 · 집 없음 */
function S14WelcomePage() {
  const navigate = useNavigate();

  return (
    <OnboardingLayout
      showBack={false}
      heading="같이 사는 사람과 짐을 나눠볼까요?"
      description="집을 만들고 구성원을 초대해 보세요."
      footer={
        <BottomButton onClick={() => navigate(ONBOARDING_PATHS.profileNew)}>집 만들기</BottomButton>
      }
    />
  );
}

export default S14WelcomePage;
