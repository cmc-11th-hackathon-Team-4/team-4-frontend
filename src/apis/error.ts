/** 서버 실패 응답 { success: false, code, message } 또는 네트워크 오류 */
export class ApiError extends Error {
  /** 서버 에러 코드 (예: PERIOD-409-2), 네트워크 오류면 NETWORK */
  code: string;
  status?: number;

  constructor(code: string, message: string, status?: number) {
    super(message);
    this.name = 'ApiError';
    this.code = code;
    this.status = status;
  }
}

/** ApiError인지, code를 주면 그 코드인지까지 확인 */
export function isApiError(error: unknown, code?: string): error is ApiError {
  return error instanceof ApiError && (!code || error.code === code);
}
