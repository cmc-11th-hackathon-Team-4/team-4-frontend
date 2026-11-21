import { type ReactNode, useState } from 'react';
import { useNavigate } from 'react-router';
import StateView from '@/components/common/StateView';
import TabBar from '@/components/common/TabBar';
import { IconChevronLeft, IconChevronRight } from '@/components/common/icons';
import { useGroupBoard } from '@/hooks/useGroupBoard';
import { useHouseCycle } from '@/hooks/useHouseSettings';
import { useEndCycle } from '@/hooks/useWeekly';
import { MYPAGE_PATHS } from '@/routes/mypagePaths';
import { WEEKLY_PATHS } from '@/routes/weeklyPaths';
import type { SettlementCycle } from '@/stores/onboarding';
import { useToastStore } from '@/stores/toast';
import { MAX_MEMBERS } from '@/types/group';
import { formatMonthDay } from '@/utils/date';
import AddChoreSheet from './components/AddChoreSheet';
import ChoreListSheet from './components/ChoreListSheet';
import ExtendCycleSheet from './components/ExtendCycleSheet';

const CYCLE_LABEL: Record<SettlementCycle, string> = {
  weekly: '매주',
  biweekly: '2주',
  monthly: '한 달',
};

/** 시연 메뉴 표시. .env에 VITE_DEMO_MENU=false 넣으면 숨김 */
const SHOW_DEMO_MENU = import.meta.env.VITE_DEMO_MENU !== 'false';

type Sheet = 'add' | 'list' | 'extend' | null;

/**
 * V5-12 우리 집 설정 (권한: 모두 · 결산 기간은 방장)
 * - 진입: M-01 [우리 집 설정], V5-01 톱니
 * - 집안일 추가(V5-13) · 목록, 결산 주기 · 이번 기간 늘리기(V5-14), 초대 코드 복사 · 구성원 수, 시연용 기간 종료
 */
function V512HouseSettingsPage() {
  const navigate = useNavigate();
  const showToast = useToastStore((s) => s.show);
  const { group, me, isLoading, isError, refetch } = useGroupBoard();
  const cycle = useHouseCycle();
  const endCycle = useEndCycle();
  const [sheet, setSheet] = useState<Sheet>(null);

  if (isLoading || cycle.isLoading) return <StateView type="loading" />;
  if (isError || cycle.isError) {
    return (
      <StateView
        type="error"
        message="우리 집 정보를 불러오지 못했어요"
        retryLabel="다시 시도"
        onRetry={() => {
          refetch();
          cycle.refetch();
        }}
      />
    );
  }
  if (!group || !me || !cycle.data) {
    return <StateView type="error" message="아직 우리 집이 없어요" />;
  }

  const isHost = me.isHost;
  const { endDate } = cycle.data;

  const copyInviteCode = async () => {
    try {
      await navigator.clipboard.writeText(group.inviteCode);
      showToast('초대 코드를 복사했어요');
    } catch {
      showToast('복사하지 못했어요');
    }
  };

  const endPeriod = () =>
    endCycle.mutate(undefined, {
      onSuccess: () => navigate(WEEKLY_PATHS.summary),
      onError: () => showToast('기간을 종료하지 못했어요. 다시 시도해주세요'),
    });

  return (
    <div className="flex flex-1 flex-col bg-line-300">
      <header className="grid h-14 grid-cols-[40px_1fr_40px] items-center px-2">
        <button
          type="button"
          aria-label="뒤로가기"
          onClick={() => navigate(-1)}
          className="flex size-10 items-center justify-center text-gray-800"
        >
          <IconChevronLeft size={24} />
        </button>
        <h1 className="text-center text-lg font-semibold text-gray-800">우리 집 설정</h1>
      </header>

      <main className="flex flex-1 flex-col px-4 pb-6">
        <Section label="집안일">
          <Row label="집안일 추가" onClick={() => setSheet('add')} />
          <Row
            label="집안일 목록"
            value={`${group.chores.length}개`}
            onClick={() => setSheet('list')}
          />
        </Section>

        {/* 방장이 아니면 흐리게 보여주고 못 누름 */}
        <Section label="결산 기간 · 방장">
          <Row
            label="결산 주기"
            value={CYCLE_LABEL[cycle.data.cycle]}
            disabled={!isHost}
            // TODO: 주기 변경 화면 명세 나오면 연결
            onClick={() => showToast('준비 중이에요')}
          />
          <Row
            label="이번 기간 늘리기"
            value={`${formatMonthDay(endDate)}까지`}
            disabled={!isHost}
            onClick={() => setSheet('extend')}
          />
        </Section>

        <Section label="구성원">
          <Row
            label="초대 코드"
            onClick={copyInviteCode}
            trailing={
              <span className="flex items-center gap-2">
                <span className="text-base font-semibold text-gray-900">{group.inviteCode}</span>
                <CopyIcon />
              </span>
            }
          />
          <Row
            label="구성원"
            value={`${group.members.length} / ${MAX_MEMBERS}명`}
            onClick={() => navigate(MYPAGE_PATHS.my)}
          />
        </Section>

        {SHOW_DEMO_MENU && (
          <>
            <p className="mt-6 mb-2 px-1 text-xs text-gray-500">시연</p>
            <button
              type="button"
              disabled={!isHost || endCycle.isPending}
              onClick={endPeriod}
              className="flex items-center justify-between rounded-xl border border-dashed border-line-900 bg-white px-4 py-4 text-left disabled:opacity-40"
            >
              <span className="text-base text-gray-900">
                {endCycle.isPending ? '종료하는 중' : '기간 종료하기'}
              </span>
              <span className="text-xs text-gray-500">시연용 · 숨김</span>
            </button>
          </>
        )}
      </main>

      <TabBar />

      {sheet === 'add' && <AddChoreSheet onClose={() => setSheet(null)} />}
      {sheet === 'list' && <ChoreListSheet group={group} onClose={() => setSheet(null)} />}
      {sheet === 'extend' && <ExtendCycleSheet endDate={endDate} onClose={() => setSheet(null)} />}
    </div>
  );
}

function Section({ label, children }: { label: string; children: ReactNode }) {
  return (
    <section className="mt-4">
      <p className="mb-2 px-1 text-xs text-gray-500">{label}</p>
      <div className="divide-y divide-line-600 rounded-xl bg-white">{children}</div>
    </section>
  );
}

function Row({
  label,
  value,
  trailing,
  disabled = false,
  onClick,
}: {
  label: string;
  value?: string;
  trailing?: ReactNode;
  disabled?: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className="flex w-full items-center justify-between px-4 py-4 text-left disabled:opacity-40"
    >
      <span className="text-base text-gray-900">{label}</span>
      {trailing ?? (
        <span className="flex items-center gap-1 text-sm text-gray-500">
          {value}
          <IconChevronRight size={18} className="text-gray-400" />
        </span>
      )}
    </button>
  );
}

function CopyIcon() {
  return (
    <svg
      width={18}
      height={18}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      className="text-gray-500"
      aria-hidden
    >
      <rect x="8" y="8" width="12" height="12" rx="2" />
      <path d="M16 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2" />
    </svg>
  );
}

export default V512HouseSettingsPage;
