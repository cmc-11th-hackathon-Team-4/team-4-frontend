import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router';
import { createDistribution, type ServerSettlementCycle } from '@/apis/onboarding';
import { ONBOARDING_PATHS } from '@/routes/onboardingPaths';
import { useOnboardingStore, type SettlementCycle } from '@/stores/onboarding';
import { useToastStore } from '@/stores/toast';
import { errorMessage } from './apiMessages';
import BottomButton from './components/BottomButton';
import InfoText from './components/InfoText';
import OnboardingLayout from './components/OnboardingLayout';
import { ONBOARDING_STEP_TOTAL } from './constants';
import { formatDate, parseDate, todayString, weekdayOf } from './date';
import { onboardingKeys } from './queryKeys';
import { useMe } from './useMyHouse';

const CYCLE_OPTIONS: { value: SettlementCycle; label: string }[] = [
  { value: 'weekly', label: '매주' },
  { value: 'biweekly', label: '2주' },
  { value: 'monthly', label: '한 달' },
];

/** 앱 주기 값 → 서버 값 (settlementCycle) */
const SERVER_CYCLE: Record<SettlementCycle, ServerSettlementCycle> = {
  weekly: 'WEEKLY',
  biweekly: 'BIWEEKLY',
  monthly: 'MONTHLY',
};

/** 고른 주기에 맞춘 안내 문구 (명세 예시: 매주 월요일 0시에 결산하고 다시 나눠요.) */
function getCycleGuide(cycle: SettlementCycle, startDate: string) {
  const weekday = weekdayOf(startDate);
  if (cycle === 'weekly') return `매주 ${weekday}요일 0시에 결산하고 다시 나눠요.`;
  if (cycle === 'biweekly') return `2주마다 ${weekday}요일 0시에 결산하고 다시 나눠요.`;
  return `매달 ${parseDate(startDate).getDate()}일 0시에 결산하고 다시 나눠요.`;
}

/**
 * S-06 결산 주기 (권한: 방장)
 * - 주기 매주 / 2주 / 한 달 (기본 매주), 시작 날짜는 오늘 이후만
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

  const save = useMutation({
    mutationFn: () =>
      createDistribution(houseId!, { settlementCycle: SERVER_CYCLE[cycle], startDate }),
    onSuccess: (distribution) => {
      queryClient.setQueryData(onboardingKeys.distribution(houseId!), distribution);
      queryClient.invalidateQueries({ queryKey: onboardingKeys.me });
      navigate(ONBOARDING_PATHS.assign);
    },
    onError: (error) => showToast(errorMessage(error)),
  });

  const handleStart = () => save.mutate();

  return (
    <OnboardingLayout
      title="집안일 배분하기"
      step={{ current: 6, total: ONBOARDING_STEP_TOTAL }}
      heading="언제마다 새로 나눌까요?"
      description="주기가 끝나면 결산하고 다시 나눠요."
      footer={
        <BottomButton disabled={!houseId || save.isPending} onClick={handleStart}>
          우리 집 시작하기
        </BottomButton>
      }
    >
      <label className="mt-8 flex flex-col">
        <span className="text-sm text-neutral-500">결산 주기</span>
        <select
          value={cycle}
          onChange={(e) => setCycle(e.target.value as SettlementCycle)}
          className="h-12 appearance-none border-b-2 border-neutral-300 bg-transparent text-xl font-semibold outline-none focus:border-neutral-900"
        >
          {CYCLE_OPTIONS.map(({ value, label }) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
      </label>

      <label className="relative mt-8 flex flex-col">
        <span className="text-sm text-neutral-500">시작 날짜</span>
        <span className="flex h-12 items-center border-b-2 border-neutral-300 text-xl font-semibold">
          {formatDate(startDate)}
        </span>
        {/* 표시는 위 텍스트, 선택은 투명한 날짜 입력으로 (기기 기본 날짜 선택기) */}
        <input
          type="date"
          value={startDate}
          min={today}
          onChange={(e) => e.target.value >= today && setStartDate(e.target.value)}
          aria-label="시작 날짜"
          className="absolute inset-x-0 bottom-0 h-12 opacity-0"
        />
      </label>

      <div className="mt-3 flex flex-col gap-2">
        <InfoText>{getCycleGuide(cycle, startDate)}</InfoText>
        <InfoText>주기는 우리 집 설정에서 바꿀 수 있어요.</InfoText>
      </div>
    </OnboardingLayout>
  );
}

export default S06CyclePage;
