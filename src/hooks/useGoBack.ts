import { useNavigate } from 'react-router';

/**
 * 뒤로가기 (헤더 ‹ 버튼 공용)
 * - 앱 안에서 이전 화면이 있으면 브라우저 뒤로가기
 * - 이 화면이 첫 화면이면(주소로 바로 열기 · 링크 · 앱 재시작) 사이트를 나가지 않고 fallback 으로 이동
 *   (react-router 가 history.state.idx 에 앱 안 이동 순번을 저장: 0 이면 첫 화면)
 */
export function useGoBack(fallback: string) {
  const navigate = useNavigate();
  return () => {
    const idx = (window.history.state as { idx?: number } | null)?.idx ?? 0;
    if (idx > 0) navigate(-1);
    else navigate(fallback, { replace: true });
  };
}
