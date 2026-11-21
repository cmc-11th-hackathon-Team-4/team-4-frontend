import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router';
import { ONBOARDING_PATHS } from '@/routes/onboardingPaths';
import { CHARACTER_COUNT, type CharacterId } from '@/types/member';
import BottomButton from './components/BottomButton';
import OnboardingLayout from './components/OnboardingLayout';
import { INPUT_RULES, isValidText } from './validation';

/** 캐릭터 값 형식은 서버 확정 전까지 '1'~'4' */
const CHARACTERS: CharacterId[] = Array.from({ length: CHARACTER_COUNT }, (_, i) => String(i + 1));

/**
 * P-01 프로필 만들기 (권한: 모두)
 * - S-14에서 ?next=create → S-01 집 만들기, ?next=join → S-13 코드로 참여
 * - TODO(API): 프로필 저장 후 이동
 */
function P01ProfilePage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const nextPath =
    searchParams.get('next') === 'join' ? ONBOARDING_PATHS.join : ONBOARDING_PATHS.create;

  const [character, setCharacter] = useState<CharacterId | null>(null);
  const [name, setName] = useState('');

  const canSubmit = character !== null && isValidText(name, INPUT_RULES.profileName);

  return (
    <OnboardingLayout
      title="프로필 만들기"
      heading="어떤 캐릭터로 함께할까요?"
      description="같은 캐릭터여도 이름으로 구분돼요."
      footer={
        <BottomButton disabled={!canSubmit} onClick={() => navigate(nextPath)}>
          프로필 만들고 계속하기
        </BottomButton>
      }
    >
      <div className="mt-6 grid grid-cols-2 gap-3">
        {CHARACTERS.map((id) => (
          <button
            key={id}
            type="button"
            aria-pressed={character === id}
            onClick={() => setCharacter(id)}
            className={`flex aspect-square flex-col items-center justify-center rounded-2xl border-2 bg-neutral-100 text-sm ${
              character === id ? 'border-neutral-900' : 'border-transparent'
            }`}
          >
            캐릭터 {id}
          </button>
        ))}
      </div>

      <label className="mt-6 flex flex-col gap-2">
        <span className="text-sm font-semibold">이름</span>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          maxLength={INPUT_RULES.profileName.max}
          placeholder="수아"
          className="h-12 rounded-xl border border-neutral-300 px-4 text-base"
        />
        <span className="text-xs text-neutral-500">1~10자 · 메인에서 캐릭터와 함께 보여요.</span>
      </label>
    </OnboardingLayout>
  );
}

export default P01ProfilePage;
