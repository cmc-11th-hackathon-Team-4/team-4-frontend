import type { ReactNode } from 'react';
import { useNavigate } from 'react-router';
import Header from '@/components/common/Header';
import StateView from '@/components/common/StateView';
import TabBar from '@/components/common/TabBar';
import { CHARACTER_IMAGES } from '@/constants/character';
import { useMyProfile } from '@/hooks/useProfile';
import { MYPAGE_PATHS } from '@/routes/mypagePaths';
import { ONBOARDING_PATHS } from '@/routes/onboardingPaths';
import type { CharacterId } from '@/types/member';

/** TODO: 배포 버전 정해지면 package.json과 맞추기 */
const APP_VERSION = '1.0.0';
/** 집 없음 카드의 캐릭터 (피그마 시안: 주황) */
const EMPTY_HOUSE_CHARACTER: CharacterId = '2';

/**
 * M-01 마이페이지 (하단 탭 [마이]) — 피그마 ④ 마이 플로우 디자인
 * - 빈 프로필: [만들기] → P-01 만들기 → 마이로 복귀
 * - 집 없음: [홈에서 시작하기] → S-14
 * - 집 있음: 구성원 목록, 우리 집 설정(V5-12)
 */
function M01MyPage() {
  const navigate = useNavigate();
  const { profile, hasHouse, house, me, isLoading, isError, refetch } = useMyProfile();

  if (isLoading) return <StateView type="loading" />;
  if (isError) {
    return (
      <StateView
        type="error"
        message="정보를 불러오지 못했어요"
        retryLabel="다시 시도"
        onRetry={refetch}
      />
    );
  }

  const subtitle = !profile
    ? '프로필을 만들어 주세요'
    : hasHouse && me?.house
      ? `${me.house.name} · ${me.house.isHost ? '방장' : '구성원'}`
      : '아직 우리 집이 없어요';

  return (
    <div className="flex flex-1 flex-col">
      <Header variant="main" title="마이페이지" />

      <main className="flex flex-1 flex-col px-4 pt-3 pb-6">
        {/* 프로필 카드 */}
        <section className="flex h-[104px] items-center gap-4 rounded-[20px] bg-line-400 px-4">
          {profile ? (
            <Character id={profile.character} size={72} />
          ) : (
            <div className="flex size-[72px] shrink-0 items-center justify-center rounded-full border border-dashed border-gray-300 bg-white text-lg font-semibold text-gray-300">
              ?
            </div>
          )}
          <div className="min-w-0 flex-1">
            <p
              className={`truncate text-lg leading-[normal] font-semibold ${profile ? 'text-gray-800' : 'text-gray-500'}`}
            >
              {profile?.nickname ?? '닉네임 없음'}
            </p>
            <p className="mt-[7px] truncate text-sm leading-[normal] font-medium text-gray-500">
              {subtitle}
            </p>
          </div>
          {profile ? (
            <PillButton onClick={() => navigate(MYPAGE_PATHS.profileEdit)}>수정</PillButton>
          ) : (
            <PillButton primary onClick={() => navigate(`${ONBOARDING_PATHS.profileNew}?next=my`)}>
              만들기
            </PillButton>
          )}
        </section>

        {/* 빈 프로필 */}
        {!profile && (
          <>
            <SectionLabel>우리 집</SectionLabel>
            <p className="mt-3 text-base leading-[normal] font-medium text-gray-600">
              프로필을 만들면 우리 집에 들어갈 수 있어요
            </p>
            <Divider className="mt-5" />
            <InfoRow label="버전" value={APP_VERSION} />
          </>
        )}

        {/* 집 없음 */}
        {profile && !hasHouse && (
          <>
            <SectionLabel>우리 집</SectionLabel>
            <div className="mt-3 flex flex-col items-center rounded-[20px] bg-line-400 px-4 pt-4 pb-3">
              <Character id={EMPTY_HOUSE_CHARACTER} size={76} />
              <p className="mt-2 text-center text-base leading-[normal] font-medium text-gray-600">
                같이 사는 사람과 우리 집을 만들어 보세요
              </p>
              <PillButton
                className="mt-3 w-[180px]"
                onClick={() => navigate(ONBOARDING_PATHS.welcome)}
              >
                홈에서 시작하기
              </PillButton>
            </div>
          </>
        )}

        {/* 집 있음 */}
        {profile && hasHouse && house && (
          <>
            <SectionLabel>우리 집 구성원 {house.members.length}명</SectionLabel>
            <ul className="mt-2.5">
              {house.members.map((m) => (
                <li key={m.id} className="flex items-center gap-3 border-b border-line-600 py-2">
                  <Character id={m.character} size={48} />
                  <span className="text-lg leading-[normal] font-semibold text-gray-800">
                    {m.nickname}
                  </span>
                  {m.isMe && (
                    <span className="flex h-[22px] w-7 items-center justify-center rounded-md bg-primary-100 text-sm font-medium text-primary-500">
                      나
                    </span>
                  )}
                  {m.isHost && (
                    <span className="ml-auto text-sm leading-[normal] font-medium text-gray-500">
                      방장
                    </span>
                  )}
                </li>
              ))}
            </ul>

            <SectionLabel className="mt-[19px]">앱</SectionLabel>
            <button
              type="button"
              onClick={() => navigate(MYPAGE_PATHS.settings)}
              className="mt-3 flex items-center justify-between text-left"
            >
              <span className="text-base leading-[normal] font-medium text-gray-800">
                우리 집 설정
              </span>
              <span aria-hidden className="text-lg leading-[normal] font-semibold text-gray-500">
                ›
              </span>
            </button>
            <Divider className="mt-4" />
            <InfoRow label="버전" value={APP_VERSION} />
          </>
        )}
      </main>

      <TabBar />
    </div>
  );
}

/** 캐릭터 이미지 (배경 없이). 이미지가 없는 값이면 빈 원 */
function Character({ id, size }: { id: CharacterId; size: number }) {
  const src = CHARACTER_IMAGES[id];
  if (!src) {
    return (
      <span
        aria-hidden
        className="block shrink-0 rounded-full bg-line-500"
        style={{ width: size, height: size }}
      />
    );
  }
  return (
    <img src={src} alt="" className="shrink-0 object-cover" style={{ width: size, height: size }} />
  );
}

/** 프로필 카드 · 빈 상태 카드의 알약 버튼 (높이 36) */
function PillButton({
  primary = false,
  className = 'w-[68px]',
  children,
  onClick,
}: {
  primary?: boolean;
  className?: string;
  children: ReactNode;
  onClick: () => void;
}) {
  const color = primary
    ? 'bg-primary-500 text-white'
    : 'border border-line-700 bg-white text-gray-700';
  return (
    <button
      type="button"
      onClick={onClick}
      className={`h-9 shrink-0 rounded-[18px] text-sm leading-[normal] font-medium ${color} ${className}`}
    >
      {children}
    </button>
  );
}

function SectionLabel({
  children,
  className = 'mt-7',
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <p className={`text-sm leading-[normal] font-medium text-gray-500 ${className}`}>{children}</p>
  );
}

function Divider({ className = '' }: { className?: string }) {
  return <hr className={`border-line-600 ${className}`} />;
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="mt-[18px] flex items-center justify-between text-base leading-[normal] font-medium">
      <span className="text-gray-800">{label}</span>
      <span className="text-gray-500">{value}</span>
    </div>
  );
}

export default M01MyPage;
