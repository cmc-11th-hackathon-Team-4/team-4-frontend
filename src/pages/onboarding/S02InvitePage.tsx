import { useNavigate } from 'react-router';
import { ONBOARDING_PATHS } from '@/routes/onboardingPaths';
import BottomButton from './components/BottomButton';
import OnboardingLayout from './components/OnboardingLayout';

/** S-02 초대장 만들기 (방장) */
function S02InvitePage() {
  const navigate = useNavigate();

  return (
    <OnboardingLayout
      title="초대장 만들기"
      heading="같이 사는 사람에게 초대장을 보내주세요"
      description="초대 코드를 받은 사람만 들어올 수 있어요."
      footer={
        <BottomButton onClick={() => navigate(ONBOARDING_PATHS.waiting)}>
          초대장 보내기
        </BottomButton>
      }
    />
  );
}

export default S02InvitePage;
