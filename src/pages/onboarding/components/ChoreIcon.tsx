import { choreIconOf, isInsetChoreIcon } from '@/constants/choreIcons';

/** 집안일 아이콘 48px (매핑: @/constants/choreIcons) */
function ChoreIcon({ name, className = '' }: { name: string; className?: string }) {
  return (
    <img
      src={choreIconOf(name)}
      alt=""
      width={48}
      height={48}
      className={`size-12 shrink-0 object-cover ${isInsetChoreIcon(name) ? 'p-[5px]' : ''} ${className}`}
    />
  );
}

export default ChoreIcon;
