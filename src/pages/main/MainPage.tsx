import { useState } from 'react';
import { useNavigate } from 'react-router';
import { useQueryClient } from '@tanstack/react-query';
import ConfirmModal from '@/components/common/ConfirmModal';
import Header, { HeaderSettingButton } from '@/components/common/Header';
import PullToRefresh from '@/components/common/PullToRefresh';
import StateView from '@/components/common/StateView';
import TabBar from '@/components/common/TabBar';
import ChoreCard from '@/components/main/ChoreCard';
import MainHero from '@/components/main/MainHero';
import MemberCard from '@/components/main/MemberCard';
import MoodPicker from '@/components/main/MoodPicker';
import { HeartNotice, RequestNotice } from '@/components/main/NoticeCards';
import RequestSheet from '@/components/main/RequestSheet';
import SectionCard from '@/components/main/SectionCard';
import { themeOf } from '@/constants/characterTheme';
import { MAIN_TEXT } from '@/constants/main';
import { useChoreRequests } from '@/hooks/useChoreRequests';
import { useDevSession } from '@/hooks/useDevSession';
import { useDueCaption } from '@/hooks/useDueCaption';
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
  const dueCaption = useDueCaption();

  const [requesting, setRequesting] = useState<Chore | null>(null);
  const [completing, setCompleting] = useState<Chore | null>(null);
  const [moodOpen, setMoodOpen] = useState(false);
  const [canceling, setCanceling] = useState<Chore | null>(null);
  const queryClient = useQueryClient();
  /** 당겨서 새로고침: 그룹(부탁 포함) · 알림 다시 불러오기 */
  const refreshAll = () =>
    Promise.all([
      queryClient.refetchQueries({ queryKey: ['group'] }),
      queryClient.refetchQueries({ queryKey: ['notifications'] }),
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

  const theme = themeOf(me.character);
  const nameOf = (id: string) => group.members.find((m) => m.id === id)?.nickname ?? '';
  const choreNameOf = (id?: string) => group.chores.find((c) => c.id === id)?.name ?? '';
  const myChores = choresOf(myId).filter((c) => !c.done);
  const others = group.members.filter((m) => m.id !== myId);
  const sentByChore = new Map(requests.sent.map((r) => [r.choreId, r]));
  const myFull = isMemberFull(group.chores, myId);
  const thanksTarget = pendingThanks.at(-1);

  return (
    <div className="flex flex-1 flex-col" style={{ background: theme.background }}>
      <Header
        title={MAIN_TEXT.homeTitle}
        right={<HeaderSettingButton onClick={() => navigate(MAIN_PATHS.settings)} />}
      />

      <PullToRefresh onRefresh={refreshAll}>
        <MainHero
          theme={theme}
          character={me.character}
          status={me.status}
          count={myChores.length}
          onMoodClick={() => setMoodOpen((open) => !open)}
          heartBurstKey={heartBurst?.id}
          onHeartBurstEnd={() => markPlayed(heartsReceived.map((n) => n.id))}
        >
          {moodOpen && (
            <MoodPicker
              character={me.character}
              value={me.status}
              color={theme.c500}
              onChange={(next) => status.mutate(next)}
              onClose={() => setMoodOpen(false)}
            />
          )}
        </MainHero>

        <main className="flex flex-col gap-5 px-4 pb-6">
          <MemberCard
            members={group.members}
            myId={myId}
            activeId={myId}
            countOf={pendingCountOf}
            onSelect={(id) => id !== myId && navigate(MAIN_PATHS.member(id))}
          />

          <SectionCard title={MAIN_TEXT.myChoresTitle} hint={MAIN_TEXT.myChoresHint}>
            {requests.received.map((req) => (
              <RequestNotice
                key={req.id}
                text={MAIN_TEXT.requestedBy(
                  nameOf(req.fromId),
                  req.choreName ?? choreNameOf(req.choreId),
                )}
                disabled={respond.isPending}
                onAccept={() =>
                  myFull
                    ? showToast(MAIN_TEXT.memberFullToast)
                    : respond.mutate({
                        req,
                        accept: true,
                        choreName: req.choreName ?? choreNameOf(req.choreId),
                      })
                }
                onDecline={() =>
                  respond.mutate({
                    req,
                    accept: false,
                    choreName: req.choreName ?? choreNameOf(req.choreId),
                  })
                }
              />
            ))}
            {thanksTarget && (
              <HeartNotice
                text={MAIN_TEXT.takenBy(
                  nameOf(thanksTarget.fromId),
                  thanksTarget.choreName ?? choreNameOf(thanksTarget.choreId),
                )}
                disabled={heart.isPending}
                onHeart={() =>
                  heart.mutate({ notification: thanksTarget, name: nameOf(thanksTarget.fromId) })
                }
              />
            )}

            {myChores.length === 0 ? (
              <p className="py-6 text-center text-sm font-medium text-gray-400">
                {MAIN_TEXT.emptyMyChores}
              </p>
            ) : (
              <div className="grid grid-cols-2 gap-x-4 gap-y-2.5">
                {myChores.map((chore) => {
                  const sent = sentByChore.get(chore.id);
                  return sent ? (
                    <ChoreCard
                      key={chore.id}
                      name={chore.name}
                      caption={MAIN_TEXT.requesting(nameOf(sent.toId))}
                      dimmed
                      onPress={() => setCanceling(chore)}
                    />
                  ) : (
                    <ChoreCard
                      key={chore.id}
                      name={chore.name}
                      caption={dueCaption}
                      onPress={() => setRequesting(chore)}
                      onComplete={() => setCompleting(chore)}
                    />
                  );
                })}
              </div>
            )}
          </SectionCard>
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
