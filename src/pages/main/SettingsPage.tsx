import { useState } from 'react';
import { useNavigate } from 'react-router';
import StateView from '@/components/common/StateView';
import TabBar from '@/components/common/TabBar';
import AddChoreSheet from '@/components/main/AddChoreSheet';
import MainHeader from '@/components/main/MainHeader';
import SettingsRow, { SettingsSection } from '@/components/main/SettingsRow';
import { MAIN_TEXT, MAX_CHORES } from '@/constants/main';
import { useDevSession } from '@/hooks/useDevSession';
import { useGroupBoard } from '@/hooks/useGroupBoard';
import { useMainMutations } from '@/hooks/useMainMutations';
import { MAIN_PATHS } from '@/routes/mainPaths';
import { WEEKLY_PATHS } from '@/routes/weeklyPaths';
import { useToastStore } from '@/stores/toast';
import { MAX_MEMBERS } from '@/types/group';

/** V5-12 우리 집 설정 (+ V5-13 집안일 추가 시트) */
function SettingsPage() {
  useDevSession();
  const navigate = useNavigate();
  const showToast = useToastStore((s) => s.show);
  const { group, me, isLoading, isError, refetch } = useGroupBoard();
  const { add, end } = useMainMutations();
  const [adding, setAdding] = useState(false);

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

  const choreCount = group.chores.length;
  const isFull = choreCount >= MAX_CHORES;

  const copyInviteCode = async () => {
    try {
      await navigator.clipboard.writeText(group.inviteCode);
      showToast(MAIN_TEXT.inviteCopied);
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
            disabled={isFull}
            onClick={() => setAdding(true)}
          />
          <SettingsRow
            label={MAIN_TEXT.choreList}
            value={MAIN_TEXT.choreCount(choreCount)}
            onClick={() => navigate(MAIN_PATHS.choreList)}
          />
        </SettingsSection>

        {/* TODO: 결산 주기 · 기간 늘리기(V5-14, 부가)는 아직 표시만. 방장이 아니면 흐리게 */}
        <SettingsSection title={MAIN_TEXT.sectionCycle}>
          <SettingsRow
            label={MAIN_TEXT.cycle}
            value={MAIN_TEXT.cycleWeekly}
            disabled={!me.isHost}
          />
          <SettingsRow label={MAIN_TEXT.extendCycle} disabled={!me.isHost} />
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
          />
        </SettingsSection>

        {/* 시연용: 배포 때 뺄 가능성 높음 */}
        <section>
          <h2 className="mb-2 px-1 text-xs text-neutral-500">{MAIN_TEXT.sectionDemo}</h2>
          <button
            type="button"
            disabled={!me.isHost || end.isPending}
            className="flex h-14 w-full items-center rounded-2xl border border-dashed border-neutral-300 px-4 disabled:opacity-40"
            onClick={() =>
              end.mutate(undefined, { onSuccess: () => navigate(WEEKLY_PATHS.summary) })
            }
          >
            <span className="flex-1 text-left">{MAIN_TEXT.endCycle}</span>
            <span className="text-xs text-neutral-400">{MAIN_TEXT.endCycleTag}</span>
          </button>
        </section>
      </main>

      <TabBar />

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
