import { useQueryClient } from '@tanstack/react-query';
import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router';
import { MAIN_TEXT } from '@/constants/main';
import { STATUS_NOTICE } from '@/constants/status';
import { useGroupBoard } from '@/hooks/useGroupBoard';
import { useNotifications } from '@/hooks/useNotifications';
import { MAIN_PATHS } from '@/routes/mainPaths';
import { WEEKLY_PATHS } from '@/routes/weeklyPaths';
import { formatMonthDayWeek } from '@/utils/date';
import { useSeenNotificationStore } from '@/stores/seenNotification';
import type { Group } from '@/types/group';
import type { AppNotification } from '@/types/notification';

const DURATION = 4000;

function toText(n: AppNotification, group: Group) {
  const from = group.members.find((m) => m.id === n.fromId)?.nickname ?? '';
  const chore = group.chores.find((c) => c.id === n.choreId)?.name ?? '';
  if (n.type === 'take') return MAIN_TEXT.takenBy(from, chore);
  if (n.type === 'heart') return MAIN_TEXT.heartReceived(from);
  if (n.type === 'request') return MAIN_TEXT.requestedBy(from, chore);
  if (n.type === 'accept') return MAIN_TEXT.acceptedBy(from, chore);
  if (n.type === 'decline') return MAIN_TEXT.declinedBy(from, chore);
  if (n.type === 'cycleEnd') return MAIN_TEXT.cycleEnded;
  if (n.type === 'cycleExtend' && n.endDate)
    return MAIN_TEXT.cycleExtended(formatMonthDayWeek(n.endDate));
  if (n.status === 'unwilling') return STATUS_NOTICE.unwilling(from);
  return null;
}

/** 상단 알림 배너 (App에 한 번만). 상태·덜어감·하트·부탁·수락·거절 알림을 받으면 표시 */
function NotificationBanner() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { group } = useGroupBoard();
  const { received } = useNotifications();
  const { seenIds, markSeen } = useSeenNotificationStore();

  const unseen = received.filter((n) => !seenIds.includes(n.id));
  const latest = unseen.at(-1);
  const text = latest && group ? toText(latest, group) : null;
  const latestId = latest?.id;

  // 새 알림이 오면 그룹 정보도 바로 갱신 (짐 개수·상태 반영)
  const lastSynced = useRef<string | undefined>(undefined);
  useEffect(() => {
    if (!latestId || lastSynced.current === latestId) return;
    lastSynced.current = latestId;
    queryClient.invalidateQueries({ queryKey: ['group'] });
    queryClient.invalidateQueries({ queryKey: ['requests'] });
    queryClient.invalidateQueries({ queryKey: ['cycle'] });
  }, [latestId, queryClient]);

  const close = () => markSeen(unseen.map((n) => n.id));

  // 렌더마다 배열이 새로 만들어지므로 ref로 최신 목록만 보관 (타이머 리셋 방지)
  const receivedIds = useRef<string[]>([]);
  useEffect(() => {
    receivedIds.current = received.map((n) => n.id);
  });
  useEffect(() => {
    if (!latestId) return;
    const timer = setTimeout(() => markSeen(receivedIds.current), DURATION);
    return () => clearTimeout(timer);
  }, [latestId, markSeen]);

  if (!latest || !text) return null;

  return (
    <div className="fixed inset-x-0 top-0 z-50 flex justify-center px-3 pt-[calc(8px+var(--safe-top))]">
      <div className="flex w-full max-w-[406px] items-center gap-2 rounded-2xl bg-white p-3 shadow-lg ring-1 ring-neutral-200">
        <button
          type="button"
          className="flex min-w-0 flex-1 items-center gap-3 text-left"
          onClick={() => {
            close();
            navigate(latest.type === 'cycleEnd' ? WEEKLY_PATHS.summary : MAIN_PATHS.home);
          }}
        >
          <span className="size-8 shrink-0 rounded-full border border-neutral-300 bg-neutral-100" />
          <span className="truncate text-sm font-semibold">{text}</span>
        </button>
        <button
          type="button"
          aria-label={MAIN_TEXT.close}
          className="p-1 text-neutral-400"
          onClick={close}
        >
          ✕
        </button>
      </div>
    </div>
  );
}

export default NotificationBanner;
