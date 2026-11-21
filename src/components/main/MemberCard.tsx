import crownIcon from '@/assets/icons/crown.svg';
import { CHARACTER_IMAGES } from '@/constants/character';
import { themeOf } from '@/constants/characterTheme';
import { MAIN_TEXT } from '@/constants/main';
import type { Id } from '@/types/common';
import type { Member } from '@/types/member';
import SectionCard from './SectionCard';

// 비활성 아바타 색 (피그마 보라 기본값)
const BASE_INSET = '#ccc2ff';
const BASE_DROP = '#cfc7e3';

interface MemberCardProps {
  members: Member[];
  myId: Id;
  /** 지금 보고 있는 사람 (내 메인이면 나) */
  activeId: Id;
  countOf: (id: Id) => number;
  onSelect: (id: Id) => void;
}

/** "내 구성원" 카드: 나가 맨 앞, 누르면 그 사람 화면 (피그마 V5-01 · V5-07) */
function MemberCard({ members, myId, activeId, countOf, onSelect }: MemberCardProps) {
  const sorted = [...members].sort((a, b) => Number(b.id === myId) - Number(a.id === myId));

  return (
    <SectionCard title={MAIN_TEXT.membersTitle} hint={MAIN_TEXT.membersHint}>
      <ul className="flex items-center gap-5">
        {sorted.map((member) => {
          const isMe = member.id === myId;
          const active = member.id === activeId;
          const theme = themeOf(member.character);
          const label = isMe ? MAIN_TEXT.meLabel : member.nickname;
          return (
            <li key={member.id}>
              <button
                type="button"
                aria-label={label}
                aria-current={active || undefined}
                className="relative block h-[54px] w-[46px]"
                onClick={() => onSelect(member.id)}
              >
                {/* 바깥 원 46 */}
                <span
                  className="absolute inset-x-0 top-0 size-[46px] rounded-full bg-line-600"
                  style={{
                    boxShadow: `inset 0 4px 4px ${active ? theme.avatarInset : BASE_INSET}`,
                  }}
                />
                {/* 안쪽 원 40 + 캐릭터 */}
                <span
                  className="absolute top-[3px] left-[3px] size-10"
                  style={{
                    filter: `drop-shadow(0 2px 4px ${active ? theme.avatarDrop : BASE_DROP})`,
                  }}
                >
                  <span
                    className="absolute inset-0 overflow-hidden rounded-full border-2 bg-line-600"
                    style={{
                      borderColor: active && isMe ? theme.c500 : 'white',
                      boxShadow: `inset 0 4px 4px ${BASE_INSET}`,
                    }}
                  >
                    <img
                      src={CHARACTER_IMAGES[member.character]}
                      alt=""
                      className="absolute top-1/2 left-1/2 size-[66px] max-w-none -translate-x-1/2 -translate-y-1/2 object-cover"
                    />
                  </span>
                  {/* 오른쪽 위: 방장 왕관 / 맡은 짐 수 */}
                  {member.isHost ? (
                    <span className="absolute -top-1 left-[26px] flex size-[19px] items-center justify-center rounded-full border-[1.25px] border-white bg-[#784be4]">
                      <img src={crownIcon} alt="" width={13} height={12} />
                    </span>
                  ) : (
                    <span
                      className="absolute -top-1 left-[26px] flex size-[18px] items-center justify-center rounded-[20px] border text-xs leading-[normal] font-bold"
                      style={
                        active
                          ? { backgroundColor: theme.c500, borderColor: theme.c500, color: 'white' }
                          : { backgroundColor: 'white', borderColor: '#a594f6', color: '#7f68f1' }
                      }
                    >
                      {countOf(member.id)}
                    </span>
                  )}
                </span>
                {/* 이름 */}
                <span
                  className="absolute top-8 left-1/2 -translate-x-1/2 rounded-[30px] border-2 px-2.5 py-0.5 text-xs leading-[normal] font-bold whitespace-nowrap"
                  style={
                    active
                      ? { backgroundColor: theme.c500, borderColor: '#e7e8ed', color: 'white' }
                      : {
                          backgroundColor: 'rgba(255,255,255,0.9)',
                          borderColor: 'white',
                          color: '#454750',
                        }
                  }
                >
                  {label}
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    </SectionCard>
  );
}

export default MemberCard;
