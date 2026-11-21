import { useState } from 'react';
import { useNavigate } from 'react-router';
import { ONBOARDING_PATHS } from '@/routes/onboardingPaths';
import { useOnboardingStore } from '@/stores/onboarding';
import BottomButton from './components/BottomButton';
import InfoText from './components/InfoText';
import OnboardingLayout from './components/OnboardingLayout';
import { ONBOARDING_STEP_TOTAL } from './constants';
import UnderlineInput from './components/UnderlineInput';
import { INPUT_RULES, isValidText } from './validation';

/**
 * S-01 집 만들기 (권한: 방장)
 * - 집 이름을 채워야 [다음]이 눌리고, 누르면 S-02로 이동
 * - TODO(API): 집 생성 · 초대 코드 발급 · 방장 저장, 저장 중 버튼 로딩, 실패 시 토스트(입력값 유지)
 */
function S01CreateHousePage() {
  const navigate = useNavigate();
  const savedName = useOnboardingStore((s) => s.houseName);
  const setHouseName = useOnboardingStore((s) => s.setHouseName);
  const setRole = useOnboardingStore((s) => s.setRole);

  const [name, setName] = useState(savedName);
  const canSubmit = isValidText(name, INPUT_RULES.houseName);

  const handleNext = () => {
    setHouseName(name.trim());
    setRole('host');
    navigate(ONBOARDING_PATHS.invite);
  };

  return (
    <OnboardingLayout
      title="집 만들기"
      step={{ current: 2, total: ONBOARDING_STEP_TOTAL }}
      heading="우리 집 이름을 알려주세요"
      description="구성원에게 보여질 이름이에요."
      footer={
        <BottomButton disabled={!canSubmit} onClick={handleNext}>
          다음
        </BottomButton>
      }
    >
      <UnderlineInput
        className="mt-10"
        label="집 이름"
        value={name}
        onChange={setName}
        maxLength={INPUT_RULES.houseName.max}
        placeholder="302호 우리집"
      />
      <InfoText className="mt-2">
        구성원 모두에게 보이는 이름이에요. 나중에 마이페이지에서 바꿀 수 있어요.
      </InfoText>
    </OnboardingLayout>
  );
}

export default S01CreateHousePage;
