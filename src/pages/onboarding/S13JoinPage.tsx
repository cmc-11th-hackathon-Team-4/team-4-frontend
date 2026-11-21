import { useNavigate } from 'react-router';
import { ONBOARDING_PATHS } from '@/routes/onboardingPaths';
import BottomButton from './components/BottomButton';
import OnboardingLayout from './components/OnboardingLayout';

/**
 * S-13 코드로 참여 (참여자)
 * - 기능명세서·와이어 없음: 화면 문구와 입력 항목은 명세 확정 후 작성
 */
function S13JoinPage() {
  const navigate = useNavigate();

  return (
    <OnboardingLayout
      title="코드로 참여"
      footer={<BottomButton onClick={() => navigate(ONBOARDING_PATHS.waiting)}>다음</BottomButton>}
    />
  );
}

export default S13JoinPage;
