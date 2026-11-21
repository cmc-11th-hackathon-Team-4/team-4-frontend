import { useNavigate } from 'react-router';
import { ONBOARDING_PATHS } from '@/routes/onboardingPaths';
import BottomButton from './components/BottomButton';
import OnboardingLayout from './components/OnboardingLayout';

/** S-13 코드로 참여 (참여자) */
function S13JoinPage() {
  const navigate = useNavigate();

  return (
    <OnboardingLayout
      title="코드로 참여"
      heading="초대 코드를 입력해 주세요"
      description="받은 초대 코드로 우리 집에 들어갈 수 있어요."
      footer={
        <BottomButton onClick={() => navigate(ONBOARDING_PATHS.waiting)}>참여하기</BottomButton>
      }
    />
  );
}

export default S13JoinPage;
