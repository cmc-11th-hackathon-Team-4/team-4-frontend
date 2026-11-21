import { useEffect, useState } from 'react';

/**
 * 화면 키보드가 가리는 높이(px). 키보드가 없거나 브라우저가 화면을 줄여 주면 0
 * - iOS Safari처럼 키보드가 화면을 덮는 환경에서 하단 버튼을 키보드 위로 올릴 때 사용
 */
export function useKeyboardInset() {
  const [inset, setInset] = useState(0);

  useEffect(() => {
    const viewport = window.visualViewport;
    if (!viewport) return;

    const update = () => {
      const covered = window.innerHeight - viewport.height - viewport.offsetTop;
      setInset(Math.max(0, Math.round(covered)));
    };

    update();
    viewport.addEventListener('resize', update);
    viewport.addEventListener('scroll', update);
    return () => {
      viewport.removeEventListener('resize', update);
      viewport.removeEventListener('scroll', update);
    };
  }, []);

  return inset;
}
