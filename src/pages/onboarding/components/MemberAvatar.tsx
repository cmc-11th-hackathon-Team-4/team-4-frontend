import closeIcon from '@/assets/icons/close-fill.svg';
import type { CharacterId } from '@/types/member';
import CharacterImage from './CharacterImage';

interface MemberAvatarProps {
  label: string;
  /** 없으면 빈 칸 (프로필을 아직 안 만든 경우) */
  character?: CharacterId | null;
  /** 나는 이름을 보라색으로 (피그마 S-02·S-03 "프로필_나") */
  isMe?: boolean;
  /** 있으면 오른쪽 위 × 빼기 버튼 (S-02 방장 전용) */
  onRemove?: () => void;
}

// 구성원 아바타: 80px 둥근 사각형 캐릭터 + 이름 (피그마 S-02 · S-03 시안)
function MemberAvatar({ label, character, isMe = false, onRemove }: MemberAvatarProps) {
  return (
    <div className="relative flex w-20 flex-col items-center gap-2">
      {character ? (
        <CharacterImage id={character} size={80} scale={1.8} offset={0.21} shape="square" />
      ) : (
        <span aria-hidden className="block size-20 rounded-[28px] bg-line-400" />
      )}
      <span
        className={`text-lg leading-[normal] font-semibold ${isMe ? 'text-primary-500' : 'text-gray-600'}`}
      >
        {label}
      </span>
      {onRemove && (
        // 시안: 24px 원형 × 아이콘, 아바타 오른쪽 위 (left 60, top -2)
        <button
          type="button"
          aria-label={`${label} 빼기`}
          onClick={onRemove}
          className="absolute -top-0.5 left-[60px] flex size-6 items-center justify-center"
        >
          <img src={closeIcon} alt="" width={20} height={20} />
        </button>
      )}
    </div>
  );
}

export default MemberAvatar;
