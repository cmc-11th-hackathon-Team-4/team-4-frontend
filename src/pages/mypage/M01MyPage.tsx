import type { ReactNode } from 'react';
import { useNavigate } from 'react-router';
import StateView from '@/components/common/StateView';
import TabBar from '@/components/common/TabBar';
import { IconChevronRight, IconHome, IconSmile, IconUser } from '@/components/common/icons';
import { useMyProfile } from '@/hooks/useProfile';
import { MYPAGE_PATHS } from '@/routes/mypagePaths';
import { ONBOARDING_PATHS } from '@/routes/onboardingPaths';
import { useToastStore } from '@/stores/toast';

/** TODO: 배포 버전 정해지면 package.json과 맞추기 */
const APP_VERSION = '1.0.0';

/**
 * M-01 마이 (하단 탭 [마이])
 * - 빈 프로필: [만들기] → P-01 만들기 → 마이로 복귀
 * - 집 없음: [홈에서 시작하기] → S-14
 * - 집 있음: 구성원 목록, 우리 집 설정(V5-12)
 */
function M01MyPage() {
  const navigate = useNavigate();
  const showToast = useToastStore((s) => s.show);
  const { profile, hasHouse, group, me, isLoading, isError, refetch } = useMyProfile();

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
    ? '프로필을 만들어요'
    : hasHouse && group && me
      ? `${group.name} · ${me.isHost ? '방장' : '구성원'}`
      : '아직 우리 집이 없어요';

  return (
    <div className="flex flex-1 flex-col">
      <main className="flex flex-1 flex-col px-5 pt-6 pb-6">
        <h1 className="text-[28px] font-bold text-gray-900">마이</h1>

        {/* 프로필 카드 */}
        <section className="mt-6 flex items-center gap-4 rounded-2xl bg-line-400 p-4">
          <div
            className={`flex size-18 shrink-0 items-center justify-center rounded-full bg-white text-gray-500 ${
              profile ? 'border border-line-700' : 'border border-dashed border-line-900'
            }`}
          >
            {profile ? <IconSmile size={36} /> : <IconUser size={28} />}
          </div>
          <div className="min-w-0 flex-1">
            <p className={`text-base font-semibold ${profile ? 'text-gray-900' : 'text-gray-500'}`}>
              {profile?.nickname ?? '이름 없음'}
            </p>
            <p className="mt-1 truncate text-sm text-gray-500">{subtitle}</p>
          </div>
          {profile ? (
            <button
              type="button"
              onClick={() => navigate(MYPAGE_PATHS.profileEdit)}
              className="shrink-0 rounded-lg border border-line-800 bg-white px-4 py-2 text-sm font-medium text-gray-800"
            >
              수정
            </button>
          ) : (
            <button
              type="button"
              onClick={() => navigate(`${ONBOARDING_PATHS.profileNew}?next=my`)}
              className="shrink-0 rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white"
            >
              만들기
            </button>
          )}
        </section>

        {/* 우리 집 */}
        {!profile && (
          <>
            <SectionLabel>우리 집</SectionLabel>
            <p className="mt-3 text-sm text-gray-700">프로필을 만들면 집에 들어갈 수 있어요</p>
            <Divider />
            <VersionRow />
          </>
        )}

        {profile && !hasHouse && (
          <>
            <SectionLabel>우리 집</SectionLabel>
            <div className="mt-6 flex flex-col items-center">
              <div className="flex size-16 items-center justify-center rounded-full bg-line-500 text-gray-500">
                <IconHome size={28} />
              </div>
              <p className="mt-4 text-base font-medium text-gray-800">
                같이 사는 사람과 집을 만들어요
              </p>
              <button
                type="button"
                onClick={() => navigate(ONBOARDING_PATHS.welcome)}
                className="mt-4 h-13 w-full rounded-xl border border-line-800 bg-white text-base font-medium text-gray-800"
              >
                홈에서 시작하기
              </button>
            </div>
          </>
        )}

        {profile && hasHouse && group && (
          <>
            <SectionLabel>우리 집 구성원 {group.members.length}명</SectionLabel>
            <ul className="mt-2">
              {group.members.map((m) => (
                <li
                  key={m.id}
                  className="flex items-center gap-3 border-b border-line-600 py-3 last:border-b-0"
                >
                  <div className="flex size-10 items-center justify-center rounded-full border border-line-700 text-gray-500">
                    <IconSmile size={22} />
                  </div>
                  <span className="text-base font-medium text-gray-900">{m.nickname}</span>
                  {m.id === me?.id && (
                    <span className="rounded border border-line-800 px-1.5 text-xs text-gray-600">
                      나
                    </span>
                  )}
                  {m.isHost && <span className="ml-auto text-sm text-gray-500">방장</span>}
                </li>
              ))}
            </ul>
            <Divider />
            <SectionLabel>앱</SectionLabel>
            <button
              type="button"
              // TODO: V5-12 우리 집 설정(②) 경로 생기면 연결
              onClick={() => showToast('준비 중이에요')}
              className="flex items-center justify-between py-3 text-base font-medium text-gray-900"
            >
              우리 집 설정
              <IconChevronRight size={20} className="text-gray-400" />
            </button>
            <Divider />
            <VersionRow />
          </>
        )}
      </main>

      <TabBar />
    </div>
  );
}

function SectionLabel({ children }: { children: ReactNode }) {
  return <p className="mt-6 text-sm text-gray-500">{children}</p>;
}

function Divider() {
  return <hr className="mt-3 border-line-600" />;
}

function VersionRow() {
  return (
    <div className="flex items-center justify-between py-3 text-base">
      <span className="font-medium text-gray-900">버전</span>
      <span className="text-sm text-gray-500">{APP_VERSION}</span>
    </div>
  );
}

export default M01MyPage;
