import { useState } from 'react';
import { useNavigate } from 'react-router';
import BottomButton from '@/components/common/BottomButton';
import StateView from '@/components/common/StateView';
import AddChoreSheet from '@/components/main/AddChoreSheet';
import LoadGauge from '@/components/main/LoadGauge';
import MainHeader from '@/components/main/MainHeader';
import MemberRail from '@/components/main/MemberRail';
import NoticeCard from '@/components/main/NoticeCard';
import SpeechBubble from '@/components/main/SpeechBubble';
import StatusTabs from '@/components/main/StatusTabs';
import ThanksCard from '@/components/main/ThanksCard';
import TodayChores from '@/components/main/TodayChores';
import { MAIN_TEXT } from '@/constants/main';
import { STATUS_BUBBLE, STATUS_NOTICE } from '@/constants/status';
import { useDevSession } from '@/hooks/useDevSession';
import { useGroupBoard } from '@/hooks/useGroupBoard';
import { useMainMutations } from '@/hooks/useMainMutations';
import { useNotifications } from '@/hooks/useNotifications';
import { MAIN_PATHS } from '@/routes/mainPaths';
import { ONBOARDING_PATHS } from '@/routes/onboardingPaths';
import { MAX_MEMBERS } from '@/types/group';
import type { Member } from '@/types/member';

const NOTICE_PRIORITY = { unwilling: 0, tired: 1, relaxed: 2 } as const;

/** V3-01 내 메인 */
function MainPage() {
  useDevSession();
  const navigate = useNavigate();
  const { group, me, myId, choresOf, pendingCountOf, isLoading, isError, refetch } =
    useGroupBoard();
  const { status, toggleDone, add } = useMainMutations();
  const { pendingThanks, heartsReceived, heart } = useNotifications();
  const [sheetOpen, setSheetOpen] = useState(false);

  if (isLoading || (!group && !isError)) return <StateView type="loading" />;
  if (isError || !group || !me || !myId) {
    return (
      <StateView
        type="error"
        message={MAIN_TEXT.loadError}
        retryLabel={MAIN_TEXT.retry}
        onRetry={refetch}
      />
    );
  }

  // 도움이 필요한 구성원: 고르기 싫음 > 지침, 같으면 짐 많은 순
  const needHelp: Member | undefined = group.members
    .filter((m) => m.id !== myId && m.status !== 'relaxed')
    .sort(
      (a, b) =>
        NOTICE_PRIORITY[a.status] - NOTICE_PRIORITY[b.status] ||
        pendingCountOf(b.id) - pendingCountOf(a.id),
    )[0];

  const myCount = pendingCountOf(myId);
  const nameOf = (id: string) => group.members.find((m) => m.id === id)?.nickname ?? '';
  const choreNameOf = (id?: string) => group.chores.find((c) => c.id === id)?.name ?? '';
  const thanksTarget = pendingThanks.at(-1);

  return (
    <div className="flex flex-1 flex-col">
      <MainHeader
        title={MAIN_TEXT.homeTitle}
        inviteLabel={MAIN_TEXT.invite(group.members.length, MAX_MEMBERS)}
        onInvite={() => navigate(ONBOARDING_PATHS.invite)}
      />

      <main className="flex flex-1 flex-col gap-4 px-4 pb-4">
        <div className="flex gap-2 pt-2">
          <div className="min-w-0 flex-1">
            <SpeechBubble text={STATUS_BUBBLE[me.status]} />
            <div className="mt-6">
              <LoadGauge
                count={myCount}
                status={me.status}
                caption={MAIN_TEXT.gaugeCaption(true, me.nickname, myCount)}
                hearts={heartsReceived.length}
              />
            </div>
          </div>
          <div className="shrink-0">
            <MemberRail
              members={group.members}
              myId={myId}
              activeId={myId}
              countOf={pendingCountOf}
              onSelect={(id) => id !== myId && navigate(MAIN_PATHS.member(id))}
            />
          </div>
        </div>

        <StatusTabs
          value={me.status}
          onChange={(next) => next !== me.status && status.mutate(next)}
        />

        {thanksTarget && (
          <ThanksCard
            text={MAIN_TEXT.takenBy(nameOf(thanksTarget.fromId), choreNameOf(thanksTarget.choreId))}
            disabled={heart.isPending}
            onHeart={() =>
              heart.mutate({ notification: thanksTarget, name: nameOf(thanksTarget.fromId) })
            }
          />
        )}

        {needHelp && STATUS_NOTICE[needHelp.status as keyof typeof STATUS_NOTICE] && (
          <NoticeCard
            title={STATUS_NOTICE[needHelp.status as keyof typeof STATUS_NOTICE](needHelp.nickname)}
            count={pendingCountOf(needHelp.id)}
            onClick={() => navigate(MAIN_PATHS.member(needHelp.id))}
          />
        )}

        <TodayChores chores={choresOf(myId)} onToggle={(chore) => toggleDone.mutate(chore)} />

        <div className="mt-auto">
          <BottomButton onClick={() => setSheetOpen(true)}>{MAIN_TEXT.addChore}</BottomButton>
        </div>
      </main>

      <AddChoreSheet
        open={sheetOpen}
        onClose={() => setSheetOpen(false)}
        onSubmit={(name) => add.mutate(name)}
      />
    </div>
  );
}

export default MainPage;
