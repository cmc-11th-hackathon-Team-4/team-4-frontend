import { useNavigate } from 'react-router';
import { ONBOARDING_PATHS } from '@/routes/onboardingPaths';
import BottomButton from './components/BottomButton';
import OnboardingLayout from './components/OnboardingLayout';

/** S-03 대기실 (공통 · 시작은 방장) */
function S03WaitingPage() {
  const navigate = useNavigate();

  return (
    <OnboardingLayout
      title="대기실"
      heading="구성원을 기다리고 있어요"
      description="더 기다리거나, 지금 바로 시작할 수 있어요."
      footer={
        <BottomButton onClick={() => navigate(ONBOARDING_PATHS.chores)}>
          집안일 고르러 가기
        </BottomButton>
      }
    />
  );
}

export default S03WaitingPage;
