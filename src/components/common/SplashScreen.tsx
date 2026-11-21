import splashImage from '@/assets/splash.png';

/**
 * 스플래시 (앱을 `/` 로 처음 열 때, ① StartGate 가 첫 화면을 정하는 동안)
 * - 앱 프레임(App.tsx) 안에서 흰 배경 + 가운데 이미지
 * - TODO(디자인): 스플래시 이미지가 나오면 src/assets/splash.png 만 교체 (지금은 S-14 캐릭터 일러스트)
 */
function SplashScreen() {
  return (
    <div
      role="img"
      aria-label="앱 시작 화면"
      className="flex flex-1 items-center justify-center bg-white"
    >
      <img src={splashImage} alt="" width={260} className="h-auto w-[260px] max-w-[70%]" />
    </div>
  );
}

export default SplashScreen;
