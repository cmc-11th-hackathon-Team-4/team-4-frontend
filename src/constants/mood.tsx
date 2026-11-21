import { IconSleepy, IconSmile, IconTired } from '@/components/common/icons';
import type { MemberStatus } from '@/types/member';

/** 기분별 아이콘 (TODO: 캐릭터 표정 에셋으로 교체) */
export const STATUS_ICON: Record<MemberStatus, typeof IconSmile> = {
  relaxed: IconSmile,
  tired: IconTired,
  unwilling: IconSleepy,
};
