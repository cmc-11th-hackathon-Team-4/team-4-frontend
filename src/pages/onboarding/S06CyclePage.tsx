import { useNavigate } from 'react-router';
import { HOME_PATH } from '@/routes/onboardingPaths';
import BottomButton from './components/BottomButton';
import OnboardingLayout from './components/OnboardingLayout';

/** S-06 결산 주기 (방장) */
function S06CyclePage() {
  const navigate = useNavigate();

  return (
    <OnboardingLayout
      title="결산 주기"
      heading="언제마다 새로 나눌까요?"
      description="주기가 끝나면 결산하고 다시 나눠요."
      footer={<BottomButton onClick={() => navigate(HOME_PATH)}>우리 집 시작하기</BottomButton>}
    />
  );
}

export default S06CyclePage;
