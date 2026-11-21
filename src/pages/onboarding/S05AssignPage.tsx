import { useNavigate } from 'react-router';
import { HOME_PATH } from '@/routes/onboardingPaths';
import { useOnboardingStore } from '@/stores/onboarding';
import BottomButton from './components/BottomButton';
import OnboardingLayout from './components/OnboardingLayout';

/** 사람별 배분 결과 (표시용) */
interface AssignmentResult {
  memberLabel: string;
  chores: string[];
}

/**
 * S-05 랜덤 배분 (권한: 방장)
 * - 사람별 결과, [다시 섞기](몇 번이든), [확정하기] → V5-01 내 메인 (명세 순서: S-04 → S-06 → S-05)
 * - 균등 규칙: 인원수로 나누고 남는 일은 1개씩 더 (차이는 최대 1개)
 * - TODO(API): 배분 주체(서버 / 앱) 결정 전까지 배분 로직 보류 → 결과는 비어 있음
 * - TODO(API): 섞는 동안 짧은 로딩, 확정 시 각 집안일의 담당자 저장 · 구성원 모두에게 배분 알림
 */
function S05AssignPage() {
  const navigate = useNavigate();
  const reset = useOnboardingStore((s) => s.reset);
  const results: AssignmentResult[] = [];
  const perPerson = results[0]?.chores.length;

  // 플로우 ① 마지막 화면: 진행 상태를 비우고 내 메인으로
  const handleConfirm = () => {
    reset();
    navigate(HOME_PATH, { replace: true });
  };

  return (
    <OnboardingLayout
      title="랜덤 배분"
      heading="공평하게 나눴어요"
      description={
        perPerson ? `각자 ${perPerson}개씩 맡아요. 언제든 서로 덜어줄 수 있어요.` : undefined
      }
      footer={
        <div className="flex gap-2">
          <BottomButton variant="secondary" disabled className="flex-1">
            다시 섞기
          </BottomButton>
          <BottomButton className="flex-1" onClick={handleConfirm}>
            확정하기
          </BottomButton>
        </div>
      }
    >
      <ul className="mt-6 flex flex-col gap-6">
        {results.map(({ memberLabel, chores }) => (
          <li key={memberLabel}>
            <div className="flex items-center gap-3">
              <div aria-hidden className="size-9 rounded-full bg-neutral-200" />
              <span className="flex-1 font-semibold">{memberLabel}</span>
              <span className="text-sm text-neutral-500">{chores.length}개</span>
            </div>
            <ul className="mt-3 flex flex-col gap-3 pl-1">
              {chores.map((chore) => (
                <li key={chore} className="text-sm">
                  {chore}
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </OnboardingLayout>
  );
}

export default S05AssignPage;
