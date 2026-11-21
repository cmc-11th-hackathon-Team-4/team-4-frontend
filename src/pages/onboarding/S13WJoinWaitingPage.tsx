import { Navigate } from 'react-router';
import loadingRingIcon from '@/assets/icons/loading-ring.svg';
import StateView from '@/components/common/StateView';
import { fromServerCharacter } from '@/constants/character';
import { HOME_PATH, ONBOARDING_PATHS } from '@/routes/onboardingPaths';
import { useToastStore } from '@/stores/toast';
import { LOAD_ERROR, RETRY_LABEL } from './apiMessages';
import BottomButton from './components/BottomButton';
import MemberAvatar from './components/MemberAvatar';
import OnboardingLayout from './components/OnboardingLayout';
import { useMyHouse } from './useMyHouse';

/**
 * S-13-W 방장 기다리는 중 (권한: 참여자) — 피그마 2-5 디자인 기준
 * - 상단 집 이름, 구성원 아바타(방장 먼저 · 나는 "나"), 방장이 집안일과 결산 주기를 정하는 중이라는 안내
 * - 실시간 없음: 화면에 들어올 때와 [새로고침] 때 집 상태(GET /api/v1/houses/{id})를 조회
 * - 상태가 ACTIVE(시작됨)면 내 메인으로
 * - 상태가 DISTRIBUTING(배분됨)이면 S-05 랜덤 배분 · 참여자 화면으로
 * - TODO: "앱을 껐다 켜도 이 화면부터" 는 앱 첫 화면 가드(② 담당과 협의)에서 처리
 */
function S13WJoinWaitingPage() {
  const showToast = useToastStore((s) => s.show);
  const { house, isLoading, isError, isFetching, refetch } = useMyHouse();

  if (isLoading) return <StateView type="loading" />;
  if (isError || !house) {
    return (
      <StateView type="error" message={LOAD_ERROR} retryLabel={RETRY_LABEL} onRetry={refetch} />
    );
  }
  if (house.status === 'ACTIVE') return <Navigate to={HOME_PATH} replace />;
  if (house.status === 'DISTRIBUTING') return <Navigate to={ONBOARDING_PATHS.assign} replace />;

  const owner = house.members.find((m) => m.role === 'OWNER');
  // 시안: 방장 먼저, 그다음 들어온 순서
  const members = [...house.members].sort(
    (a, b) => Number(b.role === 'OWNER') - Number(a.role === 'OWNER'),
  );

  const handleRefresh = async () => {
    const result = await refetch();
    if (result.isError) showToast(LOAD_ERROR);
  };

  return (
    <OnboardingLayout
      title={house.name}
      heading={
        <>
          우리 집에
          <br />
          들어왔어요
        </>
      }
      description={owner ? `${owner.name}님이 집안일과 결산 주기를 정하고 있어요.` : undefined}
      footer={
        <BottomButton disabled={isFetching} onClick={handleRefresh}>
          새로고침
        </BottomButton>
      }
    >
      {/* 피그마 2-5 S-13-W: 80px 아바타 줄, 아래 로딩 링 + "방장을 기다리는 중이에요" */}
      <ul className="mt-10 flex flex-wrap gap-4">
        {members.map((m) => (
          <li key={m.userId}>
            <MemberAvatar
              label={m.isMe ? '나' : m.name}
              character={fromServerCharacter(m.characterType)}
              isMe={m.isMe}
            />
          </li>
        ))}
      </ul>
      <p className="mt-[38px] flex items-center gap-2 text-sm leading-[normal] text-gray-500">
        <img src={loadingRingIcon} alt="" width={16} height={16} className="animate-spin" />
        방장을 기다리는 중이에요
      </p>
    </OnboardingLayout>
  );
}

export default S13WJoinWaitingPage;
