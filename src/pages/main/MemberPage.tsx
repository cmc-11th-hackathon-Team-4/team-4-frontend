import { useState } from 'react';
import { Navigate, useNavigate, useParams } from 'react-router';
import ConfirmModal from '@/components/common/ConfirmModal';
import Header, { HeaderSettingButton } from '@/components/common/Header';
import StateView from '@/components/common/StateView';
import TabBar from '@/components/common/TabBar';
import ChoreCard from '@/components/main/ChoreCard';
import MainChips from '@/components/main/MainChips';
import MainHero from '@/components/main/MainHero';
import MemberCard from '@/components/main/MemberCard';
import SectionCard from '@/components/main/SectionCard';
import { themeOf } from '@/constants/characterTheme';
import { MAIN_TEXT } from '@/constants/main';
import { useChoreRequests } from '@/hooks/useChoreRequests';
import { useDevSession } from '@/hooks/useDevSession';
import { useDueCaption } from '@/hooks/useDueCaption';
import { useGroupBoard } from '@/hooks/useGroupBoard';
import { isMemberFull } from '@/apis/limits';
import { useMainMutations } from '@/hooks/useMainMutations';
import { useToastStore } from '@/stores/toast';
import { MAIN_PATHS } from '@/routes/mainPaths';
import type { Chore } from '@/types/chore';

/** V5-07 상대 상세 · V5-08 확인 팝업 · V5-09 덜어주기 완료 (상대 캐릭터 색 테마) */
function MemberPage() {
  useDevSession();
  const { memberId } = useParams();
  const navigate = useNavigate();
  const showToast = useToastStore((s) => s.show);
  const { group, myId, choresOf, pendingCountOf, isLoading, isError, refetch } = useGroupBoard();
  const { take } = useMainMutations();
  const { toByChore } = useChoreRequests();
  const dueCaption = useDueCaption();
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

  const theme = themeOf(member.character);
  const chores = choresOf(member.id).filter((c) => !c.done);
  const requestedTo = (toId: string) =>
    toId === myId
      ? MAIN_TEXT.requestingMe
      : MAIN_TEXT.requesting(group.members.find((m) => m.id === toId)?.nickname ?? '');

  return (
    // 위(헤더 · 칩) · 아래(탭바) 고정, 가운데만 스크롤 (피그마 iPhone 18 Pro - 1)
    <div
      className="flex min-h-0 flex-1 flex-col overflow-hidden"
      style={{ background: theme.background }}
    >
      <div className="shrink-0">
        <Header
          title={MAIN_TEXT.homeTitle}
          right={<HeaderSettingButton onClick={() => navigate(MAIN_PATHS.settings)} />}
        />
        <MainChips
          theme={theme}
          status={member.status}
          count={chores.length}
          ownerName={member.nickname}
        />
      </div>

      <div className="flex min-h-0 flex-1 flex-col overflow-y-auto overscroll-contain">
        <MainHero theme={theme} character={member.character} count={chores.length} />

        <main className="flex flex-col gap-5 px-4 pb-6">
          <MemberCard
            members={group.members}
            myId={myId}
            activeId={member.id}
            countOf={pendingCountOf}
            onSelect={(id) =>
              navigate(id === myId ? MAIN_PATHS.home : MAIN_PATHS.member(id), { replace: true })
            }
          />

          <SectionCard
            title={MAIN_TEXT.memberChores(member.nickname)}
            hint={MAIN_TEXT.memberChoresHint}
          >
            {chores.length === 0 ? (
              <p className="py-6 text-center text-sm font-medium text-gray-400">
                {MAIN_TEXT.emptyMemberChores}
              </p>
            ) : (
              <div className="grid grid-cols-2 gap-x-4 gap-y-2.5">
                {chores.map((chore) => {
                  const toId = toByChore.get(chore.id);
                  return toId ? (
                    <ChoreCard
                      key={chore.id}
                      name={chore.name}
                      caption={requestedTo(toId)}
                      dimmed
                    />
                  ) : (
                    <ChoreCard
                      key={chore.id}
                      name={chore.name}
                      caption={dueCaption}
                      onPress={() =>
                        isMemberFull(group.chores, myId)
                          ? showToast(MAIN_TEXT.memberFullToast)
                          : setPending(chore)
                      }
                    />
                  );
                })}
              </div>
            )}
          </SectionCard>
        </main>
      </div>

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
