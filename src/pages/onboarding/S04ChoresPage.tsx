import { useMutation, useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { useNavigate } from 'react-router';
import { getChorePresets, saveChores } from '@/apis/onboarding';
import StateView from '@/components/common/StateView';
import { ONBOARDING_PATHS } from '@/routes/onboardingPaths';
import checkboxDefaultIcon from '@/assets/icons/checkbox-default.svg';
import checkboxSelectIcon from '@/assets/icons/checkbox-select.svg';
import { useOnboardingStore } from '@/stores/onboarding';
import { useToastStore } from '@/stores/toast';
import { errorMessage, LOAD_ERROR, RETRY_LABEL } from './apiMessages';
import BottomButton from './components/BottomButton';
import OnboardingLayout from './components/OnboardingLayout';
import { ONBOARDING_STEP_TOTAL } from './constants';
import { onboardingKeys } from './queryKeys';
import { useMe } from './useMyHouse';
import { INPUT_RULES, isValidText } from './validation';

/**
 * S-04 집안일 고르기 (권한: 방장 확정)
 * - 기본 목록 체크 + 직접 추가, 1개 이상 골라야 [N개 선택 완료]가 눌리고 S-06으로 이동
 * - 기본 목록: GET /api/v1/chore-presets (못 불러오면 "다시 시도")
 * - [N개 선택 완료]: PUT /api/v1/houses/{id}/chores 로 저장 (보낸 목록이 최종 목록) 후 S-06
 * - 참여자와 함께 고르기는 부가 기능이라 보류
 */
function S04ChoresPage() {
  const presets = useQuery({ queryKey: onboardingKeys.presets, queryFn: getChorePresets });
  const me = useMe();
  const houseId = me.data?.house ? String(me.data.house.id) : null;

  if (presets.isLoading || me.isLoading) return <StateView type="loading" />;
  if (presets.isError || !presets.data || !houseId) {
    return (
      <StateView
        type="error"
        message={LOAD_ERROR}
        retryLabel={RETRY_LABEL}
        onRetry={() => (presets.isError ? presets.refetch() : me.refetch())}
      />
    );
  }
  return <ChoreForm presets={presets.data} houseId={houseId} />;
}

function ChoreForm({ presets, houseId }: { presets: string[]; houseId: string }) {
  const navigate = useNavigate();
  const showToast = useToastStore((s) => s.show);
  const savedChores = useOnboardingStore((s) => s.selectedChores);
  const setSelectedChores = useOnboardingStore((s) => s.setSelectedChores);

  // 직접 추가한 항목도 목록에 남도록 기본 목록 + 이전 선택을 합침
  const [options, setOptions] = useState(() => [
    ...presets,
    ...savedChores.filter((c) => !presets.includes(c)),
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

  const save = useMutation({
    mutationFn: () => saveChores(houseId, selected),
    onSuccess: () => {
      setSelectedChores(selected);
      navigate(ONBOARDING_PATHS.cycle);
    },
    onError: (error) => showToast(errorMessage(error)),
  });

  const handleNext = () => save.mutate();

  return (
    <OnboardingLayout
      title="집안일 고르기"
      step={{ current: 5, total: ONBOARDING_STEP_TOTAL }}
      heading="우리 집 집안일을 골라주세요"
      description="나중에 홈에서 더 추가할 수 있어요."
      footer={
        <BottomButton disabled={selected.length === 0 || save.isPending} onClick={handleNext}>
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
