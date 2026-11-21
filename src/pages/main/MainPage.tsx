import { useState } from 'react';
import { useNavigate } from 'react-router';
import ConfirmModal from '@/components/common/ConfirmModal';
import StateView from '@/components/common/StateView';
import TabBar from '@/components/common/TabBar';
import ChorePanel from '@/components/main/ChorePanel';
import ChoreTile from '@/components/main/ChoreTile';
import LoadGauge from '@/components/main/LoadGauge';
import MainHeader from '@/components/main/MainHeader';
import MemberRail from '@/components/main/MemberRail';
import MoodPicker from '@/components/main/MoodPicker';
import { HeartNotice, RequestNotice } from '@/components/main/NoticeCards';
import RequestSheet from '@/components/main/RequestSheet';
import { MAIN_TEXT } from '@/constants/main';
import { useChoreRequests } from '@/hooks/useChoreRequests';
import { useDevSession } from '@/hooks/useDevSession';
import { useGroupBoard } from '@/hooks/useGroupBoard';
import { useMainMutations } from '@/hooks/useMainMutations';
import { useNotifications } from '@/hooks/useNotifications';
import { MAIN_PATHS } from '@/routes/mainPaths';
import { useToastStore } from '@/stores/toast';
import type { Chore } from '@/types/chore';

/** V5-01 내 메인 (+ V5-02 기분 선택, V5-03~06 완료·짐 올리기, V5-10~11 부탁·하트) */
function MainPage() {
  useDevSession();
  const navigate = useNavigate();
  const showToast = useToastStore((s) => s.show);
  const { group, me, myId, choresOf, pendingCountOf, isLoading, isError, refetch } =
    useGroupBoard();
  const { pendingThanks, heartsReceived, heart } = useNotifications();
  const requests = useChoreRequests();
  const { request, respond, complete, status } = useMainMutations();

  const [requesting, setRequesting] = useState<Chore | null>(null);
  const [completing, setCompleting] = useState<Chore | null>(null);

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

  const nameOf = (id: string) => group.members.find((m) => m.id === id)?.nickname ?? '';
  const choreNameOf = (id?: string) => group.chores.find((c) => c.id === id)?.name ?? '';
  const myChores = choresOf(myId).filter((c) => !c.done);
  const others = group.members.filter((m) => m.id !== myId);
  const sentTo = new Map(requests.sent.map((r) => [r.choreId, r.toId]));
  const thanksTarget = pendingThanks.at(-1);

  return (
    <div className="flex flex-1 flex-col bg-neutral-50">
      <MainHeader title={MAIN_TEXT.homeTitle} onSettings={() => showToast(MAIN_TEXT.preparing)} />

      <main className="flex flex-1 flex-col gap-5 px-4 pb-6">
        <div className="relative">
          <div className="pt-2 pb-3">
            <LoadGauge count={myChores.length} status={me.status} hearts={heartsReceived.length} />
          </div>
          <div className="flex justify-center">
            <MoodPicker value={me.status} onChange={(next) => status.mutate(next)} />
          </div>
          <div className="absolute top-2 right-0">
            <MemberRail
              members={group.members}
              myId={myId}
              activeId={myId}
              countOf={pendingCountOf}
              onSelect={(id) => id !== myId && navigate(MAIN_PATHS.member(id))}
            />
          </div>
        </div>

        <ChorePanel
          title={MAIN_TEXT.myChoresTitle}
          hint={MAIN_TEXT.myChoresHint}
          emptyText={MAIN_TEXT.emptyMyChores}
          notice={
            <>
              {requests.received.map((req) => (
                <RequestNotice
                  key={req.id}
                  text={MAIN_TEXT.requestedBy(nameOf(req.fromId), choreNameOf(req.choreId))}
                  disabled={respond.isPending}
                  onAccept={() =>
                    respond.mutate({ req, accept: true, choreName: choreNameOf(req.choreId) })
                  }
                  onDecline={() =>
                    respond.mutate({ req, accept: false, choreName: choreNameOf(req.choreId) })
                  }
                />
              ))}
              {thanksTarget && (
                <HeartNotice
                  text={MAIN_TEXT.takenBy(
                    nameOf(thanksTarget.fromId),
                    choreNameOf(thanksTarget.choreId),
                  )}
                  disabled={heart.isPending}
                  onHeart={() =>
                    heart.mutate({ notification: thanksTarget, name: nameOf(thanksTarget.fromId) })
                  }
                />
              )}
            </>
          }
        >
          {myChores.map((chore) =>
            sentTo.has(chore.id) ? (
              <ChoreTile
                key={chore.id}
                name={chore.name}
                pendingTo={nameOf(sentTo.get(chore.id)!)}
              />
            ) : (
              <ChoreTile
                key={chore.id}
                name={chore.name}
                onClick={() => setRequesting(chore)}
                onComplete={() => setCompleting(chore)}
              />
            ),
          )}
        </ChorePanel>
      </main>

      <TabBar />

      {requesting && (
        <RequestSheet
          choreName={requesting.name}
          members={others}
          countOf={pendingCountOf}
          onClose={() => setRequesting(null)}
          onSubmit={(toId) => {
            request.mutate({ chore: requesting, toId });
            setRequesting(null);
          }}
        />
      )}

      <ConfirmModal
        open={!!completing}
        title={MAIN_TEXT.doneTitle}
        description={completing ? MAIN_TEXT.doneDesc(completing.name) : undefined}
        confirmLabel={MAIN_TEXT.doneOk}
        cancelLabel={MAIN_TEXT.doneNo}
        onCancel={() => setCompleting(null)}
        onConfirm={() => {
          if (completing) complete.mutate(completing);
          setCompleting(null);
        }}
      />
    </div>
  );
}

export default MainPage;
