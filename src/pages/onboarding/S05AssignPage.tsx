import { useNavigate } from 'react-router';
import { ONBOARDING_PATHS } from '@/routes/onboardingPaths';
import BottomButton from './components/BottomButton';
import OnboardingLayout from './components/OnboardingLayout';

/** S-05 랜덤 배분 (방장) */
function S05AssignPage() {
  const navigate = useNavigate();

  return (
    <OnboardingLayout
      title="랜덤 배분"
      heading="공평하게 나눴어요"
      description="언제든 서로 덜어줄 수 있어요."
      footer={
        <BottomButton onClick={() => navigate(ONBOARDING_PATHS.cycle)}>확정하기</BottomButton>
      }
    />
  );
}

export default S05AssignPage;
