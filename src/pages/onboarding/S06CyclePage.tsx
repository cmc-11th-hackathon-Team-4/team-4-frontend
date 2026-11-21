import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router';
import { createDistribution } from '@/apis/onboarding';
import { ONBOARDING_PATHS } from '@/routes/onboardingPaths';
import { useOnboardingStore, type SettlementCycle } from '@/stores/onboarding';
import { useToastStore } from '@/stores/toast';
import { errorMessage } from './apiMessages';
import BottomButton from './components/BottomButton';
import SelectUnderline from './components/SelectUnderline';
import OnboardingLayout from './components/OnboardingLayout';
import { ONBOARDING_STEP_TOTAL } from './constants';
import { formatDate, todayString, weekdayOf } from './date';
import { onboardingKeys } from './queryKeys';
import { useMe, useRefreshMe } from './useMyHouse';

const CYCLE_OPTIONS: { value: SettlementCycle; label: string }[] = [
  { value: 7, label: '매주' },
  { value: 3, label: '3일' },
  { value: 1, label: '1일' },
];

/** 고른 주기에 맞춘 안내 문구 (명세 예시: 매주 월요일 0시에 결산하고 다시 나눠요.) */
function getCycleGuide(cycle: SettlementCycle, startDate: string) {
  if (cycle === 7) return `매주 ${weekdayOf(startDate)}요일 0시에 결산하고 다시 나눠요.`;
  if (cycle === 3) return '3일마다 0시에 결산하고 다시 나눠요.';
  return '매일 0시에 결산하고 다시 나눠요.';
}

/**
 * S-06 결산 주기 (권한: 방장)
 * - 주기 매주(7일) / 3일 / 1일 (기본 매주), 시작 날짜는 오늘 이후만 — 서버 settlementCycle 은 일수(1 · 3 · 7)
 * - [우리 집 시작하기] → S-05 랜덤 배분 (명세 순서: S-04 → S-06 → S-05)
 * - POST /api/v1/houses/{id}/distribution (주기 + 시작 날짜) 로 첫 배분을 만들고, 결과를 들고 S-05 로. 실패 시 토스트
 */
function S06CyclePage() {
  const navigate = useNavigate();
  const cycle = useOnboardingStore((s) => s.cycle);
  const setCycle = useOnboardingStore((s) => s.setCycle);
  const savedDate = useOnboardingStore((s) => s.startDate);
  const setStartDate = useOnboardingStore((s) => s.setStartDate);

  const today = todayString();
  const startDate = savedDate && savedDate >= today ? savedDate : today;

  const showToast = useToastStore((s) => s.show);
  const me = useMe();
  const houseId = me.data?.house ? String(me.data.house.id) : null;

  const queryClient = useQueryClient();
  const refreshMe = useRefreshMe();

  const save = useMutation({
    mutationFn: () => createDistribution(houseId!, { settlementCycle: cycle, startDate }),
    onSuccess: (distribution) => {
      queryClient.setQueryData(onboardingKeys.distribution(houseId!), distribution);
      refreshMe();
      navigate(ONBOARDING_PATHS.assign);
    },
    onError: (error) => showToast(errorMessage(error)),
  });

  const handleStart = () => save.mutate();

  return (
    <OnboardingLayout
      title="집안일 배분하기"
      step={{ current: 6, total: ONBOARDING_STEP_TOTAL }}
      heading={
        <>
          언제마다
          <br />
          새로 나눌까요?
        </>
      }
      description="주기가 끝나면 결산하고 다시 나눠요."
      footer={
        <BottomButton disabled={!houseId || save.isPending} onClick={handleStart}>
          우리 집 시작하기
        </BottomButton>
      }
    >
      <SelectUnderline
        className="mt-10"
        label="결산 주기"
        value={CYCLE_OPTIONS.find((o) => o.value === cycle)?.label ?? ''}
        helperText="주기는 우리 집 설정에서 바꿀 수 있어요."
      >
        <select
          value={cycle}
          onChange={(e) => setCycle(Number(e.target.value) as SettlementCycle)}
          aria-label="결산 주기"
        >
          {CYCLE_OPTIONS.map(({ value, label }) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
      </SelectUnderline>

      <SelectUnderline
        className="mt-10"
        label="시작 날짜"
        value={formatDate(startDate)}
        helperText={getCycleGuide(cycle, startDate)}
      >
        <input
          type="date"
          value={startDate}
          min={today}
          onChange={(e) => e.target.value >= today && setStartDate(e.target.value)}
          aria-label="시작 날짜"
        />
      </SelectUnderline>
    </OnboardingLayout>
  );
}

export default S06CyclePage;
