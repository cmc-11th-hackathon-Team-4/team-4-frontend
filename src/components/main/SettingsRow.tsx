import type { ReactNode } from 'react';
import { IconChevronRight } from '@/components/common/icons';

interface SettingsRowProps {
  label: string;
  value?: ReactNode;
  /** 없으면 눌리지 않는 표시용 줄 */
  onClick?: () => void;
  disabled?: boolean;
  /** 오른쪽 아이콘 (기본: 화살표) */
  trailing?: ReactNode;
}

/** V5-12 설정 목록 한 줄 */
function SettingsRow({ label, value, onClick, disabled, trailing }: SettingsRowProps) {
  const content = (
    <>
      <span className="flex-1 text-left">{label}</span>
      {value !== undefined && <span className="text-sm text-neutral-500">{value}</span>}
      {trailing ?? (onClick && <IconChevronRight size={18} className="text-neutral-400" />)}
    </>
  );
  const base = 'flex h-14 w-full items-center gap-2 px-4';

  if (!onClick) return <div className={`${base} ${disabled ? 'opacity-40' : ''}`}>{content}</div>;
  return (
    <button
      type="button"
      disabled={disabled}
      className={`${base} active:bg-neutral-100 disabled:opacity-40`}
      onClick={onClick}
    >
      {content}
    </button>
  );
}

export function SettingsSection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section>
      <h2 className="mb-2 px-1 text-xs text-neutral-500">{title}</h2>
      <div className="divide-y divide-neutral-100 overflow-hidden rounded-2xl bg-white">
        {children}
      </div>
    </section>
  );
}

export default SettingsRow;
