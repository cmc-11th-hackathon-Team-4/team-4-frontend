import { useNavigate } from 'react-router';
import { IconChevronLeft, IconGear } from '@/components/common/icons';
import { MAIN_TEXT } from '@/constants/main';

interface MainHeaderProps {
  title: string;
  /** 상대 상세: 뒤로가기 + 가운데 제목 */
  showBack?: boolean;
  onSettings?: () => void;
}

function MainHeader({ title, showBack = false, onSettings }: MainHeaderProps) {
  const navigate = useNavigate();

  if (showBack) {
    return (
      <header className="relative flex h-14 items-center justify-center px-4">
        <button
          type="button"
          aria-label="뒤로가기"
          className="absolute left-3 p-1"
          onClick={() => navigate(-1)}
        >
          <IconChevronLeft size={24} />
        </button>
        <h1 className="text-lg font-bold">{title}</h1>
      </header>
    );
  }

  return (
    <header className="flex h-16 items-center justify-between px-5">
      <h1 className="text-2xl font-bold">{title}</h1>
      {onSettings && (
        <button type="button" aria-label={MAIN_TEXT.settings} className="p-1" onClick={onSettings}>
          <IconGear size={26} />
        </button>
      )}
    </header>
  );
}

export default MainHeader;
