import { useMutation, useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { useNavigate } from 'react-router';
import { getChorePresets, saveChores } from '@/apis/onboarding';
import StateView from '@/components/common/StateView';
import { MAIN_TEXT, MAX_CHORES } from '@/constants/main';
import { ONBOARDING_PATHS } from '@/routes/onboardingPaths';
import checkboxDefaultIcon from '@/assets/icons/checkbox-default.svg';
import checkboxSelectIcon from '@/assets/icons/checkbox-select.svg';
import { useOnboardingStore } from '@/stores/onboarding';
import { useToastStore } from '@/stores/toast';
import { errorMessage, LOAD_ERROR, RETRY_LABEL } from './apiMessages';
import BottomButton from './components/BottomButton';
import ChoreIcon from './components/ChoreIcon';
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
 * - 최대 10개 (Swagger: 11개 이상이면 COMMON-400). 넘게 고르거나 추가하면 ② 와 같은 토스트 "집안일은 한 집에 10개까지 추가할 수 있어요"
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

  // 서버 한도: 한 집 집안일 최대 10개 (PUT /chores 11개 이상이면 COMMON-400)
  const isFull = selected.length >= MAX_CHORES;
  const warnFull = () => showToast(MAIN_TEXT.houseFullToast);

  const toggle = (chore: string) => {
    if (selected.includes(chore)) return setSelected((prev) => prev.filter((c) => c !== chore));
    if (isFull) return warnFull();
    setSelected((prev) => [...prev, chore]);
  };

  const trimmedDraft = draft.trim();
  const canAdd = isValidText(draft, INPUT_RULES.choreName) && !options.includes(trimmedDraft);

  const addCustom = () => {
    if (!canAdd) return;
    if (isFull) return warnFull();
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
      heading={
        <>
          우리 집 집안일을
          <br />
          골라주세요
        </>
      }
      description="나중에 홈에서 더 추가할 수 있어요."
      footer={
        <BottomButton disabled={selected.length === 0 || save.isPending} onClick={handleNext}>
          {selected.length}개 선택 완료
        </BottomButton>
      }
    >
      {/* 피그마 2-5 S-04: 체크박스 20 · 아이콘 48 · 18px 이름, 항목마다 아래 구분선 */}
      <ul className="mt-6 flex flex-col gap-4">
        {options.map((chore) => {
          const checked = selected.includes(chore);
          return (
            <li key={chore} className="flex flex-col gap-1">
              <button
                type="button"
                role="checkbox"
                aria-checked={checked}
                onClick={() => toggle(chore)}
                className="flex w-full items-center gap-0.5 text-left text-lg leading-[normal] font-semibold text-gray-600"
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
                <ChoreIcon name={chore} />
                {chore}
              </button>
              <span aria-hidden className="h-px bg-line-400" />
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
