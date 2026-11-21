import bathroomIcon from '@/assets/chores/bathroom.png';
import dishesIcon from '@/assets/chores/dishes.png';
import foodWasteIcon from '@/assets/chores/food-waste.png';
import laundryFoldIcon from '@/assets/chores/laundry-fold.png';
import laundryHangIcon from '@/assets/chores/laundry-hang.png';
import mopIcon from '@/assets/chores/mop.png';
import recycleIcon from '@/assets/chores/recycle.png';
import trashIcon from '@/assets/chores/trash.png';
import vacuumIcon from '@/assets/chores/vacuum.png';
import washerIcon from '@/assets/chores/washer.png';

/**
 * 집안일 아이콘 48px (피그마 Components · 가사 아이콘 10종)
 * - 이름은 띄어쓰기를 빼고 맞춤 ("일반쓰레기 버리기" = "일반 쓰레기 버리기")
 * - 목록에 없는 이름(직접 추가)은 빨래 널기 아이콘
 */
const CHORE_ICONS: Record<string, string> = {
  빨래널기: laundryHangIcon,
  설거지: dishesIcon,
  분리수거: recycleIcon,
  욕실청소: bathroomIcon,
  세탁기돌리기: washerIcon,
  빨래개기: laundryFoldIcon,
  청소기돌리기: vacuumIcon,
  바닥닦기: mopIcon,
  일반쓰레기버리기: trashIcon,
  음식물쓰레기버리기: foodWasteIcon,
};

/** 집안일 이름 → 아이콘 */
export const choreIconOf = (name: string) =>
  CHORE_ICONS[name.replace(/\s/g, '')] ?? laundryHangIcon;

/** 시안 컴포넌트에서 안쪽 여백(10.42%)을 두고 작게 그리는 아이콘 */
const INSET_ICONS = new Set([recycleIcon]);
export const isInsetChoreIcon = (name: string) => INSET_ICONS.has(choreIconOf(name));

/** 시안에서 회색 칸 위에 놓이는 기본(빨래 널기) 아이콘 */
export const DEFAULT_CHORE_ICON = laundryHangIcon;
