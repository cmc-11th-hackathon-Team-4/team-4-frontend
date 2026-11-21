import { useState } from 'react';
import { useNavigate } from 'react-router';
import { useQueryClient } from '@tanstack/react-query';
import ConfirmModal from '@/components/common/ConfirmModal';
import PullToRefresh from '@/components/common/PullToRefresh';
import StateView from '@/components/common/StateView';
import TabBar from '@/components/common/TabBar';
import ChorePanel from '@/components/main/ChorePanel';
import ChoreTile from '@/components/main/ChoreTile';
import LoadGauge from '@/components/main/LoadGauge';
import MainHeader from '@/components/main/MainHeader';
import MemberRail, { RAIL_ITEM_HEIGHT } from '@/components/main/MemberRail';
import MoodPicker from '@/components/main/MoodPicker';
import { HeartNotice, RequestNotice } from '@/components/main/NoticeCards';
import RequestSheet from '@/components/main/RequestSheet';
import { MAIN_TEXT } from '@/constants/main';
import { useChoreRequests } from '@/hooks/useChoreRequests';
import { useDevSession } from '@/hooks/useDevSession';
import { useGroupBoard } from '@/hooks/useGroupBoard';
import { isMemberFull } from '@/apis/limits';
import { useMainMutations } from '@/hooks/useMainMutations';
import { useNotifications } from '@/hooks/useNotifications';
import { MAIN_PATHS } from '@/routes/mainPaths';
import { useHeartBurstStore } from '@/stores/heartBurst';
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
  const { playedIds, markPlayed } = useHeartBurstStore();
  /** 아직 뿅뿅을 안 보여준 최신 하트 (배려왕 카운트와 별개, 1회성) */
  const heartBurst = heartsReceived.filter((n) => !playedIds.includes(n.id)).at(-1);
  const requests = useChoreRequests();
  const { request, respond, complete, status, cancelRequest } = useMainMutations();

  const [requesting, setRequesting] = useState<Chore | null>(null);
  const [completing, setCompleting] = useState<Chore | null>(null);
  const [moodOpen, setMoodOpen] = useState(false);
  const [canceling, setCanceling] = useState<Chore | null>(null);
  const queryClient = useQueryClient();
  /** 당겨서 새로고침: 그룹 · 알림 · 부탁 다시 불러오기 */
  const refreshAll = () =>
    Promise.all([
      queryClient.refetchQueries({ queryKey: ['group'] }),
      queryClient.refetchQueries({ queryKey: ['notifications'] }),
      queryClient.refetchQueries({ queryKey: ['requests'] }),
    ]);

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
  const sentByChore = new Map(requests.sent.map((r) => [r.choreId, r]));
  const myFull = isMemberFull(group.chores, myId);
  const thanksTarget = pendingThanks.at(-1);

  return (
    <div className="flex flex-1 flex-col bg-neutral-50">
      <MainHeader title={MAIN_TEXT.homeTitle} onSettings={() => navigate(MAIN_PATHS.settings)} />

      <PullToRefresh onRefresh={refreshAll}>
        <main className="flex flex-1 flex-col gap-5 px-4 pb-6">
          <div
            className="relative"
            // TODO(디자인): 구성원이 많으면(최대 5명) 레일이 카드 영역과 겹치지 않게 임시로 높이 확보
            style={{ minHeight: group.members.length * RAIL_ITEM_HEIGHT }}
          >
            <div className="pt-2 pb-3">
              <LoadGauge
                count={myChores.length}
                status={me.status}
                heartBurstKey={heartBurst?.id}
                onHeartBurstEnd={() => markPlayed(heartsReceived.map((n) => n.id))}
                onCharacterClick={() => setMoodOpen(true)}
              />
            </div>
            <div className="flex justify-center">
              <MoodPicker
                value={me.status}
                onChange={(next) => status.mutate(next)}
                open={moodOpen}
                onOpenChange={setMoodOpen}
              />
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
                      myFull
                        ? showToast(MAIN_TEXT.memberFullToast)
                        : respond.mutate({ req, accept: true, choreName: choreNameOf(req.choreId) })
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
                      heart.mutate({
                        notification: thanksTarget,
                        name: nameOf(thanksTarget.fromId),
                      })
                    }
                  />
                )}
              </>
            }
          >
            {myChores.map((chore) =>
              sentByChore.has(chore.id) ? (
                <ChoreTile
                  key={chore.id}
                  name={chore.name}
                  pendingTo={nameOf(sentByChore.get(chore.id)!.toId)}
                  onClick={() => setCanceling(chore)}
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
      </PullToRefresh>

      <TabBar />

      {requesting && (
        <RequestSheet
          choreName={requesting.name}
          members={others}
          countOf={pendingCountOf}
          isFull={(id) => isMemberFull(group.chores, id)}
          onClose={() => setRequesting(null)}
          onSubmit={(toId) => {
            request.mutate({ chore: requesting, toId });
            setRequesting(null);
          }}
        />
      )}

      <ConfirmModal
        open={!!canceling}
        title={MAIN_TEXT.cancelRequestTitle}
        description={canceling ? MAIN_TEXT.cancelRequestDesc(canceling.name) : undefined}
        confirmLabel={MAIN_TEXT.cancelRequestOk}
        cancelLabel={MAIN_TEXT.doneNo}
        onCancel={() => setCanceling(null)}
        onConfirm={() => {
          const req = canceling && sentByChore.get(canceling.id);
          if (req) cancelRequest.mutate(req);
          setCanceling(null);
        }}
      />

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
