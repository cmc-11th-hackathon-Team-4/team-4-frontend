import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router';
import { ONBOARDING_PATHS } from '@/routes/onboardingPaths';
import { useOnboardingStore } from '@/stores/onboarding';
import type { CharacterId } from '@/types/member';
import BottomButton from './components/BottomButton';
import CharacterPicker from './components/CharacterPicker';
import OnboardingLayout from './components/OnboardingLayout';
import UnderlineInput from './components/UnderlineInput';
import { ONBOARDING_STEP_TOTAL } from './constants';
import { INPUT_RULES, isValidText } from './validation';

/** 처음 보이는 캐릭터 (피그마 시안에서 선택된 보라 캐릭터) */
const DEFAULT_CHARACTER: CharacterId = '5';

/**
 * P-01 프로필 만들기 (권한: 모두) — 피그마 비주얼 시안 기준
 * - S-14에서 ?next=create → S-01 집 만들기, ?next=join → S-13 코드로 참여
 * - 프로필 수정 모드(④ 마이)는 ④ 담당. CharacterPicker 재사용 가능
 * - TODO(API): POST /api/v1/users 로 프로필 저장 후 이동
 */
function P01ProfilePage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const nextPath =
    searchParams.get('next') === 'join' ? ONBOARDING_PATHS.join : ONBOARDING_PATHS.create;

  const savedCharacter = useOnboardingStore((s) => s.character);
  const saveCharacter = useOnboardingStore((s) => s.setCharacter);

  const [character, setCharacter] = useState<CharacterId>(savedCharacter ?? DEFAULT_CHARACTER);
  const [name, setName] = useState('');

  const canSubmit = isValidText(name, INPUT_RULES.profileName);

  const handleNext = () => {
    saveCharacter(character);
    navigate(nextPath);
  };

  return (
    <OnboardingLayout
      title="프로필 만들기"
      step={{ current: 1, total: ONBOARDING_STEP_TOTAL }}
      heading={
        <>
          집안일에 참여하기 전
          <br />
          <span className="text-primary-500">닉네임</span>과{' '}
          <span className="text-primary-500">캐릭터</span>를 정해주세요
        </>
      }
      description="정한 이름과 캐릭터는 우리 집 구성원에게 보여요."
      footer={
        <BottomButton disabled={!canSubmit} onClick={handleNext}>
          다음
        </BottomButton>
      }
    >
      <div className="mt-8">
        <CharacterPicker value={character} onChange={setCharacter} />
      </div>

      <UnderlineInput
        className="mt-13"
        label="이름"
        value={name}
        onChange={setName}
        maxLength={INPUT_RULES.profileName.max}
        placeholder="이름을 정해주세요."
        helperText="0~10글자 · 메인에서 캐릭터와 함께 보여요."
      />
    </OnboardingLayout>
  );
}

export default P01ProfilePage;
