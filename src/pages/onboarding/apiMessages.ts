import { ApiError } from '@/apis/error';

/** UX 라이팅 가이드 공통 에러 문구 */
export const COMMON_ERROR = '문제가 생겼어요. 잠시 후 다시 시도해 주세요.';
export const LOAD_ERROR = '정보를 불러오지 못했어요. 다시 시도해 주세요.';
export const RETRY_LABEL = '다시 시도';

/** 토스트로 보여줄 문구: 서버가 준 문구가 있으면 그것, 없으면 공통 문구 */
export function errorMessage(error: unknown) {
  if (error instanceof ApiError && error.code !== 'NETWORK' && error.message) {
    return error.message;
  }
  return COMMON_ERROR;
}
