import { useNavigate } from 'react-router';

// S-09 한 일 · 못 한 일 — 디자인 확정 전 뼈대
function WeeklyResultPage() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-1 flex-col p-5">
      <h1 className="text-xl font-bold">S-09 한 일 · 못 한 일</h1>
      <div className="flex-1" />
      <div className="flex flex-col gap-2">
        <button
          type="button"
          className="rounded-xl border border-neutral-300 py-3"
          onClick={() => navigate('/weekly/carry-over')}
        >
          못 한 일 이월하기
        </button>
        <button
          type="button"
          className="rounded-xl bg-neutral-900 py-3 text-white"
          onClick={() => navigate('/weekly/best')}
        >
          배려왕 보기
        </button>
      </div>
    </div>
  );
}

export default WeeklyResultPage;
