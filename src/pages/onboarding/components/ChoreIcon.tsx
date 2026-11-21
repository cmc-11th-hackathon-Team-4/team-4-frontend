import dishesIcon from '@/assets/chores/dishes.png';
import laundryHangIcon from '@/assets/chores/laundry-hang.png';

/**
 * 집안일 아이콘 48px (피그마 Components · 집안일 아이콘: "빨래 널기" · "설거지" 두 가지)
 * - 시안(S-04 · S-05)은 설거지만 설거지 아이콘, 나머지는 모두 빨래 널기 아이콘
 * - TODO(디자인): 집안일별 아이콘이 더 나오면 여기 이름 → 이미지만 추가
 */
const CHORE_ICONS: Record<string, string> = {
  설거지: dishesIcon,
};

function ChoreIcon({ name }: { name: string }) {
  return (
    <img
      src={CHORE_ICONS[name] ?? laundryHangIcon}
      alt=""
      width={48}
      height={48}
      className="size-12 shrink-0 object-cover"
    />
  );
}

export default ChoreIcon;
