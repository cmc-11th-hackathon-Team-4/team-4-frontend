import {
  DndContext,
  DragOverlay,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragStartEvent,
} from '@dnd-kit/core';
import { useState } from 'react';
import { Navigate, useNavigate, useParams } from 'react-router';
import ConfirmModal from '@/components/common/ConfirmModal';
import StateView from '@/components/common/StateView';
import ChoreCard, { ChoreCardView } from '@/components/main/ChoreCard';
import Dock, { DOCK_DROP_ID } from '@/components/main/Dock';
import LoadGauge from '@/components/main/LoadGauge';
import MainHeader from '@/components/main/MainHeader';
import MemberRail, { RAIL_ME_DROP_ID } from '@/components/main/MemberRail';
import SpeechBubble from '@/components/main/SpeechBubble';
import { MAIN_TEXT, VISIBLE_CHORES } from '@/constants/main';
import { STATUS_BUBBLE } from '@/constants/status';
import { useDevSession } from '@/hooks/useDevSession';
import { useGroupBoard } from '@/hooks/useGroupBoard';
import { useMainMutations } from '@/hooks/useMainMutations';
import { PATHS } from '@/routes/paths';
import { useTakeStore } from '@/stores/take';
import type { Chore } from '@/types/chore';
import { MAX_MEMBERS } from '@/types/group';

const DROP_TARGETS = [DOCK_DROP_ID, RAIL_ME_DROP_ID];

/** V3-02 상대 메인 · V3-03 드래그 중 · S-07 확인 모달 · V3-04 놓은 직후 */
function MemberPage() {
  useDevSession();
  const { memberId } = useParams();
  const navigate = useNavigate();
  const { group, myId, choresOf, pendingCountOf, isLoading, isError, refetch } = useGroupBoard();
  const { take } = useMainMutations();
  const lastTake = useTakeStore((s) => s.lastTake);

  const [dragging, setDragging] = useState<Chore | null>(null);
  const [pending, setPending] = useState<Chore | null>(null);
  const [expanded, setExpanded] = useState(false);

  // 스크롤과 구분: 마우스는 5px 이동, 터치는 0.15초 누르면 드래그 시작
  const sensors = useSensors(
    useSensor(MouseSensor, { activationConstraint: { distance: 5 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 150, tolerance: 8 } }),
  );

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
  if (!member || member.id === myId) return <Navigate to={PATHS.home} replace />;

  const chores = choresOf(member.id).filter((c) => !c.done);
  const visible = expanded ? chores : chores.slice(0, VISIBLE_CHORES);
  const hiddenCount = chores.length - visible.length;
  const bubble =
    lastTake?.fromId === member.id ? MAIN_TEXT.thanksBubble : STATUS_BUBBLE[member.status];

  const handleDragStart = ({ active }: DragStartEvent) => setDragging(active.data.current as Chore);
  const handleDragEnd = ({ over }: DragEndEvent) => {
    if (dragging && over && DROP_TARGETS.includes(String(over.id))) setPending(dragging);
    setDragging(null);
  };

  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragCancel={() => setDragging(null)}
    >
      <div className="flex flex-1 flex-col">
        <MainHeader
          showBack
          title={member.nickname}
          inviteLabel={MAIN_TEXT.invite(group.members.length, MAX_MEMBERS)}
          onInvite={() => navigate(PATHS.onboarding.invite)}
        />

        <main className="flex flex-1 flex-col gap-4 px-4 pb-4">
          <div className="flex gap-2 pt-2">
            <div className="min-w-0 flex-1">
              <SpeechBubble text={bubble} />
              <div className="mt-6">
                <LoadGauge
                  count={chores.length}
                  status={member.status}
                  caption={MAIN_TEXT.gaugeCaption(false, member.nickname, chores.length)}
                />
              </div>
            </div>
            <div className="shrink-0">
              <MemberRail
                members={group.members}
                myId={myId}
                activeId={member.id}
                countOf={pendingCountOf}
                droppable
                dragging={!!dragging}
                onSelect={(id) =>
                  navigate(id === myId ? PATHS.home : PATHS.member(id), { replace: true })
                }
              />
            </div>
          </div>

          <section>
            <div className="mb-2 flex items-center justify-between">
              <h2 className="text-sm font-bold">{MAIN_TEXT.memberChores(member.nickname)}</h2>
              <span className="text-[11px] text-neutral-400">{MAIN_TEXT.dragHint}</span>
            </div>
            {chores.length === 0 ? (
              <p className="rounded-xl border border-dashed border-neutral-300 py-4 text-center text-sm text-neutral-400">
                {MAIN_TEXT.emptyChores}
              </p>
            ) : (
              <div className="flex flex-col gap-2">
                {visible.map((chore) => (
                  <ChoreCard key={chore.id} chore={chore} onTake={setPending} />
                ))}
                {(hiddenCount > 0 || expanded) && chores.length > VISIBLE_CHORES && (
                  <button
                    type="button"
                    className="self-start text-[11px] text-neutral-400"
                    onClick={() => setExpanded((v) => !v)}
                  >
                    {expanded ? MAIN_TEXT.fold : MAIN_TEXT.more(hiddenCount)}
                  </button>
                )}
              </div>
            )}
          </section>

          <div className="sticky bottom-4 mt-auto">
            <Dock count={pendingCountOf(myId)} dragging={!!dragging} />
          </div>
        </main>
      </div>

      <DragOverlay>{dragging && <ChoreCardView name={dragging.name} lifted />}</DragOverlay>

      <ConfirmModal
        open={!!pending}
        title={MAIN_TEXT.confirmTitle}
        description={pending ? MAIN_TEXT.confirmDesc(pending.name, member.nickname) : undefined}
        confirmLabel={MAIN_TEXT.confirmOk}
        cancelLabel={MAIN_TEXT.confirmCancel}
        onCancel={() => setPending(null)}
        onConfirm={() => {
          if (pending) take.mutate(pending);
          setPending(null);
        }}
      />
    </DndContext>
  );
}

export default MemberPage;
