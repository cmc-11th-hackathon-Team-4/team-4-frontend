import { useState } from 'react';
import { Navigate, useNavigate, useParams } from 'react-router';
import ConfirmModal from '@/components/common/ConfirmModal';
import StateView from '@/components/common/StateView';
import TabBar from '@/components/common/TabBar';
import ChorePanel from '@/components/main/ChorePanel';
import ChoreTile from '@/components/main/ChoreTile';
import LoadGauge from '@/components/main/LoadGauge';
import MainHeader from '@/components/main/MainHeader';
import MemberRail, { RAIL_ITEM_HEIGHT } from '@/components/main/MemberRail';
import MoodBubble from '@/components/main/MoodBubble';
import { MAIN_TEXT } from '@/constants/main';
import { STATUS_BUBBLE } from '@/constants/status';
import { useChoreRequests } from '@/hooks/useChoreRequests';
import { useDevSession } from '@/hooks/useDevSession';
import { useGroupBoard } from '@/hooks/useGroupBoard';
import { useMainMutations } from '@/hooks/useMainMutations';
import { MAIN_PATHS } from '@/routes/mainPaths';
import type { Chore } from '@/types/chore';

/** V5-07 상대 상세 · V5-08 확인 팝업 · V5-09 덜어주기 완료 */
function MemberPage() {
  useDevSession();
  const { memberId } = useParams();
  const navigate = useNavigate();
  const { group, myId, choresOf, pendingCountOf, isLoading, isError, refetch } = useGroupBoard();
  const { take } = useMainMutations();
  const { toByChore } = useChoreRequests();
  const [pending, setPending] = useState<Chore | null>(null);

  if (isLoading || (!group && !isError)) return <StateView type="loading" />;
  if (isError || !group || !myId) {
    return (
      <StateView
        type="error"
        message={MAIN_TEXT.loadError}
        retryLabel={MAIN_TEXT.retry}
        onRetry={refetch}
      />
    );
  }

  const member = group.members.find((m) => m.id === memberId);
  if (!member || member.id === myId) return <Navigate to={MAIN_PATHS.home} replace />;

  const chores = choresOf(member.id).filter((c) => !c.done);

  return (
    <div className="flex flex-1 flex-col bg-neutral-50">
      <MainHeader showBack title={member.nickname} />

      <main className="flex flex-1 flex-col gap-5 px-4 pb-6">
        <div
          className="relative"
          // TODO(디자인): 구성원이 많으면(최대 5명) 레일이 카드 영역과 겹치지 않게 임시로 높이 확보
          style={{ minHeight: group.members.length * RAIL_ITEM_HEIGHT }}
        >
          <div className="pt-2 pb-3">
            <LoadGauge count={chores.length} status={member.status} />
          </div>
          <MoodBubble text={STATUS_BUBBLE[member.status]} />
          <div className="absolute top-2 right-0">
            <MemberRail
              members={group.members}
              myId={myId}
              activeId={member.id}
              countOf={pendingCountOf}
              onSelect={(id) =>
                navigate(id === myId ? MAIN_PATHS.home : MAIN_PATHS.member(id), { replace: true })
              }
            />
          </div>
        </div>

        <ChorePanel
          title={MAIN_TEXT.memberChores(member.nickname)}
          hint={MAIN_TEXT.memberChoresHint}
          emptyText={MAIN_TEXT.emptyMemberChores}
        >
          {chores.map((chore) =>
            toByChore.has(chore.id) ? (
              <ChoreTile
                key={chore.id}
                name={chore.name}
                pendingTo={
                  toByChore.get(chore.id) === myId
                    ? MAIN_TEXT.meLabel
                    : (group.members.find((m) => m.id === toByChore.get(chore.id))?.nickname ?? '')
                }
              />
            ) : (
              <ChoreTile key={chore.id} name={chore.name} onClick={() => setPending(chore)} />
            ),
          )}
        </ChorePanel>
      </main>

      <TabBar />

      <ConfirmModal
        open={!!pending}
        title={MAIN_TEXT.takeTitle}
        description={pending ? MAIN_TEXT.takeDesc(member.nickname, pending.name) : undefined}
        confirmLabel={MAIN_TEXT.takeOk}
        cancelLabel={MAIN_TEXT.cancel}
        onCancel={() => setPending(null)}
        onConfirm={() => {
          if (pending) take.mutate(pending);
          setPending(null);
        }}
      />
    </div>
  );
}

export default MemberPage;
