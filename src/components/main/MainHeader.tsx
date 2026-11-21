import { useNavigate } from 'react-router';

interface MainHeaderProps {
  title: string;
  inviteLabel: string;
  onInvite: () => void;
  showBack?: boolean;
}

function MainHeader({ title, inviteLabel, onInvite, showBack = false }: MainHeaderProps) {
  const navigate = useNavigate();

  return (
    <header className="flex h-14 items-center justify-between px-4">
      <div className="flex items-center gap-1">
        {showBack && (
          <button
            type="button"
            aria-label="뒤로가기"
            className="-ml-1 p-1 text-xl"
            onClick={() => navigate(-1)}
          >
            ‹
          </button>
        )}
        <h1 className="text-xl font-bold">{title}</h1>
      </div>
      <button
        type="button"
        className="rounded-full border border-neutral-300 px-3 py-1 text-xs"
        onClick={onInvite}
      >
        {inviteLabel}
      </button>
    </header>
  );
}

export default MainHeader;
