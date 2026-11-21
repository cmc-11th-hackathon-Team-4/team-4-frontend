import { useNavigate } from 'react-router';
import { WEEKLY_PATHS } from '@/routes/weeklyPaths';

/** S-09 한 일 · 못 한 일 */
// 디자인 확정 전 뼈대. 스타일은 임시 무채색
function S09ResultPage() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-1 flex-col p-5">
      <h1 className="text-xl font-bold">S-09 한 일 · 못 한 일</h1>
      <div className="flex-1" />
      <div className="flex flex-col gap-2">
        <button
          type="button"
          className="rounded-xl border border-neutral-300 py-3"
          onClick={() => navigate(WEEKLY_PATHS.carryOver)}
        >
          못 한 일 이월하기
        </button>
        <button
          type="button"
          className="rounded-xl bg-neutral-900 py-3 text-white"
          onClick={() => navigate(WEEKLY_PATHS.best)}
        >
          배려왕 보기
        </button>
      </div>
    </div>
  );
}

export default S09ResultPage;
