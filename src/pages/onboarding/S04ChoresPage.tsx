import { useNavigate } from 'react-router';
import { ONBOARDING_PATHS } from '@/routes/onboardingPaths';
import BottomButton from './components/BottomButton';
import OnboardingLayout from './components/OnboardingLayout';

/** S-04 집안일 고르기 (방장 확정) */
function S04ChoresPage() {
  const navigate = useNavigate();

  return (
    <OnboardingLayout
      title="집안일 고르기"
      heading="우리 집 집안일을 골라주세요"
      description="나중에 홈에서 더 추가할 수 있어요."
      footer={
        <BottomButton onClick={() => navigate(ONBOARDING_PATHS.assign)}>선택 완료</BottomButton>
      }
    />
  );
}

export default S04ChoresPage;
