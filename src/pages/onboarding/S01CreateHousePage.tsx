import { useState } from 'react';
import { useNavigate } from 'react-router';
import { ONBOARDING_PATHS } from '@/routes/onboardingPaths';
import { useOnboardingStore } from '@/stores/onboarding';
import BottomButton from './components/BottomButton';
import OnboardingLayout from './components/OnboardingLayout';
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
      heading="우리 집 이름을 알려주세요"
      description="구성원에게 보여질 이름이에요."
      footer={
        <BottomButton disabled={!canSubmit} onClick={handleNext}>
          다음
        </BottomButton>
      }
    >
      <label className="mt-8 flex flex-col">
        <span className="text-sm text-neutral-500">집 이름</span>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          maxLength={INPUT_RULES.houseName.max}
          placeholder="302호 우리집"
          className="h-12 border-b-2 border-neutral-300 text-xl font-semibold outline-none focus:border-neutral-900"
        />
      </label>
      <p className="mt-3 flex gap-2 text-sm text-neutral-500">
        <span aria-hidden>ⓘ</span>
        구성원 모두에게 보이는 이름이에요. 나중에 마이페이지에서 바꿀 수 있어요.
      </p>
    </OnboardingLayout>
  );
}

export default S01CreateHousePage;
