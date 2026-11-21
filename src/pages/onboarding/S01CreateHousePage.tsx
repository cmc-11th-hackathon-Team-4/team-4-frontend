import { useNavigate } from 'react-router';
import { ONBOARDING_PATHS } from '@/routes/onboardingPaths';
import BottomButton from './components/BottomButton';
import OnboardingLayout from './components/OnboardingLayout';

/** S-01 집 만들기 (방장) */
function S01CreateHousePage() {
  const navigate = useNavigate();

  return (
    <OnboardingLayout
      title="집 만들기"
      heading="우리 집 이름을 알려주세요"
      description="구성원에게 보여질 이름이에요."
      footer={<BottomButton onClick={() => navigate(ONBOARDING_PATHS.invite)}>다음</BottomButton>}
    />
  );
}

export default S01CreateHousePage;
