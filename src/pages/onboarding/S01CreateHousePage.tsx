import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { useNavigate } from 'react-router';
import { ApiError } from '@/apis/error';
import { createHouse } from '@/apis/onboarding';
import { ONBOARDING_PATHS } from '@/routes/onboardingPaths';
import { useOnboardingStore } from '@/stores/onboarding';
import { useToastStore } from '@/stores/toast';
import BottomButton from './components/BottomButton';
import OnboardingLayout from './components/OnboardingLayout';
import { errorMessage } from './apiMessages';
import { ONBOARDING_STEP_TOTAL } from './constants';
import { onboardingKeys } from './queryKeys';
import UnderlineInput from './components/UnderlineInput';
import { INPUT_RULES, isValidText } from './validation';

/**
 * S-01 집 만들기 (권한: 방장)
 * - 집 이름을 채워야 [다음]이 눌리고, 누르면 S-02로 이동
 * - POST /api/v1/houses 로 집 생성 (초대 코드 발급, 만든 사람이 방장). 저장 중 버튼 비활성, 실패 시 토스트(입력값 유지)
 * - 이미 집이 있으면(HOUSE-409, 예: S-02에서 뒤로 왔다가 다시 누름) 그 집으로 계속 진행
 */
function S01CreateHousePage() {
  const navigate = useNavigate();
  const savedName = useOnboardingStore((s) => s.houseName);
  const setHouseName = useOnboardingStore((s) => s.setHouseName);
  const setRole = useOnboardingStore((s) => s.setRole);

  const showToast = useToastStore((s) => s.show);
  const queryClient = useQueryClient();

  const [name, setName] = useState(savedName);

  const goNext = () => {
    setHouseName(name.trim());
    setRole('host');
    queryClient.invalidateQueries({ queryKey: onboardingKeys.me });
    navigate(ONBOARDING_PATHS.invite);
  };

  const create = useMutation({
    mutationFn: () => createHouse(name.trim()),
    onSuccess: goNext,
    onError: (error) => {
      if (error instanceof ApiError && error.code === 'HOUSE-409') return goNext();
      showToast(errorMessage(error));
    },
  });

  const canSubmit = isValidText(name, INPUT_RULES.houseName) && !create.isPending;
  const handleNext = () => create.mutate();

  return (
    <OnboardingLayout
      title="집 만들기"
      step={{ current: 2, total: ONBOARDING_STEP_TOTAL }}
      heading={
        <>
          우리가 함께할
          <br />
          집에 이름을 붙여주세요
        </>
      }
      description="가족들이 알아보기 쉬운 이름이면 좋아요."
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
        placeholder="이름을 정해주세요."
        helperText="나중에 마이페이지에서 바꿀 수 있어요."
      />
    </OnboardingLayout>
  );
}

export default S01CreateHousePage;
