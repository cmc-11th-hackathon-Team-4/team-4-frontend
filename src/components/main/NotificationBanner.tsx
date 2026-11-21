import { useQueryClient } from '@tanstack/react-query';
import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router';
import { IconHeart } from '@/components/common/icons';
import { MAIN_TEXT } from '@/constants/main';
import { STATUS_NOTICE } from '@/constants/status';
import { useGroupBoard } from '@/hooks/useGroupBoard';
import { useNotifications } from '@/hooks/useNotifications';
import { MAIN_PATHS } from '@/routes/mainPaths';
import { WEEKLY_PATHS } from '@/routes/weeklyPaths';
import { formatMonthDayWeekday } from '@/utils/date';
import { useSeenNotificationStore } from '@/stores/seenNotification';
import type { Group } from '@/types/group';
import type { AppNotification } from '@/types/notification';

const DURATION = 4000;

interface BannerContent {
  title: string;
  desc?: string;
  /** 하트 알림은 문자 대신 하트 아이콘 (UX 라이팅 가이드) */
  heart?: boolean;
}

function toContent(n: AppNotification, group: Group): BannerContent | null {
  const from = group.members.find((m) => m.id === n.fromId)?.nickname ?? '';
  const chore = n.choreName ?? group.chores.find((c) => c.id === n.choreId)?.name ?? '';
  if (n.type === 'take') return { title: MAIN_TEXT.takenBy(from, chore) };
  if (n.type === 'heart') return { title: MAIN_TEXT.heartReceived(from), heart: true };
  if (n.type === 'request') return { title: MAIN_TEXT.requestedBy(from, chore) };
  if (n.type === 'accept') return { title: MAIN_TEXT.acceptedBy(from, chore) };
  if (n.type === 'decline')
    return { title: MAIN_TEXT.declinedBy(from, chore), desc: MAIN_TEXT.declinedByDesc(chore) };
  if (n.type === 'cycleEnd') return { title: MAIN_TEXT.cycleEnded };
  if (n.type === 'cycleExtend' && n.endDate)
    return { title: MAIN_TEXT.cycleExtended(formatMonthDayWeekday(n.endDate)) };
  // 실서버: 기간 늘림(결산일 없음) · 다음 기간 시작은 서버 문구 그대로
  if ((n.type === 'cycleExtend' || n.type === 'cycleStart') && n.message)
    return { title: n.message };
  if (n.status === 'unwilling')
    return { title: STATUS_NOTICE.title(from), desc: STATUS_NOTICE.desc(from) };
  return null;
}

/** 상단 알림 배너 (App에 한 번만). 상태·덜어감·하트·부탁·수락·거절 알림을 받으면 표시 */
function NotificationBanner() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { group, myId } = useGroupBoard();
  const { received: notifications } = useNotifications();
  // 서버엔 '부탁 받음' 알림이 없어서, 보드의 받은 부탁을 부탁 알림으로 바꿔 함께 띄움
  const requestNotices: AppNotification[] = (group?.requests ?? [])
    .filter((r) => r.toId === myId)
    .map((r) => ({
      id: `request-${r.id}`,
      type: 'request',
      fromId: r.fromId,
      toId: r.toId,
      choreId: r.choreId,
      choreName: r.choreName,
      createdAt: r.createdAt,
    }));
  const received = [...notifications, ...requestNotices].sort((a, b) =>
    a.createdAt.localeCompare(b.createdAt),
  );
  const { seenIds, markSeen } = useSeenNotificationStore();

  const unseen = received.filter((n) => !seenIds.includes(n.id));
  const latest = unseen.at(-1);
  const content = latest && group ? toContent(latest, group) : null;
  const latestId = latest?.id;

  // 새 알림이 오면 그룹 정보도 바로 갱신 (짐 개수·상태 반영)
  const lastSynced = useRef<string | undefined>(undefined);
  useEffect(() => {
    if (!latestId || lastSynced.current === latestId) return;
    lastSynced.current = latestId;
    queryClient.invalidateQueries({ queryKey: ['group'] });
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

  if (!latest || !content) return null;

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
          <span className="min-w-0">
            <span className="flex items-center gap-1 text-sm font-semibold">
              <span className="truncate">{content.title}</span>
              {content.heart && <IconHeart size={14} fill="currentColor" className="shrink-0" />}
            </span>
            {content.desc && (
              <span className="block truncate text-xs text-neutral-500">{content.desc}</span>
            )}
          </span>
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
