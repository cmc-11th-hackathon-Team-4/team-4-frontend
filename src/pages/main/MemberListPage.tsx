import StateView from '@/components/common/StateView';
import TabBar from '@/components/common/TabBar';
import MainHeader from '@/components/main/MainHeader';
import { MAIN_TEXT } from '@/constants/main';
import { useDevSession } from '@/hooks/useDevSession';
import { useGroupBoard } from '@/hooks/useGroupBoard';

/** V5-12 › 구성원 목록 (보기만, 추가·삭제 없음) */
function MemberListPage() {
  useDevSession();
  const { group, myId, isLoading, isError, refetch } = useGroupBoard();

  if (isLoading || (!group && !isError)) return <StateView type="loading" />;
  if (isError || !group) {
    return (
      <StateView
        type="error"
        message={MAIN_TEXT.loadError}
        retryLabel={MAIN_TEXT.retry}
        onRetry={refetch}
      />
    );
  }

  return (
    <div className="flex flex-1 flex-col bg-neutral-50">
      <MainHeader showBack title={MAIN_TEXT.members} />

      <main className="flex flex-1 flex-col px-4 pt-2 pb-6">
        <ul className="divide-y divide-neutral-100 overflow-hidden rounded-2xl bg-white">
          {group.members.map((member) => (
            <li key={member.id} className="flex h-14 items-center gap-2 px-4">
              <span className="flex-1 truncate">{member.nickname}</span>
              {member.isHost && (
                <span className="rounded-full border border-neutral-300 px-2 py-0.5 text-[10px] text-neutral-500">
                  {MAIN_TEXT.hostTag}
                </span>
              )}
              {member.id === myId && (
                <span className="text-sm text-neutral-500">{MAIN_TEXT.meLabel}</span>
              )}
            </li>
          ))}
        </ul>
      </main>

      <TabBar />
    </div>
  );
}

export default MemberListPage;
