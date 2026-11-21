import { Navigate } from 'react-router';
import StateView from '@/components/common/StateView';
import { fromServerCharacter } from '@/constants/character';
import { HOME_PATH } from '@/routes/onboardingPaths';
import { useToastStore } from '@/stores/toast';
import { LOAD_ERROR, RETRY_LABEL } from './apiMessages';
import BottomButton from './components/BottomButton';
import CharacterImage from './components/CharacterImage';
import { useMyHouse } from './useMyHouse';

/**
 * S-13-W 방장 기다리는 중 (권한: 참여자) — 기능명세서 · 유저플로우 와이어 기준
 * - 상단 집 이름, 내 캐릭터, 방장이 집안일과 결산 주기를 정하는 중이라는 안내
 * - 실시간 없음: 화면에 들어올 때와 [새로고침] 때 집 상태(GET /api/v1/houses/{id})를 조회
 * - 상태가 ACTIVE(시작됨)면 내 메인으로
 * - TODO(API): DISTRIBUTING(배분됨) → S-05 랜덤 배분 · 참여자 (배분 결과 API 가 없어 보류)
 * - TODO: "앱을 껐다 켜도 이 화면부터" 는 앱 첫 화면 가드(② 담당과 협의)에서 처리
 */
function S13WJoinWaitingPage() {
  const showToast = useToastStore((s) => s.show);
  const { me, house, isLoading, isError, refetch } = useMyHouse();

  if (isLoading) return <StateView type="loading" />;
  if (isError || !house) {
    return (
      <StateView type="error" message={LOAD_ERROR} retryLabel={RETRY_LABEL} onRetry={refetch} />
    );
  }
  if (house.status === 'ACTIVE') return <Navigate to={HOME_PATH} replace />;

  const owner = house.members.find((m) => m.role === 'OWNER');
  const myCharacter = me ? fromServerCharacter(me.characterType) : null;

  const handleRefresh = async () => {
    const result = await refetch();
    if (result.isError) showToast(LOAD_ERROR);
  };

  return (
    <div className="flex flex-1 flex-col">
      <header className="flex h-14 items-center px-4">
        <h1 className="text-xl leading-[normal] font-bold text-gray-800">{house.name}</h1>
      </header>

      <main className="flex flex-1 flex-col items-center px-4 pt-14 text-center break-keep">
        {myCharacter ? (
          <CharacterImage id={myCharacter} size={160} offset={0.2} />
        ) : (
          <span aria-hidden className="block size-40 rounded-full bg-line-400" />
        )}
        <h2 className="mt-8 text-2xl leading-[normal] font-semibold text-gray-800">
          우리 집에 들어왔어요
        </h2>
        {owner && (
          <p className="mt-3 text-base leading-[normal] font-medium text-gray-500">
            {owner.name}님이 집안일과 결산 주기를
            <br />
            정하고 있어요
          </p>
        )}
        <p className="mt-10 text-sm leading-[normal] text-gray-400">방장을 기다리는 중</p>
      </main>

      <footer className="sticky bottom-0 bg-white p-4">
        <BottomButton variant="outline" onClick={handleRefresh}>
          새로고침
        </BottomButton>
      </footer>
    </div>
  );
}

export default S13WJoinWaitingPage;
