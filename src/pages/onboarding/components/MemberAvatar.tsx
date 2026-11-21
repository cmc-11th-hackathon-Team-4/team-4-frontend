import type { CharacterId } from '@/types/member';
import CharacterImage from './CharacterImage';

interface MemberAvatarProps {
  label: string;
  /** 없으면 빈 칸 (프로필을 아직 안 만든 경우) */
  character?: CharacterId | null;
  /** 나는 이름을 보라색으로 (피그마 S-02·S-03 "프로필_나") */
  isMe?: boolean;
}

// 구성원 아바타: 80px 둥근 사각형 캐릭터 + 이름 (피그마 S-02 · S-03 시안)
function MemberAvatar({ label, character, isMe = false }: MemberAvatarProps) {
  return (
    <div className="flex w-20 flex-col items-center gap-2">
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
    </div>
  );
}

export default MemberAvatar;
