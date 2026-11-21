import { useNavigate } from 'react-router';
import welcomeIllustration from '@/assets/illustrations/welcome.png';
import { ONBOARDING_PATHS } from '@/routes/onboardingPaths';
import BottomButton from './components/BottomButton';
import OnboardingLayout from './components/OnboardingLayout';
import { useMe } from './useMyHouse';

/**
 * S-14 홈 · 집 없음 (권한: 모두)
 * - 집이 없을 때만 보이는 홈. 집 있음 → V5-01 분기는 가드에서 처리 (② 담당과 협의, API 필요)
 * - "프로필 있음?": 있으면 P-01을 건너뛰고 S-01 / S-13, 없으면 P-01을 먼저 거침
 *   (서버 기준 GET /api/v1/users/me. 아직 모르거나 실패하면 P-01 로 — P-01 은 이미 등록된 기기면 서버 프로필로 이어감)
 */
function S14WelcomePage() {
  const navigate = useNavigate();

  const hasProfile = useMe().data !== undefined;

  const goProfile = (next: 'create' | 'join') => {
    if (hasProfile) {
      navigate(next === 'join' ? ONBOARDING_PATHS.join : ONBOARDING_PATHS.create);
      return;
    }
    navigate(`${ONBOARDING_PATHS.profileNew}?next=${next}`);
  };

  return (
    <OnboardingLayout
      showBack={false}
      footer={
        // 피그마 2-5 S-14: 밑줄 텍스트 링크(14px)가 주 버튼 위
        <div className="flex flex-col items-center gap-4">
          <button
            type="button"
            onClick={() => goProfile('join')}
            className="py-1 text-sm leading-[normal] font-medium text-gray-600 underline"
          >
            초대코드가 있어요
          </button>
          <BottomButton onClick={() => goProfile('create')}>집 만들기</BottomButton>
        </div>
      }
    >
      {/* 피그마 2-5 S-14: 가운데 정렬 굵은 제목 두 줄 + 설명, 아래 캐릭터 일러스트 370×405 */}
      <div className="mt-6 flex flex-col items-center gap-4 text-center leading-[normal]">
        <h2 className="text-[28px] font-bold text-gray-800">
          같이 사는 사람과
          <br />
          우리집 집안일 나눠볼까요?
        </h2>
        <p className="text-base font-medium text-gray-500">집을 만들고 구성원을 초대해 보세요.</p>
      </div>
      <img
        src={welcomeIllustration}
        alt="캐릭터 일러스트"
        width={370}
        height={405}
        className="mx-auto mt-6 h-auto w-full max-w-[370px] mix-blend-multiply"
      />
    </OnboardingLayout>
  );
}

export default S14WelcomePage;
