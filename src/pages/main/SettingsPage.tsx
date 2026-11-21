import { useState } from 'react';
import { useNavigate } from 'react-router';
import StateView from '@/components/common/StateView';
import TabBar from '@/components/common/TabBar';
import AddChoreSheet from '@/components/main/AddChoreSheet';
import MainHeader from '@/components/main/MainHeader';
import SettingsRow, { SettingsSection } from '@/components/main/SettingsRow';
import { MAIN_TEXT } from '@/constants/main';
import { useDevSession } from '@/hooks/useDevSession';
import { useGroupBoard } from '@/hooks/useGroupBoard';
import { useMainMutations } from '@/hooks/useMainMutations';
import { useEndCycle } from '@/hooks/useWeekly';
import { MAIN_PATHS } from '@/routes/mainPaths';
import { WEEKLY_PATHS } from '@/routes/weeklyPaths';
import { useToastStore } from '@/stores/toast';
import { MAX_MEMBERS } from '@/types/group';
import { isHouseFull, isMemberFull, pendingChores } from '@/apis/limits';
import ExtendCycleSheet from '@/components/main/ExtendCycleSheet';
import { useCycle } from '@/hooks/useCycle';
import { formatMonthDay } from '@/utils/date';

/** 시연 메뉴 노출 여부 (기본 보임) */
const SHOW_DEMO_MENU = import.meta.env.VITE_DEMO_MENU !== 'false';

/** V5-12 우리 집 설정 (+ V5-13 집안일 추가 시트) */
function SettingsPage() {
  useDevSession();
  const navigate = useNavigate();
  const showToast = useToastStore((s) => s.show);
  const { group, me, isLoading, isError, refetch } = useGroupBoard();
  const { add, end, extend } = useMainMutations();
  const weeklyEnd = useEndCycle();
  const { data: cycle } = useCycle();
  const [adding, setAdding] = useState(false);
  const [extending, setExtending] = useState(false);

  if (isLoading || (!group && !isError)) return <StateView type="loading" />;
  if (isError || !group || !me) {
    return (
      <StateView
        type="error"
        message={MAIN_TEXT.loadError}
        retryLabel={MAIN_TEXT.retry}
        onRetry={refetch}
      />
    );
  }

  // 완료한 짐은 빼고 셈: 한 집 10개, 한 사람 5개
  const choreCount = pendingChores(group.chores).length;
  const houseFull = isHouseFull(group.chores);
  const memberFull = isMemberFull(group.chores, me.id);
  /** 다 찼으면 흐리게 보이고, 누르면 이유를 토스트로 안내 */
  const openAddChore = () => {
    if (houseFull) showToast(MAIN_TEXT.houseFullToast);
    else if (memberFull) showToast(MAIN_TEXT.memberFullToast);
    else setAdding(true);
  };

  const copyInviteCode = async () => {
    try {
      await navigator.clipboard.writeText(group.inviteCode);
    } catch {
      showToast(MAIN_TEXT.error);
    }
  };

  return (
    <div className="flex flex-1 flex-col bg-neutral-50">
      <MainHeader showBack title={MAIN_TEXT.settingsTitle} />

      <main className="flex flex-1 flex-col gap-6 px-4 pt-2 pb-6">
        <SettingsSection title={MAIN_TEXT.sectionChores}>
          <SettingsRow
            label={MAIN_TEXT.addChore}
            dimmed={houseFull || memberFull}
            onClick={openAddChore}
          />
          <SettingsRow
            label={MAIN_TEXT.choreList}
            value={MAIN_TEXT.choreCount(choreCount)}
            onClick={() => navigate(MAIN_PATHS.choreList)}
          />
        </SettingsSection>

        {/* 결산 주기 · 기간 늘리기 → V5-14. 방장이 아니면 흐리게 */}
        <SettingsSection title={MAIN_TEXT.sectionCycle}>
          <SettingsRow
            label={MAIN_TEXT.cycle}
            value={cycle ? MAIN_TEXT.cyclePeriod[cycle.period] : undefined}
            disabled={!me.isHost || !cycle}
            onClick={() => setExtending(true)}
          />
          <SettingsRow
            label={MAIN_TEXT.extendCycle}
            value={cycle ? MAIN_TEXT.cycleUntil(formatMonthDay(cycle.endDate)) : undefined}
            disabled={!me.isHost || !cycle}
            onClick={() => setExtending(true)}
          />
        </SettingsSection>

        <SettingsSection title={MAIN_TEXT.sectionMembers}>
          <SettingsRow
            label={MAIN_TEXT.inviteCode}
            value={<span className="font-bold text-neutral-900">{group.inviteCode}</span>}
            trailing={<span className="text-xs text-neutral-400">복사</span>}
            onClick={copyInviteCode}
          />
          <SettingsRow
            label={MAIN_TEXT.members}
            value={MAIN_TEXT.memberCount(group.members.length, MAX_MEMBERS)}
            onClick={() => navigate(MAIN_PATHS.memberList)}
          />
        </SettingsSection>

        {/* 시연용: 배포 때 .env에 VITE_DEMO_MENU=false 로 숨김 (④와 같은 규칙) */}
        {SHOW_DEMO_MENU && (
          <section>
            <h2 className="mb-2 px-1 text-xs text-neutral-500">{MAIN_TEXT.sectionDemo}</h2>
            <button
              type="button"
              disabled={!me.isHost || end.isPending || weeklyEnd.isPending}
              className="flex h-14 w-full items-center rounded-2xl border border-dashed border-neutral-300 px-4 disabled:opacity-40"
              onClick={async () => {
                try {
                  // ② 상대 폰 배너 알림 + ③ 결산 상태를 '종료'로
                  await Promise.all([end.mutateAsync(), weeklyEnd.mutateAsync()]);
                  navigate(WEEKLY_PATHS.summary);
                } catch {
                  // 실패 토스트는 각 뮤테이션에서 처리
                }
              }}
            >
              <span className="flex-1 text-left">{MAIN_TEXT.endCycle}</span>
              <span className="text-xs text-neutral-400">{MAIN_TEXT.endCycleTag}</span>
            </button>
          </section>
        )}
      </main>

      <TabBar />

      {extending && cycle && (
        <ExtendCycleSheet
          endDate={cycle.endDate}
          onClose={() => setExtending(false)}
          onSubmit={(days) => extend.mutateAsync(days)}
        />
      )}

      {adding && (
        <AddChoreSheet
          onClose={() => setAdding(false)}
          onSubmit={(name) => add.mutateAsync(name)}
        />
      )}
    </div>
  );
}

export default SettingsPage;
