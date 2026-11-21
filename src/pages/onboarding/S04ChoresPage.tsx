import { useState } from 'react';
import { useNavigate } from 'react-router';
import { ONBOARDING_PATHS } from '@/routes/onboardingPaths';
import checkboxDefaultIcon from '@/assets/icons/checkbox-default.svg';
import checkboxSelectIcon from '@/assets/icons/checkbox-select.svg';
import { useOnboardingStore } from '@/stores/onboarding';
import BottomButton from './components/BottomButton';
import OnboardingLayout from './components/OnboardingLayout';
import { DEFAULT_CHORES } from './constants';
import { INPUT_RULES, isValidText } from './validation';

/**
 * S-04 집안일 고르기 (권한: 방장 확정)
 * - 기본 목록 체크 + 직접 추가, 1개 이상 골라야 [N개 선택 완료]가 눌리고 S-06으로 이동
 * - TODO(API): 고른 집안일 목록 저장
 * - 참여자와 함께 고르기는 부가 기능이라 보류
 */
function S04ChoresPage() {
  const navigate = useNavigate();
  const savedChores = useOnboardingStore((s) => s.selectedChores);
  const setSelectedChores = useOnboardingStore((s) => s.setSelectedChores);

  // 직접 추가한 항목도 목록에 남도록 기본 목록 + 이전 선택을 합침
  const [options, setOptions] = useState(() => [
    ...DEFAULT_CHORES,
    ...savedChores.filter((c) => !DEFAULT_CHORES.includes(c)),
  ]);
  const [selected, setSelected] = useState<string[]>(savedChores);
  const [isAdding, setIsAdding] = useState(false);
  const [draft, setDraft] = useState('');

  const toggle = (chore: string) =>
    setSelected((prev) =>
      prev.includes(chore) ? prev.filter((c) => c !== chore) : [...prev, chore],
    );

  const trimmedDraft = draft.trim();
  const canAdd = isValidText(draft, INPUT_RULES.choreName) && !options.includes(trimmedDraft);

  const addCustom = () => {
    if (!canAdd) return;
    setOptions((prev) => [...prev, trimmedDraft]);
    setSelected((prev) => [...prev, trimmedDraft]);
    setDraft('');
    setIsAdding(false);
  };

  const handleNext = () => {
    setSelectedChores(selected);
    navigate(ONBOARDING_PATHS.cycle);
  };

  return (
    <OnboardingLayout
      title="집안일 고르기"
      heading="우리 집 집안일을 골라주세요"
      description="나중에 홈에서 더 추가할 수 있어요."
      footer={
        <BottomButton disabled={selected.length === 0} onClick={handleNext}>
          {selected.length}개 선택 완료
        </BottomButton>
      }
    >
      <ul className="mt-6 flex flex-col">
        {options.map((chore) => {
          const checked = selected.includes(chore);
          return (
            <li key={chore}>
              <button
                type="button"
                role="checkbox"
                aria-checked={checked}
                onClick={() => toggle(chore)}
                className="flex h-15 w-full items-center gap-4 text-left"
              >
                {/* 피그마 Components · checkbox_1 (default / select) */}
                <span
                  aria-hidden
                  className={`size-5 shrink-0 rounded-full ${checked ? 'bg-primary-500' : ''}`}
                >
                  <img
                    src={checked ? checkboxSelectIcon : checkboxDefaultIcon}
                    alt=""
                    width={20}
                    height={20}
                  />
                </span>
                {chore}
              </button>
            </li>
          );
        })}
      </ul>

      {isAdding ? (
        <form
          className="mt-2 flex items-center gap-2"
          onSubmit={(e) => {
            e.preventDefault();
            addCustom();
          }}
        >
          <input
            autoFocus
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            maxLength={INPUT_RULES.choreName.max}
            placeholder="집안일 이름"
            aria-label="직접 추가할 집안일 이름"
            className="h-12 flex-1 border-b-2 border-neutral-300 outline-none focus:border-neutral-900"
          />
          <button
            type="submit"
            disabled={!canAdd}
            className="h-10 rounded-lg px-3 text-sm font-semibold disabled:opacity-40"
          >
            추가
          </button>
        </form>
      ) : (
        <button
          type="button"
          onClick={() => setIsAdding(true)}
          className="flex h-15 items-center gap-4 text-left text-neutral-600"
        >
          <span aria-hidden className="flex size-6.5 items-center justify-center text-xl">
            +
          </span>
          직접 추가
        </button>
      )}
    </OnboardingLayout>
  );
}

export default S04ChoresPage;
