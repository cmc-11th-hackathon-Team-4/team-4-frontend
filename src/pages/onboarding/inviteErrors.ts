import { ApiError } from '@/apis/error';

/** S-13-E 에러 종류별 문구 (유저플로우 최신 UX 라이팅) */
const CODE_ERROR_MESSAGE = {
  notFound: '없는 초대 코드예요. 다시 확인해 주세요.',
  full: '이 집은 구성원이 다 찼어요.',
  network: '연결이 불안정해요. 다시 시도해 주세요.',
} as const;

/** 초대 코드 미리보기 · 참여 에러 → 문구 (명세 3종 외에는 서버 문구) */
export function toCodeErrorMessage(error: unknown) {
  if (error instanceof ApiError) {
    if (error.code === 'HOUSE-404-1') return CODE_ERROR_MESSAGE.notFound;
    if (error.code === 'HOUSE-409-1') return CODE_ERROR_MESSAGE.full;
    if (error.code !== 'NETWORK' && error.message) return error.message;
  }
  return CODE_ERROR_MESSAGE.network;
}
