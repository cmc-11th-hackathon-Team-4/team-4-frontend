import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { getNotifications, sendHeart } from '@/apis/notification';
import { queryKeys } from '@/apis/queryKeys';
import { MAIN_TEXT } from '@/constants/main';
import { useSessionStore } from '@/stores/session';
import { useToastStore } from '@/stores/toast';
import type { AppNotification } from '@/types/notification';

/** 알림 폴링 (TODO: ③ 주기 종료 확인도 여기로 통합) */
export function useNotifications() {
  const memberId = useSessionStore((s) => s.memberId) ?? '';
  const queryClient = useQueryClient();
  const showToast = useToastStore((s) => s.show);

  const query = useQuery({
    queryKey: queryKeys.notifications(memberId),
    queryFn: () => getNotifications(memberId),
    enabled: !!memberId,
    refetchInterval: 3000,
  });

  const all = query.data ?? [];
  const received = all.filter((n) => n.toId === memberId);

  // 하트를 아직 안 보낸 덜어감 알림 (V3-01 내 메인 · 하트)
  const thanked = new Set(
    all
      .filter((n) => n.type === 'heart' && n.fromId === memberId)
      .map((n) => `${n.toId}:${n.choreId}`),
  );
  // 실서버는 덜어감 알림의 hearted로, 목데이터는 내가 보낸 하트 알림으로 판단
  const pendingThanks = received.filter(
    (n) => n.type === 'take' && !(n.hearted ?? thanked.has(`${n.fromId}:${n.choreId}`)),
  );
  const heartsReceived = received.filter((n) => n.type === 'heart');

  const heart = useMutation({
    mutationFn: ({ notification }: { notification: AppNotification; name: string }) =>
      sendHeart(memberId, notification),
    onSuccess: (_d, { name }) => showToast(MAIN_TEXT.heartSent(name)),
    onError: () => showToast(MAIN_TEXT.error),
    onSettled: () => queryClient.invalidateQueries({ queryKey: queryKeys.notifications(memberId) }),
  });

  return { ...query, received, pendingThanks, heartsReceived, heart };
}
