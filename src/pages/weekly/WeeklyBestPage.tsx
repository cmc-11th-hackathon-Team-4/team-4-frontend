import { useNavigate } from 'react-router';

// S-11 이번 주 배려왕 — 디자인 확정 전 뼈대
function WeeklyBestPage() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-1 flex-col p-5">
      <h1 className="text-xl font-bold">S-11 이번 주 배려왕</h1>
      <div className="flex-1" />
      <div className="flex flex-col gap-2">
        <button
          type="button"
          className="rounded-xl bg-neutral-900 py-3 text-white"
          onClick={() => navigate('/weekly/next')}
        >
          다음 주기 보기
        </button>
      </div>
    </div>
  );
}

export default WeeklyBestPage;
